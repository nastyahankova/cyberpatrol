import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gamingSituations } from '../data/gamingThreatsData';
import './GamingGame.css';

export default function GamingGame({ onComplete }) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const feedbackRef = useRef(null);

  const total = gamingSituations.length;
  const current = gamingSituations[index];

  useEffect(() => {
    if (answer && feedbackRef.current) {
      setTimeout(() => {
        feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [answer]);

  const handleAnswer = (choice) => {
    if (answer) return;
    setAnswer(choice);
    const isCorrect =
      (choice === 'safe' && current.safe) ||
      (choice === 'danger' && !current.safe);
    if (isCorrect) setCorrectCount((c) => c + 1);
  };

  const handleNext = () => {
    if (index < total - 1) {
      setIndex(index + 1);
      setAnswer(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onComplete({ correct: correctCount, total });
    }
  };

  const isCorrect =
    answer &&
    ((answer === 'safe' && current.safe) ||
      (answer === 'danger' && !current.safe));

  return (
    <div className="gm-game">
      <div className="gm-header">
        <h2>🎮 Безопасно или опасно?</h2>
        <p>Прочитай ситуацию и реши: это безопасно или мошенничество?</p>
        <div className="gm-progress">
          Ситуация {index + 1} / {total}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          className="gm-card"
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -60, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="gm-icon">{current.icon}</div>
          <h3 className="gm-title">{current.title}</h3>
          <p className="gm-text">{current.text}</p>
        </motion.div>
      </AnimatePresence>

      {!answer ? (
        <div className="gm-buttons">
          <motion.button
            className="gm-btn safe"
            onClick={() => handleAnswer('safe')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            ✅ Безопасно
          </motion.button>
          <motion.button
            className="gm-btn danger"
            onClick={() => handleAnswer('danger')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            ⚠️ Опасно
          </motion.button>
        </div>
      ) : (
        <motion.div
          ref={feedbackRef}
          className={`gm-feedback ${isCorrect ? 'correct' : 'wrong'}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="gm-feedback-title">
            {isCorrect ? '✅ Верно!' : '❌ Ошибка'}
          </div>
          <div className="gm-feedback-truth">
            {current.safe ? 'Это безопасно.' : 'Это мошенничество.'}
          </div>
          <p className="gm-feedback-reason">{current.reason}</p>
          <button className="btn-primary" onClick={handleNext}>
            {index < total - 1 ? 'Следующая ситуация →' : 'Завершить'}
          </button>
        </motion.div>
      )}
    </div>
  );
}