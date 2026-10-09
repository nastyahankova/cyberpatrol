import { useState } from 'react';
import { motion } from 'framer-motion';
import { phishingInspect } from '../data/phishingInspect';
import './inspect.css';

export default function InspectEmail({ onComplete }) {
  const [selected, setSelected] = useState([]);
  const [finished, setFinished] = useState(false);

  const totalSuspicious = phishingInspect.parts.filter((p) => p.isSuspicious).length;

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

  const correctCount = phishingInspect.parts.filter(
    (p) => p.isSuspicious && selected.includes(p.id)
  ).length;

  return (
    <div className="inspect-game">
      <div className="inspect-header">
        <h2>🔍 Найди подозрительные элементы</h2>
        <p>
          Перед тобой письмо, которое пришло на почту. Нажми на те части, которые
          кажутся тебе подозрительными. Их может быть несколько.
        </p>
      </div>

      <div className="inspect-email">
        <div className="inspect-channel">
          {phishingInspect.icon} {phishingInspect.channel}
        </div>

        <div className="inspect-parts">
          {phishingInspect.parts.map((part) => {
            const isSelected = selected.includes(part.id);
            let className = 'inspect-part';
            if (isSelected) className += ' selected';

            if (finished) {
              if (part.isSuspicious && isSelected) className += ' correct';
              else if (part.isSuspicious && !isSelected) className += ' missed';
              else if (!part.isSuspicious && isSelected) className += ' wrong';
            }

            return (
              <motion.button
                key={part.id}
                className={className}
                onClick={() => handleClick(part.id)}
                whileHover={!finished ? { scale: 1.01, x: 4 } : {}}
                whileTap={!finished ? { scale: 0.99 } : {}}
                disabled={finished}
              >
                <div className="inspect-part-label">{part.label}</div>
                <div className="inspect-part-value">{part.value}</div>

                {finished && (
                  <div className="inspect-part-mark">
                    {part.isSuspicious && isSelected && '✅'}
                    {part.isSuspicious && !isSelected && '⚠️'}
                    {!part.isSuspicious && isSelected && '❌'}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {!finished ? (
        <button
          className="btn-primary inspect-check-btn"
          onClick={handleCheck}
          disabled={selected.length === 0}
        >
          Проверить ({selected.length} выбрано)
        </button>
      ) : (
        <motion.div
          className="inspect-feedback"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="inspect-feedback-title">
            {correctCount === totalSuspicious
              ? '🎉 Отлично! Ты нашёл все подозрительные элементы!'
              : `Ты нашёл ${correctCount} из ${totalSuspicious} подозрительных элементов`}
          </div>

          <div className="inspect-feedback-list">
            {phishingInspect.parts.map((part) => (
              <div key={part.id} className="inspect-feedback-item">
                <span className={`inspect-feedback-icon ${part.isSuspicious ? 'danger' : 'safe'}`}>
                  {part.isSuspicious ? '⚠️' : '✅'}
                </span>
                <div>
                  <div className="inspect-feedback-label">
                    <b>{part.label}:</b> {part.value}
                  </div>
                  <div className="inspect-feedback-reason">{part.reason}</div>
                </div>
              </div>
            ))}
          </div>

          <button
            className="btn-primary"
            onClick={() => onComplete({ correct: correctCount, total: totalSuspicious })}
          >
            Продолжить →
          </button>
        </motion.div>
      )}
    </div>
  );
}