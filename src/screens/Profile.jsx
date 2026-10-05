import { motion } from 'framer-motion';
import {
  BLOCKS,
  loadProgress,
  getProgressPercent,
  getAverageScore,
  getAchievements,
} from '../utils/progress';
import './Profile.css';

export default function Profile({ onBack, onLevels }) {
  const progress = loadProgress();
  const percent = getProgressPercent(progress);
  const average = getAverageScore(progress);
  const achievements = getAchievements(progress);
  const blocksToShow = BLOCKS.filter(b => b.id !== 'intro');

  const rank = progress.finalBattle?.rank || 'Новичок';

  return (
    <div className="profile-screen">
      <div className="profile-bg" />

      <button className="back-btn-inline" onClick={onBack}>← На главную</button>

      <motion.div
        className="profile-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="profile-header">
          <div className="profile-avatar">🛡️</div>
          <h1 className="profile-title">Мой профиль</h1>
          <p className="profile-subtitle">
            {progress.completed.length === 0
              ? 'Ты ещё не начал миссии. Пора это исправить!'
              : `Ты прошёл ${progress.completed.filter(id => id !== 'intro').length} из ${blocksToShow.length} миссий`}
          </p>
        </div>

        {/* Большая карточка прогресса */}
        <div className="profile-card profile-progress-card">
          <div className="profile-progress-top">
            <div>
              <div className="profile-label">Общий прогресс</div>
              <div className="profile-percent">{percent}%</div>
            </div>
            <div className="profile-rank">
              <div className="profile-label">Текущий ранг</div>
              <div className="profile-rank-value">{rank}</div>
            </div>
          </div>
          <div className="profile-bar">
            <motion.div
              className="profile-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </div>

        {/* Средний результат */}
        {average > 0 && (
          <div className="profile-card">
            <div className="profile-card-title">📊 Средний результат</div>
            <div className="profile-average">
              <div className="profile-average-value">{average}%</div>
              <div className="profile-average-desc">правильных ответов по всем миссиям</div>
            </div>
          </div>
        )}

        {/* Достижения */}
        <div className="profile-card">
          <div className="profile-card-title">🏅 Достижения</div>
          {achievements.length === 0 ? (
            <p className="profile-empty">
              Пока достижений нет. Проходи миссии, чтобы их открыть!
            </p>
          ) : (
            <div className="profile-achievements">
              {achievements.map((a) => (
                <motion.div
                  key={a.id}
                  className="profile-achievement"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <div className="profile-achievement-icon">{a.icon}</div>
                  <div className="profile-achievement-title">{a.title}</div>
                  <div className="profile-achievement-desc">{a.desc}</div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Результаты по блокам */}
        <div className="profile-card">
          <div className="profile-card-title">📚 Результаты по миссиям</div>
          <div className="profile-blocks-list">
            {blocksToShow.map((block, i) => {
              const r = progress.results[block.id];
              const done = progress.completed.includes(block.id);
              const percentBlock = r ? Math.round((r.correct / r.total) * 100) : 0;

              return (
                <motion.div
                  key={block.id}
                  className={`profile-block-row ${done ? 'done' : 'not-done'}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <div className="profile-block-icon">{block.icon}</div>
                  <div className="profile-block-info">
                    <div className="profile-block-title">{block.title}</div>
                    {done ? (
                      <div className="profile-block-bar">
                        <div
                          className="profile-block-bar-fill"
                          style={{ width: `${percentBlock}%` }}
                        />
                      </div>
                    ) : (
                      <div className="profile-block-locked">🔒 Закрыто</div>
                    )}
                  </div>
                  <div className="profile-block-score">
                    {r ? `${r.correct}/${r.total}` : '—'}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Финальная битва */}
        {progress.finalBattle && (
          <div className="profile-card profile-final-card">
            <div className="profile-card-title">⚔️ Финальная битва</div>
            <div className="profile-final-info">
              <div className="profile-final-score">
                {progress.finalBattle.correct} / {progress.finalBattle.total}
              </div>
              <div className="profile-final-rank">{progress.finalBattle.rank}</div>
            </div>
          </div>
        )}

        {/* Кнопки */}
        <div className="profile-actions">
          <button className="btn-primary" onClick={onLevels}>
            🎮 К миссиям
          </button>
          <button className="btn-secondary" onClick={onBack}>
            На главную
          </button>
        </div>
      </motion.div>
    </div>
  );
}