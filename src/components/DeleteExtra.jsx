import { useState } from 'react';
import { motion } from 'framer-motion';
import { reputationPosts } from '../data/reputationData';
import './deleteextra.css';

export default function DeleteExtra({ onComplete }) {
  const [selected, setSelected] = useState([]);
  const [finished, setFinished] = useState(false);

  const totalDangerous = reputationPosts.filter((p) => p.isDangerous).length;

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

  const correctCount = reputationPosts.filter(
    (p) => p.isDangerous && selected.includes(p.id)
  ).length;

  return (
    <div className="de-game">
      <div className="de-header">
        <h2>🗑️ Удали лишнее</h2>
        <p>
          Перед тобой 8 постов из твоего профиля. Нажми на те, которые могут
          навредить твоей репутации или безопасности. Их может быть несколько.
        </p>
      </div>

      <div className="de-feed">
        {reputationPosts.map((post) => {
          const isSelected = selected.includes(post.id);
          let className = 'de-post';
          if (isSelected) className += ' selected';

          if (finished) {
            if (post.isDangerous && isSelected) className += ' correct';
            else if (post.isDangerous && !isSelected) className += ' missed';
            else if (!post.isDangerous && isSelected) className += ' wrong';
          }

          return (
            <motion.button
              key={post.id}
              className={className}
              onClick={() => handleClick(post.id)}
              whileHover={!finished ? { scale: 1.02, y: -2 } : {}}
              whileTap={!finished ? { scale: 0.98 } : {}}
              disabled={finished}
            >
              <div className="de-post-header">
                <div className="de-post-avatar">👤</div>
                <div>
                  <div className="de-post-author">Твой профиль</div>
                  <div className="de-post-time">только что</div>
                </div>
              </div>

              <div className="de-post-image">{post.icon}</div>
              <div className="de-post-title">{post.title}</div>
              <div className="de-post-text">{post.text}</div>

              {finished && (
                <div className="de-post-mark">
                  {post.isDangerous && isSelected && '✅ Удалён правильно'}
                  {post.isDangerous && !isSelected && '⚠️ Надо было удалить'}
                  {!post.isDangerous && isSelected && '❌ Удалять не нужно'}
                  {!post.isDangerous && !isSelected && '✅ Оставлен правильно'}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {!finished ? (
        <button
          className="btn-primary de-check-btn"
          onClick={handleCheck}
          disabled={selected.length === 0}
        >
          Удалить выбранные ({selected.length})
        </button>
      ) : (
        <motion.div
          className="de-feedback"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="de-feedback-title">
            {correctCount === totalDangerous
              ? '🎉 Отлично! Ты правильно определил все опасные посты!'
              : `Правильно определено: ${correctCount} из ${totalDangerous}`}
          </div>

          <div className="de-feedback-list">
            {reputationPosts.map((post) => (
              <div key={post.id} className="de-feedback-item">
                <span className={`de-feedback-icon ${post.isDangerous ? 'danger' : 'safe'}`}>
                  {post.isDangerous ? '⚠️' : '✅'}
                </span>
                <div>
                  <div className="de-feedback-label">
                    {post.icon} <b>{post.title}</b>
                  </div>
                  <div className="de-feedback-reason">{post.reason}</div>
                </div>
              </div>
            ))}
          </div>

          <button
            className="btn-primary"
            onClick={() => onComplete({ correct: correctCount, total: totalDangerous })}
          >
            Продолжить →
          </button>
        </motion.div>
      )}
    </div>
  );
}