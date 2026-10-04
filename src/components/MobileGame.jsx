import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mobileSituations } from '../data/mobileData';
import './MobileGame.css';

export default function MobileGame({ onComplete }) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const feedbackRef = useRef(null);

  const total = mobileSituations.length;
  const current = mobileSituations[index];
  const chosen = current.options.find((o) => o.value === answer);

  useEffect(() => {
    if (answer && feedbackRef.current) {
      setTimeout(() => {
        feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [answer]);

  const handleAnswer = (option) => {
    if (answer) return;
    setAnswer(option.value);
    if (option.correct) setCorrectCount((c) => c + 1);
  };

  const handleNext = () => {
    if (index < total - 1) {
      setIndex(index + 1);
      setAnswer(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onComplete(correctCount);
    }
  };

  return (
    <div className="mb-game">
      <div className="mb-header">
        <h2>📱 Как правильно защитить телефон?</h2>
        <p>Выбери самый безопасный вариант ответа.</p>
        <div className="mb-progress">
          Ситуация {index + 1} / {total}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          className="mb-card"
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -60, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-icon">{current.icon}</div>
          <h3 className="mb-title">{current.title}</h3>
          <p className="mb-text">{current.text}</p>
        </motion.div>
      </AnimatePresence>

      <div className="mb-options">
        {current.options.map((opt) => {
          const isChosen = answer === opt.value;
          const showResult = answer !== null;
          let className = 'mb-option';
          if (showResult && isChosen) {
            className += opt.correct ? ' chosen-correct' : ' chosen-wrong';
          } else if (showResult && opt.correct) {
            className += ' highlight-correct';
          }
          return (
            <motion.button
              key={opt.value}
              className={className}
              onClick={() => handleAnswer(opt)}
              whileHover={!answer ? { scale: 1.02, x: 4 } : {}}
              whileTap={!answer ? { scale: 0.98 } : {}}
              disabled={answer !== null}
            >
              {opt.label}
            </motion.button>
          );
        })}
      </div>

      {answer && (
        <motion.div
          ref={feedbackRef}
          className={`mb-feedback ${chosen.correct ? 'correct' : 'wrong'}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="mb-feedback-title">
            {chosen.correct ? '✅ Верно!' : '❌ Не самый безопасный вариант'}
          </div>
          <p className="mb-feedback-reason">{chosen.reason}</p>
          <button className="btn-primary" onClick={handleNext}>
            {index < total - 1 ? 'Следующая ситуация →' : 'Завершить'}
          </button>
        </motion.div>
      )}
    </div>
  );
}