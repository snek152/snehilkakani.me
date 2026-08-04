"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { MutableRefObject } from "react";
import GalleryCell from "./GalleryCell";
import { getPhotoDims } from "./photo-dims";
import type { Photo } from "./GalleryCell";

/** Horizontal gutter between frames inside a row. Wide enough that two
 * adjacent photographs read as two plates rather than one panorama. */
const COL_GAP = 16;

/** Vertical gutter between rows. Deliberately much larger than `COL_GAP`:
 * each row now ends in a caption, and the caption has to sit far closer
 * to its own photograph than to the row below it, or the binding between
 * the two is ambiguous. */
const ROW_GAP = 44;

/** Roughly the narrowest a plate can get before its caption stops being
 * readable copy and becomes a column of ellipses. It doesn't force a
 * width — a portrait beside a landscape will always be narrower — it
 * caps how many frames a row may hold at a given container width, which
 * is what keeps a phone from packing two slivers side by side. */
const MIN_PLATE = 260;

type RowItem = { photo: Photo; index: number; width: number };
type Row = { items: RowItem[]; height: number };

/**
 * Classic justified-gallery row packing: walk the photo list in order,
 * accumulating aspect ratios into the current row, and close the row at
 * whichever count lands nearest `targetHeight` — or at `maxPerRow`,
 * whichever comes first. Consumes the array strictly in order, so DOM
 * order === array order === reading order — which is what makes
 * arrow-key navigation in the lightbox move to the frame beside the one
 * the reader is looking at, instead of wherever CSS columns happened to
 * place it.
 */
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
    if (height > targetHeight && current.length < maxPerRow) return; // row still has room

    // The row is full. If it filled by reaching the target, adding this
    // last frame may have overshot so far that the row reads as a
    // cramped strip — on a phone, packing a second landscape frame
    // halves the height — so keep whichever count lands closer to the
    // target. A row closed by `maxPerRow` alone is already above target;
    // dropping a frame there would only push it further away.
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
    // Trailing partial row: only stretch it to fill the width if it's
    // already close to full at the target height. A lone last photo
    // blown up to fill the whole row would read as an error, not intent.
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // Measure synchronously before observing. A ResizeObserver only
    // guarantees a callback when it has an observation to report, and
    // the shell can mount this route inside a transition layer that is
    // already at its final size — in which case the first callback
    // never arrives, `width` stays 0, and the grid packs zero rows into
    // a container that is plainly 1292px wide. Seeding here means the
    // first paint already has a real width; the observer then only has
    // to handle actual resizes.
    setWidth(el.getBoundingClientRect().width);

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Row height adapts to the available width instead of a fixed
  // breakpoint list. The floor is what keeps a phone from stacking two
  // letterbox slivers per row; the ceiling stops a wide desktop from
  // turning three photographs into three billboards.
  const targetHeight = Math.max(220, Math.min(400, width / 4.2));
  const rows = useMemo(() => packRows(photos, width, targetHeight), [photos, width, targetHeight]);

  return (
    <div ref={containerRef} className="flex flex-col" style={{ gap: ROW_GAP }}>
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
  );
}
