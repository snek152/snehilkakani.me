"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { MutableRefObject } from "react";
import GalleryCell from "./GalleryCell";
import { getPhotoDims } from "./photo-dims";
import type { Photo } from "./GalleryCell";

/** Gutter between frames, both axes — the same 8px (`gap-2`) token used
 * elsewhere on the site, not an arbitrary value picked to look fine in
 * isolation. */
const GAP = 8;

type RowItem = { photo: Photo; index: number; width: number };
type Row = { items: RowItem[]; height: number };

/**
 * Classic justified-gallery row packing: walk the photo list in order,
 * accumulating aspect ratios into the current row until the row would
 * reach `targetHeight` at the container's width, then scale that row so
 * it fills the width exactly. Consumes the array strictly in order, so
 * DOM order === array order === reading order — which is what makes
 * arrow-key navigation in the lightbox move to the frame beside the one
 * the reader is looking at, instead of wherever CSS columns happened to
 * place it.
 */
function packRows(photos: Photo[], containerWidth: number, targetHeight: number): Row[] {
  if (containerWidth <= 0) return [];
  const rows: Row[] = [];
  let current: { photo: Photo; index: number; aspect: number }[] = [];
  let aspectSum = 0;

  const flush = (height: number) => {
    rows.push({
      height,
      items: current.map((c) => ({ photo: c.photo, index: c.index, width: c.aspect * height })),
    });
    current = [];
    aspectSum = 0;
  };

  photos.forEach((photo, index) => {
    const { w, h } = getPhotoDims(photo.image);
    const aspect = w / h;
    current.push({ photo, index, aspect });
    aspectSum += aspect;
    const widthAtTarget = aspectSum * targetHeight + (current.length - 1) * GAP;
    if (widthAtTarget >= containerWidth) {
      flush((containerWidth - (current.length - 1) * GAP) / aspectSum);
    }
  });

  if (current.length) {
    // Trailing partial row: only stretch it to fill the width if it's
    // already close to full at the target height. A lone last photo
    // blown up to fill the whole row would read as an error, not intent.
    const naturalWidth = aspectSum * targetHeight + (current.length - 1) * GAP;
    flush(naturalWidth < containerWidth * 0.82 ? targetHeight : (containerWidth - (current.length - 1) * GAP) / aspectSum);
  }

  return rows;
}

export default function JustifiedGrid({
  photos,
  onOpen,
  onExifChange,
  cellRefs,
}: {
  photos: Photo[];
  onOpen: (index: number) => void;
  onExifChange: (index: number | null) => void;
  cellRefs: MutableRefObject<(HTMLButtonElement | null)[]>;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Row height adapts to the available width instead of a fixed
  // breakpoint list, clamped so a narrow phone doesn't get a single
  // giant frame per row and a wide desktop doesn't get a wall of tiny ones.
  const targetHeight = Math.max(140, Math.min(300, width / 5.5));
  const rows = useMemo(() => packRows(photos, width, targetHeight), [photos, width, targetHeight]);

  return (
    <div ref={containerRef} className="flex flex-col" style={{ gap: GAP }}>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex" style={{ gap: GAP, height: row.height }}>
          {row.items.map(({ photo, index, width: itemWidth }) => (
            <GalleryCell
              key={photo.image}
              photo={photo}
              index={index}
              total={photos.length}
              width={itemWidth}
              height={row.height}
              onOpen={() => onOpen(index)}
              onExifChange={onExifChange}
              cellRef={(el) => {
                cellRefs.current[index] = el;
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
