import { checkArrowEscape, findHint, linesIntersect, getArrowSegments } from './src/utils/puzzleEngine.js';
import { HANDCRAFTED_LEVELS, ALL_100_LEVELS } from './src/data/levels.js';

console.log('Testing Handcrafted Levels 1 to 10 step-by-step:');

for (const lvl of HANDCRAFTED_LEVELS) {
  let remaining = [...lvl.arrows];
  const solutionOrder = [];

  // Check initial intersections at rest
  for (let i = 0; i < remaining.length; i++) {
    for (let j = i + 1; j < remaining.length; j++) {
      const segs1 = getArrowSegments(remaining[i]);
      const segs2 = getArrowSegments(remaining[j]);
      for (const s1 of segs1) {
        for (const s2 of segs2) {
          if (linesIntersect(s1.x1, s1.y1, s1.x2, s1.y2, s2.x1, s2.y1, s2.x2, s2.y2)) {
            console.warn(`  [INTERSECT AT REST] Level ${lvl.id}: ${remaining[i].id} and ${remaining[j].id} overlap!`);
          }
        }
      }
    }
  }

  // Attempt to solve greedily
  let stuck = false;
  while (remaining.length > 0) {
    const hint = findHint(remaining, lvl.walls);
    if (!hint) {
      stuck = true;
      break;
    }
    solutionOrder.push(hint.id);
    remaining = remaining.filter(a => a.id !== hint.id);
  }

  if (stuck) {
    console.error(`❌ Level ${lvl.id} ("${lvl.name}") is STUCK with ${remaining.length} arrows remaining!`);
  } else {
    console.log(`✅ Level ${lvl.id} ("${lvl.name}") solved! Order: ${solutionOrder.join(' -> ')}`);
  }
}
