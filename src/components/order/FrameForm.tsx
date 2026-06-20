import { useState, type FormEvent } from 'react';
import { toast } from 'react-hot-toast';
import { Zap } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { PriceEstimate } from './PriceEstimate';
import { addOrder } from '../../lib/firestore';
import { usePricing } from '../../hooks/usePricing';
import { calculateFramePrice } from '../../lib/pricing';
import { FRAME_TYPES as FRAME_TYPE_VALUES, FRAME_SIZES, EDGE_TYPES as EDGE_TYPE_VALUES, LAMINATION_TYPES as LAMINATION_TYPE_VALUES } from '../../lib/constants';
import type { FrameType, FrameSize, EdgeType, LaminationType } from '../../types';

const FRAME_TYPES: { value: FrameType; label: string }[] = FRAME_TYPE_VALUES.map((v) => ({ value: v, label: v }));
const SIZES: { value: FrameSize; label: string }[] = FRAME_SIZES.map((v) => ({ value: v, label: v }));
const EDGE_TYPES: { value: EdgeType; label: string }[] = EDGE_TYPE_VALUES.map((v) => ({ value: v, label: v }));
const LAMINATION_TYPES: { value: LaminationType; label: string }[] = LAMINATION_TYPE_VALUES.map((v) => ({ value: v, label: v }));

interface FrameFormProps {
  onSuccess: () => void;
}

export function FrameForm({ onSuccess }: FrameFormProps) {
  const { pricing } = usePricing();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [expressDelivery, setExpressDelivery] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    frameType: '' as FrameType | '',
    size: '' as FrameSize | '',
    edgeType: '' as EdgeType | '',
    lamination: '' as LaminationType | '',
    quantity: 1,
    additionalNotes: '',
  });

  const { unitPrice, total } = calculateFramePrice(pricing, {
    frameType: form.frameType,
    size: form.size,
    edgeType: form.edgeType,
    lamination: form.lamination,
    quantity: form.quantity,
    expressDelivery,
  });
  const basePrice = form.frameType && form.size ? pricing.frames[form.frameType]?.[form.size] ?? 0 : 0;
  const edgeFee = form.edgeType ? pricing.frameAddons.edgeTypes[form.edgeType] ?? 0 : 0;
  const laminationFee = form.lamination ? pricing.frameAddons.lamination[form.lamination] ?? 0 : 0;
  const expressFee = expressDelivery ? pricing.frameAddons.expressDeliveryFee : 0;
  const showEstimate = Boolean(form.frameType && form.size);
  const priceLines = [
    { label: `Frame price (${form.size || ''})`, amount: basePrice },
    ...(edgeFee > 0 ? [{ label: form.edgeType, amount: edgeFee }] : []),
    ...(laminationFee > 0 ? [{ label: `${form.lamination} lamination`, amount: laminationFee }] : []),
    ...(form.quantity > 1 ? [{ label: `Unit price × ${form.quantity}`, amount: unitPrice * form.quantity }] : []),
    ...(expressFee > 0 ? [{ label: 'Express delivery', amount: expressFee }] : []),
  ];

  function set(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    if (!form.frameType) errs.frameType = 'Please select a frame type';
    if (!form.size) errs.size = 'Please select a size';
    if (!form.edgeType) errs.edgeType = 'Please select edge type';
    if (!form.lamination) errs.lamination = 'Please select lamination';
    if (form.quantity < 1) errs.quantity = 'Quantity must be at least 1';
    return errs;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await addOrder({ ...form, expressDelivery, estimatedPrice: total, orderType: 'frame' } as Parameters<typeof addOrder>[0]);
      onSuccess();
    } catch {
      toast.error('Failed to submit order. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Full Name *" placeholder="Your full name" value={form.name} onChange={(e) => set('name', e.target.value)} error={errors.name} />
        <Input label="Phone Number *" type="tel" placeholder="+233 XX XXX XXXX" value={form.phone} onChange={(e) => set('phone', e.target.value)} error={errors.phone} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select label="Frame Type *" options={FRAME_TYPES} placeholder="Select frame type" value={form.frameType} onChange={(e) => set('frameType', e.target.value)} error={errors.frameType} />
        <Select label="Size *" options={SIZES} placeholder="Select size" value={form.size} onChange={(e) => set('size', e.target.value)} error={errors.size} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select label="Edge Type *" options={EDGE_TYPES} placeholder="Select edge type" value={form.edgeType} onChange={(e) => set('edgeType', e.target.value)} error={errors.edgeType} />
        <Select label="Lamination *" options={LAMINATION_TYPES} placeholder="Select lamination" value={form.lamination} onChange={(e) => set('lamination', e.target.value)} error={errors.lamination} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Quantity *" type="number" min={1} value={form.quantity} onChange={(e) => set('quantity', Number(e.target.value))} error={errors.quantity} />
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-[#374151]">Delivery</span>
          <button
            type="button"
            onClick={() => setExpressDelivery(!expressDelivery)}
            className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer text-left ${
              expressDelivery ? 'border-[#F97316] bg-[#FFEDD5]' : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${expressDelivery ? 'border-[#F97316] bg-[#F97316]' : 'border-gray-300'}`}>
              {expressDelivery && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-sm font-medium text-[#111827]">
                <Zap size={14} className={expressDelivery ? 'text-[#F97316]' : 'text-gray-400'} />
                Express Delivery
              </div>
              <span className="text-xs text-[#6B7280]">{expressDelivery ? 'Same day (+fee)' : 'Standard: 2–3 days'}</span>
            </div>
          </button>
        </div>
      </div>
      <Textarea label="Additional Notes" placeholder="Any special instructions..." value={form.additionalNotes} onChange={(e) => set('additionalNotes', e.target.value)} />
      {showEstimate && (
        <PriceEstimate
          lines={priceLines}
          total={total}
          note="Final price may vary slightly based on design complexity."
        />
      )}
      <Button type="submit" loading={loading} size="lg" className="w-full sm:w-auto">
        Submit Frame Order
      </Button>
    </form>
  );
}
