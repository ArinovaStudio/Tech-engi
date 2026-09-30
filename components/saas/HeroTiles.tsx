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

const STOPS = [
  [110, 168, 255],
  [185, 140, 246],
  [233, 139, 100],
  [295, 180, 0],
];

// Grid size per screen width. Fewer, larger tiles on small screens.
const TIERS: { minWidth: number; cfg: GridConfig }[] = [
  { minWidth: 1024, cfg: { cols: 14, rows: 6 } },
  { minWidth: 700, cfg: { cols: 10, rows: 5 } },
  { minWidth: 480, cfg: { cols: 8, rows: 5 } },
  { minWidth: 0, cfg: { cols: 6, rows: 4 } },
];

function configForWidth(w: number): GridConfig {
  return (TIERS.find((t) => w >= t.minWidth) ?? TIERS[TIERS.length - 1]).cfg;
}

function hash(a: number, b: number) {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

// x is 0..1 across the grid; interpolates through all four color stops
function colorAt(x: number) {
  const p = x * (STOPS.length - 1);
  const i = Math.min(STOPS.length - 2, Math.floor(p));
  const f = p - i;
  return STOPS[i].map((v, j) => Math.round(v + (STOPS[i + 1][j] - v) * f));
}

// Row 0 is the TOP row. The number of lit tiles grows from ~43% of the
// columns at the top to all columns at the second-to-last row, for any
// grid size. (For 14 cols x 6 rows this gives 6, 8, 10, 12, 14, 14,
// the same as the original.)
function visibleCountForRow(r: number, cols: number, rows: number): number {
  const start = Math.round(cols * 0.43);
  const span = Math.max(1, rows - 2);
  return Math.min(cols, Math.round(start + ((cols - start) * r) / span));
}

function buildGrid({ cols, rows }: GridConfig): Tile[] {
  const tiles: Tile[] = [];
  for (let r = 0; r < rows; r++) {
    const count = visibleCountForRow(r, cols, rows);
    const cutoff = cols - count; // columns before this index are hidden

    for (let c = 0; c < cols; c++) {
      const k = colorAt(c / (cols - 1));
      const hidden = c < cutoff;

      let alpha = 0;
      if (!hidden) {
        const depth = rows > 1 ? r / (rows - 1) : 1; // 0 at top, 1 at bottom
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