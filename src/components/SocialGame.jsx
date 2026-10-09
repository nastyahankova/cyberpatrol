import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { socialScript, socialOutro } from '../data/socialEngineering';
import './socialgame.css';

export default function SocialGame({ onComplete }) {
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [finished, setFinished] = useState(false);
  const chatEndRef = useRef(null);

  const current = socialScript[step];

  useEffect(() => {
    if (messages.length === 0 && current) {
      setMessages([{ from: 'them', text: current.text }]);
    }
  }, [current, messages.length]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleChoice = (option) => {
    if (!option.correct) setMistakes((m) => m + 1);

    setMessages((prev) => [
      ...prev,
      { from: 'me', text: option.text },
      { from: 'them', text: option.reaction, comment: option.comment, correct: option.correct },
    ]);

    setTimeout(() => {
      if (step < socialScript.length - 1) {
        const next = socialScript[step + 1];
        setMessages((prev) => [...prev, { from: 'them', text: next.text }]);
        setStep(step + 1);
      } else {
        setFinished(true);
      }
    }, 1400);
  };

  if (finished) {
    const total = socialScript.length;
    const correct = total - mistakes;
    let verdict, color, message;

    if (mistakes === 0) {
      verdict = '🏆 Идеально!';
      color = 'var(--accent-green)';
      message = socialOutro.perfect;
    } else if (mistakes <= 2) {
      verdict = '👍 Хороший результат';
      color = 'var(--accent-cyan)';
      message = socialOutro.good;
    } else {
      verdict = '⚠️ Стоит потренироваться';
      color = 'var(--accent-yellow)';
      message = socialOutro.bad;
    }

    return (
      <div className="social-result">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 150 }}
        >
          <h2 style={{ color }}>{verdict}</h2>
          <div className="social-result-score">
            {correct} из {total} безопасных решений
          </div>
          <p className="social-result-message">{message}</p>
          <button
            className="btn-primary"
            onClick={() => onComplete({ correct, total })}
          >
            Продолжить →
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="social-game">
      <div className="social-header">
        <div className="social-avatar">👤</div>
        <div>
          <div className="social-name">Артём</div>
          <div className="social-status">в сети</div>
        </div>
        <div className="social-progress">
          Раунд {step + 1} / {socialScript.length}
        </div>
      </div>

      <div className="social-chat">
        {messages.map((msg, i) => (
          <div key={i} className={`social-msg social-msg-${msg.from}`}>
            <div className="social-bubble">
              {msg.text}
              {msg.comment && (
                <div className={`social-comment ${msg.correct ? 'good' : 'bad'}`}>
                  {msg.correct ? '✅ ' : '❌ '}
                  {msg.comment}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {!finished && step < socialScript.length && (
        <div className="social-options">
          {current.options.map((opt, i) => (
            <motion.button
              key={i}
              className="social-option"
              onClick={() => handleChoice(opt)}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              disabled={messages.some((m) => m.from === 'me' && m.text === opt.text)}
            >
              {opt.text}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}