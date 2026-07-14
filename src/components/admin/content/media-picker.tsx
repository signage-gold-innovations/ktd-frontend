'use client';

import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { listLandingMedia, type MediaObject } from '@/lib/storage-client';

interface MediaPickerProps {
  /** Called with the public URL of the chosen image */
  onSelect: (url: string) => void;
}

/**
 * "Choose from library" — a slide-over that lists every image already in the
 * landing-media bucket (the same set shown on /admin/media) and returns the
 * public URL of the clicked one. The list is loaded lazily on first open and
 * re-fetched on every open so freshly uploaded images appear.
 */
export function MediaPicker({ onSelect }: MediaPickerProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaObject[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setItems(await listLandingMedia());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load media library.');
    }
  }, []);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    // Re-fetch on every open so freshly uploaded images appear
    if (nextOpen) void load();
  };

  const handlePick = (item: MediaObject) => {
    onSelect(item.publicUrl);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger render={<Button type="button" variant="outline" size="sm" />}>
        Choose from library
      </SheetTrigger>
      <SheetContent side="right" className="data-[side=right]:sm:max-w-lg">
        <SheetHeader className="border-b">
          <SheetTitle>Media library</SheetTitle>
          <SheetDescription>
            Pick an existing image, or upload new ones on the Media page.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="flex flex-col items-start gap-2">
              <p className="text-destructive text-sm">{error}</p>
              <Button type="button" variant="outline" size="sm" onClick={() => void load()}>
                Retry
              </Button>
            </div>
          )}

          {!error && items === null && <p className="text-muted-foreground text-sm">Loading…</p>}

          {!error && items?.length === 0 && (
            <p className="text-muted-foreground text-sm">
              No images yet — upload one from the field next to this button, or on the Media page.
            </p>
          )}

          {!error && items && items.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {items.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handlePick(item)}
                  className="group flex flex-col gap-1 text-left"
                  title={item.name}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.publicUrl}
                    alt={item.name}
                    loading="lazy"
                    className="ring-foreground/10 group-hover:ring-primary aspect-square w-full rounded-md object-cover ring-1 transition group-focus-visible:ring-2"
                  />
                  <span className="text-muted-foreground group-hover:text-foreground truncate text-xs">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
