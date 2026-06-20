import { useState, type FormEvent } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { Skeleton } from '../ui/Skeleton';
import { addComment, formatTimestamp } from '../../lib/firestore';
import { useComments } from '../../hooks/useComments';

interface CommentSectionProps {
  imageId: string;
}

export function CommentSection({ imageId }: CommentSectionProps) {
  const { comments, loading } = useComments(imageId);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSubmitting(true);
    try {
      await addComment({ imageId, name: name.trim(), message: message.trim() });
      setName('');
      setMessage('');
      toast.success('Comment posted!');
    } catch {
      toast.error('Failed to post comment. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare size={18} className="text-[#7C3AED]" />
        <h4 className="font-semibold text-[#111827]">
          Comments {!loading && `(${comments.length})`}
        </h4>
      </div>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-[#F9FAFB] rounded-xl border border-gray-100">
        <Input
          label="Your name"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Textarea
          label="Leave a comment"
          placeholder="Share your thoughts..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          required
        />
        <Button type="submit" loading={submitting} size="sm">
          <Send size={14} />
          Post Comment
        </Button>
      </form>

      {/* Comments list */}
      <div className="space-y-3">
        {loading ? (
          [1, 2].map((i) => (
            <div key={i} className="p-3 space-y-2">
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))
        ) : comments.length === 0 ? (
          <p className="text-sm text-[#6B7280] text-center py-4">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="p-4 bg-white rounded-xl border border-gray-100">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-sm font-semibold text-[#111827]">{c.name}</span>
                <span className="text-xs text-[#9CA3AF]">{formatTimestamp(c.createdAt)}</span>
              </div>
              <p className="text-sm text-[#374151] leading-relaxed">{c.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
