import React, { useState, useEffect, useRef } from 'react';
import { BackIcon, GearIcon, HeartIcon, LightbulbIcon, EraserIcon, MagicWandIcon, RulerIcon } from './Icons';
import { TRANSLATIONS } from '../utils/i18n';
import { sound } from '../utils/sound';
import { checkArrowEscape, findHint, getArrowTrajectory, CANVAS_SIZE } from '../utils/puzzleEngine';
import confetti from 'canvas-confetti';

export default function GameScreen({
  currentLang,
  levelData,
  onBack,
  onLevelComplete,
  onOpenSettings
}) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  // Game state
  const [arrows, setArrows] = useState([]);
  const [walls, setWalls] = useState([]);
  const [lives, setLives] = useState(3);
  const [isWon, setIsWon] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  // Active power-up tools state
  const [hintsLeft, setHintsLeft] = useState(3);
  const [erasersLeft, setErasersLeft] = useState(3);
  const [wandsLeft, setWandsLeft] = useState(3);
  const [rulersLeft, setRulersLeft] = useState(3);

  const [activeHintArrowId, setActiveHintArrowId] = useState(null);
  const [isEraserMode, setIsEraserMode] = useState(false);
  const [showLaserGuides, setShowLaserGuides] = useState(false);

  // Transient animation states
  const [escapingArrowId, setEscapingArrowId] = useState(null);
  const [bumpingArrowId, setBumpingArrowId] = useState(null);
  const [animatingEscapeDir, setAnimatingEscapeDir] = useState(null);

  // Load level data
  useEffect(() => {
    if (levelData) {
      // Deep clone arrows and walls
      setArrows(JSON.parse(JSON.stringify(levelData.arrows || [])));
      setWalls(JSON.parse(JSON.stringify(levelData.walls || [])));
      setLives(3);
      setIsWon(false);
      setIsGameOver(false);
      setActiveHintArrowId(null);
      setIsEraserMode(false);
      setShowLaserGuides(false);
      setEscapingArrowId(null);
      setBumpingArrowId(null);
    }
  }, [levelData]);

  // Handle arrow click
  const handleArrowClick = (arrow) => {
    if (isWon || isGameOver || escapingArrowId) return;

    // 1. If in Eraser Mode, erase this arrow!
    if (isEraserMode) {
      sound.playPowerUp();
      setArrows((prev) => prev.filter((a) => a.id !== arrow.id));
      setIsEraserMode(false);
      checkWinCondition(arrows.filter((a) => a.id !== arrow.id));
      return;
    }

    // 2. Normal move: check collision
    const escapeResult = checkArrowEscape(arrow, arrows, walls);

    if (escapeResult.canEscape) {
      // Escape Success!
      sound.playArrowEscape();
      setEscapingArrowId(arrow.id);
      setAnimatingEscapeDir(arrow.dir);
      setActiveHintArrowId(null);

      // Animate slide-out and remove
      setTimeout(() => {
        setArrows((prev) => {
          const next = prev.filter((a) => a.id !== arrow.id);
          checkWinCondition(next);
          return next;
        });
        setEscapingArrowId(null);
        setAnimatingEscapeDir(null);
      }, 350);
    } else {
      // Arrow is blocked! Bump, vibrate, lose 1 heart
      sound.playArrowBlocked();
      setBumpingArrowId(arrow.id);

      setTimeout(() => {
        setBumpingArrowId(null);
      }, 300);

      const nextLives = lives - 1;
      setLives(nextLives);

      if (nextLives <= 0) {
        setTimeout(() => {
          sound.playGameOver();
          setIsGameOver(true);
        }, 350);
      }
    }
  };

  const checkWinCondition = (remainingArrows) => {
    if (remainingArrows.length === 0) {
      setIsWon(true);
      sound.playWin();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
      setTimeout(() => {
        onLevelComplete(levelData.id, lives);
      }, 1000);
    }
  };

  // Booster 1: Hint (Lightbulb)
  const handleUseHint = () => {
    if (hintsLeft <= 0 || arrows.length === 0) return;
    sound.playPowerUp();
    setHintsLeft((prev) => prev - 1);

    const safeArrow = findHint(arrows, walls);
    if (safeArrow) {
      setActiveHintArrowId(safeArrow.id);
    }
  };

  // Booster 2: Eraser
  const handleUseEraser = () => {
    if (erasersLeft <= 0) return;
    sound.playPowerUp();
    setIsEraserMode(!isEraserMode);
    if (!isEraserMode) {
      setErasersLeft((prev) => prev - 1);
    }
  };

  // Booster 3: Magic Wand (Auto-escape 1 arrow magically)
  const handleUseWand = () => {
    if (wandsLeft <= 0 || arrows.length === 0 || escapingArrowId) return;
    sound.playPowerUp();
    setWandsLeft((prev) => prev - 1);

    const target = arrows[0];
    setEscapingArrowId(target.id);
    setAnimatingEscapeDir(target.dir);

    setTimeout(() => {
      setArrows((prev) => {
        const next = prev.filter((a) => a.id !== target.id);
        checkWinCondition(next);
        return next;
      });
      setEscapingArrowId(null);
    }, 400);
  };

  // Booster 4: Ruler (Laser Trajectory Guide)
  const handleUseRuler = () => {
    if (rulersLeft <= 0 && !showLaserGuides) return;
    sound.playPowerUp();
    if (!showLaserGuides) {
      setRulersLeft((prev) => Math.max(0, prev - 1));
    }
    setShowLaserGuides(!showLaserGuides);
  };

  // Render Arrow SVG element
  const renderArrow = (arrow) => {
    const isEscaping = escapingArrowId === arrow.id;
    const isBumping = bumpingArrowId === arrow.id;
    const isHinted = activeHintArrowId === arrow.id;

    // Movement transform for escaping or bumping
    let transformStyle = '';
    if (isEscaping) {
      const dist = 500;
      const dx = arrow.dir === 'left' ? -dist : arrow.dir === 'right' ? dist : 0;
      const dy = arrow.dir === 'up' ? -dist : arrow.dir === 'down' ? dist : 0;
      transformStyle = `translate(${dx}px, ${dy}px) scale(0.9)`;
    } else if (isBumping) {
      const bumpDist = 12;
      const dx = arrow.dir === 'left' ? -bumpDist : arrow.dir === 'right' ? bumpDist : 0;
      const dy = arrow.dir === 'up' ? -bumpDist : arrow.dir === 'down' ? bumpDist : 0;
      transformStyle = `translate(${dx}px, ${dy}px)`;
    }

    // Determine path points
    let pathD = '';
    let headX = 0;
    let headY = 0;

    if (arrow.type === 'bent' && arrow.points) {
      pathD = `M ${arrow.points.map((p) => `${p.x} ${p.y}`).join(' L ')}`;
      const last = arrow.points[arrow.points.length - 1];
      headX = last.x;
      headY = last.y;
    } else {
      pathD = `M ${arrow.startX} ${arrow.startY} L ${arrow.endX} ${arrow.endY}`;
      headX = arrow.endX;
      headY = arrow.endY;
    }

    // Arrowhead coordinates (triangle)
    const headSize = 10;
    let trianglePoints = '';
    if (arrow.dir === 'up') {
      trianglePoints = `${headX},${headY - headSize} ${headX - 6},${headY + 2} ${headX + 6},${headY + 2}`;
    } else if (arrow.dir === 'down') {
      trianglePoints = `${headX},${headY + headSize} ${headX - 6},${headY - 2} ${headX + 6},${headY - 2}`;
    } else if (arrow.dir === 'left') {
      trianglePoints = `${headX - headSize},${headY} ${headX + 2},${headY - 6} ${headX + 2},${headY + 6}`;
    } else if (arrow.dir === 'right') {
      trianglePoints = `${headX + headSize},${headY} ${headX - 2},${headY - 6} ${headX - 2},${headY + 6}`;
    }

    // Laser preview line if ruler is active
    const laser = showLaserGuides ? getArrowTrajectory(arrow, arrows, walls) : null;

    return (
      <g
        key={arrow.id}
        className={`arrow-group ${isHinted ? 'arrow-hinted' : ''} ${isBumping ? 'arrow-bumping' : ''} ${isEscaping ? 'arrow-escaping' : ''}`}
        style={{
          transform: transformStyle,
          transition: isEscaping
            ? 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)'
            : isBumping
            ? 'transform 0.1s ease-in-out'
            : 'transform 0.2s ease',
          cursor: isEraserMode ? 'crosshair' : 'pointer'
        }}
        onClick={() => handleArrowClick(arrow)}
      >
        {/* Laser Ruler trajectory guide */}
        {laser && (
          <line
            x1={laser.startX}
            y1={laser.startY}
            x2={laser.endX}
            y2={laser.endY}
            stroke={laser.canEscape ? '#22C55E' : '#EF4444'}
            strokeWidth="2.5"
            strokeDasharray="4 4"
            opacity="0.85"
          />
        )}

        {/* Hint pulse circle */}
        {isHinted && (
          <circle
            cx={headX}
            cy={headY}
            r="20"
            fill="rgba(234, 179, 8, 0.2)"
            stroke="#EAB308"
            strokeWidth="2"
            className="pulse-hint-ring"
          />
        )}

        {/* Arrow Body */}
        <path
          d={pathD}
          fill="none"
          stroke={isHinted ? '#EAB308' : '#000000'}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Arrow Head */}
        <polygon
          points={trianglePoints}
          fill={isHinted ? '#EAB308' : '#000000'}
        />

        {/* Transparent wider stroke for easy touch targeting on mobile devices */}
        <path
          d={pathD}
          fill="none"
          stroke="transparent"
          strokeWidth="26"
          strokeLinecap="round"
        />
      </g>
    );
  };

  return (
    <div className="screen-container game-screen">
      {/* Top Header matching Screenshot 5 */}
      <header className="game-top-bar">
        <button
          className="round-top-btn back-btn"
          onClick={() => { sound.playTap(); onBack(); }}
          aria-label="Back"
          id="game-back-btn"
        >
          <BackIcon />
        </button>

        {/* Center Pill: Level X | Hearts */}
        <div className="game-status-pill">
          <span className="game-level-text">{t.level} {levelData?.id || 1}</span>
          <div className="game-hearts-container">
            <HeartIcon filled={lives >= 1} />
            <HeartIcon filled={lives >= 2} />
            <HeartIcon filled={lives >= 3} />
          </div>
        </div>

        <button
          className="round-top-btn settings-btn"
          onClick={() => { sound.playTap(); onOpenSettings(); }}
          aria-label="Settings"
          id="game-settings-btn"
        >
          <GearIcon />
        </button>
      </header>

      {/* Eraser mode banner notification */}
      {isEraserMode && (
        <div className="mode-banner eraser-banner">
          <span>{t.eraserModeActive}</span>
        </div>
      )}

      {/* Main Game Arena / SVG Canvas matching Screenshot 5 */}
      <main className="game-canvas-area">
        <svg
          viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
          className="puzzle-svg-board"
        >
          {/* Walls */}
          {walls.map((w, idx) => (
            <line
              key={`wall_${idx}`}
              x1={w.x1}
              y1={w.y1}
              x2={w.x2}
              y2={w.y2}
              stroke="#000000"
              strokeWidth="5.5"
              strokeLinecap="round"
            />
          ))}

          {/* Arrows */}
          {arrows.map(renderArrow)}
        </svg>
      </main>

      {/* 4 Bottom Power-up Booster Buttons matching Screenshot 5 */}
      <footer className="game-boosters-bar">
        {/* 1. Lightbulb (Hint) */}
        <button
          className="booster-round-btn"
          onClick={handleUseHint}
          disabled={hintsLeft <= 0}
          aria-label={t.hint}
          id="booster-hint-btn"
        >
          <div className="booster-icon-wrap">
            <LightbulbIcon />
          </div>
          <span className="booster-count-badge">{hintsLeft}</span>
        </button>

        {/* 2. Eraser */}
        <button
          className={`booster-round-btn ${isEraserMode ? 'active-booster' : ''}`}
          onClick={handleUseEraser}
          disabled={erasersLeft <= 0}
          aria-label={t.eraser}
          id="booster-eraser-btn"
        >
          <div className="booster-icon-wrap">
            <EraserIcon />
          </div>
          <span className="booster-count-badge">{erasersLeft}</span>
        </button>

        {/* 3. Magic Wand */}
        <button
          className="booster-round-btn"
          onClick={handleUseWand}
          disabled={wandsLeft <= 0}
          aria-label={t.wand}
          id="booster-wand-btn"
        >
          <div className="booster-icon-wrap">
            <MagicWandIcon />
          </div>
          <span className="booster-count-badge">{wandsLeft}</span>
        </button>

        {/* 4. Laser Ruler */}
        <button
          className={`booster-round-btn ${showLaserGuides ? 'active-booster' : ''}`}
          onClick={handleUseRuler}
          disabled={rulersLeft <= 0 && !showLaserGuides}
          aria-label={t.ruler}
          id="booster-ruler-btn"
        >
          <div className="booster-icon-wrap">
            <RulerIcon />
          </div>
          <span className="booster-count-badge">{rulersLeft}</span>
        </button>
      </footer>

      {/* Game Over Modal */}
      {isGameOver && (
        <div className="game-modal-overlay">
          <div className="game-modal-card gameover-card">
            <h2 className="modal-title text-danger">{t.outOfLives}</h2>
            <p className="modal-desc">{t.outOfLivesDesc}</p>
            <div className="modal-actions-col">
              <button
                className="modal-cta-btn btn-revive"
                onClick={() => {
                  sound.playPowerUp();
                  setLives(3);
                  setIsGameOver(false);
                }}
                id="btn-revive-game"
              >
                {t.revive}
              </button>
              <button
                className="modal-cta-btn btn-retry"
                onClick={() => {
                  sound.playTap();
                  setArrows(JSON.parse(JSON.stringify(levelData.arrows || [])));
                  setLives(3);
                  setIsGameOver(false);
                }}
                id="btn-retry-game"
              >
                {t.retry}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
