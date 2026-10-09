import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BLOCKS,
  loadProgress,
  getProgressPercent,
  getAverageScore,
  getAchievements,
} from '../utils/progress';
import './profilemodal.css';

export default function ProfileModal({ onClose }) {
  const progress = loadProgress();
  const percent = getProgressPercent(progress);
  const average = getAverageScore(progress);
  const achievements = getAchievements(progress);
  const blocksToShow = BLOCKS.filter((b) => b.id !== 'intro');

  const blocksDone = progress.completed.filter((id) => id !== 'intro').length;

  const getRankByProgress = () => {
    if (progress.finalBattle?.rank) {
      return progress.finalBattle.rank;
    }
    if (blocksDone >= 9) return 'Легенда КиберПатруля';
    if (blocksDone >= 6) return 'Киберзащитник';
    if (blocksDone >= 3) return 'Патрульный';
    return 'Новичок';
  };

  const rank = getRankByProgress();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <motion.div
      className="pm-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="pm-modal"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="pm-close"
          onClick={onClose}
          aria-label="Закрыть"
          type="button"
        >
          ✕
        </button>

        <div className="pm-header">
          <div className="pm-avatar">🛡️</div>
          <h2>Мой профиль</h2>
          <p>
            {progress.completed.length === 0
              ? 'Ты ещё не начал миссии'
              : `Пройдено ${blocksDone} из ${blocksToShow.length} миссий`}
          </p>
        </div>

        <div className="pm-card pm-progress-card">
          <div className="pm-progress-top">
            <div>
              <div className="pm-label">Общий прогресс</div>
              <div className="pm-percent">{percent}%</div>
            </div>
            <div className="pm-rank">
              <div className="pm-label">Текущий ранг</div>
              <div className="pm-rank-value">{rank}</div>
            </div>
          </div>
          <div className="pm-bar">
            <motion.div
              className="pm-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </div>

        {average > 0 && (
          <div className="pm-card">
            <div className="pm-card-title">📊 Средний результат</div>
            <div className="pm-average">
              <div className="pm-average-value">{average}%</div>
              <div className="pm-average-desc">правильных ответов</div>
            </div>
          </div>
        )}

        <div className="pm-card">
          <div className="pm-card-title">🏅 Достижения</div>
          {achievements.length === 0 ? (
            <p className="pm-empty">Пока достижений нет. Проходи миссии, чтобы их открыть!</p>
          ) : (
            <div className="pm-achievements">
              {achievements.map((a) => (
                <div key={a.id} className="pm-achievement">
                  <div className="pm-achievement-icon">{a.icon}</div>
                  <div className="pm-achievement-title">{a.title}</div>
                  <div className="pm-achievement-desc">{a.desc}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pm-card">
          <div className="pm-card-title">📚 Результаты по миссиям</div>
          <div className="pm-blocks-list">
            {blocksToShow.map((block) => {
              const r = progress.results[block.id];
              const done = progress.completed.includes(block.id);
              const percentBlock = r ? Math.round((r.correct / r.total) * 100) : 0;

              return (
                <div
                  key={block.id}
                  className={`pm-block-row ${done ? 'done' : 'not-done'}`}
                >
                  <div className="pm-block-icon">{block.icon}</div>
                  <div className="pm-block-info">
                    <div className="pm-block-title">{block.title}</div>
                    {done ? (
                      <div className="pm-block-bar">
                        <div
                          className="pm-block-bar-fill"
                          style={{ width: `${percentBlock}%` }}
                        />
                      </div>
                    ) : (
                      <div className="pm-block-locked">🔒 Закрыто</div>
                    )}
                  </div>
                  <div className="pm-block-score">
                    {r ? `${r.correct}/${r.total}` : '—'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {progress.finalBattle && (
          <div className="pm-card pm-final-card">
            <div className="pm-card-title">⚔️ Финальная битва</div>
            <div className="pm-final-info">
              <div className="pm-final-score">
                {progress.finalBattle.correct} / {progress.finalBattle.total}
              </div>
              <div className="pm-final-rank">{progress.finalBattle.rank}</div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}