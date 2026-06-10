import type { PricingConfig, FrameType, FrameSize } from '../types';
import {
  FRAME_TYPES,
  FRAME_SIZES,
  EDGE_TYPES,
  LAMINATION_TYPES,
  PRINT_METHODS,
  SHIRT_ITEM_TYPES,
  GIFT_PRODUCT_TYPES,
  OCCASION_TYPES,
} from './constants';

function zeroMap<K extends string>(keys: readonly K[]): Record<K, number> {
  return Object.fromEntries(keys.map((k) => [k, 0])) as Record<K, number>;
}

export const DEFAULT_PRICING: PricingConfig = {
  frames: Object.fromEntries(
    FRAME_TYPES.map((type) => [type, zeroMap(FRAME_SIZES)]),
  ) as PricingConfig['frames'],
  frameAddons: {
    edgeTypes: zeroMap(EDGE_TYPES),
    lamination: zeroMap(LAMINATION_TYPES),
    expressDeliveryFee: 0,
  },
  shirts: {
    items: zeroMap(SHIRT_ITEM_TYPES),
    printMethods: zeroMap(PRINT_METHODS),
  },
  gifts: zeroMap(GIFT_PRODUCT_TYPES),
  photoshoot: zeroMap(OCCASION_TYPES),
};

export function formatPrice(amount: number): string {
  return `₵${amount.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ── Order estimate calculators ──────────────────────────────────────────────

export function calculateFramePrice(
  pricing: PricingConfig,
  opts: {
    frameType: FrameType | '';
    size: FrameSize | '';
    edgeType: keyof PricingConfig['frameAddons']['edgeTypes'] | '';
    lamination: keyof PricingConfig['frameAddons']['lamination'] | '';
    quantity: number;
    expressDelivery: boolean;
  },
): { unitPrice: number; total: number } {
  const base = opts.frameType && opts.size ? pricing.frames[opts.frameType]?.[opts.size] ?? 0 : 0;
  const edgeFee = opts.edgeType ? pricing.frameAddons.edgeTypes[opts.edgeType] ?? 0 : 0;
  const laminationFee = opts.lamination ? pricing.frameAddons.lamination[opts.lamination] ?? 0 : 0;
  const unitPrice = base + edgeFee + laminationFee;
  const expressFee = opts.expressDelivery ? pricing.frameAddons.expressDeliveryFee : 0;
  return { unitPrice, total: unitPrice * Math.max(opts.quantity, 1) + expressFee };
}

export function calculateShirtPrice(
  pricing: PricingConfig,
  opts: { itemTypes: string[]; printMethods: string[]; quantity: number },
): { unitPrice: number; total: number } {
  const itemsTotal = opts.itemTypes.reduce(
    (sum, t) => sum + (pricing.shirts.items[t as keyof PricingConfig['shirts']['items']] ?? 0),
    0,
  );
  const methodsTotal = opts.printMethods.reduce(
    (sum, m) => sum + (pricing.shirts.printMethods[m as keyof PricingConfig['shirts']['printMethods']] ?? 0),
    0,
  );
  const unitPrice = itemsTotal + methodsTotal;
  return { unitPrice, total: unitPrice * Math.max(opts.quantity, 1) };
}

export function calculateGiftPrice(
  pricing: PricingConfig,
  opts: { productTypes: string[]; quantity: number },
): { unitPrice: number; total: number } {
  const unitPrice = opts.productTypes.reduce(
    (sum, p) => sum + (pricing.gifts[p as keyof PricingConfig['gifts']] ?? 0),
    0,
  );
  return { unitPrice, total: unitPrice * Math.max(opts.quantity, 1) };
}

export function getPhotoshootStartingPrice(
  pricing: PricingConfig,
  occasionType: string,
): number {
  return pricing.photoshoot[occasionType as keyof PricingConfig['photoshoot']] ?? 0;
}
