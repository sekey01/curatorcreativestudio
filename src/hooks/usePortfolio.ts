import { useEffect, useState } from 'react';
import { subscribeToPortfolio, subscribeToRecentPortfolio } from '../lib/firestore';
import type { PortfolioImage, PortfolioCategory } from '../types';

export function usePortfolio(category?: PortfolioCategory) {
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeToPortfolio((data) => {
      setImages(data);
      setLoading(false);
    }, category);
    return unsub;
  }, [category]);

  return { images, loading };
}

export function useRecentPortfolio(limit = 6) {
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeToRecentPortfolio((data) => {
      setImages(data);
      setLoading(false);
    }, limit);
    return unsub;
  }, [limit]);

  return { images, loading };
}
