import { useState, type FormEvent } from 'react';
import { toast } from 'react-hot-toast';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { addOrder } from '../../lib/firestore';

const OCCASION_OPTIONS = [
  { value: 'Birthday', label: 'Birthday' },
  { value: 'Wedding', label: 'Wedding' },
  { value: 'Party', label: 'Party' },
  { value: 'Funeral', label: 'Funeral' },
  { value: 'Ceremony', label: 'Ceremony' },
  { value: 'Other', label: 'Other' },
];

interface PhotoshootFormProps {
  onSuccess: () => void;
}

export function PhotoshootForm({ onSuccess }: PhotoshootFormProps) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: '',
    phone: '',
    occasionType: '',
    eventDate: '',
    eventLocation: '',
    additionalNotes: '',
  });

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    if (!form.occasionType) errs.occasionType = 'Please select an occasion type';
    if (!form.eventDate) errs.eventDate = 'Event date is required';
    if (!form.eventLocation.trim()) errs.eventLocation = 'Location is required';
    return errs;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await addOrder({ ...form, orderType: 'photoshoot' } as Parameters<typeof addOrder>[0]);
      onSuccess();
    } catch {
      toast.error('Failed to submit order. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Name *"
          placeholder="Your full name"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          error={errors.name}
        />
        <Input
          label="Phone Number *"
          type="tel"
          placeholder="+233 XX XXX XXXX"
          value={form.phone}
          onChange={(e) => set('phone', e.target.value)}
          error={errors.phone}
        />
      </div>
      <Select
        label="Occasion Type *"
        options={OCCASION_OPTIONS}
        placeholder="Select occasion"
        value={form.occasionType}
        onChange={(e) => set('occasionType', e.target.value)}
        error={errors.occasionType}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Event Date *"
          type="date"
          value={form.eventDate}
          onChange={(e) => set('eventDate', e.target.value)}
          error={errors.eventDate}
        />
        <Input
          label="Event Location / Venue *"
          placeholder="Location or venue name"
          value={form.eventLocation}
          onChange={(e) => set('eventLocation', e.target.value)}
          error={errors.eventLocation}
        />
      </div>
      <Textarea
        label="Additional Notes"
        placeholder="Any special requirements or instructions..."
        value={form.additionalNotes}
        onChange={(e) => set('additionalNotes', e.target.value)}
      />
      <Button type="submit" loading={loading} size="lg" className="w-full sm:w-auto">
        Submit Booking Request
      </Button>
    </form>
  );
}
