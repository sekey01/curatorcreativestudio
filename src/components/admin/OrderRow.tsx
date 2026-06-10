import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { StatusBadge } from './StatusBadge';
import { Button } from '../ui/Button';
import { updateOrderStatus, formatTimestamp } from '../../lib/firestore';
import { formatPrice } from '../../lib/pricing';
import type { Order, OrderStatus } from '../../types';

const TYPE_LABELS: Record<string, string> = {
  photoshoot: 'Photoshoot',
  frame: 'Frame / Print',
  shirt: 'Shirt Printing',
  gift: 'Gifts & Merch',
};

const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  pending: 'in_progress',
  in_progress: 'completed',
  completed: null,
};

export function OrderRow({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);

  async function handleStatusUpdate() {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    setUpdating(true);
    try {
      await updateOrderStatus(order.id, next);
      toast.success(`Order marked as ${next.replace('_', ' ')}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  }

  function renderDetails() {
    switch (order.orderType) {
      case 'photoshoot':
        return (
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            <div><dt className="text-[#9CA3AF] text-xs uppercase tracking-wide">Occasion</dt><dd className="font-medium mt-0.5">{order.occasionType}</dd></div>
            <div><dt className="text-[#9CA3AF] text-xs uppercase tracking-wide">Event Date</dt><dd className="font-medium mt-0.5">{order.eventDate}</dd></div>
            <div><dt className="text-[#9CA3AF] text-xs uppercase tracking-wide">Location</dt><dd className="font-medium mt-0.5">{order.eventLocation}</dd></div>
            {order.additionalNotes && <div className="col-span-full"><dt className="text-[#9CA3AF] text-xs uppercase tracking-wide">Notes</dt><dd className="mt-0.5">{order.additionalNotes}</dd></div>}
          </dl>
        );
      case 'frame':
        return (
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            <div><dt className="text-[#9CA3AF] text-xs uppercase tracking-wide">Frame Type</dt><dd className="font-medium mt-0.5">{order.frameType}</dd></div>
            <div><dt className="text-[#9CA3AF] text-xs uppercase tracking-wide">Size</dt><dd className="font-medium mt-0.5">{order.size}</dd></div>
            <div><dt className="text-[#9CA3AF] text-xs uppercase tracking-wide">Lamination</dt><dd className="font-medium mt-0.5">{order.lamination}</dd></div>
            <div><dt className="text-[#9CA3AF] text-xs uppercase tracking-wide">Edge</dt><dd className="font-medium mt-0.5">{order.edgeType}</dd></div>
            <div><dt className="text-[#9CA3AF] text-xs uppercase tracking-wide">Qty</dt><dd className="font-medium mt-0.5">{order.quantity}</dd></div>
            <div><dt className="text-[#9CA3AF] text-xs uppercase tracking-wide">Express</dt><dd className="font-medium mt-0.5">{order.expressDelivery ? '✓ Yes' : 'No'}</dd></div>
          </dl>
        );
      case 'shirt':
        return (
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            <div><dt className="text-[#9CA3AF] text-xs uppercase tracking-wide">Print Methods</dt><dd className="font-medium mt-0.5">{order.printMethods.join(', ')}</dd></div>
            <div><dt className="text-[#9CA3AF] text-xs uppercase tracking-wide">Items</dt><dd className="font-medium mt-0.5">{order.itemTypes.join(', ')}</dd></div>
            <div><dt className="text-[#9CA3AF] text-xs uppercase tracking-wide">Qty</dt><dd className="font-medium mt-0.5">{order.quantity}</dd></div>
            {order.sizesNeeded && <div><dt className="text-[#9CA3AF] text-xs uppercase tracking-wide">Sizes</dt><dd className="font-medium mt-0.5">{order.sizesNeeded}</dd></div>}
            <div className="col-span-full"><dt className="text-[#9CA3AF] text-xs uppercase tracking-wide">Design</dt><dd className="mt-0.5">{order.designDescription}</dd></div>
          </dl>
        );
      case 'gift':
        return (
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            <div><dt className="text-[#9CA3AF] text-xs uppercase tracking-wide">Products</dt><dd className="font-medium mt-0.5">{order.productTypes.join(', ')}</dd></div>
            <div><dt className="text-[#9CA3AF] text-xs uppercase tracking-wide">Qty</dt><dd className="font-medium mt-0.5">{order.quantity}</dd></div>
            {order.neededByDate && <div><dt className="text-[#9CA3AF] text-xs uppercase tracking-wide">Needed By</dt><dd className="font-medium mt-0.5">{order.neededByDate}</dd></div>}
            <div className="col-span-full"><dt className="text-[#9CA3AF] text-xs uppercase tracking-wide">Customization</dt><dd className="mt-0.5">{order.customizationDetails}</dd></div>
          </dl>
        );
    }
  }

  return (
    <>
      <tr
        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="px-4 py-3 text-sm text-[#6B7280]">{formatTimestamp(order.createdAt)}</td>
        <td className="px-4 py-3 text-sm font-medium text-[#111827]">{order.name}</td>
        <td className="px-4 py-3 text-sm text-[#6B7280]">{order.phone}</td>
        <td className="px-4 py-3 text-sm">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            {TYPE_LABELS[order.orderType]}
          </span>
        </td>
        <td className="px-4 py-3 text-sm font-medium text-[#111827]">
          {order.estimatedPrice != null ? formatPrice(order.estimatedPrice) : '—'}
          {order.orderType === 'photoshoot' && order.estimatedPrice != null && (
            <span className="block text-xs font-normal text-[#9CA3AF]">starting from</span>
          )}
        </td>
        <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            {NEXT_STATUS[order.status] && (
              <Button
                size="sm"
                variant="outline"
                loading={updating}
                onClick={(e) => { e.stopPropagation(); handleStatusUpdate(); }}
              >
                Mark {NEXT_STATUS[order.status]?.replace('_', ' ')}
              </Button>
            )}
            {expanded ? <ChevronUp size={16} className="text-gray-400 ml-1" /> : <ChevronDown size={16} className="text-gray-400 ml-1" />}
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-[#F8FAF9] border-b border-gray-100">
          <td colSpan={7} className="px-6 py-4">
            {renderDetails()}
          </td>
        </tr>
      )}
    </>
  );
}
