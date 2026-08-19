"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { MutableRefObject } from "react";
import GalleryCell from "./GalleryCell";
import { getPhotoDims } from "./photo-dims";
import type { Photo } from "./GalleryCell";

const COL_GAP = 16;

const ROW_GAP = 32;

const MIN_PLATE = 260;

type RowItem = { photo: Photo; index: number; width: number };
type Row = { items: RowItem[]; height: number };

function packRows(photos: Photo[], containerWidth: number, targetHeight: number): Row[] {
  if (containerWidth <= 0) return [];
  const rows: Row[] = [];
  let current: { photo: Photo; index: number; aspect: number }[] = [];
  let aspectSum = 0;

  const maxPerRow = Math.max(1, Math.floor((containerWidth + COL_GAP) / (MIN_PLATE + COL_GAP)));
  const heightFor = (count: number, sum: number) => (containerWidth - (count - 1) * COL_GAP) / sum;

  const flush = (items: typeof current, height: number) => {
    rows.push({
      height,
      items: items.map((c) => ({ photo: c.photo, index: c.index, width: c.aspect * height })),
    });
  };

  photos.forEach((photo, index) => {
    const { w, h } = getPhotoDims(photo.image);
    const aspect = w / h;
    current.push({ photo, index, aspect });
    aspectSum += aspect;
    const height = heightFor(current.length, aspectSum);
    if (height > targetHeight && current.length < maxPerRow) return;
    const dropsLast =
      current.length > 1 &&
      height <= targetHeight &&
      Math.abs(heightFor(current.length - 1, aspectSum - aspect) - targetHeight) <
        Math.abs(height - targetHeight);

    if (dropsLast) {
      const carried = current[current.length - 1]!;
      const kept = current.slice(0, -1);
      flush(kept, heightFor(kept.length, aspectSum - aspect));
      current = [carried];
      aspectSum = carried.aspect;
    } else {
      flush(current, height);
      current = [];
      aspectSum = 0;
    }
  });

  if (current.length) {
    const naturalWidth = aspectSum * targetHeight + (current.length - 1) * COL_GAP;
    flush(
      current,
      naturalWidth < containerWidth * 0.82 ? targetHeight : heightFor(current.length, aspectSum),
    );
  }

  return rows;
}

export default function JustifiedGrid({
  photos,
  onOpen,
  cellRefs,
}: {
  photos: Photo[];
  onOpen: (index: number) => void;
  cellRefs: MutableRefObject<(HTMLButtonElement | null)[]>;
}) {
  const containerRef = useRef<HTMLElement | null>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setWidth(el.getBoundingClientRect().width);

    let frame: number | null = null;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      if (frame !== null) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = null;
        setWidth(entry.contentRect.width);
      });
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  const targetHeight = Math.max(220, Math.min(400, width / 4.2));
  const rows = useMemo(() => packRows(photos, width, targetHeight), [photos, width, targetHeight]);

  return (
    <section
      ref={containerRef}
      className="relative mt-0 overflow-hidden"
      aria-label="Contact sheet"
    >
      <div className="flex flex-col" style={{ gap: ROW_GAP }}>
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex items-start" style={{ gap: COL_GAP }}>
            {row.items.map(({ photo, index, width: itemWidth }) => (
              <GalleryCell
                key={photo.image}
                photo={photo}
                index={index}
                width={itemWidth}
                height={row.height}
                onOpen={() => onOpen(index)}
                cellRef={(el) => {
                  cellRefs.current[index] = el;
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
