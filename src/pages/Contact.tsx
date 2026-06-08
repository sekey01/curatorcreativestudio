import { MessageCircle, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export function Contact() {
  return (
    <div className="pt-24 pb-20">
      {/* Hero */}
      <section className="bg-[#F8FAF9] py-16 mb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <Badge variant="category" className="mb-3">Contact</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#111827]">Get in Touch</h1>
          <p className="mt-3 text-[#6B7280] max-w-xl mx-auto">
            Have a question or want to place an order? Reach us instantly on WhatsApp or send
            us a message.
          </p>
          <div className="mt-8">
            <a href="https://wa.me/233553767177" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="text-base px-8 py-4">
                <MessageCircle size={22} />
                Chat on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-[#111827]">Contact Information</h2>
            <div className="space-y-5">
              <ContactItem
                icon={Phone}
                label="Phone"
                value="+233 55 376 7177"
                href="tel:+233553767177"
              />
              <ContactItem
                icon={MessageCircle}
                label="WhatsApp"
                value="+233 55 376 7177"
                href="https://wa.me/233553767177"
                external
              />
              <ContactItem
                icon={Mail}
                label="Email"
                value="hello@curatorcreativestudio.com"
                href="mailto:hello@curatorcreativestudio.com"
              />
              <ContactItem
                icon={MapPin}
                label="Location"
                value="[Location coming soon]"
              />
            </div>

            <div className="p-5 bg-[#E8F5F0] rounded-xl border border-[#1D9E75]/20">
              <p className="text-sm font-medium text-[#0F6E56] mb-1">Business Hours</p>
              <p className="text-sm text-[#374151]">Monday – Saturday: 8:00 AM – 7:00 PM</p>
              <p className="text-sm text-[#374151]">Sunday: 10:00 AM – 4:00 PM</p>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#111827]">Find Us</h2>
            <div className="w-full h-72 lg:h-96 bg-[#F8FAF9] rounded-xl border border-gray-200 flex flex-col items-center justify-center gap-3 text-[#9CA3AF]">
              <MapPin size={32} />
              <p className="text-sm font-medium">Map coming soon</p>
              <p className="text-xs">Location will be added shortly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ContactItemProps {
  icon: typeof Phone;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}

function ContactItem({ icon: Icon, label, value, href, external }: ContactItemProps) {
  const content = (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#1D9E75]/40 hover:shadow-sm transition-all duration-200 group">
      <div className="w-10 h-10 bg-[#E8F5F0] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#1D9E75] transition-colors duration-200">
        <Icon size={18} className="text-[#1D9E75] group-hover:text-white transition-colors duration-200" />
      </div>
      <div>
        <p className="text-xs text-[#9CA3AF] uppercase tracking-wide font-medium">{label}</p>
        <p className="text-sm font-semibold text-[#111827] mt-0.5">{value}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>
        {content}
      </a>
    );
  }
  return content;
}
