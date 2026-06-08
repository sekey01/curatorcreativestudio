import { useState } from 'react';
import { Trash2, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { ImageModal } from '../../components/gallery/ImageModal';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ImageCardSkeleton } from '../../components/ui/Skeleton';
import { deletePortfolioImage } from '../../lib/firestore';
import { deletePortfolioFile } from '../../lib/storage';
import { usePortfolio } from '../../hooks/usePortfolio';
import type { PortfolioImage } from '../../types';

export function AdminGalleryManager() {
  const { images, loading } = usePortfolio();
  const [selectedImage, setSelectedImage] = useState<PortfolioImage | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(img: PortfolioImage) {
    if (!window.confirm(`Delete "${img.title}"? This cannot be undone.`)) return;
    setDeletingId(img.id);
    try {
      await deletePortfolioFile(img.storagePath);
      await deletePortfolioImage(img.id);
      toast.success('Image deleted');
    } catch {
      toast.error('Failed to delete image');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Gallery Manager</h1>
          <p className="text-sm text-[#6B7280] mt-1">{images.length} image{images.length !== 1 ? 's' : ''} in portfolio</p>
        </div>

        <ImageUploader onUploaded={() => {}} />

        {/* Images grid */}
        <div>
          <h3 className="font-semibold text-[#111827] mb-5">All Images</h3>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <ImageCardSkeleton key={i} />)}
            </div>
          ) : images.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-xl border border-gray-100">
              <p className="text-[#6B7280]">No images uploaded yet. Use the uploader above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {images.map((img) => (
                <div key={img.id} className="group rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                    <img
                      src={img.imageUrl}
                      alt={img.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                      <Button
                        size="sm"
                        className="bg-white text-[#111827] hover:bg-white/90 shadow-sm"
                        onClick={() => setSelectedImage(img)}
                      >
                        <Eye size={14} />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        loading={deletingId === img.id}
                        onClick={() => handleDelete(img)}
                      >
                        <Trash2 size={14} />
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="text-sm font-semibold text-[#111827] truncate">{img.title}</h4>
                    {img.description && (
                      <p className="text-xs text-[#6B7280] truncate mt-0.5">{img.description}</p>
                    )}
                    <div className="mt-2">
                      <Badge variant="category">{img.category}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
    </AdminLayout>
  );
}
