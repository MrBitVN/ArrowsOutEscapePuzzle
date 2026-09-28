import React, { useEffect, useRef } from 'react';
import { BackIcon } from './Icons';
import { TRANSLATIONS } from '../utils/i18n';
import { sound } from '../utils/sound';

export default function MapScreen({
  currentLang,
  maxUnlockedLevel = 1,
  onSelectLevel,
  onBack
}) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const currentActiveLevel = maxUnlockedLevel;
  const activeNodeRef = useRef(null);

  // Auto-scroll so current active level is nicely centered on screen
  useEffect(() => {
    if (activeNodeRef.current) {
      setTimeout(() => {
        activeNodeRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 150);
    }
  }, [currentActiveLevel]);

  // Generate 100 level positions along a serpentine path
  const totalLevels = 100;
  const levelNodes = [];

  for (let i = 1; i <= totalLevels; i++) {
    // Generate organic undulating x coordinates between 25% and 75%
    // Screenshot 3 has: Level 1 at ~65%, Level 2 at ~75%, Level 3 at ~60%, Level 4 at ~60%, Level 5 at ~45%
    const wave = Math.sin(i * 0.9) * 22 + Math.cos(i * 0.4) * 8;
    const xPercent = Math.min(80, Math.max(20, 50 + wave));
    levelNodes.push({
      level: i,
      x: xPercent
    });
  }

  // Reverse so Level 1 is at bottom, climbing up to Level 100 at top
  const reversedNodes = [...levelNodes].reverse();

  const handleNodeClick = (level) => {
    if (level <= maxUnlockedLevel) {
      sound.playTap();
      onSelectLevel(level);
    } else {
      sound.playArrowBlocked();
    }
  };

  const handlePlayActive = () => {
    sound.playTap();
    onSelectLevel(currentActiveLevel);
  };

  return (
    <div className="screen-container map-screen">
      {/* Floating Header with Back Button */}
      <header className="map-floating-header">
        <button
          className="round-top-btn back-btn"
          onClick={() => { sound.playTap(); onBack(); }}
          aria-label="Back to Menu"
          id="map-back-btn"
        >
          <BackIcon />
        </button>
      </header>

      {/* Scrollable Stone Path Area matching Screenshot 3 */}
      <div className="map-scroll-viewport">
        <div className="map-canvas-track">
          {/* Tile texture background */}
          <div className="stone-tile-grid"></div>

          {/* Organic grass tufts */}
          <div className="grass-clump grass-1" style={{ top: '92%', left: '8%' }}></div>
          <div className="grass-clump grass-2" style={{ top: '85%', right: '10%' }}></div>
          <div className="grass-clump grass-3" style={{ top: '75%', left: '12%' }}></div>
          <div className="grass-clump grass-4" style={{ top: '65%', right: '14%' }}></div>
          <div className="grass-clump grass-5" style={{ top: '50%', left: '9%' }}></div>
          <div className="grass-clump grass-6" style={{ top: '35%', right: '11%' }}></div>
          <div className="grass-clump grass-7" style={{ top: '20%', left: '10%' }}></div>
          <div className="grass-clump grass-8" style={{ top: '5%', right: '12%' }}></div>

          {/* Level Nodes */}
          {reversedNodes.map((node) => {
            const isCompleted = node.level < maxUnlockedLevel;
            const isCurrent = node.level === maxUnlockedLevel;
            const isLocked = node.level > maxUnlockedLevel;

            let bubbleClass = 'node-bubble';
            if (isCompleted) bubbleClass += ' completed';
            else if (isCurrent) bubbleClass += ' current';
            else bubbleClass += ' locked';

            return (
              <div
                key={node.level}
                ref={isCurrent ? activeNodeRef : null}
                className="map-node-row"
              >
                <button
                  className={bubbleClass}
                  style={{ left: `${node.x}%` }}
                  onClick={() => handleNodeClick(node.level)}
                  disabled={isLocked}
                  aria-label={`Level ${node.level}`}
                  id={`map-node-${node.level}`}
                >
                  <span className="node-number">{node.level}</span>

                  {/* Beach ball decoration on completed levels (as seen on Level 1 in Screenshot 3) */}
                  {isCompleted && (
                    <div className="node-beachball-badge">
                      <div className="ball-stripe stripe-1"></div>
                      <div className="ball-stripe stripe-2"></div>
                    </div>
                  )}

                  {/* Pulse ring on current active level */}
                  {isCurrent && <div className="node-active-ring"></div>}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Floating Play Button matching Screenshot 3 */}
      <footer className="map-bottom-footer">
        <button
          className="map-play-cta-btn"
          onClick={handlePlayActive}
          id="btn-play-current-level"
        >
          <span className="cta-play-text">{t.play}</span>
          <span className="cta-level-sub">({t.level} {currentActiveLevel})</span>
        </button>
      </footer>
    </div>
  );
}
