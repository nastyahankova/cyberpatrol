import { useState } from 'react';
import { motion } from 'framer-motion';
import { posts } from '../data/privacyData';
import './feedbuilder.css';

export default function FeedBuilder({ onComplete }) {
  const [selected, setSelected] = useState([]);
  const [finished, setFinished] = useState(false);

  const totalSafe = posts.filter((p) => p.safe).length;

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

  const correctCount = posts.filter((p) => p.safe && selected.includes(p.id)).length;

  return (
    <div className="fb-game">
      <div className="fb-header">
        <h2>📱 Собери свою ленту</h2>
        <p>
          Перед тобой 10 постов. Нажми на те, которые <b>можно публиковать</b> —
          они добавятся в твою ленту. Опасные посты лучше не выкладывать.
        </p>
      </div>

      <div className="fb-pool">
        <div className="fb-pool-label">
          Посты ({selected.length} выбрано из {posts.length})
        </div>
        <div className="fb-pool-list">
          {posts.map((post) => {
            const isSelected = selected.includes(post.id);
            let className = 'fb-post';
            if (isSelected) className += ' selected';

            if (finished) {
              if (post.safe && isSelected) className += ' correct';
              else if (post.safe && !isSelected) className += ' missed';
              else if (!post.safe && isSelected) className += ' wrong';
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
                <div className="fb-post-image">{post.icon}</div>
                <div className="fb-post-content">
                  <div className="fb-post-caption">{post.caption}</div>
                  <div className="fb-post-desc">{post.description}</div>
                </div>

                {finished && (
                  <div className="fb-post-mark">
                    {post.safe && isSelected && '✅'}
                    {post.safe && !isSelected && '⚠️'}
                    {!post.safe && isSelected && '❌'}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {!finished ? (
        <button
          className="btn-primary fb-check-btn"
          onClick={handleCheck}
          disabled={selected.length === 0}
        >
          Опубликовать выбранное ({selected.length})
        </button>
      ) : (
        <motion.div
          className="fb-feedback"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="fb-feedback-title">
            {correctCount === totalSafe && selected.length === totalSafe
              ? '🎉 Идеально! Ты собрал безопасную ленту!'
              : `Правильно выбрано: ${correctCount} из ${totalSafe} безопасных постов`}
          </div>

          <div className="fb-feedback-list">
            {posts.map((p) => (
              <div key={p.id} className="fb-feedback-item">
                <span className={`fb-feedback-icon ${p.safe ? 'safe' : 'danger'}`}>
                  {p.safe ? '✅' : '⚠️'}
                </span>
                <div>
                  <div className="fb-feedback-label">
                    {p.icon} <b>{p.caption}</b>
                  </div>
                  <div className="fb-feedback-reason">{p.reason}</div>
                </div>
              </div>
            ))}
          </div>

          <button
            className="btn-primary"
            onClick={() => onComplete({ correct: correctCount, total: totalSafe })}
          >
            Продолжить →
          </button>
        </motion.div>
      )}
    </div>
  );
}