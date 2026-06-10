import { useEffect, useRef, useState, type ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { Save } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { usePricing } from '../../hooks/usePricing';
import { savePricing } from '../../lib/firestore';
import { DEFAULT_PRICING } from '../../lib/pricing';
import {
  FRAME_TYPES,
  FRAME_SIZES,
  EDGE_TYPES,
  LAMINATION_TYPES,
  PRINT_METHODS,
  SHIRT_ITEM_TYPES,
  GIFT_PRODUCT_TYPES,
  OCCASION_TYPES,
} from '../../lib/constants';
import type { PricingConfig } from '../../types';

function mergeWithDefaults(p: PricingConfig): PricingConfig {
  return {
    frames: Object.fromEntries(
      FRAME_TYPES.map((type) => [type, { ...DEFAULT_PRICING.frames[type], ...(p.frames?.[type] ?? {}) }]),
    ) as PricingConfig['frames'],
    frameAddons: {
      edgeTypes: { ...DEFAULT_PRICING.frameAddons.edgeTypes, ...(p.frameAddons?.edgeTypes ?? {}) },
      lamination: { ...DEFAULT_PRICING.frameAddons.lamination, ...(p.frameAddons?.lamination ?? {}) },
      expressDeliveryFee: p.frameAddons?.expressDeliveryFee ?? 0,
    },
    shirts: {
      items: { ...DEFAULT_PRICING.shirts.items, ...(p.shirts?.items ?? {}) },
      printMethods: { ...DEFAULT_PRICING.shirts.printMethods, ...(p.shirts?.printMethods ?? {}) },
    },
    gifts: { ...DEFAULT_PRICING.gifts, ...(p.gifts ?? {}) },
    photoshoot: { ...DEFAULT_PRICING.photoshoot, ...(p.photoshoot ?? {}) },
  };
}

function Section({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-semibold text-[#111827]">{title}</h3>
      <p className="text-sm text-[#6B7280] mt-0.5 mb-4">{description}</p>
      {children}
    </div>
  );
}

function CurrencyInput({ value, onChange, ariaLabel }: { value: number; onChange: (v: number) => void; ariaLabel?: string }) {
  return (
    <div className="relative">
      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-[#9CA3AF] pointer-events-none">₵</span>
      <input
        type="number"
        min={0}
        step="0.01"
        inputMode="decimal"
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.valueAsNumber || 0)}
        className="w-full pl-6 pr-2 py-2 rounded-lg text-sm outline-none border border-gray-200 bg-white text-[#111827]
          focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20 transition-all"
      />
    </div>
  );
}

function LabeledCurrencyInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-[#6B7280]">{label}</label>
      <CurrencyInput value={value} onChange={onChange} ariaLabel={label} />
    </div>
  );
}

export function AdminPricing() {
  const { pricing, loading } = usePricing();
  const [form, setForm] = useState<PricingConfig>(DEFAULT_PRICING);
  const [saving, setSaving] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (!loading && !initialized.current) {
      setForm(mergeWithDefaults(pricing));
      initialized.current = true;
    }
  }, [loading, pricing]);

  async function handleSave() {
    setSaving(true);
    try {
      await savePricing(form);
      toast.success('Pricing updated');
    } catch {
      toast.error('Failed to save pricing. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 pb-24">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#111827]">Pricing</h1>
            <p className="text-sm text-[#6B7280] mt-1">
              Set prices shown to customers on the Order page. All amounts are in Ghana Cedis (₵).
            </p>
          </div>
          <Button onClick={handleSave} loading={saving} size="lg">
            <Save size={16} />
            Save Pricing
          </Button>
        </div>

        {/* Frame & Print matrix */}
        <Section title="Frames & Prints" description="Price per frame type and size combination.">
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm border-collapse min-w-[640px]">
              <thead>
                <tr>
                  <th className="text-left p-2 sticky left-0 bg-white text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
                    Frame Type
                  </th>
                  {FRAME_SIZES.map((size) => (
                    <th key={size} className="p-2 text-center text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
                      {size}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FRAME_TYPES.map((type) => (
                  <tr key={type} className="border-t border-gray-100">
                    <td className="p-2 pr-4 font-medium text-[#111827] whitespace-nowrap sticky left-0 bg-white">
                      {type}
                    </td>
                    {FRAME_SIZES.map((size) => (
                      <td key={size} className="p-1.5 min-w-[88px]">
                        <CurrencyInput
                          ariaLabel={`${type} ${size}`}
                          value={form.frames[type][size]}
                          onChange={(v) =>
                            setForm((prev) => ({
                              ...prev,
                              frames: { ...prev.frames, [type]: { ...prev.frames[type], [size]: v } },
                            }))
                          }
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Frame add-ons */}
        <Section title="Frame Add-ons" description="Extra fees added on top of the base frame price.">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
            <div>
              <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-2">Edge Type</p>
              <div className="space-y-3">
                {EDGE_TYPES.map((edge) => (
                  <LabeledCurrencyInput
                    key={edge}
                    label={edge}
                    value={form.frameAddons.edgeTypes[edge]}
                    onChange={(v) =>
                      setForm((prev) => ({
                        ...prev,
                        frameAddons: { ...prev.frameAddons, edgeTypes: { ...prev.frameAddons.edgeTypes, [edge]: v } },
                      }))
                    }
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-2">Lamination</p>
              <div className="space-y-3">
                {LAMINATION_TYPES.map((lam) => (
                  <LabeledCurrencyInput
                    key={lam}
                    label={lam}
                    value={form.frameAddons.lamination[lam]}
                    onChange={(v) =>
                      setForm((prev) => ({
                        ...prev,
                        frameAddons: { ...prev.frameAddons, lamination: { ...prev.frameAddons.lamination, [lam]: v } },
                      }))
                    }
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-2">Delivery</p>
              <LabeledCurrencyInput
                label="Express Delivery Fee"
                value={form.frameAddons.expressDeliveryFee}
                onChange={(v) => setForm((prev) => ({ ...prev, frameAddons: { ...prev.frameAddons, expressDeliveryFee: v } }))}
              />
            </div>
          </div>
        </Section>

        {/* Shirt printing */}
        <Section title="Shirt Printing" description="Base price per garment, plus a fee per print method applied.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-2">Item Type (base price)</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SHIRT_ITEM_TYPES.map((item) => (
                  <LabeledCurrencyInput
                    key={item}
                    label={item}
                    value={form.shirts.items[item]}
                    onChange={(v) =>
                      setForm((prev) => ({ ...prev, shirts: { ...prev.shirts, items: { ...prev.shirts.items, [item]: v } } }))
                    }
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-2">Print Method (added fee)</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRINT_METHODS.map((method) => (
                  <LabeledCurrencyInput
                    key={method}
                    label={method}
                    value={form.shirts.printMethods[method]}
                    onChange={(v) =>
                      setForm((prev) => ({
                        ...prev,
                        shirts: { ...prev.shirts, printMethods: { ...prev.shirts.printMethods, [method]: v } },
                      }))
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Gifts & merch */}
        <Section title="Gifts & Merch" description="Price per item for each product type.">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {GIFT_PRODUCT_TYPES.map((product) => (
              <LabeledCurrencyInput
                key={product}
                label={product}
                value={form.gifts[product]}
                onChange={(v) => setForm((prev) => ({ ...prev, gifts: { ...prev.gifts, [product]: v } }))}
              />
            ))}
          </div>
        </Section>

        {/* Photoshoot */}
        <Section title="Photoshoot Packages" description="'Starting from' price shown for each occasion type.">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {OCCASION_TYPES.map((occasion) => (
              <LabeledCurrencyInput
                key={occasion}
                label={occasion}
                value={form.photoshoot[occasion]}
                onChange={(v) => setForm((prev) => ({ ...prev, photoshoot: { ...prev.photoshoot, [occasion]: v } }))}
              />
            ))}
          </div>
        </Section>

        <div className="flex justify-end">
          <Button onClick={handleSave} loading={saving} size="lg">
            <Save size={16} />
            Save Pricing
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
