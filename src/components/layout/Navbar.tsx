import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';

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
  const { theme, toggle } = useTheme();

  useEffect(() => { setOpen(false); }, [location]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'backdrop-blur-xl shadow-sm' : 'backdrop-blur-md'
      }`}
      style={{
        background: scrolled
          ? 'color-mix(in srgb, var(--bg-base) 95%, transparent)'
          : 'color-mix(in srgb, var(--bg-base) 80%, transparent)',
        borderBottom: `1px solid var(--border-section)`,
      }}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-200"
            style={{
              background: 'var(--accent-subtle)',
              borderColor: 'var(--border)',
            }}>
            <span className="font-bold text-sm" style={{ color: 'var(--accent)' }}>C</span>
          </div>
          <div className="leading-tight">
            <span className="font-semibold text-sm block tracking-wide" style={{ color: 'var(--text-1)' }}>Curator</span>
            <span className="text-xs font-medium tracking-widest uppercase"
              style={{ color: 'var(--text-3)', fontSize: '9px' }}>Creative Studio</span>
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
                `relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 tracking-wide ${
                  isActive ? 'font-semibold' : ''
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? 'var(--text-1)' : 'var(--text-2)',
                background: isActive ? 'var(--accent-subtle)' : 'transparent',
              })}
            >
              {({ isActive }) => (
                <>
                  {label}
                  {isActive && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                      style={{ background: 'var(--accent)' }}/>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="w-9 h-9 rounded-lg flex items-center justify-center border transition-all duration-200 hover:scale-105"
            style={{
              background: 'var(--accent-subtle)',
              borderColor: 'var(--border)',
              color: 'var(--text-2)',
            }}
          >
            {theme === 'light' ? <Moon size={15}/> : <Sun size={15}/>}
          </button>

          <Button size="sm" onClick={() => window.open('https://wa.me/233553767177', '_blank')}>
            Order Now
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all"
            style={{
              background: 'var(--accent-subtle)',
              borderColor: 'var(--border)',
              color: 'var(--text-2)',
            }}
          >
            {theme === 'light' ? <Moon size={14}/> : <Sun size={14}/>}
          </button>
          <button
            className="p-2 rounded-lg transition-colors"
            style={{ color: 'var(--text-2)' }}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20}/> : <Menu size={20}/>}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t px-4 pb-5 pt-3 space-y-1 shadow-lg animate-fade-in"
          style={{
            background: 'var(--bg-base)',
            borderColor: 'var(--border-section)',
          }}>
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className="block px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 tracking-wide"
              style={({ isActive }) => ({
                color: isActive ? 'var(--text-1)' : 'var(--text-2)',
                background: isActive ? 'var(--accent-subtle)' : 'transparent',
                border: isActive ? '1px solid var(--border)' : '1px solid transparent',
              })}
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
