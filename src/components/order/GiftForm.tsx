import { useState, type FormEvent } from 'react';
import { toast } from 'react-hot-toast';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { ChipGroup } from '../ui/Chip';
import { PriceEstimate } from './PriceEstimate';
import { addOrder } from '../../lib/firestore';
import { usePricing } from '../../hooks/usePricing';
import { calculateGiftPrice, formatPrice } from '../../lib/pricing';
import { GIFT_PRODUCT_TYPES as PRODUCT_TYPES } from '../../lib/constants';
import type { GiftProductType } from '../../types';

interface GiftFormProps {
  onSuccess: () => void;
}

export function GiftForm({ onSuccess }: GiftFormProps) {
  const { pricing } = usePricing();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    quantity: 1,
    neededByDate: '',
    customizationDetails: '',
    additionalNotes: '',
  });

  const productHints = Object.fromEntries(
    PRODUCT_TYPES.map((t) => [t, formatPrice(pricing.gifts[t] ?? 0)]),
  );

  const { unitPrice, total } = calculateGiftPrice(pricing, { productTypes, quantity: form.quantity });
  const showEstimate = productTypes.length > 0;
  const priceLines = [
    ...productTypes.map((t) => ({ label: t, amount: pricing.gifts[t as GiftProductType] ?? 0 })),
    ...(form.quantity > 1 ? [{ label: `Unit price × ${form.quantity}`, amount: unitPrice * form.quantity }] : []),
  ];

  function set(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    if (!productTypes.length) errs.productTypes = 'Select at least one product';
    if (form.quantity < 1) errs.quantity = 'Quantity must be at least 1';
    if (!form.customizationDetails.trim()) errs.customizationDetails = 'Please describe your customization';
    return errs;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await addOrder({
        ...form,
        productTypes: productTypes as GiftProductType[],
        estimatedPrice: total,
        orderType: 'gift',
      } as Parameters<typeof addOrder>[0]);
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
      <ChipGroup
        label="Product Type *"
        options={PRODUCT_TYPES}
        hints={productHints}
        selected={productTypes}
        onChange={(v) => { setProductTypes(v); setErrors((p) => ({ ...p, productTypes: '' })); }}
        error={errors.productTypes}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Quantity *" type="number" min={1} value={form.quantity} onChange={(e) => set('quantity', Number(e.target.value))} error={errors.quantity} />
        <Input label="Needed By Date" type="date" value={form.neededByDate} onChange={(e) => set('neededByDate', e.target.value)} />
      </div>
      <Textarea label="Customization Details *" placeholder="Names, text, colors, photo descriptions, special instructions..." value={form.customizationDetails} onChange={(e) => set('customizationDetails', e.target.value)} rows={5} error={errors.customizationDetails} />
      <Textarea label="Additional Notes" placeholder="Any other requirements..." value={form.additionalNotes} onChange={(e) => set('additionalNotes', e.target.value)} />
      {showEstimate && (
        <PriceEstimate
          lines={priceLines}
          total={total}
          note="Final price may vary slightly based on customization complexity."
        />
      )}
      <Button type="submit" loading={loading} size="lg" className="w-full sm:w-auto">
        Submit Gift Order
      </Button>
    </form>
  );
}
