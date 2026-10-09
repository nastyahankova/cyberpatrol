import { useState } from 'react';
import { motion } from 'framer-motion';
import { profileSettingsNew } from '../data/privacyData';
import './profilesetup.css';

export default function ProfileSetup({ onComplete }) {
  const [values, setValues] = useState(() => {
    const init = {};
    profileSettingsNew.forEach((s) => {
      init[s.id] = s.options[0].value;
    });
    return init;
  });
  const [finished, setFinished] = useState(false);

  const handleChange = (id, value) => {
    if (finished) return;
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleCheck = () => {
    setFinished(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isCorrect = (setting) => {
    return setting.correctValues.includes(values[setting.id]);
  };

  const correctCount = profileSettingsNew.filter((s) => isCorrect(s)).length;

  return (
    <div className="ps-game">
      <div className="ps-header">
        <h2>🎛️ Настрой свой профиль</h2>
        <p>
          Перед тобой настройки приватности в соцсети. Выбери, кто сможет видеть
          информацию о тебе. Подумай, что безопаснее.
        </p>
      </div>

      <div className="ps-profile">
        <div className="ps-profile-header">
          <div className="ps-profile-avatar">👤</div>
          <div>
            <div className="ps-profile-name">Твой профиль</div>
            <div className="ps-profile-status">Настройки приватности</div>
          </div>
        </div>

        <div className="ps-settings">
          {profileSettingsNew.map((setting) => {
            const chosen = values[setting.id];
            const correct = isCorrect(setting);
            return (
              <div
                key={setting.id}
                className={`ps-setting ${finished ? (correct ? 'correct' : 'wrong') : ''}`}
              >
                <div className="ps-setting-top">
                  <span className="ps-setting-icon">{setting.icon}</span>
                  <div className="ps-setting-info">
                    <div className="ps-setting-label">{setting.label}</div>
                    <div className="ps-setting-desc">{setting.description}</div>
                  </div>
                  {finished && (
                    <div className="ps-setting-mark">{correct ? '✅' : '❌'}</div>
                  )}
                </div>

                <div className="ps-toggle">
                  {setting.options.map((opt) => {
                    const isActive = chosen === opt.value;
                    return (
                      <button
                        key={opt.value}
                        className={`ps-toggle-btn ${isActive ? 'active' : ''}`}
                        onClick={() => handleChange(setting.id, opt.value)}
                        disabled={finished}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                {finished && (
                  <div className="ps-setting-reason">{setting.reason}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {!finished ? (
        <button className="btn-primary ps-check-btn" onClick={handleCheck}>
          Сохранить настройки
        </button>
      ) : (
        <motion.div
          className="ps-feedback"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="ps-feedback-title">
            {correctCount === profileSettingsNew.length
              ? '🎉 Отлично! Ты настроил профиль максимально безопасно!'
              : `Правильно настроено: ${correctCount} из ${profileSettingsNew.length}`}
          </div>
          <button
            className="btn-primary"
            onClick={() => onComplete({ correct: correctCount, total: profileSettingsNew.length })}
          >
            Продолжить →
          </button>
        </motion.div>
      )}
    </div>
  );
}