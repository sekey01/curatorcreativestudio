import { useState, useRef, type DragEvent, type ChangeEvent } from 'react';
import { Upload, X, Image } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { uploadPortfolioImage } from '../../lib/storage';
import { addPortfolioImage } from '../../lib/firestore';
import type { PortfolioCategory } from '../../types';

const CATEGORY_OPTIONS: { value: PortfolioCategory; label: PortfolioCategory }[] = [
  { value: 'Photoshoots', label: 'Photoshoots' },
  { value: 'Frames & Prints', label: 'Frames & Prints' },
  { value: 'Shirt Printing', label: 'Shirt Printing' },
  { value: 'Gifts & Merch', label: 'Gifts & Merch' },
];

export function ImageUploader({ onUploaded }: { onUploaded: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '' as PortfolioCategory | '',
  });
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    if (!f.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  function handleFileInput(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  }

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!file) errs.file = 'Please select an image';
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.category) errs.category = 'Please select a category';
    return errs;
  }

  async function handleUpload() {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setUploading(true);
    try {
      const { downloadURL, storagePath } = await uploadPortfolioImage(file!, ({ progress: p }) => {
        setProgress(p);
      });
      await addPortfolioImage({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category as PortfolioCategory,
        imageUrl: downloadURL,
        storagePath,
      });
      toast.success('Image uploaded successfully!');
      setFile(null);
      setPreview(null);
      setProgress(0);
      setForm({ title: '', description: '', category: '' });
      onUploaded();
    } catch {
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-5 p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
      <h3 className="font-semibold text-[#111827]">Upload New Image</h3>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !file && inputRef.current?.click()}
        className={`relative rounded-xl border-2 border-dashed transition-all cursor-pointer ${
          isDragging ? 'border-[#7C3AED] bg-[#F3E8FF]' : 'border-gray-200 hover:border-[#7C3AED] hover:bg-[#F9FAFB]'
        } ${errors.file ? 'border-red-400' : ''}`}
      >
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
        {preview ? (
          <div className="relative">
            <img src={preview} alt="Preview" className="w-full h-56 object-cover rounded-xl" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }}
              className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-lg hover:bg-white shadow-sm transition-colors"
            >
              <X size={16} className="text-gray-600" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-12 px-4">
            <div className="w-12 h-12 bg-[#F3E8FF] rounded-xl flex items-center justify-center">
              <Upload size={22} className="text-[#7C3AED]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-[#111827]">Drag & drop an image</p>
              <p className="text-xs text-[#6B7280] mt-1">or click to browse · PNG, JPG, WEBP</p>
            </div>
          </div>
        )}
      </div>
      {errors.file && <p className="text-xs text-red-500 -mt-3">{errors.file}</p>}

      {uploading && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-[#6B7280]">
            <span>Uploading...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#7C3AED] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Title *"
          placeholder="Image title"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          error={errors.title}
        />
        <Select
          label="Category *"
          options={CATEGORY_OPTIONS}
          placeholder="Select category"
          value={form.category}
          onChange={(e) => set('category', e.target.value)}
          error={errors.category}
        />
      </div>
      <Textarea
        label="Description"
        placeholder="Optional description..."
        value={form.description}
        onChange={(e) => set('description', e.target.value)}
        rows={3}
      />
      <Button onClick={handleUpload} loading={uploading} disabled={!file}>
        <Image size={16} />
        Upload to Gallery
      </Button>
    </div>
  );
}
