import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { finalBattle } from '../data/finalBattleData';
import './FinalBattle.css';

export default function FinalBattle({ onComplete }) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [password, setPassword] = useState('');
  const [passwordDone, setPasswordDone] = useState(false);
  const feedbackRef = useRef(null);

  const total = finalBattle.length;
  const current = finalBattle[index];

  useEffect(() => {
    if (answer && feedbackRef.current) {
      setTimeout(() => {
        feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [answer]);

  const handleBinary = (choice) => {
    if (answer) return;
    setAnswer(choice);
    const isCorrect =
      (choice === 'safe' && current.safe) ||
      (choice === 'danger' && !current.safe);
    if (isCorrect) setCorrectCount((c) => c + 1);
  };

  const handleTriple = (option) => {
    if (answer) return;
    setAnswer(option.value);
    if (option.correct) setCorrectCount((c) => c + 1);
  };

  const checkPassword = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-zа-я]/.test(password)) score++;
    if (/[A-ZА-Я]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-zА-Яа-я0-9]/.test(password)) score++;

    const isStrong = score >= 5;
    setPasswordDone(true);
    setAnswer('password');
    if (isStrong) setCorrectCount((c) => c + 1);
  };

  const handleNext = () => {
    if (index < total - 1) {
      setIndex(index + 1);
      setAnswer(null);
      setPassword('');
      setPasswordDone(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onComplete(correctCount);
    }
  };

  // === РЕНДЕР ОБРАТНОЙ СВЯЗИ ===
  const renderFeedback = () => {
    if (!answer) return null;

    let isCorrect = false;
    let reason = '';

    if (current.type === 'binary') {
      isCorrect =
        (answer === 'safe' && current.safe) ||
        (answer === 'danger' && !current.safe);
      reason = current.reason;
    } else if (current.type === 'triple') {
      const chosen = current.options.find((o) => o.value === answer);
      isCorrect = chosen.correct;
      reason = chosen.reason;
    } else if (current.type === 'password') {
      let score = 0;
      if (password.length >= 8) score++;
      if (password.length >= 12) score++;
      if (/[a-zа-я]/.test(password)) score++;
      if (/[A-ZА-Я]/.test(password)) score++;
      if (/\d/.test(password)) score++;
      if (/[^A-Za-zА-Яа-я0-9]/.test(password)) score++;
      isCorrect = score >= 5;
      reason = isCorrect
        ? 'Отличный пароль! Профессор не сможет его взломать.'
        : 'Слабый пароль. Нужно минимум 12 символов, заглавные буквы, цифры и знаки.';
    }

    return (
      <motion.div
        ref={feedbackRef}
        className={`fb-feedback ${isCorrect ? 'correct' : 'wrong'}`}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="fb-feedback-title">
          {isCorrect ? '✅ Верно!' : '❌ Ошибка'}
        </div>
        <p className="fb-feedback-reason">{reason}</p>
        <button className="btn-primary" onClick={handleNext}>
          {index < total - 1 ? 'Дальше →' : 'Завершить битву'}
        </button>
      </motion.div>
    );
  };

  // === РЕНДЕР ЗАДАНИЯ ===
  const renderTask = () => {
    if (current.type === 'binary') {
      return (
        <div className="fb-buttons">
          <motion.button
            className="fb-btn safe"
            onClick={() => handleBinary('safe')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={!!answer}
          >
            ✅ Безопасно
          </motion.button>
          <motion.button
            className="fb-btn danger"
            onClick={() => handleBinary('danger')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={!!answer}
          >
            ⚠️ Опасно
          </motion.button>
        </div>
      );
    }

    if (current.type === 'triple') {
      return (
        <div className="fb-options">
          {current.options.map((opt) => {
            const isChosen = answer === opt.value;
            const showResult = answer !== null;
            let className = 'fb-option';
            if (showResult && isChosen) {
              className += opt.correct ? ' chosen-correct' : ' chosen-wrong';
            } else if (showResult && opt.correct) {
              className += ' highlight-correct';
            }
            return (
              <button
                key={opt.value}
                className={className}
                onClick={() => handleTriple(opt)}
                disabled={answer !== null}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      );
    }

    if (current.type === 'password') {
      return (
        <div className="fb-password">
          <input
            type="text"
            className="fb-password-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введи пароль"
            disabled={passwordDone}
          />
          {!passwordDone && (
            <button
              className="btn-primary"
              onClick={checkPassword}
              disabled={!password}
            >
              Проверить пароль
            </button>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fb-game">
      <div className="fb-header">
        <div className="fb-vs">
          <img src="/hacker.png" alt="Профессор" className="fb-hacker-mini" />
          <div>
            <div className="fb-progress-label">Финальная атака</div>
            <div className="fb-progress-value">Раунд {index + 1} / {total}</div>
          </div>
        </div>
        <div className="fb-score">
          Правильно: {correctCount}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          className="fb-card"
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -60, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="fb-icon">{current.icon}</div>
          <h3 className="fb-title">{current.title}</h3>
          <p className="fb-text">{current.text}</p>
        </motion.div>
      </AnimatePresence>

      {!answer && renderTask()}
      {renderFeedback()}
    </div>
  );
}