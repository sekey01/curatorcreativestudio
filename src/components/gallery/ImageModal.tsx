import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { CommentSection } from './CommentSection';
import type { PortfolioImage } from '../../types';

interface ImageModalProps {
  image: PortfolioImage | null;
  onClose: () => void;
}

export function ImageModal({ image, onClose }: ImageModalProps) {
  return (
    <Modal open={!!image} onClose={onClose} className="max-w-4xl">
      {image && (
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Image pane */}
          <div className="relative bg-gray-900 lg:rounded-l-2xl overflow-hidden min-h-64 lg:min-h-auto">
            <img
              src={image.imageUrl}
              alt={image.title}
              className="w-full h-full object-cover"
              style={{ minHeight: '280px', maxHeight: '600px' }}
            />
          </div>

          {/* Details pane */}
          <div className="p-6 lg:p-8 overflow-y-auto max-h-[85vh]">
            <div className="space-y-3 mb-6">
              <Badge variant="category">{image.category}</Badge>
              <h2 className="text-xl font-bold text-[#111827]">{image.title}</h2>
              {image.description && (
                <p className="text-sm text-[#6B7280] leading-relaxed">{image.description}</p>
              )}
            </div>
            <CommentSection imageId={image.id} />
          </div>
        </div>
      )}
    </Modal>
  );
}
