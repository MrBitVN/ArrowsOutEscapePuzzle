import React, { useState } from 'react';
import { LANGUAGES, TRANSLATIONS } from '../utils/i18n';
import { CheckIcon, FlagIcon } from './Icons';
import { sound } from '../utils/sound';

export default function LanguageScreen({ currentLang, onSelectLanguage, onConfirm }) {
  const [selected, setSelected] = useState(currentLang || 'en');
  const t = TRANSLATIONS[selected] || TRANSLATIONS.en;

  const handleSelect = (langId) => {
    sound.playTap();
    setSelected(langId);
    onSelectLanguage(langId);
  };

  const handleConfirm = () => {
    sound.playTap();
    onConfirm(selected);
  };

  return (
    <div className="screen-container language-screen">
      {/* Header with Title and Confirm Checkmark */}
      <header className="screen-header language-header">
        <h1 className="header-title">{t.languageTitle}</h1>
        <button
          className="header-action-btn check-btn"
          onClick={handleConfirm}
          aria-label="Confirm Language"
          id="confirm-lang-btn"
        >
          <CheckIcon />
        </button>
      </header>

      {/* Language List matching Screenshot 1 */}
      <div className="language-list">
        {LANGUAGES.map((lang) => {
          const isSelected = selected === lang.id;
          return (
            <button
              key={lang.id}
              className={`language-pill-btn ${isSelected ? 'selected' : ''}`}
              onClick={() => handleSelect(lang.id)}
              id={`lang-btn-${lang.id}`}
            >
              <div className="language-flag-container">
                <FlagIcon type={lang.flagType} />
              </div>
              <span className="language-name">{lang.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
