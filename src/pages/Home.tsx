import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Frame, Shirt, Gift, ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ImageCardSkeleton } from '../components/ui/Skeleton';
import { ImageModal } from '../components/gallery/ImageModal';
import { useRecentPortfolio } from '../hooks/usePortfolio';
import { useRecentComments } from '../hooks/useComments';
import { formatTimestamp } from '../lib/firestore';
import type { PortfolioImage } from '../types';

const SERVICES = [
  {
    icon: Camera,
    title: 'Photoshoot Booking',
    description: 'Professional photography for birthdays, weddings, ceremonies, and every special moment.',
    tab: 'photoshoot',
  },
  {
    icon: Frame,
    title: 'Frame & Print Orders',
    description: 'Custom frames, canvas art, citations, certificates, and personalized clocks in premium finishes.',
    tab: 'frame',
  },
  {
    icon: Shirt,
    title: 'Shirt Printing',
    description: 'Embroidery, DTF, sublimation, and screen printing on t-shirts, jerseys, lab coats, and more.',
    tab: 'shirt',
  },
  {
    icon: Gift,
    title: 'Gifts & Merch',
    description: 'Magic mugs, custom pillows, plaques, 3D signage, hand fans, and unique personalized gifts.',
    tab: 'gift',
  },
];

export function Home() {
  const { images, loading } = useRecentPortfolio(6);
  const { comments, loading: commentsLoading } = useRecentComments(5);
  const [selectedImage, setSelectedImage] = useState<PortfolioImage | null>(null);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center hero-pattern pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#E8F5F0] rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-[#1D9E75] rounded-full" />
              <span className="text-xs font-medium text-[#1D9E75]">Based in Ghana · Crafted with passion</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#111827] leading-[1.1] tracking-tight">
              We Create.{' '}
              <span className="text-[#1D9E75]">We Capture.</span>
              <br />
              We Deliver.
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-[#6B7280] leading-relaxed max-w-2xl">
              Premium photography, custom frames, shirt printing & personalized gifts —
              crafted for every occasion.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/order">
                <Button size="lg">
                  Place an Order
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/gallery">
                <Button size="lg" variant="outline">
                  View Our Work
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative accent */}
        <div className="absolute right-0 top-1/4 w-96 h-96 bg-[#1D9E75]/5 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* ── Services ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#F8FAF9]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge variant="category" className="mb-3">What We Do</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#111827]">Our Services</h2>
            <p className="mt-3 text-[#6B7280] max-w-xl mx-auto">
              From capturing your best moments to crafting custom gifts — we've got every occasion covered.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map(({ icon: Icon, title, description, tab }) => (
              <Link
                key={tab}
                to={`/order?tab=${tab}`}
                className="group p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#1D9E75]/40 hover:-translate-y-1 transition-all duration-200"
              >
                <div className="w-12 h-12 bg-[#E8F5F0] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#1D9E75] transition-colors duration-200">
                  <Icon size={22} className="text-[#1D9E75] group-hover:text-white transition-colors duration-200" />
                </div>
                <h3 className="font-semibold text-[#111827] mb-2">{title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{description}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-[#1D9E75] opacity-0 group-hover:opacity-100 transition-opacity">
                  Order Now <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Work ────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <Badge variant="category" className="mb-3">Portfolio</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#111827]">Featured Work</h2>
            </div>
            <Link to="/gallery" className="hidden sm:flex items-center gap-1 text-sm font-medium text-[#1D9E75] hover:text-[#0F6E56] transition-colors">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <ImageCardSkeleton key={i} />)
              : images.length === 0
              ? (
                <div className="col-span-full py-16 text-center">
                  <div className="w-16 h-16 bg-[#E8F5F0] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera size={28} className="text-[#1D9E75]" />
                  </div>
                  <p className="text-[#6B7280]">Portfolio images will appear here once uploaded.</p>
                </div>
              )
              : images.map((img) => (
                <div
                  key={img.id}
                  className="group cursor-pointer rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  onClick={() => setSelectedImage(img)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedImage(img)}
                >
                  <div className="relative overflow-hidden aspect-[4/3] bg-gray-100">
                    <img
                      src={img.imageUrl}
                      alt={img.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-[#111827] truncate">{img.title}</h3>
                    <div className="mt-2">
                      <Badge variant="category">{img.category}</Badge>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link to="/gallery">
              <Button variant="outline" size="lg">
                View Full Gallery <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials / Comments ────────────────────────────────────── */}
      <section className="py-20 bg-[#F8FAF9]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge variant="category" className="mb-3">Testimonials</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#111827]">What People Say</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {commentsLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-6 bg-white rounded-xl border border-gray-100 space-y-3">
                  <div className="skeleton h-4 w-1/3 rounded" />
                  <div className="skeleton h-16 w-full rounded" />
                </div>
              ))
              : comments.length === 0
              ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-[#6B7280]">Customer comments will appear here.</p>
                </div>
              )
              : comments.slice(0, 5).map((c) => (
                <div key={c.id} className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-[#1D9E75] text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-sm text-[#374151] leading-relaxed mb-4">"{c.message}"</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#111827]">{c.name}</span>
                    <span className="text-xs text-[#9CA3AF]">{formatTimestamp(c.createdAt)}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ── CTA Strip ────────────────────────────────────────────────────── */}
      <section className="py-16 bg-[#1D9E75]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Ready to bring your vision to life?
          </h2>
          <p className="text-white/80 mb-8">
            Reach us on WhatsApp for quick enquiries or place an order online.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://wa.me/233553767177" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#1D9E75]">
                <MessageCircle size={18} />
                Chat on WhatsApp
              </Button>
            </a>
            <Link to="/order">
              <Button size="lg" className="bg-white text-[#1D9E75] hover:bg-white/90">
                Place an Order
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
    </>
  );
}
