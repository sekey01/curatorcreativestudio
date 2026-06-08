import { type ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, ImageIcon, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    navigate('/admin/login');
  }

  return (
    <div className="min-h-screen flex bg-[#F8FAF9]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="h-16 flex items-center gap-2.5 px-6 border-b border-gray-100">
          <div className="w-8 h-8 bg-[#1D9E75] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <div className="leading-tight">
            <span className="text-[#111827] font-semibold text-sm block">Curator</span>
            <span className="text-[#1D9E75] text-xs">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#E8F5F0] text-[#1D9E75]'
                    : 'text-[#374151] hover:bg-gray-50 hover:text-[#1D9E75]'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors w-full cursor-pointer"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-[#6B7280]">Admin</span>
            <div className="w-8 h-8 bg-[#E8F5F0] rounded-full flex items-center justify-center">
              <span className="text-[#1D9E75] text-xs font-bold">A</span>
            </div>
          </div>
        </header>
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
