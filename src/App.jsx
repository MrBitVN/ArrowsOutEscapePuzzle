import React, { useState, useEffect } from 'react';
import LanguageScreen from './components/LanguageScreen';
import MainMenuScreen from './components/MainMenuScreen';
import MapScreen from './components/MapScreen';
import ChallengeScreen from './components/ChallengeScreen';
import GameScreen from './components/GameScreen';
import { VictoryModal, SettingsModal, VipModal, DailyModal } from './components/Modals';
import { ALL_100_LEVELS, CHALLENGE_LEVELS, getDailyLevel } from './data/levels';
import { sound } from './utils/sound';
import './App.css';

export default function App() {
  // Persistence & Initial State
  const [hasChosenLang, setHasChosenLang] = useState(() => {
    return !!localStorage.getItem('arrow_escape_has_lang');
  });

  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('arrow_escape_lang') || 'en';
  });

  // Default to Level 2 active (matching Screenshot 3 where Level 1 is completed and Level 2 is ready!)
  const [maxUnlockedLevel, setMaxUnlockedLevel] = useState(() => {
    const saved = localStorage.getItem('arrow_escape_max_level');
    return saved ? parseInt(saved, 10) : 2;
  });

  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem('arrow_escape_coins');
    return saved ? parseInt(saved, 10) : 100;
  });

  const [challengeProgress, setChallengeProgress] = useState(() => {
    try {
      const saved = localStorage.getItem('arrow_escape_challenge_prog');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Current active screen: 'language', 'menu', 'map', 'challenge', 'game'
  const [currentScreen, setCurrentScreen] = useState(() => {
    const hasChosen = localStorage.getItem('arrow_escape_has_lang');
    return hasChosen ? 'menu' : 'language';
  });

  // Level data for game arena
  const [activeLevelData, setActiveLevelData] = useState(null);
  const [isChallengeMode, setIsChallengeMode] = useState(false);
  const [activeChallengeInfo, setActiveChallengeInfo] = useState(null);

  // Settings
  const [soundOn, setSoundOn] = useState(true);
  const [vibrationOn, setVibrationOn] = useState(true);

  // Modals
  const [showSettings, setShowSettings] = useState(false);
  const [showVip, setShowVip] = useState(false);
  const [showDaily, setShowDaily] = useState(false);
  const [victoryState, setVictoryState] = useState(null); // { levelNum, stars }

  // Mobile container frame toggle for desktop view
  const [isMobileFrame, setIsMobileFrame] = useState(true);

  // Sound sync
  useEffect(() => {
    sound.enabled = soundOn;
  }, [soundOn]);

  useEffect(() => {
    sound.vibrationEnabled = vibrationOn;
  }, [vibrationOn]);

  // Handle language confirmation
  const handleConfirmLanguage = (langId) => {
    setCurrentLang(langId);
    setHasChosenLang(true);
    localStorage.setItem('arrow_escape_lang', langId);
    localStorage.setItem('arrow_escape_has_lang', 'true');
    setCurrentScreen('menu');
  };

  // Launch Regular Game Level (1 - 100)
  const handleStartRegularLevel = (levelNum) => {
    const lvl = ALL_100_LEVELS.find((l) => l.id === levelNum) || ALL_100_LEVELS[0];
    setActiveLevelData(lvl);
    setIsChallengeMode(false);
    setActiveChallengeInfo(null);
    setCurrentScreen('game');
  };

  // Launch Challenge Level
  const handleStartChallenge = (tier, levelNum) => {
    const tierLevels = CHALLENGE_LEVELS[tier] || CHALLENGE_LEVELS.easy;
    const lvl = tierLevels[levelNum - 1] || tierLevels[0];
    setActiveLevelData(lvl);
    setIsChallengeMode(true);
    setActiveChallengeInfo({ tier, levelNum });
    setCurrentScreen('game');
  };

  // Launch Daily Level
  const handleStartDaily = () => {
    setShowDaily(false);
    const dailyLvl = getDailyLevel();
    setActiveLevelData(dailyLvl);
    setIsChallengeMode(false);
    setActiveChallengeInfo({ isDaily: true });
    setCurrentScreen('game');
  };

  // Handle level completion
  const handleLevelComplete = (levelId, livesRemaining) => {
    const stars = livesRemaining >= 3 ? 3 : livesRemaining === 2 ? 2 : 1;
    setCoins((c) => {
      const next = c + 50;
      localStorage.setItem('arrow_escape_coins', next.toString());
      return next;
    });

    if (isChallengeMode && activeChallengeInfo) {
      const key = `${activeChallengeInfo.tier}_${activeChallengeInfo.levelNum}`;
      const nextProg = { ...challengeProgress, [key]: true };
      setChallengeProgress(nextProg);
      localStorage.setItem('arrow_escape_challenge_prog', JSON.stringify(nextProg));
    } else if (!activeChallengeInfo?.isDaily) {
      if (levelId >= maxUnlockedLevel && maxUnlockedLevel < 100) {
        const nextMax = levelId + 1;
        setMaxUnlockedLevel(nextMax);
        localStorage.setItem('arrow_escape_max_level', nextMax.toString());
      }
    }

    setVictoryState({ levelNum: levelId, stars });
  };

  // Victory: Next Level
  const handleVictoryNext = () => {
    setVictoryState(null);
    if (isChallengeMode && activeChallengeInfo) {
      if (activeChallengeInfo.levelNum < 10) {
        handleStartChallenge(activeChallengeInfo.tier, activeChallengeInfo.levelNum + 1);
      } else {
        setCurrentScreen('challenge');
      }
    } else {
      const nextId = (activeLevelData?.id || 1) + 1;
      if (nextId <= 100) {
        handleStartRegularLevel(nextId);
      } else {
        setCurrentScreen('map');
      }
    }
  };

  // Victory: Retry Level
  const handleVictoryRetry = () => {
    setVictoryState(null);
    if (isChallengeMode && activeChallengeInfo) {
      handleStartChallenge(activeChallengeInfo.tier, activeChallengeInfo.levelNum);
    } else {
      handleStartRegularLevel(activeLevelData?.id || 1);
    }
  };

  return (
    <div className={`app-root ${isMobileFrame ? 'desktop-simulator-mode' : 'fullscreen-mode'}`}>
      {/* Desktop Responsive Toolbar (Toggle Frame / Fullscreen) */}
      <div className="simulator-desktop-bar">
        <span className="app-title-tag">🏹 Arrow Escape - Mobile App</span>
        <button
          className="frame-toggle-btn"
          onClick={() => setIsMobileFrame(!isMobileFrame)}
          title="Toggle Mobile Device Frame"
        >
          {isMobileFrame ? '🖥️ Fullscreen View' : '📱 Mobile Device Frame'}
        </button>
      </div>

      {/* Mobile Device Simulation Shell */}
      <div className="mobile-device-shell">
        <div className="mobile-speaker-bar"></div>
        <div className="mobile-screen-content">
          {/* SCREEN 1: Language Selection */}
          {currentScreen === 'language' && (
            <LanguageScreen
              currentLang={currentLang}
              onSelectLanguage={setCurrentLang}
              onConfirm={handleConfirmLanguage}
            />
          )}

          {/* SCREEN 2: Main Menu */}
          {currentScreen === 'menu' && (
            <MainMenuScreen
              currentLang={currentLang}
              onNavigate={(dest) => {
                if (dest === 'daily') setShowDaily(true);
                else setCurrentScreen(dest);
              }}
              onOpenSettings={() => setShowSettings(true)}
              onOpenVip={() => setShowVip(true)}
            />
          )}

          {/* SCREEN 3: 100-Level Map */}
          {currentScreen === 'map' && (
            <MapScreen
              currentLang={currentLang}
              maxUnlockedLevel={maxUnlockedLevel}
              onSelectLevel={handleStartRegularLevel}
              onBack={() => setCurrentScreen('menu')}
            />
          )}

          {/* SCREEN 4: Challenge Mode */}
          {currentScreen === 'challenge' && (
            <ChallengeScreen
              currentLang={currentLang}
              challengeProgress={challengeProgress}
              onSelectChallenge={handleStartChallenge}
              onBack={() => setCurrentScreen('menu')}
            />
          )}

          {/* SCREEN 5: Puzzle Game Arena */}
          {currentScreen === 'game' && activeLevelData && (
            <GameScreen
              currentLang={currentLang}
              levelData={activeLevelData}
              onBack={() => setCurrentScreen(isChallengeMode ? 'challenge' : 'map')}
              onLevelComplete={handleLevelComplete}
              onOpenSettings={() => setShowSettings(true)}
            />
          )}

          {/* Modals */}
          {victoryState && (
            <VictoryModal
              currentLang={currentLang}
              levelNum={victoryState.levelNum}
              stars={victoryState.stars}
              onNextLevel={handleVictoryNext}
              onRetry={handleVictoryRetry}
            />
          )}

          {showSettings && (
            <SettingsModal
              currentLang={currentLang}
              soundEnabled={soundOn}
              vibrationEnabled={vibrationOn}
              onToggleSound={() => setSoundOn(!soundOn)}
              onToggleVibration={() => setVibrationOn(!vibrationOn)}
              onChangeLanguage={() => {
                setShowSettings(false);
                setCurrentScreen('language');
              }}
              onClose={() => setShowSettings(false)}
            />
          )}

          {showVip && (
            <VipModal
              currentLang={currentLang}
              onClose={() => setShowVip(false)}
            />
          )}

          {showDaily && (
            <DailyModal
              currentLang={currentLang}
              onPlayDaily={handleStartDaily}
              onClose={() => setShowDaily(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
