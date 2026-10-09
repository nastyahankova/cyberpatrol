import { useState } from 'react';
import { motion } from 'framer-motion';
import DialogueBox from '../components/DialogueBox';
import FinalBattle from '../components/FinalBattle';
import Certificate from '../components/Certificate';
import './Block11.css';

const introScript = [
  {
    speaker: 'Анастасия Александровна',
    text: 'Вот и всё. «Фантом» собрал всех своих помощников и готовит финальную атаку на школу. Это решающий бой.',
    avatar: '/mentor.png',
    side: 'right',
  },
  {
    speaker: 'Ты',
    text: 'Я готов. Я многому научился.',
    avatar: '/hero.png',
    side: 'left',
  },
  {
    speaker: 'Анастасия Александровна',
    text: 'Тогда вперёд. 10 раундов — 10 атак. Каждый правильный ответ отнимает у «Фантома» одно деление здоровья. Применяй всё, чему научился. Удачи, КиберПатруль!',
    avatar: '/mentor.png',
    side: 'right',
  },
];

function getRank(score, total) {
  const percent = (score / total) * 100;
  if (percent >= 90) return 'Легенда КиберПатруля';
  if (percent >= 70) return 'Киберзащитник';
  if (percent >= 50) return 'Патрульный';
  return 'Новичок';
}

export default function Block11({ onComplete, onBack }) {
  const [phase, setPhase] = useState('intro');
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState(null);

  const handleRestart = () => {
    setResult(null);
    setIndex(0);
    setPhase('battle');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (phase === 'intro') {
    const current = introScript[index];
    const handleNext = () => {
      if (index < introScript.length - 1) setIndex(index + 1);
      else { setIndex(0); setPhase('battle'); }
    };
    return (
      <>
        <DialogueBox
          speaker={current.speaker}
          text={current.text}
          avatar={current.avatar}
          side={current.side}
          onNext={handleNext}
          isLast={index === introScript.length - 1}
        />
        <button className="back-btn" onClick={onBack}>← К карте</button>
      </>
    );
  }

  if (phase === 'battle') {
    return (
      <>
        <FinalBattle
          onComplete={({ correct, total, hp }) => {
            const rank = getRank(correct, total);
            setResult({ score: correct, total, hp, rank });
            setPhase('result');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
        <button className="back-btn" onClick={onBack}>← К карте</button>
      </>
    );
  }

  if (phase === 'result') {
    const { score, total, hp, rank } = result;
    const isVictory = hp === 0;

    return (
      <div className="b11-result">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 150 }}
          className="b11-result-content"
        >
          <div className={`b11-hacker ${isVictory ? '' : 'escaped'}`}>
            <img src="/hacker.png" alt="Фантом" />
            <div className="b11-hacker-overlay">
              {isVictory ? 'ПОБЕЖДЁН' : 'СБЕЖАЛ'}
            </div>
          </div>

          <h2 className="b11-title">
            {isVictory ? '🎉 Школа спасена!' : '⚠️ Фантом сбежал'}
          </h2>
          <p className="b11-subtitle">
            {isVictory
              ? 'Ты отразил все атаки и полностью победил Фантома!'
              : `Фантом потерял ${10 - hp} из 10 жизней, но уцелел. Попробуй пройти финал без ошибок — тогда он будет побеждён.`}
          </p>

          <div className="b11-stats">
            <div className="b11-stat">
              <div className="b11-stat-label">Правильных ответов</div>
              <div className="b11-stat-value">{score} / {total}</div>
            </div>
            <div className="b11-stat">
              <div className="b11-stat-label">HP Фантома</div>
              <div className="b11-stat-value">{hp} / 10</div>
            </div>
            <div className="b11-stat">
              <div className="b11-stat-label">Твой ранг</div>
              <div className="b11-stat-value rank">{rank}</div>
            </div>
          </div>

          {isVictory ? (
            <Certificate score={score} total={total} rank={rank} />
          ) : (
            <button
              className="btn-primary b11-restart"
              onClick={handleRestart}
            >
              🔄 Пройти финал заново
            </button>
          )}

          <button
            className="btn-secondary b11-complete"
            onClick={() => onComplete({ correct: score, total, rank })}
          >
            Завершить миссию
          </button>
        </motion.div>
      </div>
    );
  }
}