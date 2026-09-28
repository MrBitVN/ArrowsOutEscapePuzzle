// Unit test suite for Phase 1 collision engine requirements
import {
  linesIntersect,
  segmentDistance,
  checkArrowEscape,
  getArrowTrajectory,
  getArrowSegments,
  getArrowHead,
  CANVAS_SIZE
} from './src/utils/puzzleEngine.js';

console.log('--- TESTING STAGE 1 COLLISION ENGINE ---');

// Test 1: Collinear segments
console.log('\n[Test 1: Collinear segments overlapping]');
const t1_1 = linesIntersect(160, 185, 200, 185, 190, 185, 220, 185);
console.log('Overlapping horizontal segments collinear:', t1_1, '(Expected: true)');
if (!t1_1) console.error('FAIL: Overlapping collinear segments should return true');

const t1_2 = linesIntersect(160, 185, 200, 185, 210, 185, 250, 185);
console.log('Separated collinear horizontal segments:', t1_2, '(Expected: false)');
if (t1_2) console.error('FAIL: Separated collinear segments should return false');

const t1_3 = linesIntersect(185, 100, 185, 150, 185, 140, 185, 200);
console.log('Overlapping vertical segments collinear:', t1_3, '(Expected: true)');
if (!t1_3) console.error('FAIL: Overlapping vertical collinear segments should return true');

// Test 2: Level 2 Collinear Arrow Blocking (a2 behind a1)
console.log('\n[Test 2: Level 2 Collinear Arrow Blocking]');
const lvl2_a1 = { id: 'a1', type: 'straight', startX: 215, startY: 185, endX: 255, endY: 185, dir: 'right' };
const lvl2_a2 = { id: 'a2', type: 'straight', startX: 160, startY: 185, endX: 200, endY: 185, dir: 'right' };
const lvl2_arrows = [lvl2_a1, lvl2_a2];
const lvl2_walls = [
  { x1: 140, y1: 140, x2: 260, y2: 140 },
  { x1: 140, y1: 140, x2: 140, y2: 260 },
  { x1: 140, y1: 260, x2: 260, y2: 260 }
];

const res_a1 = checkArrowEscape(lvl2_a1, lvl2_arrows, lvl2_walls);
console.log('a1 canEscape:', res_a1.canEscape, '(Expected: true)');
const res_a2 = checkArrowEscape(lvl2_a2, lvl2_arrows, lvl2_walls);
console.log('a2 canEscape:', res_a2.canEscape, '(Expected: false, blocked behind a1)');
if (res_a2.canEscape) {
  console.error('FAIL: a2 must be blocked by a1!');
} else {
  console.log('SUCCESS: a2 correctly blocked by', res_a2.blocker, 'distance:', res_a2.distance);
}

// Test 3: Arrowhead Tip & Wings Collision with Wall
console.log('\n[Test 3: Arrowhead tip collision]');
// An arrow ending at y=162 pointing UP into a wall at y=150.
// Shaft ends at y=162. Tip is at y = 162 - 10 = 152. Wall at y=150 has thickness ~2.75px.
// Tip will hit the wall when traveling ~ 0.5px to 2px!
const tipArrow = { id: 'tip_arr', type: 'straight', startX: 200, startY: 200, endX: 200, endY: 162, dir: 'up' };
const wallTop = [{ x1: 150, y1: 150, x2: 250, y2: 150 }];
const resTip = checkArrowEscape(tipArrow, [tipArrow], wallTop);
console.log('tipArrow hitting wall at y=150:', !resTip.canEscape, 'distance:', resTip.distance, '(Expected distance <= 12)');

// Test 4: Trajectory stops at obstacle
console.log('\n[Test 4: getArrowTrajectory exact stopping point]');
const traj = getArrowTrajectory(lvl2_a2, lvl2_arrows, lvl2_walls);
console.log('a2 trajectory:', traj);
console.log('Laser stops at x:', traj.endX, '(a1 starts at x=215, expected near 215)');
if (traj.canEscape || traj.distance > 20) {
  console.error('FAIL: laser trajectory should stop right at a1!');
} else {
  console.log('SUCCESS: laser stops at obstacle distance:', traj.distance);
}

// Test 5: Bent Arrow rigid-body motion
console.log('\n[Test 5: Bent arrow rigid motion]');
const bentArrow = {
  id: 'b1',
  type: 'bent',
  points: [{ x: 160, y: 200 }, { x: 130, y: 200 }, { x: 130, y: 160 }],
  dir: 'up'
};
// Wall directly above the tail at y=140
const wallAboveTail = [{ x1: 150, y1: 140, x2: 180, y2: 140 }];
const resBent = checkArrowEscape(bentArrow, [bentArrow], wallAboveTail);
console.log('Bent arrow with wall above its tail at (160, 200):', !resBent.canEscape, '(Expected: blocked because rigid body moves up)');
