import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#111827] text-gray-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-[#1D9E75] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">C</span>
              </div>
              <div className="leading-tight">
                <span className="text-white font-semibold block">Curator</span>
                <span className="text-[#1D9E75] text-sm">Creative Studio</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Premium photography, custom frames, shirt printing & personalized gifts — crafted
              for every occasion in Ghana.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://wa.me/233553767177"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[#1D9E75] hover:text-[#25D366] transition-colors"
              >
                <MessageCircle size={16} />
                +233 55 376 7177
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Home' },
                { to: '/gallery', label: 'Portfolio' },
                { to: '/order', label: 'Place an Order' },
                { to: '/contact', label: 'Contact Us' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm hover:text-[#1D9E75] transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider">Services</h4>
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
                    className="text-sm hover:text-[#1D9E75] transition-colors duration-200"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">© 2025 Curator Creative Studio. All rights reserved.</p>
          <div className="flex items-center gap-1">
            {[
              { href: 'https://instagram.com', label: 'IG' },
              { href: 'https://facebook.com', label: 'FB' },
              { href: 'https://tiktok.com', label: 'TK' },
            ].map(({ href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-800 hover:text-[#1D9E75] transition-colors text-xs font-bold"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
