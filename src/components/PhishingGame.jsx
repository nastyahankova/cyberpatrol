import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { phishingMessages } from '../data/phishingMessages';
import './PhishingGame.css';

const CHANNEL_ICONS = {
  email: '📧',
  sms: '📱',
  messenger: '💬',
};

const CHANNEL_LABELS = {
  email: 'Почта',
  sms: 'SMS',
  messenger: 'Мессенджер',
};

export default function PhishingGame({ onComplete }) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState(null); // null | 'safe' | 'danger'
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const total = phishingMessages.length;
  const current = phishingMessages[index];

  const handleAnswer = (choice) => {
    if (answer) return;
    setAnswer(choice);

    const correct =
      (choice === 'danger' && current.isPhishing) ||
      (choice === 'safe' && !current.isPhishing);

    if (correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (index < total - 1) {
      setIndex(index + 1);
      setAnswer(null);
    } else {
      setFinished(true);
    }
  };

  // --- Экран результата ---
  if (finished) {
    const percent = Math.round((score / total) * 100);
    let verdict, color, message;
    if (percent >= 80) {
      verdict = 'Отличный результат!';
      color = 'var(--accent-green)';
      message = 'Ты хорошо распознаёшь фишинг. Продолжай в том же духе!';
    } else if (percent >= 50) {
      verdict = 'Неплохо, но есть над чем поработать';
      color = 'var(--accent-yellow)';
      message = 'Ты уже многое знаешь, но мошенники хитры. Будь внимательнее.';
    } else {
      verdict = 'Стоит потренироваться';
      color = 'var(--accent-red)';
      message = 'Фишинг — главная угроза в интернете. Разбери ошибки и попробуй снова.';
    }

    return (
      <div className="phish-result">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 150 }}
        >
          <div className="phish-result-icon">🎣</div>
          <h2 style={{ color }}>{verdict}</h2>
          <div className="phish-result-score">
            {score} из {total} правильных
          </div>
          <p className="phish-result-message">{message}</p>
          <button className="btn-primary" onClick={onComplete}>
            Продолжить →
          </button>
        </motion.div>
      </div>
    );
  }

  // --- Игровой экран ---
  const isCorrect =
    answer &&
    ((answer === 'danger' && current.isPhishing) ||
      (answer === 'safe' && !current.isPhishing));

  return (
    <div className="phish-game">
      <div className="phish-header">
        <h2>🎣 Определи, фишинг или нет</h2>
        <p>Прочитай сообщение и реши: это мошенники или настоящий отправитель?</p>
        <div className="phish-progress">
          <div className="phish-progress-bar">
            <div
              className="phish-progress-fill"
              style={{ width: `${((index + 1) / total) * 100}%` }}
            />
          </div>
          <span>
            {index + 1} / {total}
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          className="phish-card"
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -60, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="phish-card-header">
            <span className="phish-channel">
              {CHANNEL_ICONS[current.channel]} {CHANNEL_LABELS[current.channel]}
            </span>
          </div>

          <div className="phish-from">
            <span className="phish-from-label">От:</span>
            <span className="phish-from-value">{current.from}</span>
          </div>

          {current.subject && current.subject !== 'SMS' && current.subject !== 'Сообщение' && (
            <div className="phish-subject">
              <span className="phish-from-label">Тема:</span>
              <span>{current.subject}</span>
            </div>
          )}

          <div className="phish-text">{current.text}</div>
        </motion.div>
      </AnimatePresence>

      {!answer ? (
        <div className="phish-buttons">
          <motion.button
            className="phish-btn safe"
            onClick={() => handleAnswer('safe')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            ✅ Безопасно
          </motion.button>
          <motion.button
            className="phish-btn danger"
            onClick={() => handleAnswer('danger')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            ⚠️ Опасно
          </motion.button>
        </div>
      ) : (
        <motion.div
          className={`phish-feedback ${isCorrect ? 'correct' : 'wrong'}`}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="phish-feedback-title">
            {isCorrect ? '✅ Правильно!' : '❌ Неверно'}
          </div>
          <div className="phish-feedback-truth">
            {current.isPhishing ? 'Это фишинг.' : 'Это настоящее сообщение.'}
          </div>
          <p className="phish-feedback-reason">{current.reason}</p>
          <button className="btn-primary" onClick={handleNext}>
            {index < total - 1 ? 'Следующее →' : 'Завершить'}
          </button>
        </motion.div>
      )}
    </div>
  );
}