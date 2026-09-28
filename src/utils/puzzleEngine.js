// Arrow Escape Puzzle Physics, Collision Detection and Solver Engine

// Coordinate system: Normalized 400x400 canvas (centered around 200, 200)
export const CANVAS_SIZE = 400;

export const DIRECTIONS = {
  up: { dx: 0, dy: -1, angle: -90 },
  down: { dx: 0, dy: 1, angle: 90 },
  left: { dx: -1, dy: 0, angle: 180 },
  right: { dx: 1, dy: 0, angle: 0 }
};

// Visual stroke dimensions (matching GameScreen.jsx rendering)
// Wall stroke: 5.5px (radius 2.75px), Arrow shaft stroke: 3.5px (radius 1.75px)
export const WALL_COLLISION_RADIUS = 3.2;   // effective contact radius with walls
export const ARROW_COLLISION_RADIUS = 2.8;  // effective contact radius between arrows

/**
 * Check if two 2D line segments (p1-p2 and p3-p4) intersect.
 * Handles standard non-parallel intersection AND collinear overlapping segments.
 */
export function linesIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
  const d1x = x2 - x1;
  const d1y = y2 - y1;
  const d2x = x4 - x3;
  const d2y = y4 - y3;

  const denom = d2y * d1x - d2x * d1y;

  if (Math.abs(denom) > 1e-6) {
    const ua = (d2x * (y1 - y3) - d2y * (x1 - x3)) / denom;
    const ub = (d1x * (y1 - y3) - d1y * (x1 - x3)) / denom;
    return ua >= -1e-6 && ua <= 1 + 1e-6 && ub >= -1e-6 && ub <= 1 + 1e-6;
  }

  // Parallel lines (denom close to 0): Check if collinear
  const cross = (x3 - x1) * d1y - (y3 - y1) * d1x;
  const lenSq1 = d1x * d1x + d1y * d1y;
  // If normalized cross product distance is small, they lie on the same line
  if (lenSq1 > 1e-8 && (cross * cross) / lenSq1 > 1e-4) {
    return false; // Parallel but separated
  }

  // Collinear: Check 1D interval projection overlap
  if (Math.abs(d1x) >= Math.abs(d1y)) {
    const min1 = Math.min(x1, x2);
    const max1 = Math.max(x1, x2);
    const min2 = Math.min(x3, x4);
    const max2 = Math.max(x3, x4);
    return Math.max(min1, min2) <= Math.min(max1, max2) + 1e-4;
  } else {
    const min1 = Math.min(y1, y2);
    const max1 = Math.max(y1, y2);
    const min2 = Math.min(y3, y4);
    const max2 = Math.max(y3, y4);
    return Math.max(min1, min2) <= Math.min(max1, max2) + 1e-4;
  }
}

/**
 * Squared distance from point (px, py) to line segment (x1, y1)-(x2, y2).
 */
export function pointToSegmentDistanceSq(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq < 1e-8) {
    const ex = px - x1;
    const ey = py - y1;
    return ex * ex + ey * ey;
  }
  let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const projX = x1 + t * dx;
  const projY = y1 + t * dy;
  const diffX = px - projX;
  const diffY = py - projY;
  return diffX * diffX + diffY * diffY;
}

/**
 * Shortest Euclidean distance between two line segments (p1-p2 and p3-p4).
 */
export function segmentDistance(x1, y1, x2, y2, x3, y3, x4, y4) {
  if (linesIntersect(x1, y1, x2, y2, x3, y3, x4, y4)) {
    return 0;
  }
  const d1 = pointToSegmentDistanceSq(x1, y1, x3, y3, x4, y4);
  const d2 = pointToSegmentDistanceSq(x2, y2, x3, y3, x4, y4);
  const d3 = pointToSegmentDistanceSq(x3, y3, x1, y1, x2, y2);
  const d4 = pointToSegmentDistanceSq(x4, y4, x1, y1, x2, y2);
  return Math.sqrt(Math.min(d1, d2, d3, d4));
}

/**
 * Get arrowhead base point and heading direction.
 */
export function getArrowHead(arrow) {
  if (arrow.type === 'bent' && arrow.points && arrow.points.length >= 2) {
    const last = arrow.points[arrow.points.length - 1];
    return { x: last.x, y: last.y, dir: arrow.dir };
  }
  return { x: arrow.endX, y: arrow.endY, dir: arrow.dir };
}

/**
 * Get exact arrowhead geometry matching GameScreen.jsx rendering:
 * Tip extends 10px in arrow.dir, wings extend 6px laterally.
 */
export function getArrowHeadTriangle(arrow) {
  const head = getArrowHead(arrow);
  const headX = head.x;
  const headY = head.y;
  const dir = head.dir;
  const headSize = 10;

  let tip, wing1, wing2;
  if (dir === 'up') {
    tip = { x: headX, y: headY - headSize };
    wing1 = { x: headX - 6, y: headY + 2 };
    wing2 = { x: headX + 6, y: headY + 2 };
  } else if (dir === 'down') {
    tip = { x: headX, y: headY + headSize };
    wing1 = { x: headX - 6, y: headY - 2 };
    wing2 = { x: headX + 6, y: headY - 2 };
  } else if (dir === 'left') {
    tip = { x: headX - headSize, y: headY };
    wing1 = { x: headX + 2, y: headY - 6 };
    wing2 = { x: headX + 2, y: headY + 6 };
  } else {
    // right
    tip = { x: headX + headSize, y: headY };
    wing1 = { x: headX - 2, y: headY - 6 };
    wing2 = { x: headX - 2, y: headY + 6 };
  }
  return { tip, wing1, wing2, base: { x: headX, y: headY } };
}

/**
 * Get all line segments that make up an arrow.
 * If includeHead=true (default), includes the arrowhead triangle segments as well.
 */
export function getArrowSegments(arrow, includeHead = true) {
  const segs = [];

  // 1. Shaft segments
  if (arrow.type === 'bent' && arrow.points && arrow.points.length >= 2) {
    for (let i = 0; i < arrow.points.length - 1; i++) {
      segs.push({
        x1: arrow.points[i].x,
        y1: arrow.points[i].y,
        x2: arrow.points[i + 1].x,
        y2: arrow.points[i + 1].y
      });
    }
  } else {
    segs.push({
      x1: arrow.startX,
      y1: arrow.startY,
      x2: arrow.endX,
      y2: arrow.endY
    });
  }

  // 2. Arrowhead triangle edges
  if (includeHead) {
    const { tip, wing1, wing2, base } = getArrowHeadTriangle(arrow);
    segs.push({ x1: base.x, y1: base.y, x2: tip.x, y2: tip.y });
    segs.push({ x1: wing1.x, y1: wing1.y, x2: tip.x, y2: tip.y });
    segs.push({ x1: wing2.x, y1: wing2.y, x2: tip.x, y2: tip.y });
    segs.push({ x1: wing1.x, y1: wing1.y, x2: wing2.x, y2: wing2.y });
  }

  return segs;
}

/**
 * Get all significant vertices of an arrow (shaft points + arrowhead points).
 */
export function getArrowPoints(arrow) {
  const pts = [];
  if (arrow.type === 'bent' && arrow.points) {
    pts.push(...arrow.points);
  } else {
    pts.push({ x: arrow.startX, y: arrow.startY });
    pts.push({ x: arrow.endX, y: arrow.endY });
  }
  const { tip, wing1, wing2 } = getArrowHeadTriangle(arrow);
  pts.push(tip, wing1, wing2);
  return pts;
}

/**
 * Check collision between two segment sets at a specific translation offset (shiftX, shiftY).
 */
function testCollisionAtOffset(arrowSegs, obstacles, shiftX, shiftY, threshold) {
  for (const seg of arrowSegs) {
    const ax1 = seg.x1 + shiftX;
    const ay1 = seg.y1 + shiftY;
    const ax2 = seg.x2 + shiftX;
    const ay2 = seg.y2 + shiftY;

    for (const obs of obstacles) {
      const dist = segmentDistance(ax1, ay1, ax2, ay2, obs.x1, obs.y1, obs.x2, obs.y2);
      if (dist <= threshold) {
        return { hit: true, obstacle: obs };
      }
    }
  }
  return { hit: false };
}

/**
 * BENT ARROWS: Modeled as rigid-body translation in the arrowhead direction (arrow.dir).
 * This exactly matches the CSS SVG `translate(dx, dy)` animation in GameScreen.jsx.
 *
 * Check if an arrow can escape without colliding with walls or other arrows.
 * Uses continuous sweep with sub-step refinement to prevent tunneling and return exact hit distance.
 */
export function checkArrowEscape(arrow, otherArrows, walls) {
  const head = getArrowHead(arrow);
  const dirVec = DIRECTIONS[head.dir];
  if (!dirVec) return { canEscape: true, distance: 300 };

  const arrowSegs = getArrowSegments(arrow, true);
  const arrowPoints = getArrowPoints(arrow);

  // Pre-extract wall segments
  const wallSegs = [];
  for (const w of walls) {
    wallSegs.push({ x1: w.x1, y1: w.y1, x2: w.x2, y2: w.y2, wallRef: w });
  }

  // Pre-extract other arrow segments
  const otherArrowSegsList = [];
  for (const other of otherArrows) {
    if (other.id === arrow.id) continue;
    const oSegs = getArrowSegments(other, true);
    for (const os of oSegs) {
      otherArrowSegsList.push({ ...os, arrowRef: other });
    }
  }

  // Sweep parameters: stepSize=2px guarantees no tunneling because
  // collision radii (3.2px and 2.8px) exceed stepSize, ensuring continuous coverage.
  const stepSize = 2;
  const maxDistance = 600;
  const maxSteps = Math.ceil(maxDistance / stepSize);

  // Initial rest check (dist = 0)
  const restWall = testCollisionAtOffset(arrowSegs, wallSegs, 0, 0, WALL_COLLISION_RADIUS);
  if (restWall.hit) {
    return {
      canEscape: false,
      distance: 0,
      hitPoint: { x: head.x, y: head.y },
      blocker: 'wall',
      blockerObj: restWall.obstacle.wallRef
    };
  }

  const restArrow = testCollisionAtOffset(arrowSegs, otherArrowSegsList, 0, 0, ARROW_COLLISION_RADIUS);
  if (restArrow.hit) {
    return {
      canEscape: false,
      distance: 0,
      hitPoint: { x: head.x, y: head.y },
      blocker: 'arrow',
      blockerObj: restArrow.obstacle.arrowRef
    };
  }

  for (let s = 1; s <= maxSteps; s++) {
    const dist = s * stepSize;
    const shiftX = dirVec.dx * dist;
    const shiftY = dirVec.dy * dist;

    // 1. Check wall collision
    const wallHit = testCollisionAtOffset(arrowSegs, wallSegs, shiftX, shiftY, WALL_COLLISION_RADIUS);
    if (wallHit.hit) {
      // Sub-step binary refinement for exact contact distance
      let low = dist - stepSize;
      let high = dist;
      for (let b = 0; b < 4; b++) {
        const mid = (low + high) / 2;
        const midHit = testCollisionAtOffset(arrowSegs, wallSegs, dirVec.dx * mid, dirVec.dy * mid, WALL_COLLISION_RADIUS);
        if (midHit.hit) {
          high = mid;
        } else {
          low = mid;
        }
      }
      const finalDist = Math.max(0, high);
      return {
        canEscape: false,
        distance: finalDist,
        hitPoint: { x: head.x + dirVec.dx * finalDist, y: head.y + dirVec.dy * finalDist },
        blocker: 'wall',
        blockerObj: wallHit.obstacle.wallRef
      };
    }

    // 2. Check other arrow collision
    const arrowHit = testCollisionAtOffset(arrowSegs, otherArrowSegsList, shiftX, shiftY, ARROW_COLLISION_RADIUS);
    if (arrowHit.hit) {
      let low = dist - stepSize;
      let high = dist;
      for (let b = 0; b < 4; b++) {
        const mid = (low + high) / 2;
        const midHit = testCollisionAtOffset(arrowSegs, otherArrowSegsList, dirVec.dx * mid, dirVec.dy * mid, ARROW_COLLISION_RADIUS);
        if (midHit.hit) {
          high = mid;
        } else {
          low = mid;
        }
      }
      const finalDist = Math.max(0, high);
      return {
        canEscape: false,
        distance: finalDist,
        hitPoint: { x: head.x + dirVec.dx * finalDist, y: head.y + dirVec.dy * finalDist },
        blocker: 'arrow',
        blockerObj: arrowHit.obstacle.arrowRef
      };
    }

    // 3. Clear boundary check: all arrow vertices must be completely past the board boundary
    const margin = 6;
    let hasCleared = false;
    if (head.dir === 'right') {
      let minX = Infinity;
      for (const p of arrowPoints) {
        const px = p.x + shiftX;
        if (px < minX) minX = px;
      }
      hasCleared = minX > CANVAS_SIZE + margin;
    } else if (head.dir === 'left') {
      let maxX = -Infinity;
      for (const p of arrowPoints) {
        const px = p.x + shiftX;
        if (px > maxX) maxX = px;
      }
      hasCleared = maxX < -margin;
    } else if (head.dir === 'down') {
      let minY = Infinity;
      for (const p of arrowPoints) {
        const py = p.y + shiftY;
        if (py < minY) minY = py;
      }
      hasCleared = minY > CANVAS_SIZE + margin;
    } else if (head.dir === 'up') {
      let maxY = -Infinity;
      for (const p of arrowPoints) {
        const py = p.y + shiftY;
        if (py > maxY) maxY = py;
      }
      hasCleared = maxY < -margin;
    }

    if (hasCleared) {
      return {
        canEscape: true,
        distance: dist,
        exitDistance: dist
      };
    }
  }

  // Reached max distance without clearing or colliding
  return {
    canEscape: false,
    distance: maxDistance,
    hitPoint: { x: head.x + dirVec.dx * maxDistance, y: head.y + dirVec.dy * maxDistance },
    blocker: 'boundary'
  };
}

/**
 * Find a valid next move (used for the 💡 Hint power-up and auto solver).
 */
export function findHint(arrows, walls) {
  for (const arrow of arrows) {
    const res = checkArrowEscape(arrow, arrows, walls);
    if (res.canEscape) {
      return arrow;
    }
  }
  return null;
}

/**
 * Laser trajectory preview: compute laser beam line stopping exactly at the obstacle
 * or continuing to the edge of the board if clear.
 */
export function getArrowTrajectory(arrow, otherArrows, walls) {
  const head = getArrowHead(arrow);
  const dirVec = DIRECTIONS[head.dir];
  if (!dirVec) return null;

  const escapeRes = checkArrowEscape(arrow, otherArrows, walls);
  const distance = escapeRes.distance;

  return {
    startX: head.x,
    startY: head.y,
    endX: head.x + dirVec.dx * distance,
    endY: head.y + dirVec.dy * distance,
    canEscape: escapeRes.canEscape,
    distance: distance,
    hitPoint: escapeRes.hitPoint,
    blocker: escapeRes.blocker,
    blockerObj: escapeRes.blockerObj
  };
}
