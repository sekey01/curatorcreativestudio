import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/order', label: 'Order' },
  { to: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-[#1D9E75] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <div className="leading-tight">
            <span className="text-[#111827] font-semibold text-sm block">Curator</span>
            <span className="text-[#1D9E75] text-xs font-medium">Creative Studio</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'text-[#1D9E75] bg-[#E8F5F0]'
                    : 'text-[#374151] hover:text-[#1D9E75] hover:bg-gray-50'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button size="sm" onClick={() => window.open('https://wa.me/233553767177', '_blank')}>
            Order Now
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 pt-2 space-y-1 shadow-lg animate-fade-in">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive ? 'text-[#1D9E75] bg-[#E8F5F0]' : 'text-[#374151] hover:bg-gray-50'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <div className="pt-2">
            <Button className="w-full" onClick={() => window.open('https://wa.me/233553767177', '_blank')}>
              Order Now
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
