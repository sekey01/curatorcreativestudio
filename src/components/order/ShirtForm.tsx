import { useState, type FormEvent } from 'react';
import { toast } from 'react-hot-toast';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { ChipGroup } from '../ui/Chip';
import { PriceEstimate } from './PriceEstimate';
import { addOrder } from '../../lib/firestore';
import { usePricing } from '../../hooks/usePricing';
import { calculateShirtPrice, formatPrice } from '../../lib/pricing';
import { PRINT_METHODS, SHIRT_ITEM_TYPES as ITEM_TYPES } from '../../lib/constants';
import type { PrintMethod, ShirtItemType } from '../../types';

interface ShirtFormProps {
  onSuccess: () => void;
}

export function ShirtForm({ onSuccess }: ShirtFormProps) {
  const { pricing } = usePricing();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [printMethods, setPrintMethods] = useState<string[]>([]);
  const [itemTypes, setItemTypes] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    quantity: 1,
    sizesNeeded: '',
    designDescription: '',
    additionalNotes: '',
  });

  const itemHints = Object.fromEntries(
    ITEM_TYPES.map((t) => [t, formatPrice(pricing.shirts.items[t] ?? 0)]),
  );
  const printMethodHints = Object.fromEntries(
    PRINT_METHODS.map((m) => [m, `+${formatPrice(pricing.shirts.printMethods[m] ?? 0)}`]),
  );

  const { unitPrice, total } = calculateShirtPrice(pricing, { itemTypes, printMethods, quantity: form.quantity });
  const showEstimate = itemTypes.length > 0 || printMethods.length > 0;
  const priceLines = [
    ...itemTypes.map((t) => ({ label: t, amount: pricing.shirts.items[t as ShirtItemType] ?? 0 })),
    ...printMethods.map((m) => ({ label: m, amount: pricing.shirts.printMethods[m as PrintMethod] ?? 0 })),
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
    if (!printMethods.length) errs.printMethods = 'Select at least one print method';
    if (!itemTypes.length) errs.itemTypes = 'Select at least one item type';
    if (form.quantity < 1) errs.quantity = 'Quantity must be at least 1';
    if (!form.designDescription.trim()) errs.designDescription = 'Design description is required';
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
        printMethods: printMethods as PrintMethod[],
        itemTypes: itemTypes as ShirtItemType[],
        estimatedPrice: total,
        orderType: 'shirt',
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
        label="Print Method *"
        options={PRINT_METHODS}
        hints={printMethodHints}
        selected={printMethods}
        onChange={(v) => { setPrintMethods(v); setErrors((p) => ({ ...p, printMethods: '' })); }}
        error={errors.printMethods}
      />
      <ChipGroup
        label="Item Type *"
        options={ITEM_TYPES}
        hints={itemHints}
        selected={itemTypes}
        onChange={(v) => { setItemTypes(v); setErrors((p) => ({ ...p, itemTypes: '' })); }}
        error={errors.itemTypes}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Quantity *" type="number" min={1} value={form.quantity} onChange={(e) => set('quantity', Number(e.target.value))} error={errors.quantity} />
        <Input label="Sizes Needed" placeholder='e.g. "5×M, 10×L, 5×XL"' value={form.sizesNeeded} onChange={(e) => set('sizesNeeded', e.target.value)} />
      </div>
      <Textarea label="Design Description *" placeholder="Describe your design, colors, text, placement..." value={form.designDescription} onChange={(e) => set('designDescription', e.target.value)} error={errors.designDescription} />
      <Textarea label="Additional Notes" placeholder="Any other requirements..." value={form.additionalNotes} onChange={(e) => set('additionalNotes', e.target.value)} />
      {showEstimate && (
        <PriceEstimate
          lines={priceLines}
          total={total}
          note="Final price may vary slightly based on design complexity."
        />
      )}
      <Button type="submit" loading={loading} size="lg" className="w-full sm:w-auto">
        Submit Shirt Order
      </Button>
    </form>
  );
}
