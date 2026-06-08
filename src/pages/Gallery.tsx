import { useState } from 'react';
import { ImageCard } from '../components/gallery/ImageCard';
import { ImageModal } from '../components/gallery/ImageModal';
import { ImageCardSkeleton } from '../components/ui/Skeleton';
import { Badge } from '../components/ui/Badge';
import { usePortfolio } from '../hooks/usePortfolio';
import type { PortfolioCategory, PortfolioImage } from '../types';
import { Images } from 'lucide-react';

const CATEGORIES: { value: PortfolioCategory | 'All'; label: string }[] = [
  { value: 'All', label: 'All' },
  { value: 'Photoshoots', label: 'Photoshoots' },
  { value: 'Frames & Prints', label: 'Frames & Prints' },
  { value: 'Shirt Printing', label: 'Shirt Printing' },
  { value: 'Gifts & Merch', label: 'Gifts & Merch' },
];

export function Gallery() {
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory | 'All'>('All');
  const [selectedImage, setSelectedImage] = useState<PortfolioImage | null>(null);

  const { images, loading } = usePortfolio(
    activeCategory === 'All' ? undefined : activeCategory,
  );

  return (
    <>
      <section className="pt-28 pb-10 bg-[#F8FAF9]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <Badge variant="category" className="mb-3">Portfolio</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#111827]">Our Work</h1>
          <p className="mt-3 text-[#6B7280] max-w-xl mx-auto">
            Explore our portfolio of photography, custom frames, shirt printing, and personalized gifts.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            {CATEGORIES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setActiveCategory(value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                  activeCategory === value
                    ? 'bg-[#1D9E75] text-white shadow-sm'
                    : 'bg-white text-[#6B7280] border border-gray-200 hover:border-[#1D9E75] hover:text-[#1D9E75]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="break-inside-avoid">
                  <ImageCardSkeleton />
                </div>
              ))
              : images.length === 0
              ? (
                <div className="col-span-3 py-20 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-[#E8F5F0] rounded-full flex items-center justify-center mb-4">
                    <Images size={28} className="text-[#1D9E75]" />
                  </div>
                  <p className="text-[#6B7280] font-medium">No images in this category yet.</p>
                  <p className="text-sm text-[#9CA3AF] mt-1">Check back soon or explore another category.</p>
                </div>
              )
              : images.map((img) => (
                <div key={img.id} className="break-inside-avoid">
                  <ImageCard image={img} onClick={setSelectedImage} />
                </div>
              ))}
          </div>
        </div>
      </section>

      <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
    </>
  );
}
