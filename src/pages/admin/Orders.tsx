import { useState } from 'react';
import { Search } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { OrderRow } from '../../components/admin/OrderRow';
import { OrderRowSkeleton } from '../../components/ui/Skeleton';
import { useOrders } from '../../hooks/useOrders';
import type { OrderType, OrderStatus } from '../../types';

type FilterType = OrderType | 'all';
type FilterStatus = OrderStatus | 'all';

const TYPE_FILTERS: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'photoshoot', label: 'Photoshoot' },
  { value: 'frame', label: 'Frame / Print' },
  { value: 'shirt', label: 'Shirt Printing' },
  { value: 'gift', label: 'Gifts & Merch' },
];

const STATUS_FILTERS: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export function AdminOrders() {
  const { orders, loading } = useOrders();
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [search, setSearch] = useState('');

  const filtered = orders.filter((o) => {
    if (typeFilter !== 'all' && o.orderType !== typeFilter) return false;
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return o.name.toLowerCase().includes(q) || o.phone.includes(q);
    }
    return true;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Orders</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            {orders.length} total order{orders.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20 transition-all"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as FilterType)}
            className="px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-[#374151] outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20 cursor-pointer bg-white"
          >
            {TYPE_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
            className="px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-[#374151] outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20 cursor-pointer bg-white"
          >
            {STATUS_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FAF9] border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Estimate</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => <OrderRowSkeleton key={i} />)
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center text-[#6B7280] text-sm">
                      {orders.length === 0 ? 'No orders yet.' : 'No orders match your filters.'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((order) => <OrderRow key={order.id} order={order} />)
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
