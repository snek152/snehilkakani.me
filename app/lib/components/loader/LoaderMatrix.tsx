"use client";

import { LOADER_MARKS } from "./OrbitStage";

const PATTERN = [
  [0, 1],
  [3, 2],
];

export default function LoaderMatrix() {
  return (
    <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-8">
      {PATTERN.map((row, rowIndex) =>
        row.map((markIndex, colIndex) => {
          const { Icon } = LOADER_MARKS[markIndex];
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              data-material
              className="glass-tile flex items-center justify-center text-fg"
            >
              <Icon size={30} strokeWidth={1.65} aria-hidden="true" />
            </div>
          );
        }),
      )}
      <span
        className="absolute left-1/2 top-1/2 block rotate-45 bg-accent"
        style={{ width: 10, height: 10, translate: "-50% -50%" }}
      />
    </div>
  );
}
