import { MessageCircle, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export function Contact() {
  return (
    <div className="pt-24 pb-20" style={{ background: 'var(--bg-base)' }}>

      {/* Hero */}
      <section className="section-dark py-16 mb-16 relative overflow-hidden"
        style={{ borderBottom: '1px solid var(--border-section)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, var(--accent-subtle) 0%, transparent 60%)' }}/>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <Badge variant="category" className="mb-4">Contact</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--text-1)' }}>Get in Touch</h1>
          <p className="mt-3 max-w-xl mx-auto" style={{ color: 'var(--text-3)' }}>
            Have a question or want to place an order? Reach us instantly on WhatsApp or send
            us a message.
          </p>
          <div className="mt-8">
            <a href="https://wa.me/233553767177" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="text-base px-8 py-4">
                <MessageCircle size={22}/>
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
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-1)' }}>Contact Information</h2>
            <div className="space-y-4">
              <ContactItem icon={Phone}         label="Phone"    value="+233 55 376 7177"                  href="tel:+233553767177"/>
              <ContactItem icon={MessageCircle} label="WhatsApp" value="+233 55 376 7177"                  href="https://wa.me/233553767177" external/>
              <ContactItem icon={Mail}          label="Email"    value="hello@curatorcreativestudio.com"   href="mailto:hello@curatorcreativestudio.com"/>
              <ContactItem icon={MapPin}        label="Location" value="[Location coming soon]"/>
            </div>

            <div className="p-5 rounded-xl" style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
            }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: 'var(--text-2)' }}>Business Hours</p>
              <p className="text-sm" style={{ color: 'var(--text-3)' }}>Monday – Saturday: 8:00 AM – 7:00 PM</p>
              <p className="text-sm" style={{ color: 'var(--text-3)' }}>Sunday: 10:00 AM – 4:00 PM</p>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-1)' }}>Find Us</h2>
            <div className="w-full h-72 lg:h-96 rounded-xl flex flex-col items-center justify-center gap-3"
              style={{
                background: 'var(--bg-section)',
                border: '1px solid var(--border)',
              }}>
              <MapPin size={32} style={{ color: 'var(--text-4)' }}/>
              <p className="text-sm font-medium" style={{ color: 'var(--text-3)' }}>Map coming soon</p>
              <p className="text-xs" style={{ color: 'var(--text-4)' }}>Location will be added shortly</p>
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
    <div className="flex items-center gap-4 p-4 card-futuristic rounded-xl group cursor-pointer">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0
        transition-all duration-200"
        style={{ background: 'var(--accent-subtle)', border: '1px solid var(--border)' }}>
        <Icon size={18} style={{ color: 'var(--text-1)' }}/>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.15em] font-medium"
          style={{ color: 'var(--text-4)', fontSize: '10px' }}>{label}</p>
        <p className="text-sm font-semibold mt-0.5" style={{ color: 'var(--text-1)' }}>{value}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}>
        {content}
      </a>
    );
  }
  return content;
}
