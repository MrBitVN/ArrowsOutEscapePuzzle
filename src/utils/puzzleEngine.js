// Arrow Escape Puzzle Physics, Collision Detection and Solver Engine

// Coordinate system: Normalized 400x400 canvas (centered around 200, 200)
export const CANVAS_SIZE = 400;

export const DIRECTIONS = {
  up: { dx: 0, dy: -1, angle: -90 },
  down: { dx: 0, dy: 1, angle: 90 },
  left: { dx: -1, dy: 0, angle: 180 },
  right: { dx: 1, dy: 0, angle: 0 }
};

// Check if two line segments (p1-p2 and p3-p4) intersect
export function linesIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
  const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  if (Math.abs(denom) < 0.0001) return false; // Parallel

  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;

  return ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1;
}

// Get all line segments that make up an arrow
export function getArrowSegments(arrow) {
  if (arrow.type === 'bent' && arrow.points && arrow.points.length >= 2) {
    const segs = [];
    for (let i = 0; i < arrow.points.length - 1; i++) {
      segs.push({
        x1: arrow.points[i].x,
        y1: arrow.points[i].y,
        x2: arrow.points[i + 1].x,
        y2: arrow.points[i + 1].y
      });
    }
    return segs;
  }
  // Straight arrow
  return [{
    x1: arrow.startX,
    y1: arrow.startY,
    x2: arrow.endX,
    y2: arrow.endY
  }];
}

// Get the arrowhead position and direction
export function getArrowHead(arrow) {
  if (arrow.type === 'bent' && arrow.points && arrow.points.length >= 2) {
    const last = arrow.points[arrow.points.length - 1];
    return { x: last.x, y: last.y, dir: arrow.dir };
  }
  return { x: arrow.endX, y: arrow.endY, dir: arrow.dir };
}

// Check if an arrow can escape without colliding with walls or other arrows
export function checkArrowEscape(arrow, otherArrows, walls) {
  const head = getArrowHead(arrow);
  const dirVec = DIRECTIONS[head.dir];
  if (!dirVec) return { canEscape: true };

  // In Arrow Escape, the arrow moves along head.dir.
  // We project each segment of the arrow in the direction of movement.
  const arrowSegs = getArrowSegments(arrow);

  // Cast ray from each vertex and check path clearance up to board boundary (500px)
  const maxDistance = 600;
  const stepSize = 4;
  const steps = Math.ceil(maxDistance / stepSize);

  // For high performance and smooth precision, check bounding sweep of each arrow segment
  for (let s = 1; s <= steps; s++) {
    const dist = s * stepSize;
    const shiftX = dirVec.dx * dist;
    const shiftY = dirVec.dy * dist;

    // Check collision of shifted arrow segments against walls
    for (const seg of arrowSegs) {
      const movedX1 = seg.x1 + shiftX;
      const movedY1 = seg.y1 + shiftY;
      const movedX2 = seg.x2 + shiftX;
      const movedY2 = seg.y2 + shiftY;

      // Check walls
      for (const wall of walls) {
        if (linesIntersect(movedX1, movedY1, movedX2, movedY2, wall.x1, wall.y1, wall.x2, wall.y2)) {
          return { canEscape: false, blocker: 'wall', wall };
        }
      }

      // Check other arrows
      for (const other of otherArrows) {
        if (other.id === arrow.id) continue;
        const otherSegs = getArrowSegments(other);
        for (const oSeg of otherSegs) {
          if (linesIntersect(movedX1, movedY1, movedX2, movedY2, oSeg.x1, oSeg.y1, oSeg.x2, oSeg.y2)) {
            return { canEscape: false, blocker: 'arrow', otherArrow: other };
          }
        }
      }
    }

    // Check if the entire shifted arrow has cleared the board bounding box (-50 to 450)
    let allPointsOut = true;
    for (const seg of arrowSegs) {
      const px1 = seg.x1 + shiftX;
      const py1 = seg.y1 + shiftY;
      const px2 = seg.x2 + shiftX;
      const py2 = seg.y2 + shiftY;
      if (px1 >= 0 && px1 <= CANVAS_SIZE && py1 >= 0 && py1 <= CANVAS_SIZE) {
        allPointsOut = false;
        break;
      }
      if (px2 >= 0 && px2 <= CANVAS_SIZE && py2 >= 0 && py2 <= CANVAS_SIZE) {
        allPointsOut = false;
        break;
      }
    }

    if (allPointsOut) {
      // It has escaped past the board with no collisions!
      return { canEscape: true };
    }
  }

  return { canEscape: true };
}

// Find a valid next move (used for the 💡 Hint power-up and auto solver)
export function findHint(arrows, walls) {
  for (const arrow of arrows) {
    const res = checkArrowEscape(arrow, arrows, walls);
    if (res.canEscape) {
      return arrow;
    }
  }
  return null;
}

// Laser trajectory preview: compute trajectory line for an arrow until it hits or escapes
export function getArrowTrajectory(arrow, otherArrows, walls) {
  const head = getArrowHead(arrow);
  const dirVec = DIRECTIONS[head.dir];
  if (!dirVec) return null;

  const escapeRes = checkArrowEscape(arrow, otherArrows, walls);
  const distance = escapeRes.canEscape ? 300 : 35; // short red line if blocked, long line if clear

  return {
    startX: head.x,
    startY: head.y,
    endX: head.x + dirVec.dx * distance,
    endY: head.y + dirVec.dy * distance,
    canEscape: escapeRes.canEscape
  };
}
