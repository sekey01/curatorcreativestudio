interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`skeleton rounded-lg ${className}`}/>;
}

export function ImageCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
      <Skeleton className="w-full h-56"/>
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4"/>
        <Skeleton className="h-3 w-1/3"/>
      </div>
    </div>
  );
}

export function OrderRowSkeleton() {
  return (
    <tr className="border-b border-gray-100">
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full"/>
        </td>
      ))}
    </tr>
  );
}
