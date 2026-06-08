import { useState } from 'react';
import { Badge } from '../ui/Badge';
import type { PortfolioImage } from '../../types';

interface ImageCardProps {
  image: PortfolioImage;
  onClick: (image: PortfolioImage) => void;
}

export function ImageCard({ image, onClick }: ImageCardProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="group cursor-pointer rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-[#1D9E75]/30 transition-all duration-200 hover:-translate-y-0.5"
      onClick={() => onClick(image)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(image)}
    >
      <div className="relative overflow-hidden bg-gray-100 aspect-[4/3]">
        {!loaded && <div className="skeleton absolute inset-0" />}
        <img
          src={image.imageUrl}
          alt={image.title}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setLoaded(true)}
        />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-[#111827] truncate">{image.title}</h3>
        <div className="mt-2">
          <Badge variant="category">{image.category}</Badge>
        </div>
      </div>
    </div>
  );
}
