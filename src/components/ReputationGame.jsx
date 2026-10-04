import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { reputationSituations } from '../data/reputationData';
import './ReputationGame.css';

export default function ReputationGame({ onComplete }) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const feedbackRef = useRef(null);

  const total = reputationSituations.length;
  const current = reputationSituations[index];
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
    <div className="rp-game">
      <div className="rp-header">
        <h2>🌐 Что подумают другие?</h2>
        <p>Подумай, как эта запись в интернете повлияет на твою репутацию.</p>
        <div className="rp-progress">
          Ситуация {index + 1} / {total}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          className="rp-card"
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -60, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="rp-icon">{current.icon}</div>
          <h3 className="rp-title">{current.title}</h3>
          <p className="rp-text">{current.text}</p>
        </motion.div>
      </AnimatePresence>

      <div className="rp-options">
        {current.options.map((opt) => {
          const isChosen = answer === opt.value;
          const showResult = answer !== null;
          let className = 'rp-option';
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
          className={`rp-feedback ${chosen.correct ? 'correct' : 'wrong'}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="rp-feedback-title">
            {chosen.correct ? '✅ Верно!' : '❌ Не самый лучший вариант'}
          </div>
          <p className="rp-feedback-reason">{chosen.reason}</p>
          <button className="btn-primary" onClick={handleNext}>
            {index < total - 1 ? 'Следующая ситуация →' : 'Завершить'}
          </button>
        </motion.div>
      )}
    </div>
  );
}