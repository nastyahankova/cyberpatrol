import { useState } from 'react';
import { motion } from 'framer-motion';
import { detectiveCase } from '../data/cyberbullyingData';
import './detective.css';

export default function DetectiveGame({ onComplete }) {
  const [selected, setSelected] = useState([]);
  const [finished, setFinished] = useState(false);

  const totalBullying = detectiveCase.messages.filter((m) => m.isBullying).length;

  const handleClick = (id) => {
    if (finished) return;
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleCheck = () => {
    setFinished(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const correctCount = detectiveCase.messages.filter(
    (m) => m.isBullying && selected.includes(m.id)
  ).length;

  return (
    <div className="dt-game">
      <div className="dt-header">
        <h2>🕵️ Кибер-детектив</h2>
        <p>{detectiveCase.description}</p>
        <div className="dt-case-info">
          <span className="dt-case-label">Жертва:</span>
          <span className="dt-case-victim">{detectiveCase.victim}</span>
        </div>
      </div>

      <div className="dt-chat">
        <div className="dt-chat-header">
          <span className="dt-chat-icon">💬</span>
          <span>Общий чат класса</span>
        </div>

        <div className="dt-messages">
          {detectiveCase.messages.map((msg) => {
            const isSelected = selected.includes(msg.id);
            let className = 'dt-message';
            if (isSelected) className += ' selected';

            if (finished) {
              if (msg.isBullying && isSelected) className += ' correct';
              else if (msg.isBullying && !isSelected) className += ' missed';
              else if (!msg.isBullying && isSelected) className += ' wrong';
            }

            return (
              <motion.button
                key={msg.id}
                className={className}
                onClick={() => handleClick(msg.id)}
                whileHover={!finished ? { scale: 1.01, x: 4 } : {}}
                whileTap={!finished ? { scale: 0.99 } : {}}
                disabled={finished}
              >
                <div className="dt-message-avatar">{msg.avatar}</div>
                <div className="dt-message-content">
                  <div className="dt-message-nickname">{msg.nickname}</div>
                  <div className="dt-message-text">{msg.text}</div>
                </div>

                {finished && (
                  <div className="dt-message-mark">
                    {msg.isBullying && isSelected && '✅'}
                    {msg.isBullying && !isSelected && '⚠️'}
                    {!msg.isBullying && isSelected && '❌'}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {!finished ? (
        <button
          className="btn-primary dt-check-btn"
          onClick={handleCheck}
          disabled={selected.length === 0}
        >
          Отметить как улики ({selected.length})
        </button>
      ) : (
        <motion.div
          className="dt-feedback"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="dt-feedback-title">
            {correctCount === totalBullying
              ? '🎉 Дело раскрыто! Ты правильно определил все случаи травли!'
              : `Ты определил ${correctCount} из ${totalBullying} случаев травли`}
          </div>

          <div className="dt-feedback-list">
            {detectiveCase.messages.map((msg) => (
              <div key={msg.id} className="dt-feedback-item">
                <span className={`dt-feedback-icon ${msg.isBullying ? 'danger' : 'safe'}`}>
                  {msg.isBullying ? '⚠️' : '✅'}
                </span>
                <div>
                  <div className="dt-feedback-label">
                    {msg.avatar} <b>{msg.nickname}:</b> {msg.text}
                  </div>
                  <div className="dt-feedback-reason">{msg.reason}</div>
                </div>
              </div>
            ))}
          </div>

          <button
            className="btn-primary"
            onClick={() => onComplete({ correct: correctCount, total: totalBullying })}
          >
            Продолжить →
          </button>
        </motion.div>
      )}
    </div>
  );
}