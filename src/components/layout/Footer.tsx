import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background: 'var(--bg-section)',
        borderTop: '1px solid var(--border-section)',
      }}
    >
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, var(--accent-subtle) 0%, transparent 50%)' }}/>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center border"
                style={{ background: 'var(--accent-subtle)', borderColor: 'var(--border)' }}>
                <span className="font-bold" style={{ color: 'var(--accent)' }}>C</span>
              </div>
              <div className="leading-tight">
                <span className="font-semibold block tracking-wide" style={{ color: 'var(--text-1)' }}>Curator</span>
                <span className="text-xs font-medium tracking-widest uppercase"
                  style={{ color: 'var(--text-3)', fontSize: '9px' }}>Creative Studio</span>
              </div>
            </div>

            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--text-3)' }}>
              Premium photography, custom frames, shirt printing &amp; personalized gifts —
              crafted for every occasion in Ghana.
            </p>

            <a
              href="https://wa.me/233553767177"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm transition-colors duration-200"
              style={{ color: 'var(--text-3)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-1)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-3)')}
            >
              <MessageCircle size={15}/>
              +233 55 376 7177
            </a>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: 'var(--text-1)' }}>
              Navigation
            </h4>
            <ul className="space-y-2.5">
              {[
                { to: '/',        label: 'Home' },
                { to: '/gallery', label: 'Portfolio' },
                { to: '/order',   label: 'Place an Order' },
                { to: '/contact', label: 'Contact Us' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm transition-colors duration-200"
                    style={{ color: 'var(--text-3)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-3)')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: 'var(--text-1)' }}>Services</h4>
            <ul className="space-y-2.5">
              {[
                'Photoshoot Booking',
                'Frame & Print Orders',
                'Shirt Printing',
                'Gifts & Merch',
              ].map((s) => (
                <li key={s}>
                  <Link
                    to="/order"
                    className="text-sm transition-colors duration-200"
                    style={{ color: 'var(--text-3)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-3)')}
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid var(--border-section)' }}>
          <p className="text-xs" style={{ color: 'var(--text-4)' }}>
            © 2025 Curator Creative Studio. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[
                { href: 'https://instagram.com', label: 'IG' },
                { href: 'https://facebook.com',  label: 'FB' },
                { href: 'https://tiktok.com',    label: 'TK' },
              ].map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center
                    border text-xs font-bold transition-all duration-200"
                  style={{ color: 'var(--text-3)', borderColor: 'transparent' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-1)';
                    (e.currentTarget as HTMLElement).style.background = 'var(--accent-subtle)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-3)';
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
                  }}
                >
                  {label}
                </a>
              ))}
            </div>

            {/* Admin link — subtle, for studio owners */}
            <Link
              to="/admin/login"
              className="text-xs transition-colors duration-200 px-2 py-1"
              style={{ color: 'var(--text-4)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-3)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-4)')}
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
