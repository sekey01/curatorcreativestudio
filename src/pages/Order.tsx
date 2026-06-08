import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Camera, Frame, Shirt, Gift, CheckCircle, MessageCircle } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { PhotoshootForm } from '../components/order/PhotoshootForm';
import { FrameForm } from '../components/order/FrameForm';
import { ShirtForm } from '../components/order/ShirtForm';
import { GiftForm } from '../components/order/GiftForm';

type TabId = 'photoshoot' | 'frame' | 'shirt' | 'gift';

const TABS: { id: TabId; label: string; icon: typeof Camera }[] = [
  { id: 'photoshoot', label: 'Photoshoot Booking', icon: Camera },
  { id: 'frame', label: 'Frame / Print Order', icon: Frame },
  { id: 'shirt', label: 'Shirt Printing', icon: Shirt },
  { id: 'gift', label: 'Gifts & Merch', icon: Gift },
];

export function Order() {
  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as TabId) ?? 'photoshoot';
  const [activeTab, setActiveTab] = useState<TabId>(
    TABS.some((t) => t.id === initialTab) ? initialTab : 'photoshoot',
  );
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const tab = searchParams.get('tab') as TabId;
    if (tab && TABS.some((t) => t.id === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  function handleSuccess() {
    setSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (success) {
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center">
        <div className="max-w-lg mx-auto px-4 sm:px-6 text-center">
          <div className="w-20 h-20 bg-[#E8F5F0] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-[#1D9E75]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-3">Order Submitted!</h1>
          <p className="text-[#6B7280] leading-relaxed mb-8">
            Thank you! We've received your order and will get back to you shortly. You can
            follow up with us directly on WhatsApp for faster communication.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://wa.me/233553767177" target="_blank" rel="noopener noreferrer">
              <Button size="lg">
                <MessageCircle size={18} />
                Follow Up on WhatsApp
              </Button>
            </a>
            <Button
              variant="outline"
              size="lg"
              onClick={() => { setSuccess(false); setActiveTab('photoshoot'); }}
            >
              Place Another Order
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <Badge variant="category" className="mb-3">Order</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#111827]">Place an Order</h1>
          <p className="mt-3 text-[#6B7280]">
            Select a service and fill in your details. We'll be in touch within 24 hours.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 p-1.5 bg-[#F8FAF9] rounded-xl border border-gray-100">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 flex-1 min-w-[120px] px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeTab === id
                  ? 'bg-white text-[#1D9E75] shadow-sm border border-gray-100'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              <Icon size={15} />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-[#111827] mb-6">
            {TABS.find((t) => t.id === activeTab)?.label}
          </h2>
          {activeTab === 'photoshoot' && <PhotoshootForm onSuccess={handleSuccess} />}
          {activeTab === 'frame' && <FrameForm onSuccess={handleSuccess} />}
          {activeTab === 'shirt' && <ShirtForm onSuccess={handleSuccess} />}
          {activeTab === 'gift' && <GiftForm onSuccess={handleSuccess} />}
        </div>
      </div>
    </div>
  );
}
