import { motion } from 'framer-motion';
import { BLOCKS, loadProgress, isBlockUnlocked, getProgressPercent, resetProgress } from '../utils/progress';

export default function LevelSelect({ onSelect, onBack, onReset }) {
  const progress = loadProgress();
  const percent = getProgressPercent(progress);

  const handleReset = () => {
    if (confirm('Сбросить весь прогресс? Это действие нельзя отменить.')) {
      resetProgress();
      onReset();
    }
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
        <button className="reset-btn" onClick={handleReset}>
          Сбросить прогресс
        </button>
      </div>
    </div>
  );
}