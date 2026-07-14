'use client';

import { useId, useState } from 'react';

import { MediaPicker } from '@/components/admin/content/media-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { uploadLandingImage } from '@/lib/storage-client';

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
}

/**
 * Image picker: preview of the current image, a file input that uploads to
 * the landing-media bucket, a "choose from library" picker for existing
 * bucket images, and a plain URL input as an alternative.
 */
export function ImageField({ label, value, onChange }: ImageFieldProps) {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const url = await uploadLandingImage(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={inputId}>{label}</Label>
      <div className="flex items-start gap-3">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt={label}
            className="ring-foreground/10 h-16 w-24 shrink-0 rounded-md object-cover ring-1"
          />
        ) : (
          <div className="bg-muted text-muted-foreground flex h-16 w-24 shrink-0 items-center justify-center rounded-md text-xs">
            No image
          </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-center gap-2">
            <Input
              id={inputId}
              type="file"
              accept="image/*"
              onChange={handleFile}
              disabled={uploading}
            />
            <MediaPicker onSelect={onChange} />
          </div>
          <Input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="…or paste an image URL / /assets path"
            disabled={uploading}
          />
        </div>
      </div>
      {uploading && <p className="text-muted-foreground text-xs">Uploading…</p>}
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
}
