import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { financialOffers, startCapital } from '../data/financialSchemes';
import './FinanceGame.css';

function Byn({ size = 16 }) {
  return (
    <img
      src="/byn-icon.svg"
      alt="BYN"
      style={{
        height: size,
        width: 'auto',
        display: 'inline-block',
        verticalAlign: 'middle',
        filter: 'brightness(0) invert(1)',
      }}
    />
  );
}

export default function FinanceGame({ onComplete }) {
  const [index, setIndex] = useState(0);
  const [balance, setBalance] = useState(startCapital);
  const [answer, setAnswer] = useState(null);
  const [history, setHistory] = useState([]);
  const [finished, setFinished] = useState(false);

  const total = financialOffers.length;
  const current = financialOffers[index];

  const handleChoice = (choice) => {
    if (answer) return;
    setAnswer(choice);

    let delta = 0;
    let wasRight = false;

    if (choice === 'invest') {
      if (current.isScam) {
        delta = -current.cost;
        wasRight = false;
      } else {
        delta = current.reward;
        wasRight = true;
      }
    } else {
      if (current.isScam) {
        delta = 0;
        wasRight = true;
      } else {
        delta = 0;
        wasRight = false;
      }
    }

    setBalance((b) => b + delta);
    setHistory((h) => [...h, { id: current.id, choice, delta, wasRight }]);
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
    const profit = balance - startCapital;
    let verdict, color, message;

    if (balance >= startCapital + 50) {
      verdict = '🏆 Отличный инвестор!';
      color = 'var(--accent-green)';
      message = `Ты не только сохранил, но и приумножил капитал. Итог: ${balance} BYN (+${profit}).`;
    } else if (balance >= startCapital - 100) {
      verdict = '👍 Хороший результат';
      color = 'var(--accent-cyan)';
      message = `Ты сохранил почти всё. Итог: ${balance} BYN. Главное — не потерял на мошенниках.`;
    } else {
      verdict = '⚠️ Мошенники обманули';
      color = 'var(--accent-red)';
      message = `Ты потерял часть денег на мошеннических схемах. Итог: ${balance} BYN. В следующий раз будь внимательнее.`;
    }

    return (
      <div className="fin-result">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 150 }}
        >
          <h2 style={{ color }}>{verdict}</h2>
          <div className="fin-result-balance">
            {balance} <Byn size={36} />
          </div>
          <p className="fin-result-message">{message}</p>

          <div className="fin-result-list">
            {financialOffers.map((offer, i) => {
              const h = history[i];
              if (!h) return null;
              const status = h.wasRight ? '✅' : '❌';
              return (
                <div key={offer.id} className="fin-result-item">
                  <span>{status}</span>
                  <span className="fin-result-title">{offer.title}</span>
                  <span className={`fin-result-delta ${h.delta < 0 ? 'neg' : h.delta > 0 ? 'pos' : ''}`}>
                    {h.delta > 0 ? `+${h.delta}` : h.delta < 0 ? h.delta : '0'}
                  </span>
                </div>
              );
            })}
          </div>

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
    ((answer === 'invest' && !current.isScam) ||
      (answer === 'skip' && current.isScam));

  return (
    <div className="fin-game">
      <div className="fin-header">
        <div className="fin-balance">
          <span className="fin-balance-label">Баланс:</span>
          <span className="fin-balance-value">
            {balance} <Byn size={20} />
          </span>
        </div>
        <div className="fin-progress">
          {index + 1} / {total}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          className="fin-card"
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -60, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="fin-source">{current.source}</div>
          <h3 className="fin-title">{current.title}</h3>
          <p className="fin-text">{current.text}</p>

          <div className="fin-meta">
            <div className="fin-meta-item">
              <span>Вложение:</span>
              <b>
                {current.cost} <Byn size={14} />
              </b>
            </div>
            {current.reward < 0 && (
              <div className="fin-meta-item warn">
                <span>Потеря:</span>
                <b>
                  {current.reward} <Byn size={14} />
                </b>
              </div>
            )}
            {current.reward > 0 && !current.isScam && (
              <div className="fin-meta-item profit">
                <span>Прибыль:</span>
                <b>
                  +{current.reward} <Byn size={14} />
                </b>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {!answer ? (
        <div className="fin-buttons">
          <motion.button
            className="fin-btn skip"
            onClick={() => handleChoice('skip')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            🚫 Отказаться
          </motion.button>
          <motion.button
            className="fin-btn invest"
            onClick={() => handleChoice('invest')}
            disabled={current.cost > balance}
            whileHover={{ scale: current.cost > balance ? 1 : 1.03 }}
            whileTap={{ scale: current.cost > balance ? 1 : 0.97 }}
          >
            💰 Вложиться ({current.cost} <Byn size={14} />)
          </motion.button>
        </div>
      ) : (
        <motion.div
          className={`fin-feedback ${isCorrect ? 'correct' : 'wrong'}`}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="fin-feedback-title">
            {isCorrect ? '✅ Верно!' : '❌ Ошибка'}
          </div>
          <div className="fin-feedback-truth">
            {current.isScam ? 'Это мошенническая схема.' : 'Это надёжное вложение.'}
          </div>
          <p className="fin-feedback-reason">{current.reason}</p>
          <button className="btn-primary" onClick={handleNext}>
            {index < total - 1 ? 'Следующее →' : 'Завершить'}
          </button>
        </motion.div>
      )}
    </div>
  );
}