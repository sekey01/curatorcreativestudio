import { formatPrice } from '../../lib/pricing';

interface PriceEstimateProps {
  lines?: { label: string; amount: number }[];
  total: number;
  totalLabel?: string;
  note?: string;
}

export function PriceEstimate({ lines, total, totalLabel = 'Estimated Total', note }: PriceEstimateProps) {
  return (
    <div className="rounded-xl border border-[#EA580C]/30 bg-[#FFEDD5] p-4">
      {lines && lines.length > 0 && (
        <dl className="space-y-1 mb-2 text-sm text-[#374151]">
          {lines.map(({ label, amount }) => (
            <div key={label} className="flex justify-between gap-4">
              <dt>{label}</dt>
              <dd className="font-medium">{formatPrice(amount)}</dd>
            </div>
          ))}
        </dl>
      )}
      <div className={`flex justify-between items-baseline gap-4 ${lines && lines.length > 0 ? 'pt-2 border-t border-[#EA580C]/20' : ''}`}>
        <span className="text-sm font-semibold text-[#111827]">{totalLabel}</span>
        <span className="text-lg font-bold text-[#EA580C]">{formatPrice(total)}</span>
      </div>
      {note && <p className="text-xs text-[#6B7280] mt-1.5">{note}</p>}
    </div>
  );
}
