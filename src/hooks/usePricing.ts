import { useEffect, useState } from 'react';
import { subscribeToPricing } from '../lib/firestore';
import { DEFAULT_PRICING } from '../lib/pricing';
import type { PricingConfig } from '../types';

export function usePricing() {
  const [pricing, setPricing] = useState<PricingConfig>(DEFAULT_PRICING);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToPricing((data) => {
      setPricing(data ?? DEFAULT_PRICING);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { pricing, loading };
}
