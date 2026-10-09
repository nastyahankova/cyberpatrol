import { useState } from 'react';
import { motion } from 'framer-motion';
import { gamingChat } from '../data/gamingThreatsData';
import './gamingchat.css';

export default function GamingChat({ onComplete }) {
  const [selected, setSelected] = useState([]);
  const [finished, setFinished] = useState(false);

  const totalScammers = gamingChat.messages.filter((m) => m.isScammer).length;

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

  const correctCount = gamingChat.messages.filter(
    (m) => m.isScammer && selected.includes(m.id)
  ).length;

  return (
    <div className="gc-game">
      <div className="gc-header">
        <h2>🔍 Найди мошенников в чате</h2>
        <p>
          Перед тобой чат игры «{gamingChat.gameTitle}». Среди сообщений есть
          мошенники. Нажми на те сообщения, которые считаешь подозрительными.
        </p>
      </div>

      <div className="gc-chat">
        <div className="gc-chat-header">
          <span className="gc-chat-icon">💬</span>
          <span>Общий чат игры</span>
        </div>

        <div className="gc-messages">
          {gamingChat.messages.map((msg) => {
            const isSelected = selected.includes(msg.id);
            let className = 'gc-message';
            if (isSelected) className += ' selected';

            if (finished) {
              if (msg.isScammer && isSelected) className += ' correct';
              else if (msg.isScammer && !isSelected) className += ' missed';
              else if (!msg.isScammer && isSelected) className += ' wrong';
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
                <div className="gc-message-avatar">{msg.avatar}</div>
                <div className="gc-message-content">
                  <div className="gc-message-nickname">{msg.nickname}</div>
                  <div className="gc-message-text">{msg.text}</div>
                </div>

                {finished && (
                  <div className="gc-message-mark">
                    {msg.isScammer && isSelected && '✅'}
                    {msg.isScammer && !isSelected && '⚠️'}
                    {!msg.isScammer && isSelected && '❌'}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {!finished ? (
        <button
          className="btn-primary gc-check-btn"
          onClick={handleCheck}
          disabled={selected.length === 0}
        >
          Проверить ({selected.length} выбрано)
        </button>
      ) : (
        <motion.div
          className="gc-feedback"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="gc-feedback-title">
            {correctCount === totalScammers
              ? '🎉 Отлично! Ты нашёл всех мошенников!'
              : `Ты нашёл ${correctCount} из ${totalScammers} мошенников`}
          </div>

          <div className="gc-feedback-list">
            {gamingChat.messages.map((msg) => (
              <div key={msg.id} className="gc-feedback-item">
                <span className={`gc-feedback-icon ${msg.isScammer ? 'danger' : 'safe'}`}>
                  {msg.isScammer ? '⚠️' : '✅'}
                </span>
                <div>
                  <div className="gc-feedback-label">
                    {msg.avatar} <b>{msg.nickname}</b>
                  </div>
                  <div className="gc-feedback-reason">{msg.reason}</div>
                </div>
              </div>
            ))}
          </div>

          <button
            className="btn-primary"
            onClick={() => onComplete({ correct: correctCount, total: totalScammers })}
          >
            Продолжить →
          </button>
        </motion.div>
      )}
    </div>
  );
}