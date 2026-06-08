import { useEffect, useState } from 'react';
import { subscribeToOrders } from '../lib/firestore';
import type { Order } from '../types';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeToOrders((data) => {
      setOrders(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { orders, loading };
}
