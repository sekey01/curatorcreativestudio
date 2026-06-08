import { useEffect, useState } from 'react';
import { subscribeToComments, subscribeToRecentComments } from '../lib/firestore';
import type { Comment } from '../types';

export function useComments(imageId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!imageId) return;
    setLoading(true);
    const unsub = subscribeToComments(imageId, (data) => {
      setComments(data);
      setLoading(false);
    });
    return unsub;
  }, [imageId]);

  return { comments, loading };
}

export function useRecentComments(limit = 5) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeToRecentComments((data) => {
      setComments(data);
      setLoading(false);
    }, limit);
    return unsub;
  }, [limit]);

  return { comments, loading };
}
