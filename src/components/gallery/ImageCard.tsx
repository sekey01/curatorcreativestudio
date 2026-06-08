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
      className="group cursor-pointer rounded-xl overflow-hidden card-futuristic"
      onClick={() => onClick(image)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(image)}
    >
      <div className="relative overflow-hidden bg-[#111111] aspect-[4/3]">
        {!loaded && <div className="skeleton absolute inset-0"/>}
        <img
          src={image.imageUrl}
          alt={image.title}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/60 to-transparent
          opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-white truncate">{image.title}</h3>
        <div className="mt-2">
          <Badge variant="category">{image.category}</Badge>
        </div>
      </div>
    </div>
  );
}
