import React, { useState } from 'react';
import { BackIcon, WingBadgeIcon } from './Icons';
import { TRANSLATIONS } from '../utils/i18n';
import { sound } from '../utils/sound';

export default function ChallengeScreen({
  currentLang,
  challengeProgress = {},
  onSelectChallenge,
  onBack
}) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const [activeTier, setActiveTier] = useState('easy');

  const tiers = [
    { id: 'easy', label: t.easy },
    { id: 'medium', label: t.medium },
    { id: 'hard', label: t.hard }
  ];

  const levelsCount = 10;
  const cards = Array.from({ length: levelsCount }, (_, i) => i + 1);

  const handleCardClick = (levelNum) => {
    sound.playTap();
    onSelectChallenge(activeTier, levelNum);
  };

  return (
    <div className="screen-container challenge-screen">
      {/* Top Header matching Screenshot 4 */}
      <header className="challenge-header">
        <button
          className="round-top-btn back-btn"
          onClick={() => { sound.playTap(); onBack(); }}
          aria-label="Back to Menu"
          id="challenge-back-btn"
        >
          <BackIcon />
        </button>

        <h1 className="challenge-title">{t.challenge}</h1>

        <button
          className="round-top-btn wing-badge-btn"
          aria-label="Achievements"
          onClick={() => sound.playPowerUp()}
          id="challenge-badge-btn"
        >
          <WingBadgeIcon />
        </button>
      </header>

      {/* Tier Tabs matching Screenshot 4: Easy, Medium, Hard */}
      <nav className="challenge-tabs-nav">
        {tiers.map((tier) => {
          const isActive = activeTier === tier.id;
          return (
            <button
              key={tier.id}
              className={`challenge-tab-pill ${isActive ? 'active' : ''}`}
              onClick={() => { sound.playTap(); setActiveTier(tier.id); }}
              id={`tab-tier-${tier.id}`}
            >
              {tier.label}
            </button>
          );
        })}
      </nav>

      {/* 2-Column Grid of Level Cards matching Screenshot 4 */}
      <div className="challenge-grid-scroll">
        <div className="challenge-cards-grid">
          {cards.map((levelNum) => {
            const progressKey = `${activeTier}_${levelNum}`;
            const isCompleted = challengeProgress[progressKey] || (activeTier === 'easy' && levelNum === 5); // Level 5 in screenshot 4 has completed badge!

            return (
              <button
                key={levelNum}
                className="challenge-level-card"
                onClick={() => handleCardClick(levelNum)}
                id={`challenge-card-${activeTier}-${levelNum}`}
              >
                <span className="card-level-tag">{t.level} {levelNum}</span>
                <div className="card-center-icon">
                  {isCompleted ? (
                    <div className="winged-star-completed">
                      <WingBadgeIcon />
                    </div>
                  ) : (
                    <span className="embossed-question-mark">?</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
