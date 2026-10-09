import { useState } from 'react';
import { motion } from 'framer-motion';
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
import { phoneLostSteps } from '../data/mobileData';
import './dragorder.css';

function SortableItem({ id, text, index, finished, isCorrectPosition }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id, disabled: finished });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  let className = 'drag-item';
  if (isDragging) className += ' dragging';
  if (finished) className += isCorrectPosition ? ' correct' : ' wrong';

  return (
    <div ref={setNodeRef} style={style} className={className} {...attributes} {...listeners}>
      <div className="drag-handle">⋮⋮</div>
      <div className="drag-position">{index + 1}</div>
      <div className="drag-text">{text}</div>
      {finished && (
        <div className="drag-mark">{isCorrectPosition ? '✅' : '❌'}</div>
      )}
    </div>
  );
}

export default function DragOrder({ onComplete }) {
  const [items, setItems] = useState(() => {
    const shuffled = [...phoneLostSteps];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });
  const [finished, setFinished] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((prev) => {
        const oldIndex = prev.findIndex((i) => i.id === active.id);
        const newIndex = prev.findIndex((i) => i.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const handleCheck = () => {
    setFinished(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isCorrectPosition = (id, position) => {
    const step = phoneLostSteps.find((s) => s.id === id);
    return step.correctPosition === position + 1;
  };

  const correctCount = items.filter((item, index) =>
    isCorrectPosition(item.id, index)
  ).length;

  return (
    <div className="drag-game">
      <div className="drag-header">
        <h2>🔄 Расставь шаги по порядку</h2>
        <p>
          Ты потерял телефон. Перетащи шаги так, чтобы они шли в правильной
          последовательности — от первого действия к последнему.
        </p>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="drag-list">
            {items.map((item, index) => (
              <SortableItem
                key={item.id}
                id={item.id}
                text={item.text}
                index={index}
                finished={finished}
                isCorrectPosition={isCorrectPosition(item.id, index)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {!finished ? (
        <button className="btn-primary drag-check-btn" onClick={handleCheck}>
          Проверить
        </button>
      ) : (
        <motion.div
          className="drag-feedback"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="drag-feedback-title">
            {correctCount === phoneLostSteps.length
              ? '🎉 Идеально! Ты расставил все шаги правильно!'
              : `Правильно: ${correctCount} из ${phoneLostSteps.length}`}
          </div>

          <div className="drag-feedback-list">
            {phoneLostSteps
              .slice()
              .sort((a, b) => a.correctPosition - b.correctPosition)
              .map((step) => (
                <div key={step.id} className="drag-feedback-item">
                  <span className="drag-feedback-num">{step.correctPosition}</span>
                  <div>
                    <div className="drag-feedback-label">{step.text}</div>
                    <div className="drag-feedback-reason">{step.reason}</div>
                  </div>
                </div>
              ))}
          </div>

          <button
            className="btn-primary"
            onClick={() => onComplete({ correct: correctCount, total: phoneLostSteps.length })}
          >
            Продолжить →
          </button>
        </motion.div>
      )}
    </div>
  );
}