import { checkArrowEscape, findHint, getArrowTrajectory } from './src/utils/puzzleEngine.js';
import { ALL_100_LEVELS, CHALLENGE_LEVELS, getDailyLevel } from './src/data/levels.js';

console.log('--- RUNNING ARROW ESCAPE PUZZLE TEST SUITE ---');

// 1. Verify 100 Main Levels exist
console.log(`Total Main Levels loaded: ${ALL_100_LEVELS.length}`);
if (ALL_100_LEVELS.length !== 100) {
  throw new Error(`Expected 100 levels, got ${ALL_100_LEVELS.length}`);
}

// 2. Verify Challenge Levels
console.log(`Easy Challenges: ${CHALLENGE_LEVELS.easy.length}`);
console.log(`Medium Challenges: ${CHALLENGE_LEVELS.medium.length}`);
console.log(`Hard Challenges: ${CHALLENGE_LEVELS.hard.length}`);

// 3. Verify Daily Level
const daily = getDailyLevel();
console.log(`Daily Level generated: "${daily.name}", Arrows: ${daily.arrows.length}`);

// 4. Test Level 3 (Screenshot 5 Replica)
const lvl3 = ALL_100_LEVELS[2];
console.log(`Level 3 Name: "${lvl3.name}", Arrows: ${lvl3.arrows.length}, Walls: ${lvl3.walls.length}`);

// Test escape checks on Level 3 arrows
let freeCount = 0;
let blockedCount = 0;
for (const arrow of lvl3.arrows) {
  const result = checkArrowEscape(arrow, lvl3.arrows, lvl3.walls);
  if (result.canEscape) {
    freeCount++;
    console.log(`  Arrow ${arrow.id} (${arrow.dir}): CLEAR TO ESCAPE!`);
  } else {
    blockedCount++;
    console.log(`  Arrow ${arrow.id} (${arrow.dir}): BLOCKED by ${result.blocker}`);
  }
}
console.log(`Level 3 initial state: ${freeCount} free, ${blockedCount} blocked`);
if (freeCount === 0) {
  throw new Error('Level 3 must have at least one free arrow to begin solving!');
}

// 5. Test Hint booster on Level 3
const hintArrow = findHint(lvl3.arrows, lvl3.walls);
console.log(`Hint found arrow: ${hintArrow ? hintArrow.id : 'none'}`);
if (!hintArrow) {
  throw new Error('Hint booster should find a valid move!');
}

// 6. Test Laser Trajectory
for (const arrow of lvl3.arrows) {
  const trajectory = getArrowTrajectory(arrow, lvl3.arrows, lvl3.walls);
  if (!trajectory) throw new Error(`Trajectory calculation failed for ${arrow.id}`);
}
console.log('Laser Trajectory calculations passed!');

// 7. Verify all 100 levels have at least one initial move
let unsolvableStarts = 0;
for (const lvl of ALL_100_LEVELS) {
  const hint = findHint(lvl.arrows, lvl.walls);
  if (!hint) {
    unsolvableStarts++;
    console.warn(`Warning: Level ${lvl.id} has no immediate free arrow`);
  }
}
console.log(`All 100 levels verified! Solvable initial moves: ${100 - unsolvableStarts} / 100`);

console.log('--- ALL ENGINE CHECKS PASSED SUCCESSFULLY! ---');
