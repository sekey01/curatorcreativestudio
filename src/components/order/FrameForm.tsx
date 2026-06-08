import { useState, type FormEvent } from 'react';
import { toast } from 'react-hot-toast';
import { Zap } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { addOrder } from '../../lib/firestore';
import type { FrameType, FrameSize, EdgeType, LaminationType } from '../../types';

const FRAME_TYPES: { value: FrameType; label: string }[] = [
  { value: 'Foreign Frame', label: 'Foreign Frame' },
  { value: 'Local Frame', label: 'Local Frame' },
  { value: 'Wooden Frame', label: 'Wooden Frame' },
  { value: 'Canvas Art', label: 'Canvas Art' },
  { value: 'Pencil Art', label: 'Pencil Art' },
  { value: 'Customized Clock', label: 'Customized Clock' },
  { value: 'Citation', label: 'Citation' },
  { value: 'Certificate', label: 'Certificate' },
];
const SIZES: { value: FrameSize; label: string }[] = [
  { value: '8×10', label: '8×10' },
  { value: '10×12', label: '10×12' },
  { value: '12×16', label: '12×16' },
  { value: '16×20', label: '16×20' },
  { value: '20×24', label: '20×24' },
  { value: '24×30', label: '24×30' },
];
const EDGE_TYPES: { value: EdgeType; label: string }[] = [
  { value: 'No Edge', label: 'No Edge' },
  { value: 'With Edge', label: 'With Edge' },
];
const LAMINATION_TYPES: { value: LaminationType; label: string }[] = [
  { value: 'Crystal', label: 'Crystal' },
  { value: 'Glossy', label: 'Glossy' },
  { value: '3D', label: '3D' },
  { value: 'Canvas', label: 'Canvas' },
  { value: 'None', label: 'None' },
];

interface FrameFormProps {
  onSuccess: () => void;
}

export function FrameForm({ onSuccess }: FrameFormProps) {
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
      await addOrder({ ...form, expressDelivery, orderType: 'frame' } as Parameters<typeof addOrder>[0]);
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
              expressDelivery ? 'border-[#1D9E75] bg-[#E8F5F0]' : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${expressDelivery ? 'border-[#1D9E75] bg-[#1D9E75]' : 'border-gray-300'}`}>
              {expressDelivery && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-sm font-medium text-[#111827]">
                <Zap size={14} className={expressDelivery ? 'text-[#1D9E75]' : 'text-gray-400'} />
                Express Delivery
              </div>
              <span className="text-xs text-[#6B7280]">{expressDelivery ? 'Same day (+fee)' : 'Standard: 2–3 days'}</span>
            </div>
          </button>
        </div>
      </div>
      <Textarea label="Additional Notes" placeholder="Any special instructions..." value={form.additionalNotes} onChange={(e) => set('additionalNotes', e.target.value)} />
      <Button type="submit" loading={loading} size="lg" className="w-full sm:w-auto">
        Submit Frame Order
      </Button>
    </form>
  );
}
