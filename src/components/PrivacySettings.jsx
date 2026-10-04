import { useState } from 'react';
import { motion } from 'framer-motion';
import { privacySettings } from '../data/privacyData';
import './PrivacySettings.css';

export default function PrivacySettings({ onComplete }) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [safeCount, setSafeCount] = useState(0);

  const total = privacySettings.length;
  const current = privacySettings[index];
  const chosen = current.options.find((o) => o.value === answer);

  const handleChoose = (option) => {
    if (answer) return;
    setAnswer(option.value);
    if (option.safe) setSafeCount((c) => c + 1);
  };

  const handleNext = () => {
    if (index < total - 1) {
      setIndex(index + 1);
      setAnswer(null);
    } else {
      onComplete(safeCount);
    }
  };

  return (
    <div className="privacy-game">
      <div className="privacy-header">
        <h2>🔒 Настройки приватности</h2>
        <p>Реши, кто может видеть информацию о тебе. Что безопаснее?</p>
        <div className="privacy-progress">
          Настройка {index + 1} / {total}
        </div>
      </div>

      <motion.div
        key={current.id}
        className="privacy-card"
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h3>{current.title}</h3>

        <div className="privacy-options">
          {current.options.map((opt) => {
            const isChosen = answer === opt.value;
            const showResult = answer !== null;
            let className = 'privacy-option';
            if (showResult && isChosen) {
              className += opt.safe ? ' chosen-safe' : ' chosen-unsafe';
            } else if (showResult && opt.safe) {
              className += ' highlight-safe';
            }
            return (
              <motion.button
                key={opt.value}
                className={className}
                onClick={() => handleChoose(opt)}
                whileHover={!answer ? { scale: 1.02, x: 4 } : {}}
                whileTap={!answer ? { scale: 0.98 } : {}}
                disabled={answer !== null}
              >
                {opt.label}
                {showResult && isChosen && (
                  <span className="privacy-mark">{opt.safe ? ' ✅' : ' ❌'}</span>
                )}
              </motion.button>
            );
          })}
        </div>

        {answer && (
          <motion.div
            className={`privacy-feedback ${chosen.safe ? 'correct' : 'wrong'}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <p>{chosen.reason}</p>
            <button className="btn-primary" onClick={handleNext}>
              {index < total - 1 ? 'Дальше →' : 'К публикациям →'}
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}