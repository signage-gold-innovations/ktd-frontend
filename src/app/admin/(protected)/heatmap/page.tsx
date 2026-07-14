import Link from 'next/link';
import {
  DEVICE_PREVIEW_WIDTHS,
  getClickHeatmap,
  getMovementHeatmap,
  HEATMAP_DEVICES,
  type HeatmapDevice,
} from '@/services/heatmap';

import { HeatmapViewer } from '@/components/admin/heatmap/heatmap-viewer';
import { AdminPageHeader } from '@/components/admin/page-header';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { cn } from '@/lib/utils';

const DEVICE_LABELS: Record<HeatmapDevice, string> = {
  desktop: 'Desktop',
  tablet: 'Tablet',
  mobile: 'Mobile',
};

type HeatmapType = 'clicks' | 'movement';

function isHeatmapDevice(value: string | undefined): value is HeatmapDevice {
  return (HEATMAP_DEVICES as readonly string[]).includes(value ?? '');
}

function isHeatmapType(value: string | undefined): value is HeatmapType {
  return value === 'clicks' || value === 'movement';
}

export default async function AdminHeatmapPage({
  searchParams,
}: {
  searchParams: Promise<{ device?: string; type?: string }>;
}) {
  const { device: deviceParam, type: typeParam } = await searchParams;
  const device = isHeatmapDevice(deviceParam) ? deviceParam : 'desktop';
  const heatmapType: HeatmapType = isHeatmapType(typeParam) ? typeParam : 'clicks';

  const [clickData, moveData] = await Promise.all([
    getClickHeatmap(device),
    getMovementHeatmap(device),
  ]);

  const data = heatmapType === 'clicks' ? clickData : moveData;

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Heatmap"
        description="Visualize where visitors click and move their mouse on the landing page."
      />

      {data === null ? (
        <Card>
          <CardHeader>
            <CardTitle>Heatmap is not set up yet</CardTitle>
            <CardDescription>
              The coordinates could not be read. Apply migrations/005_click_heatmap.sql and
              migrations/007_mouse_tracking.sql to your Supabase project, then reload this page.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <>
          {/* Heatmap type tabs */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex gap-2" role="tablist" aria-label="Heatmap type">
                {(['clicks', 'movement'] as const).map((type) => (
                  <Link
                    key={type}
                    href={`/admin/heatmap?type=${type}&device=${device}`}
                    role="tab"
                    aria-selected={type === heatmapType}
                    className={cn(
                      'rounded-md border px-3 py-1.5 text-sm font-medium transition',
                      type === heatmapType
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {type === 'clicks' ? '🖱️ Clicks' : '👆 Movement'}
                  </Link>
                ))}
              </div>

              <div className="flex gap-2" role="tablist" aria-label="Device">
                {HEATMAP_DEVICES.map((candidate) => (
                  <Link
                    key={candidate}
                    href={`/admin/heatmap?type=${heatmapType}&device=${candidate}`}
                    role="tab"
                    aria-selected={candidate === device}
                    className={cn(
                      'rounded-md border px-3 py-1.5 text-sm font-medium transition',
                      candidate === device
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {DEVICE_LABELS[candidate]}
                  </Link>
                ))}
              </div>
            </div>

            <p className="text-muted-foreground text-sm">
              {data.points.length.toLocaleString()}{' '}
              {heatmapType === 'clicks' ? 'clicks' : 'mouse movements'} on{' '}
              {DEVICE_LABELS[device].toLowerCase()} in the last {data.rangeDays} days
              {data.truncated && ' (showing the most recent 20,000)'}
            </p>
          </div>

          {data.points.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  No {heatmapType === 'clicks' ? 'clicks' : 'movements'} recorded yet
                </CardTitle>
                <CardDescription>
                  Once visitors {heatmapType === 'clicks' ? 'click' : 'move their mouse'} on the
                  landing page from a {DEVICE_LABELS[device].toLowerCase()} device, the heatmap
                  appears here.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : null}

          <HeatmapViewer points={data.points} width={DEVICE_PREVIEW_WIDTHS[device]} />
        </>
      )}
    </div>
  );
}
