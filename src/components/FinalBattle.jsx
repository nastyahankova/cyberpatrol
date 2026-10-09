import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { finalBattle } from '../data/finalBattleData';
import './finalbattle.css';

function DraggableItem({ id, text, index, finished, isCorrect }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id, disabled: finished });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  let className = 'fbt-drag-item';
  if (isDragging) className += ' dragging';
  if (finished) className += isCorrect ? ' correct' : ' wrong';

  return (
    <div ref={setNodeRef} style={style} className={className} {...attributes} {...listeners}>
      <div className="fbt-drag-handle">⋮⋮</div>
      <div className="fbt-drag-pos">{index + 1}</div>
      <div className="fbt-drag-text">{text}</div>
      {finished && <div className="fbt-drag-mark">{isCorrect ? '✅' : '❌'}</div>}
    </div>
  );
}

export default function FinalBattle({ onComplete }) {
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [placed, setPlaced] = useState({});
  const [selectedSortItem, setSelectedSortItem] = useState(null);
  const [dragItems, setDragItems] = useState([]);
  const [hp, setHp] = useState(10);
  const [hitEffect, setHitEffect] = useState(false);
  const feedbackRef = useRef(null);

  const total = finalBattle.length;
  const current = finalBattle[index];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  useEffect(() => {
    if (current.type === 'drag-order') {
      const shuffled = [...current.steps];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setDragItems(shuffled);
    }
  }, [index, current.type]);

  useEffect(() => {
    if (answer && feedbackRef.current) {
      setTimeout(() => {
        feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [answer]);

  const dealDamage = () => {
    setHitEffect(true);
    setTimeout(() => setHitEffect(false), 800);
    setHp((prev) => Math.max(0, prev - 1));
  };

  const handleBinary = (choice) => {
    if (answer) return;
    setAnswer(choice);
    const isCorrect =
      (choice === 'safe' && current.safe) || (choice === 'danger' && !current.safe);
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
      dealDamage();
    }
  };

  const handleTriple = (option) => {
    if (answer) return;
    setAnswer(option.value);
    if (option.correct) {
      setCorrectCount((c) => c + 1);
      dealDamage();
    }
  };

  const handlePickPassword = (item) => {
    if (answer) return;
    setAnswer(item.id);
    if (item.isWeak) {
      setCorrectCount((c) => c + 1);
      dealDamage();
    }
  };

  const handleMultiClick = (id) => {
    if (answer) return;
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectSortItem = (item) => {
    if (answer || placed[item.id]) return;
    setSelectedSortItem(item);
  };

  const handlePlace = (category) => {
    if (!selectedSortItem) return;
    setPlaced((prev) => ({ ...prev, [selectedSortItem.id]: category }));
    setSelectedSortItem(null);
  };

  const handleUndo = (id) => {
    if (answer) return;
    setPlaced((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleDragEnd = (event) => {
    if (answer) return;
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setDragItems((prev) => {
        const oldIndex = prev.findIndex((i) => i.id === active.id);
        const newIndex = prev.findIndex((i) => i.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const handleCheckMulti = () => {
    setAnswer('multi');
    let correct = 0;
    let totalCorrect = 0;
    if (current.type === 'find-mistake-in-email') {
      correct = current.parts.filter((p) => p.isSuspicious && selectedItems.includes(p.id)).length;
      totalCorrect = current.parts.filter((p) => p.isSuspicious).length;
    } else if (current.type === 'delete-extra') {
      correct = current.items.filter((i) => i.isDangerous && selectedItems.includes(i.id)).length;
      totalCorrect = current.items.filter((i) => i.isDangerous).length;
    } else if (current.type === 'detective') {
      correct = current.messages.filter((m) => m.isBullying && selectedItems.includes(m.id)).length;
      totalCorrect = current.messages.filter((m) => m.isBullying).length;
    } else if (current.type === 'find-scammer') {
      correct = current.messages.filter((m) => m.isScammer && selectedItems.includes(m.id)).length;
      totalCorrect = current.messages.filter((m) => m.isScammer).length;
    }
    const wrongPicks = selectedItems.length - correct;
    const isPerfect = correct === totalCorrect && wrongPicks === 0;
    if (isPerfect) {
      setCorrectCount((c) => c + 1);
      dealDamage();
    }
  };

  const handleCheckSorting = () => {
    setAnswer('sorting');
    const correct = current.items.filter((item) => {
      const cat = placed[item.id];
      return (
        (item.isDangerous && cat === 'danger') ||
        (!item.isDangerous && cat === 'safe')
      );
    }).length;
    const isPerfect = correct === current.items.length;
    if (isPerfect) {
      setCorrectCount((c) => c + 1);
      dealDamage();
    }
  };

  const handleCheckDrag = () => {
    setAnswer('drag');
    const correct = dragItems.filter(
      (item, idx) => item.correctPosition === idx + 1
    ).length;
    const isPerfect = correct === dragItems.length;
    if (isPerfect) {
      setCorrectCount((c) => c + 1);
      dealDamage();
    }
  };

  const handleNext = () => {
    if (index < total - 1) {
      setIndex(index + 1);
      setAnswer(null);
      setSelectedItems([]);
      setPlaced({});
      setSelectedSortItem(null);
      setDragItems([]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onComplete({ correct: correctCount, total, hp });
    }
  };

  const renderAnswerFeedback = () => {
    if (!answer) return null;

    let isCorrect = false;
    let reason = '';
    let title = '';

    if (current.type === 'binary') {
      isCorrect =
        (answer === 'safe' && current.safe) || (answer === 'danger' && !current.safe);
      reason = current.reason;
      title = isCorrect ? '⚔️ Удар нанесён! Фантом потерял 1 HP' : '❌ Промах. Фантом не пострадал';
    } else if (current.type === 'triple') {
      const chosen = current.options.find((o) => o.value === answer);
      isCorrect = chosen.correct;
      reason = chosen.reason;
      title = isCorrect ? '⚔️ Удар нанесён! Фантом потерял 1 HP' : '❌ Промах. Фантом не пострадал';
    } else if (current.type === 'pick-worst-password') {
      const chosen = current.items.find((i) => i.id === answer);
      const weakItem = current.items.find((i) => i.isWeak);
      isCorrect = chosen.isWeak;
      reason = isCorrect
        ? `Правильно! «${chosen.value}» — слишком простой пароль. Ты получил доступ к серверу Фантома.`
        : `Ты выбрал «${chosen.value}», но этот пароль не самый слабый. Самый слабый — «${weakItem.value}». Фантом не пострадал.`;
      title = isCorrect ? '⚔️ Удар нанесён! Фантом потерял 1 HP' : '❌ Промах. Фантом не пострадал';
    } else if (answer === 'multi') {
      let correct = 0;
      let totalCorrect = 0;
      if (current.type === 'find-mistake-in-email') {
        correct = current.parts.filter((p) => p.isSuspicious && selectedItems.includes(p.id)).length;
        totalCorrect = current.parts.filter((p) => p.isSuspicious).length;
      } else if (current.type === 'delete-extra') {
        correct = current.items.filter((i) => i.isDangerous && selectedItems.includes(i.id)).length;
        totalCorrect = current.items.filter((i) => i.isDangerous).length;
      } else if (current.type === 'detective') {
        correct = current.messages.filter((m) => m.isBullying && selectedItems.includes(m.id)).length;
        totalCorrect = current.messages.filter((m) => m.isBullying).length;
      } else if (current.type === 'find-scammer') {
        correct = current.messages.filter((m) => m.isScammer && selectedItems.includes(m.id)).length;
        totalCorrect = current.messages.filter((m) => m.isScammer).length;
      }
      const wrongPicks = selectedItems.length - correct;
      isCorrect = correct === totalCorrect && wrongPicks === 0;
      title = isCorrect
        ? '⚔️ Удар нанесён! Фантом потерял 1 HP'
        : `❌ Промах. Фантом не пострадал (правильно: ${correct} из ${totalCorrect}${wrongPicks > 0 ? `, лишних: ${wrongPicks}` : ''})`;
      reason = 'Смотри разбор ниже.';
    } else if (answer === 'sorting') {
      const correct = current.items.filter((item) => {
        const cat = placed[item.id];
        return (item.isDangerous && cat === 'danger') || (!item.isDangerous && cat === 'safe');
      }).length;
      isCorrect = correct === current.items.length;
      title = isCorrect
        ? '⚔️ Удар нанесён! Фантом потерял 1 HP'
        : `❌ Промах. Фантом не пострадал (правильно: ${correct} из ${current.items.length})`;
      reason = 'Смотри разбор ниже.';
    } else if (answer === 'drag') {
      const correct = dragItems.filter((item, idx) => item.correctPosition === idx + 1).length;
      isCorrect = correct === dragItems.length;
      title = isCorrect
        ? '⚔️ Удар нанесён! Фантом потерял 1 HP'
        : `❌ Промах. Фантом не пострадал (правильно: ${correct} из ${dragItems.length})`;
      reason = 'Смотри правильный порядок ниже.';
    }

    return (
      <motion.div
        ref={feedbackRef}
        className={`fbt-feedback ${isCorrect ? 'correct' : 'wrong'}`}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="fbt-feedback-title">{title}</div>
        <p className="fbt-feedback-reason">{reason}</p>

        {current.type === 'find-mistake-in-email' && (
          <div className="fbt-feedback-list">
            {current.parts.map((p) => (
              <div key={p.id} className="fbt-feedback-item">
                <span className={`fbt-feedback-icon ${p.isSuspicious ? 'danger' : 'safe'}`}>
                  {p.isSuspicious ? '⚠️' : '✅'}
                </span>
                <div>
                  <div className="fbt-feedback-label"><b>{p.label}:</b> {p.value}</div>
                  <div className="fbt-feedback-reason-small">{p.reason}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {current.type === 'delete-extra' && (
          <div className="fbt-feedback-list">
            {current.items.map((i) => (
              <div key={i.id} className="fbt-feedback-item">
                <span className={`fbt-feedback-icon ${i.isDangerous ? 'danger' : 'safe'}`}>
                  {i.isDangerous ? '⚠️' : '✅'}
                </span>
                <div>
                  <div className="fbt-feedback-label">{i.icon ? `${i.icon} ` : ''}{i.value}</div>
                  <div className="fbt-feedback-reason-small">{i.reason}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {current.type === 'sorting' && (
          <div className="fbt-feedback-list">
            {current.items.map((i) => (
              <div key={i.id} className="fbt-feedback-item">
                <span className={`fbt-feedback-icon ${i.isDangerous ? 'danger' : 'safe'}`}>
                  {i.isDangerous ? '⚠️' : '✅'}
                </span>
                <div>
                  <div className="fbt-feedback-label">{i.icon ? `${i.icon} ` : ''}{i.value}</div>
                  <div className="fbt-feedback-reason-small">{i.reason}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {current.type === 'detective' && (
          <div className="fbt-feedback-list">
            {current.messages.map((m) => (
              <div key={m.id} className="fbt-feedback-item">
                <span className={`fbt-feedback-icon ${m.isBullying ? 'danger' : 'safe'}`}>
                  {m.isBullying ? '⚠️' : '✅'}
                </span>
                <div>
                  <div className="fbt-feedback-label"><b>{m.nickname}:</b> {m.text}</div>
                  <div className="fbt-feedback-reason-small">{m.reason}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {current.type === 'find-scammer' && (
          <div className="fbt-feedback-list">
            {current.messages.map((m) => (
              <div key={m.id} className="fbt-feedback-item">
                <span className={`fbt-feedback-icon ${m.isScammer ? 'danger' : 'safe'}`}>
                  {m.isScammer ? '⚠️' : '✅'}
                </span>
                <div>
                  <div className="fbt-feedback-label"><b>{m.nickname}:</b> {m.text}</div>
                  <div className="fbt-feedback-reason-small">{m.reason}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {current.type === 'drag-order' && (
          <div className="fbt-feedback-list">
            {current.steps
              .slice()
              .sort((a, b) => a.correctPosition - b.correctPosition)
              .map((s) => (
                <div key={s.id} className="fbt-feedback-item">
                  <span className="fbt-feedback-num">{s.correctPosition}</span>
                  <div>
                    <div className="fbt-feedback-label">{s.text}</div>
                    <div className="fbt-feedback-reason-small">{s.reason}</div>
                  </div>
                </div>
              ))}
          </div>
        )}

        <button className="btn-primary" onClick={handleNext}>
          {index < total - 1 ? 'Дальше →' : 'Завершить битву'}
        </button>
      </motion.div>
    );
  };

  const renderTask = () => {
    if (current.type === 'binary') {
      return (
        <div className="fbt-buttons">
          <motion.button
            className="fbt-btn safe"
            onClick={() => handleBinary('safe')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={!!answer}
          >
            ✅ Безопасно
          </motion.button>
          <motion.button
            className="fbt-btn danger"
            onClick={() => handleBinary('danger')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={!!answer}
          >
            ⚠️ Опасно
          </motion.button>
        </div>
      );
    }

    if (current.type === 'triple') {
      return (
        <div className="fbt-options">
          {current.options.map((opt) => {
            const isChosen = answer === opt.value;
            const showResult = answer !== null;
            let className = 'fbt-option';
            if (showResult && isChosen) {
              className += opt.correct ? ' chosen-correct' : ' chosen-wrong';
            } else if (showResult && opt.correct) {
              className += ' highlight-correct';
            }
            return (
              <button
                key={opt.value}
                className={className}
                onClick={() => handleTriple(opt)}
                disabled={answer !== null}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      );
    }

    if (current.type === 'pick-worst-password') {
      return (
        <div className="fbt-options">
          {current.items.map((item) => {
            const isChosen = answer === item.id;
            const showResult = answer !== null;
            let className = 'fbt-option fbt-password';
            if (showResult && isChosen) {
              className += item.isWeak ? ' chosen-correct' : ' chosen-wrong';
            } else if (showResult && item.isWeak) {
              className += ' highlight-correct';
            }
            return (
              <button
                key={item.id}
                className={className}
                onClick={() => handlePickPassword(item)}
                disabled={answer !== null}
              >
                {item.value}
              </button>
            );
          })}
        </div>
      );
    }

    if (current.type === 'find-mistake-in-email') {
      return (
        <>
          <div className="fbt-parts">
            {current.parts.map((part) => {
              const isSelected = selectedItems.includes(part.id);
              let className = 'fbt-part';
              if (isSelected) className += ' selected';
              return (
                <motion.button
                  key={part.id}
                  className={className}
                  onClick={() => handleMultiClick(part.id)}
                  whileHover={!answer ? { scale: 1.01, x: 4 } : {}}
                  disabled={!!answer}
                >
                  <div className="fbt-part-label">{part.label}</div>
                  <div className="fbt-part-value">{part.value}</div>
                </motion.button>
              );
            })}
          </div>
          {!answer && (
            <button
              className="btn-primary fbt-check-btn"
              onClick={handleCheckMulti}
              disabled={selectedItems.length === 0}
            >
              Проверить ({selectedItems.length})
            </button>
          )}
        </>
      );
    }

    if (current.type === 'delete-extra') {
      return (
        <>
          <div className="fbt-posts">
            {current.items.map((item) => {
              const isSelected = selectedItems.includes(item.id);
              let className = 'fbt-post';
              if (isSelected) className += ' selected';
              return (
                <motion.button
                  key={item.id}
                  className={className}
                  onClick={() => handleMultiClick(item.id)}
                  whileHover={!answer ? { scale: 1.02 } : {}}
                  disabled={!!answer}
                >
                  {item.icon ? `${item.icon} ` : ''}{item.value}
                </motion.button>
              );
            })}
          </div>
          {!answer && (
            <button
              className="btn-primary fbt-check-btn"
              onClick={handleCheckMulti}
              disabled={selectedItems.length === 0}
            >
              Проверить ({selectedItems.length})
            </button>
          )}
        </>
      );
    }

    if (current.type === 'sorting') {
      const unplaced = current.items.filter((i) => !placed[i.id]);
      const allPlaced = current.items.every((i) => placed[i.id]);
      return (
        <>
          <div className="fbt-sort-pool">
            {unplaced.map((item) => (
              <motion.button
                key={item.id}
                className={`fbt-sort-item ${selectedSortItem?.id === item.id ? 'selected' : ''}`}
                onClick={() => handleSelectSortItem(item)}
                whileHover={!answer ? { scale: 1.02 } : {}}
                disabled={!!answer}
              >
                {item.icon ? `${item.icon} ` : ''}{item.value}
              </motion.button>
            ))}
            {unplaced.length === 0 && !answer && (
              <div className="fbt-sort-empty">Все распределены</div>
            )}
          </div>

          {selectedSortItem && !answer && (
            <div className="fbt-sort-actions">
              <button className="fbt-btn safe" onClick={() => handlePlace('safe')}>
                ✅ Безопасный
              </button>
              <button className="fbt-btn danger" onClick={() => handlePlace('danger')}>
                ⚠️ Опасный
              </button>
            </div>
          )}

          <div className="fbt-columns">
            <div className="fbt-column safe-col">
              <div className="fbt-col-header">✅ Безопасные</div>
              {current.items
                .filter((i) => placed[i.id] === 'safe')
                .map((i) => (
                  <div
                    key={i.id}
                    className="fbt-col-item"
                    onClick={() => !answer && handleUndo(i.id)}
                  >
                    {i.icon ? `${i.icon} ` : ''}{i.value}
                  </div>
                ))}
            </div>
            <div className="fbt-column danger-col">
              <div className="fbt-col-header">⚠️ Опасные</div>
              {current.items
                .filter((i) => placed[i.id] === 'danger')
                .map((i) => (
                  <div
                    key={i.id}
                    className="fbt-col-item"
                    onClick={() => !answer && handleUndo(i.id)}
                  >
                    {i.icon ? `${i.icon} ` : ''}{i.value}
                  </div>
                ))}
            </div>
          </div>

          {!answer && (
            <button
              className="btn-primary fbt-check-btn"
              onClick={handleCheckSorting}
              disabled={!allPlaced}
            >
              Проверить
            </button>
          )}
        </>
      );
    }

    if (current.type === 'detective' || current.type === 'find-scammer') {
      return (
        <>
          <div className="fbt-chat">
            {current.messages.map((msg) => {
              const isSelected = selectedItems.includes(msg.id);
              let className = 'fbt-message';
              if (isSelected) className += ' selected';
              return (
                <motion.button
                  key={msg.id}
                  className={className}
                  onClick={() => handleMultiClick(msg.id)}
                  whileHover={!answer ? { scale: 1.01, x: 4 } : {}}
                  disabled={!!answer}
                >
                  <div className="fbt-msg-avatar">{msg.avatar}</div>
                  <div className="fbt-msg-content">
                    <div className="fbt-msg-nick">{msg.nickname}</div>
                    <div className="fbt-msg-text">{msg.text}</div>
                  </div>
                </motion.button>
              );
            })}
          </div>
          {!answer && (
            <button
              className="btn-primary fbt-check-btn"
              onClick={handleCheckMulti}
              disabled={selectedItems.length === 0}
            >
              Проверить ({selectedItems.length})
            </button>
          )}
        </>
      );
    }

    if (current.type === 'drag-order') {
      return (
        <>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={dragItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              <div className="fbt-drag-list">
                {dragItems.map((item, idx) => (
                  <DraggableItem
                    key={item.id}
                    id={item.id}
                    text={item.text}
                    index={idx}
                    finished={!!answer}
                    isCorrect={item.correctPosition === idx + 1}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          {!answer && (
            <button className="btn-primary fbt-check-btn" onClick={handleCheckDrag}>
              Проверить
            </button>
          )}
        </>
      );
    }

    return null;
  };

  return (
    <div className="fbt-game">
      <div className="fbt-header">
        <div className="fbt-vs">
          <motion.div
            className={`fbt-hacker-avatar ${hitEffect ? 'hit' : ''}`}
            animate={hitEffect ? { x: [0, -8, 8, -6, 6, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <img src="/hacker.png" alt="Фантом" />
          </motion.div>
          <div className="fbt-info">
            <div className="fbt-name">Фантом</div>
            <div className="fbt-hp-bar">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`fbt-hp-cell ${i < hp ? 'alive' : 'dead'}`}
                />
              ))}
            </div>
            <div className="fbt-hp-label">HP: {hp} / 10</div>
          </div>
        </div>
        <div className="fbt-score">
          <div className="fbt-score-label">Раунд</div>
          <div className="fbt-score-value">{index + 1} / {total}</div>
          <div className="fbt-score-label">Верно</div>
          <div className="fbt-score-value">{correctCount}</div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          className="fbt-card"
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -60, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="fbt-icon">{current.icon}</div>
          <h3 className="fbt-title">{current.title}</h3>
          <p className="fbt-text">{current.text}</p>
        </motion.div>
      </AnimatePresence>

      {!answer && renderTask()}
      {renderAnswerFeedback()}
    </div>
  );
}