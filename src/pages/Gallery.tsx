import { useState } from 'react';
import { ImageCard } from '../components/gallery/ImageCard';
import { ImageModal } from '../components/gallery/ImageModal';
import { ImageCardSkeleton } from '../components/ui/Skeleton';
import { Badge } from '../components/ui/Badge';
import { usePortfolio } from '../hooks/usePortfolio';
import type { PortfolioCategory, PortfolioImage } from '../types';
import { Images } from 'lucide-react';

const CATEGORIES: { value: PortfolioCategory | 'All'; label: string }[] = [
  { value: 'All',            label: 'All' },
  { value: 'Photoshoots',    label: 'Photoshoots' },
  { value: 'Frames & Prints', label: 'Frames & Prints' },
  { value: 'Shirt Printing', label: 'Shirt Printing' },
  { value: 'Gifts & Merch',  label: 'Gifts & Merch' },
];

export function Gallery() {
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory | 'All'>('All');
  const [selectedImage, setSelectedImage] = useState<PortfolioImage | null>(null);
  const { images, loading } = usePortfolio(
    activeCategory === 'All' ? undefined : activeCategory,
  );

  return (
    <>
      {/* Header */}
      <section className="pt-28 pb-12 section-dark relative overflow-hidden"
        style={{ borderBottom: '1px solid var(--border-section)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, var(--accent-subtle) 0%, transparent 60%)' }}/>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <Badge variant="category" className="mb-4">Portfolio</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--text-1)' }}>Our Work</h1>
          <p className="mt-3 max-w-xl mx-auto" style={{ color: 'var(--text-3)' }}>
            Explore our portfolio of photography, custom frames, shirt printing, and personalized gifts.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-12 section-deeper">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* Category filter tabs */}
          <div className="flex flex-wrap gap-2 mb-12">
            {CATEGORIES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setActiveCategory(value)}
                className="px-4 py-2 rounded-full text-sm font-medium tracking-wide
                  transition-all duration-200 cursor-pointer"
                style={{
                  background: activeCategory === value ? 'var(--accent-medium)' : 'transparent',
                  border: `1px solid ${activeCategory === value ? 'var(--border-hover)' : 'var(--border)'}`,
                  color: activeCategory === value ? 'var(--text-1)' : 'var(--text-3)',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Image grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="break-inside-avoid">
                  <ImageCardSkeleton/>
                </div>
              ))
              : images.length === 0
              ? (
                <div className="col-span-3 py-20 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                    style={{ background: 'var(--accent-subtle)', border: '1px solid var(--border)' }}>
                    <Images size={28} style={{ color: 'var(--text-2)' }}/>
                  </div>
                  <p className="font-medium" style={{ color: 'var(--text-1)' }}>No images in this category yet.</p>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-3)' }}>Check back soon or explore another category.</p>
                </div>
              )
              : images.map((img) => (
                <div key={img.id} className="break-inside-avoid">
                  <ImageCard image={img} onClick={setSelectedImage}/>
                </div>
              ))}
          </div>
        </div>
      </section>

      <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)}/>
    </>
  );
}
