import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { posts } from '../data/privacyData';
import './PostsGame.css';

export default function PostsGame({ onComplete }) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);

  const total = posts.length;
  const current = posts[index];

  const handleAnswer = (choice) => {
    if (answer) return;
    setAnswer(choice);
    const isCorrect =
      (choice === 'publish' && current.safe) ||
      (choice === 'hide' && !current.safe);
    if (isCorrect) setCorrectCount((c) => c + 1);
  };

  const handleNext = () => {
    if (index < total - 1) {
      setIndex(index + 1);
      setAnswer(null);
    } else {
      onComplete(correctCount + (isLastCorrect() ? 1 : 0));
    }
  };

  const isLastCorrect = () => {
    if (!answer) return false;
    return (
      (answer === 'publish' && current.safe) ||
      (answer === 'hide' && !current.safe)
    );
  };

  const isCorrect = answer && (
    (answer === 'publish' && current.safe) ||
    (answer === 'hide' && !current.safe)
  );

  return (
    <div className="posts-game">
      <div className="posts-header">
        <h2>📸 Что можно публиковать?</h2>
        <p>Реши, безопасна ли эта публикация. Если сомневаешься — лучше скрыть.</p>
        <div className="posts-progress">
          Пост {index + 1} / {total}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          className="post-card"
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -60, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="post-image">
            <span className="post-icon">{current.icon}</span>
          </div>
          <div className="post-caption">{current.caption}</div>
          <div className="post-description">{current.description}</div>
        </motion.div>
      </AnimatePresence>

      {!answer ? (
        <div className="posts-buttons">
          <motion.button
            className="posts-btn hide"
            onClick={() => handleAnswer('hide')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            🙈 Скрыть
          </motion.button>
          <motion.button
            className="posts-btn publish"
            onClick={() => handleAnswer('publish')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            📤 Опубликовать
          </motion.button>
        </div>
      ) : (
        <motion.div
          className={`posts-feedback ${isCorrect ? 'correct' : 'wrong'}`}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="posts-feedback-title">
            {isCorrect ? '✅ Верно!' : '❌ Ошибка'}
          </div>
          <div className="posts-feedback-truth">
            {current.safe ? 'Эту публикацию можно выложить.' : 'Эту публикацию лучше скрыть.'}
          </div>
          <p className="posts-feedback-reason">{current.reason}</p>
          <button className="btn-primary" onClick={handleNext}>
            {index < total - 1 ? 'Следующий пост →' : 'Завершить'}
          </button>
        </motion.div>
      )}
    </div>
  );
}