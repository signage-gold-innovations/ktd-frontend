'use client';

import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';

import type { MediaObject } from '@/lib/storage-client';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaItem({
  item,
  deleting,
  onDelete,
}: {
  item: MediaObject;
  deleting: boolean;
  onDelete: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (copyTimeoutRef.current !== null) window.clearTimeout(copyTimeoutRef.current);
    },
    []
  );

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(item.publicUrl);
      setCopied(true);
      if (copyTimeoutRef.current !== null) window.clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — nothing useful to do
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border p-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.publicUrl}
        alt={item.name}
        loading="lazy"
        className="aspect-square w-full rounded-lg border object-cover"
      />
      <div className="flex flex-col px-1">
        <p className="truncate text-sm font-medium" title={item.name}>
          {item.name}
        </p>
        <p className="text-muted-foreground text-xs">
          {item.size != null ? formatBytes(item.size) : ' '}
        </p>
      </div>
      <div className="flex gap-1.5">
        <Button size="xs" variant="outline" className="flex-1" onClick={handleCopy}>
          {copied ? 'Copied' : 'Copy URL'}
        </Button>
        <Button size="xs" variant="destructive" disabled={deleting} onClick={onDelete}>
          {deleting ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </div>
  );
}
