// src/hooks/useGridSnap.js
// Snaps a pixel value to the nearest grid cell (default 8px).
// Also provides snapToElements() — snaps to edges of other elements on canvas.

const GRID = 8;
const SNAP_THRESHOLD = 6; // px — how close before snapping to another element

export function useGridSnap(gridSize = GRID) {
  /** Snap a single number to grid */
  const snapVal = (v) => Math.round(v / gridSize) * gridSize;

  /**
   * Snap {x, y} to grid.
   * @param {{ x: number, y: number }} pos
   * @returns {{ x: number, y: number }}
   */
  const snap = ({ x, y }) => ({ x: snapVal(x), y: snapVal(y) });

  /**
   * Snap pos against other elements' edges (guide-lines, Wix-style).
   * Returns adjusted pos + list of guide lines to draw.
   * @param {{ x, y, width, height }} moving
   * @param {Array}  others  — array of {x,y,width,height}
   */
  const snapToElements = (moving, others) => {
    let { x, y } = snap(moving);
    const guides = [];

    for (const el of others) {
      // Left edge
      if (Math.abs(x - el.x) < SNAP_THRESHOLD) { x = el.x; guides.push({ type: "v", at: x }); }
      // Right edge
      if (Math.abs((x + moving.width) - (el.x + el.width)) < SNAP_THRESHOLD) {
        x = el.x + el.width - moving.width;
        guides.push({ type: "v", at: el.x + el.width });
      }
      // Center X
      if (Math.abs((x + moving.width / 2) - (el.x + el.width / 2)) < SNAP_THRESHOLD) {
        x = el.x + el.width / 2 - moving.width / 2;
        guides.push({ type: "v", at: el.x + el.width / 2 });
      }
      // Top edge
      if (Math.abs(y - el.y) < SNAP_THRESHOLD) { y = el.y; guides.push({ type: "h", at: y }); }
      // Bottom edge
      if (Math.abs((y + moving.height) - (el.y + el.height)) < SNAP_THRESHOLD) {
        y = el.y + el.height - moving.height;
        guides.push({ type: "h", at: el.y + el.height });
      }
    }

    return { x, y, guides };
  };

  return { snap, snapToElements, snapVal };
}