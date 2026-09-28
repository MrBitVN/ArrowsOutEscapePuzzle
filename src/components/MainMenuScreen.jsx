import React from 'react';
import { CrownIcon, GearIcon, Joystick3DIcon, Trophy3DIcon, Calendar3DIcon } from './Icons';
import { TRANSLATIONS } from '../utils/i18n';
import { sound } from '../utils/sound';

export default function MainMenuScreen({ currentLang, onNavigate, onOpenSettings, onOpenVip }) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const handleCardClick = (destination) => {
    sound.playTap();
    onNavigate(destination);
  };

  return (
    <div className="screen-container main-menu-screen">
      {/* Top Header with Game Logo and Action Buttons */}
      <header className="main-menu-header">
        <div className="game-logo-badge">
          <span className="logo-word-arrow">ARROW</span>
          <span className="logo-word-escape">ESCAPE</span>
        </div>

        <div className="header-right-buttons">
          <button
            className="round-top-btn crown-btn"
            onClick={() => { sound.playTap(); onOpenVip(); }}
            aria-label="Crown VIP"
            id="menu-vip-btn"
          >
            <CrownIcon />
          </button>
          <button
            className="round-top-btn settings-btn"
            onClick={() => { sound.playTap(); onOpenSettings(); }}
            aria-label="Settings"
            id="menu-settings-btn"
          >
            <GearIcon />
          </button>
        </div>
      </header>

      {/* 3 Main Action Cards matching Screenshot 2 */}
      <main className="main-menu-cards-container">
        {/* 1. Game Card (Pink with Arcade Joystick) */}
        <button
          className="menu-action-card card-game"
          onClick={() => handleCardClick('map')}
          id="btn-nav-game"
        >
          <div className="card-illustration">
            <Joystick3DIcon />
          </div>
          <span className="card-title text-game">{t.game}</span>
        </button>

        {/* 2. Challenge Card (Golden Yellow with Trophy) */}
        <button
          className="menu-action-card card-challenge"
          onClick={() => handleCardClick('challenge')}
          id="btn-nav-challenge"
        >
          <span className="card-title text-challenge">{t.challenge}</span>
          <div className="card-illustration">
            <Trophy3DIcon />
          </div>
        </button>

        {/* 3. Daily Card (Soft Lavender Purple with Calendar) */}
        <button
          className="menu-action-card card-daily"
          onClick={() => handleCardClick('daily')}
          id="btn-nav-daily"
        >
          <div className="card-illustration">
            <Calendar3DIcon />
          </div>
          <span className="card-title text-daily">{t.daily}</span>
        </button>
      </main>
    </div>
  );
}
