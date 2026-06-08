
interface ChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function Chip({ label, selected, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border cursor-pointer ${
        selected
          ? 'bg-[#1D9E75] border-[#1D9E75] text-white'
          : 'bg-white border-gray-200 text-[#6B7280] hover:border-[#1D9E75] hover:text-[#1D9E75]'
      }`}
    >
      {label}
    </button>
  );
}

interface ChipGroupProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  label?: string;
  error?: string;
}

export function ChipGroup({ options, selected, onChange, label, error }: ChipGroupProps) {
  function toggle(opt: string) {
    onChange(
      selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt],
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-sm font-medium text-[#374151]">{label}</span>}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <Chip key={opt} label={opt} selected={selected.includes(opt)} onClick={() => toggle(opt)} />
        ))}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
