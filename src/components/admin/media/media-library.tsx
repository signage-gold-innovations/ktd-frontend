'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  deleteLandingMedia,
  listLandingMedia,
  uploadLandingImage,
  type MediaObject,
} from '@/lib/storage-client';

import { MediaItem } from './media-item';

export function MediaLibrary() {
  const [items, setItems] = useState<MediaObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string[]>([]);
  const [deletingPath, setDeletingPath] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    try {
      setListError(null);
      setItems(await listLandingMedia());
    } catch (err) {
      setListError(err instanceof Error ? err.message : 'Failed to load media.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = ''; // allow re-selecting the same file later
    if (files.length === 0) return;

    setActionError(null);
    setUploading(files.map((file) => file.name));

    const results = await Promise.allSettled(
      files.map(async (file) => {
        try {
          await uploadLandingImage(file);
        } finally {
          setUploading((prev) => {
            const next = [...prev];
            next.splice(next.indexOf(file.name), 1);
            return next;
          });
        }
      })
    );

    const failures = results.filter(
      (result): result is PromiseRejectedResult => result.status === 'rejected'
    );
    if (failures.length > 0) {
      const reason = failures[0].reason;
      const message = reason instanceof Error ? reason.message : 'Unknown error';
      setActionError(
        failures.length === 1 ? message : `${failures.length} uploads failed (${message})`
      );
    }

    await refresh();
  }

  async function handleDelete(item: MediaObject) {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;

    setActionError(null);
    setDeletingPath(item.path);
    try {
      await deleteLandingMedia(item.path);
      setItems((prev) => prev.filter((existing) => existing.path !== item.path));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Delete failed.');
    } finally {
      setDeletingPath(null);
    }
  }

  const isUploading = uploading.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Media Library</CardTitle>
        <CardDescription>
          {loading
            ? 'Loading media...'
            : `${items.length} ${items.length === 1 ? 'image' : 'images'} in landing-media`}
        </CardDescription>
        <CardAction>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFilesSelected}
          />
          <Button
            size="sm"
            disabled={isUploading || Boolean(listError)}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? `Uploading ${uploading.length}...` : 'Upload images'}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {actionError && (
          <div className="bg-destructive/10 text-destructive rounded-lg px-3 py-2 text-sm">
            {actionError}
          </div>
        )}

        {listError ? (
          <div className="flex flex-col items-start gap-3">
            <div className="bg-destructive/10 text-destructive w-full rounded-lg px-3 py-2 text-sm">
              {listError} — if the bucket does not exist yet, run migrations first.
            </div>
            <Button size="sm" variant="outline" onClick={() => void refresh()}>
              Retry
            </Button>
          </div>
        ) : loading ? (
          <p className="text-muted-foreground text-sm">Loading media...</p>
        ) : items.length === 0 && !isUploading ? (
          <p className="text-muted-foreground text-sm">No media yet — upload your first image.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {uploading.map((name, index) => (
              <div
                key={`${name}-${index}`}
                className="flex animate-pulse flex-col gap-2 rounded-xl border p-2"
              >
                <div className="bg-muted aspect-square w-full rounded-lg" />
                <div className="flex flex-col px-1">
                  <p className="truncate text-sm font-medium" title={name}>
                    {name}
                  </p>
                  <p className="text-muted-foreground text-xs">Uploading...</p>
                </div>
              </div>
            ))}
            {items.map((item) => (
              <MediaItem
                key={item.path}
                item={item}
                deleting={deletingPath === item.path}
                onDelete={() => void handleDelete(item)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
