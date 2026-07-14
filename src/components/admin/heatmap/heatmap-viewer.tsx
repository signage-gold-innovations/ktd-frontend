'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { HeatmapPoint } from '@/services/heatmap';

interface HeatmapViewerProps {
  points: HeatmapPoint[];
  /** Iframe render width for the selected device bucket */
  width: number;
  /** Label for the data type being shown */
  label?: string;
}

const POINT_RADIUS = 26;
const FALLBACK_HEIGHT = 900;

/** 256-entry blue→cyan→lime→yellow→red palette, indexed by heat intensity */
function buildPalette(): Uint8ClampedArray {
  const canvas = globalThis.document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 1;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createLinearGradient(0, 0, 256, 0);
  gradient.addColorStop(0.0, 'rgb(0, 84, 255)');
  gradient.addColorStop(0.35, 'rgb(0, 210, 255)');
  gradient.addColorStop(0.6, 'rgb(90, 220, 80)');
  gradient.addColorStop(0.8, 'rgb(255, 220, 0)');
  gradient.addColorStop(1.0, 'rgb(255, 40, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 1);
  return ctx.getImageData(0, 0, 256, 1).data;
}

/**
 * simpleheat-style density rendering: stamp each point as a soft radial
 * gradient into the alpha channel, then recolor every pixel through the
 * palette using its accumulated alpha as intensity.
 */
function drawHeatmap(
  canvas: HTMLCanvasElement,
  points: HeatmapPoint[],
  width: number,
  height: number
) {
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, width, height);
  for (const point of points) {
    const px = point.x * width;
    const py = point.y * height;
    const gradient = ctx.createRadialGradient(px, py, 0, px, py, POINT_RADIUS);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.22)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(px - POINT_RADIUS, py - POINT_RADIUS, POINT_RADIUS * 2, POINT_RADIUS * 2);
  }

  const palette = buildPalette();
  const image = ctx.getImageData(0, 0, width, height);
  const data = image.data;
  for (let i = 0; i < data.length; i += 4) {
    const intensity = data[i + 3];
    if (intensity === 0) continue;
    const offset = intensity * 4;
    data[i] = palette[offset];
    data[i + 1] = palette[offset + 1];
    data[i + 2] = palette[offset + 2];
    data[i + 3] = Math.min(200, 60 + intensity);
  }
  ctx.putImageData(image, 0, 0);
}

/**
 * Renders the live landing page in a full-height iframe (interaction
 * disabled) with the click/movement density heatmap painted on a canvas
 * overlay. The iframe is same-origin, so the document height is read
 * directly; tracking inside the preview is suppressed (track() ignores
 * iframes).
 */
export function HeatmapViewer({ points, width, label }: HeatmapViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [docHeight, setDocHeight] = useState(0);

  const measure = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    const height = doc?.documentElement?.scrollHeight ?? 0;
    if (height > 0) setDocHeight(height);
  }, []);

  // Re-measure shortly after load — images/fonts can change the page height
  const handleLoad = useCallback(() => {
    measure();
    const timer = globalThis.setTimeout(measure, 1200);
    return () => globalThis.clearTimeout(timer);
  }, [measure]);

  useEffect(() => {
    if (!docHeight || !canvasRef.current) return;
    drawHeatmap(canvasRef.current, points, width, docHeight);
  }, [points, width, docHeight]);

  const height = docHeight || FALLBACK_HEIGHT;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{label}</p>
      )}
      <div className="border-border max-h-[75vh] overflow-auto rounded-lg border bg-black/5">
        <div className="relative mx-auto" style={{ width, height }}>
          <iframe
            ref={iframeRef}
            src="/"
            title="Landing page preview"
            onLoad={handleLoad}
            className="pointer-events-none block border-0"
            style={{ width, height }}
            scrolling="no"
            aria-hidden
          />
          <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" aria-hidden />
        </div>
      </div>
    </div>
  );
}
