import { Badge } from '../ui/Badge';
import type { OrderStatus } from '../../types';

export function StatusBadge({ status }: { status: OrderStatus }) {
  const variantMap: Record<OrderStatus, 'pending' | 'in_progress' | 'completed'> = {
    pending: 'pending',
    in_progress: 'in_progress',
    completed: 'completed',
  };
  const labelMap: Record<OrderStatus, string> = {
    pending: 'Pending',
    in_progress: 'In Progress',
    completed: 'Completed',
  };
  return <Badge variant={variantMap[status]}>{labelMap[status]}</Badge>;
}
