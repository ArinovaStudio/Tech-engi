"use client";

import { useEffect, useState, type CSSProperties } from "react";

type Tile = {
  bg: string;
  color: string;
  x: string;
  y: string;
  hidden: boolean;
};

type GridConfig = { cols: number; rows: number };

// Colour stops by distance from the bottom centre (0 = right there, 1 = far away).
// Blue only near the bottom centre, then purple, a wide orange stretch, yellow at the far sides/top.
const STOPS: { at: number; rgb: number[] }[] = [
  { at: 0.0, rgb: [110, 168, 255] }, // blue
  { at: 0.22, rgb: [185, 140, 246] }, // purple
  { at: 0.5, rgb: [240, 135, 85] }, // orange
  { at: 1.0, rgb: [250, 195, 70] }, // yellow
];

// Grid size per screen width. Fewer, larger tiles on small screens.
const TIERS: { minWidth: number; cfg: GridConfig }[] = [
  { minWidth: 1024, cfg: { cols: 14, rows: 6 } },
  { minWidth: 700, cfg: { cols: 10, rows: 5 } },
  { minWidth: 480, cfg: { cols: 8, rows: 5 } },
  { minWidth: 0, cfg: { cols: 6, rows: 4 } },
];

// Boxes per SIDE in each row, listed top to bottom (a row has twice this many boxes).
// Keep each list as long as `rows`, and end it at half the columns so the bottom row is full.
// A size that is not listed here falls back to the formula in buildGrid.
const SIDE_BY_ROW: Record<string, number[]> = {
  "14x6": [2, 3, 4, 5, 6, 7], // 4, 6, 8, 10, 12, 14 boxes in total
  "10x5": [1, 2, 3, 4, 5],
  "8x5": [1, 2, 2, 3, 4],
  "6x4": [1, 2, 2, 3],
};

function configForWidth(w: number): GridConfig {
  return (TIERS.find((t) => w >= t.minWidth) ?? TIERS[TIERS.length - 1]).cfg;
}

function hash(a: number, b: number) {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

// t is 0..1; walks through the stops and blends between the two around it
function colorAt(t: number): number[] {
  let i = 0;
  while (i < STOPS.length - 2 && t > STOPS[i + 1].at) i++;
  const a = STOPS[i];
  const b = STOPS[i + 1];
  const f = Math.min(1, Math.max(0, (t - a.at) / (b.at - a.at)));
  return a.rgb.map((v, j) => Math.round(v + (b.rgb[j] - v) * f));
}

// Valley shape: every row is lit from both outer edges inwards. The top row has a short
// run on each side with a gap in the middle, each row below gets wider, and the bottom
// row is full. Left and right are always equal.
function buildGrid({ cols, rows }: GridConfig): Tile[] {
  const tiles: Tile[] = [];
  const half = Math.ceil(cols / 2); // tiles per side in the bottom row
  const top = Math.max(1, Math.round(half * 0.4)); // fallback: tiles per side in the top row
  const mid = (cols - 1) / 2;

  for (let r = 0; r < rows; r++) {
    // Your list wins; otherwise grow evenly from `top` to `half`
    const side =
      SIDE_BY_ROW[`${cols}x${rows}`]?.[r] ??
      Math.round(top + ((half - top) * r) / Math.max(1, rows - 1));
    const depth = rows > 1 ? r / (rows - 1) : 1; // 0 at top, 1 at bottom

    for (let c = 0; c < cols; c++) {
      const hidden = !(c < side || c >= cols - side);

      // Distance from the bottom centre: dx sideways (0..1), dy upwards (0..1).
      // Every tile gets its own value, so the colour fades box by box.
      const dx = mid === 0 ? 0 : Math.abs(c - mid) / mid;
      const dy = 1 - depth;
      const t = Math.min(1, Math.hypot(dx, dy * 0.9) / 1.2);
      const k = colorAt(t);

      let alpha = 0;
      if (!hidden) {
        // same fade as the original version
        alpha = (0.12 + 0.75 * Math.pow(depth, 1.2)) * (0.55 + 0.45 * hash(c, r));
      }

      tiles.push({
        bg: `rgba(${k.join(",")},${alpha.toFixed(2)})`,
        color: k.join(", "), // comma-separated so rgba(var(--tile-color), a) is valid
        x: `${20 + hash(c, r + 9) * 50}%`,
        y: `${15 + hash(r, c + 5) * 60}%`,
        hidden,
      });
    }
  }
  return tiles;
}

export default function HeroTiles() {
  const [grid, setGrid] = useState<(GridConfig & { tiles: Tile[] }) | null>(null);

  useEffect(() => {
    let current = "";

    const compute = () => {
      const cfg = configForWidth(window.innerWidth);
      const key = `${cfg.cols}x${cfg.rows}`;
      if (key === current) return; // only rebuild when the breakpoint changes
      current = key;
      setGrid({ ...cfg, tiles: buildGrid(cfg) });
    };

    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  if (!grid) return <div id="hero-tiles" aria-hidden="true" />;

  return (
    <div
      id="hero-tiles"
      aria-hidden="true"
      style={{ gridTemplateColumns: `repeat(${grid.cols}, 1fr)` }}
    >
      {grid.tiles.map((t, idx) => (
        <i
          key={idx}
          style={
            {
              visibility: t.hidden ? "hidden" : "visible",
              backgroundColor: t.bg,
              "--tile-color": t.color,
              "--x": t.x,
              "--y": t.y,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}