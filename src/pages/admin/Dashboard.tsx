import { Link } from 'react-router-dom';
import { ShoppingBag, Images, MessageSquare, Clock, ArrowRight } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Skeleton } from '../../components/ui/Skeleton';
import { useOrders } from '../../hooks/useOrders';
import { usePortfolio } from '../../hooks/usePortfolio';
import { useRecentComments } from '../../hooks/useComments';

export function AdminDashboard() {
  const { orders, loading: ordersLoading } = useOrders();
  const { images, loading: imagesLoading } = usePortfolio();
  const { comments, loading: commentsLoading } = useRecentComments(100);

  const pendingOrders = orders.filter((o) => o.status === 'pending').length;

  const stats = [
    {
      label: 'Total Orders',
      value: orders.length,
      icon: ShoppingBag,
      loading: ordersLoading,
      color: 'bg-blue-50 text-blue-600',
      link: '/admin/orders',
    },
    {
      label: 'Pending Orders',
      value: pendingOrders,
      icon: Clock,
      loading: ordersLoading,
      color: 'bg-amber-50 text-amber-600',
      link: '/admin/orders',
    },
    {
      label: 'Portfolio Images',
      value: images.length,
      icon: Images,
      loading: imagesLoading,
      color: 'bg-[#E8F5F0] text-[#1D9E75]',
      link: '/admin/gallery',
    },
    {
      label: 'Total Comments',
      value: comments.length,
      icon: MessageSquare,
      loading: commentsLoading,
      color: 'bg-purple-50 text-purple-600',
      link: '/admin/orders',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Dashboard</h1>
          <p className="text-sm text-[#6B7280] mt-1">Welcome back. Here's an overview.</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map(({ label, value, icon: Icon, loading, color, link }) => (
            <Link
              key={label}
              to={link}
              className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon size={20} />
                </div>
                <ArrowRight size={16} className="text-gray-300 group-hover:text-[#1D9E75] transition-colors" />
              </div>
              {loading ? (
                <Skeleton className="h-8 w-16 mb-1" />
              ) : (
                <p className="text-3xl font-bold text-[#111827]">{value}</p>
              )}
              <p className="text-sm text-[#6B7280] mt-1">{label}</p>
            </Link>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Link
            to="/admin/orders"
            className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:border-[#1D9E75]/40 hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-[#111827] mb-1">Manage Orders</h3>
                <p className="text-sm text-[#6B7280]">View, filter, and update customer orders</p>
              </div>
              <ArrowRight size={20} className="text-gray-300 group-hover:text-[#1D9E75] transition-colors" />
            </div>
          </Link>
          <Link
            to="/admin/gallery"
            className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:border-[#1D9E75]/40 hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-[#111827] mb-1">Gallery Manager</h3>
                <p className="text-sm text-[#6B7280]">Upload, organize, and delete portfolio images</p>
              </div>
              <ArrowRight size={20} className="text-gray-300 group-hover:text-[#1D9E75] transition-colors" />
            </div>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
