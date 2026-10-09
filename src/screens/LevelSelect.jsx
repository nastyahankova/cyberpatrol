import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BLOCKS, loadProgress, isBlockUnlocked, getProgressPercent, resetProgress } from '../utils/progress';

export default function LevelSelect({ onSelect, onBack, onReset }) {
  const progress = loadProgress();
  const percent = getProgressPercent(progress);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleResetClick = () => {
    setShowConfirm(true);
  };

  const confirmReset = () => {
    resetProgress();
    onReset();
    setShowConfirm(false);
  };

  const cancelReset = () => {
    setShowConfirm(false);
  };

  return (
    <div className="level-select">
      <div className="level-header">
        <button className="back-btn-inline" onClick={onBack}>← На главную</button>
        <h1>Карта миссий</h1>
        <div className="level-progress-info">
          <span>Прогресс: {percent}%</span>
          <div className="level-progress-bar">
            <div className="level-progress-fill" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </div>

      <div className="level-grid">
        {BLOCKS.map((block, i) => {
          const isIntro = block.id === 'intro';
          const done = progress.completed.includes(block.id);
          const unlocked = isIntro || isBlockUnlocked(block.id, progress);

          let status = 'locked';
          if (done) status = 'done';
          else if (unlocked) status = 'available';

          return (
            <motion.button
              key={block.id}
              className={`level-card level-${status}`}
              onClick={() => unlocked && onSelect(block.id)}
              disabled={!unlocked}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={unlocked ? { scale: 1.03, y: -4 } : {}}
              whileTap={unlocked ? { scale: 0.98 } : {}}
            >
              <div className="level-num">{i === 0 ? '★' : i}</div>
              <div className="level-icon">{block.icon}</div>
              <div className="level-title">{block.title}</div>
              <div className="level-status">
                {status === 'done' && '✅ Пройдено'}
                {status === 'available' && '▶ Играть'}
                {status === 'locked' && '🔒 Закрыто'}
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="level-footer">
        <button className="reset-btn" onClick={handleResetClick}>
          Сбросить прогресс
        </button>
      </div>

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="reset-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cancelReset}
          >
            <motion.div
              className="reset-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="reset-icon">⚠️</div>
              <h2>Сбросить прогресс?</h2>
              <p>
                Все пройденные миссии, результаты и достижения будут удалены.
                Это действие нельзя отменить.
              </p>
              <div className="reset-actions">
                <button className="btn-secondary" onClick={cancelReset}>
                  Отмена
                </button>
                <button className="btn-danger" onClick={confirmReset}>
                  Сбросить
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}