import React from 'react';
import { TRANSLATIONS } from '../utils/i18n';
import { sound } from '../utils/sound';
import { CrownIcon } from './Icons';

export function VictoryModal({ currentLang, levelNum, stars = 3, onNextLevel, onRetry }) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  return (
    <div className="game-modal-overlay">
      <div className="game-modal-card victory-card">
        <div className="victory-stars-row">
          <span className={`star-item ${stars >= 1 ? 'active' : ''}`}>⭐</span>
          <span className={`star-item big-star ${stars >= 2 ? 'active' : ''}`}>⭐</span>
          <span className={`star-item ${stars >= 3 ? 'active' : ''}`}>⭐</span>
        </div>

        <h2 className="modal-title text-success">{t.victory}</h2>
        <p className="modal-desc">{t.levelCleared} {levelNum}!</p>

        <div className="victory-reward-badge">
          <span>+50 🪙</span>
        </div>

        <div className="modal-actions-col">
          <button
            className="modal-cta-btn btn-next-level"
            onClick={() => { sound.playTap(); onNextLevel(); }}
            id="btn-victory-next"
          >
            {t.nextLevel}
          </button>
          <button
            className="modal-cta-btn btn-retry"
            onClick={() => { sound.playTap(); onRetry(); }}
            id="btn-victory-retry"
          >
            {t.retry}
          </button>
        </div>
      </div>
    </div>
  );
}

export function SettingsModal({
  currentLang,
  soundEnabled,
  vibrationEnabled,
  onToggleSound,
  onToggleVibration,
  onChangeLanguage,
  onClose
}) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  return (
    <div className="game-modal-overlay" onClick={onClose}>
      <div className="game-modal-card settings-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{t.settings}</h2>

        <div className="settings-options-list">
          {/* Sound Toggle */}
          <div className="settings-row">
            <span>{t.sound}</span>
            <button
              className={`toggle-switch ${soundEnabled ? 'on' : 'off'}`}
              onClick={() => { sound.playTap(); onToggleSound(); }}
              id="toggle-sound-btn"
            >
              <div className="toggle-thumb" />
            </button>
          </div>

          {/* Vibration Toggle */}
          <div className="settings-row">
            <span>{t.vibration}</span>
            <button
              className={`toggle-switch ${vibrationEnabled ? 'on' : 'off'}`}
              onClick={() => { sound.playTap(); onToggleVibration(); }}
              id="toggle-vibration-btn"
            >
              <div className="toggle-thumb" />
            </button>
          </div>

          {/* Change Language */}
          <button
            className="settings-action-btn"
            onClick={() => { sound.playTap(); onChangeLanguage(); }}
            id="settings-change-lang-btn"
          >
            🌐 {t.changeLanguage}
          </button>
        </div>

        {/* How to play summary */}
        <div className="settings-help-box">
          <h4>{t.howToPlay}</h4>
          <p>{t.howToPlayDesc}</p>
        </div>

        <button
          className="modal-cta-btn btn-close-modal"
          onClick={() => { sound.playTap(); onClose(); }}
          id="settings-close-btn"
        >
          {t.close}
        </button>
      </div>
    </div>
  );
}

export function VipModal({ currentLang, onClose }) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  return (
    <div className="game-modal-overlay" onClick={onClose}>
      <div className="game-modal-card vip-card" onClick={(e) => e.stopPropagation()}>
        <div className="vip-icon-banner">
          <CrownIcon />
        </div>
        <h2 className="modal-title text-gold">{t.vipTitle}</h2>
        <p className="modal-desc">{t.vipDesc}</p>

        <button
          className="modal-cta-btn btn-claim-gold"
          onClick={() => { sound.playPowerUp(); onClose(); }}
          id="vip-claim-btn"
        >
          {t.claim}
        </button>
      </div>
    </div>
  );
}

export function DailyModal({ currentLang, onPlayDaily, onClose }) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  return (
    <div className="game-modal-overlay" onClick={onClose}>
      <div className="game-modal-card daily-card" onClick={(e) => e.stopPropagation()}>
        <span className="daily-calendar-emoji">📅</span>
        <h2 className="modal-title text-daily-title">{t.dailyReward}</h2>
        <p className="modal-desc">{t.dailyDesc}</p>

        <button
          className="modal-cta-btn btn-daily-play"
          onClick={() => { sound.playTap(); onPlayDaily(); }}
          id="daily-play-btn"
        >
          {t.play}
        </button>
      </div>
    </div>
  );
}
