import { useState } from 'react';
import DialogueBox from '../components/DialogueBox';
import CyberbullyingGame from '../components/CyberbullyingGame';

const introScript = [
  {
    speaker: 'Анастасия Александровна',
    text: 'Мы поговорили про вирусы и мошенников. Но есть ещё одна тема, о которой не всегда легко говорить — травля в интернете.',
    avatar: '/mentor.png',
    side: 'right',
  },
  {
    speaker: 'Ты',
    text: 'Кибербуллинг? Я слышал это слово.',
    avatar: '/hero.png',
    side: 'left',
  },
  {
    speaker: 'Анастасия Александровна',
    text: 'Да. Это когда кого-то оскорбляют, запугивают или унижают в сети. Сейчас я покажу несколько ситуаций. Твоя задача — выбрать правильную реакцию.',
    avatar: '/mentor.png',
    side: 'right',
  },
];

const outroScript = [
  {
    speaker: 'Анастасия Александровна',
    text: 'Молодец! Запомни главное: не отвечай агрессией, сохраняй доказательства, рассказывай взрослым. И никогда не оставайся в стороне, если травят другого.',
    avatar: '/mentor.png',
    side: 'right',
  },
  {
    speaker: 'Ты',
    text: 'Понял. Молчать — не всегда правильно. Иногда нужно действовать.',
    avatar: '/hero.png',
    side: 'left',
  },
  {
    speaker: 'Анастасия Александровна',
    text: 'Именно. А теперь — поговорим об играх. Ты же любишь играть? Там тоже есть опасности.',
    avatar: '/mentor.png',
    side: 'right',
  },
];

export default function Block7({ onComplete, onBack }) {
  const [phase, setPhase] = useState('intro');
  const [index, setIndex] = useState(0);

  if (phase === 'intro') {
    const current = introScript[index];
    const handleNext = () => {
      if (index < introScript.length - 1) setIndex(index + 1);
      else { setIndex(0); setPhase('game'); }
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

  if (phase === 'game') {
    return (
      <>
        <CyberbullyingGame onComplete={() => { setIndex(0); setPhase('outro'); }} />
        <button className="back-btn" onClick={onBack}>← К карте</button>
      </>
    );
  }

  if (phase === 'outro') {
    const current = outroScript[index];
    const handleNext = () => {
      if (index < outroScript.length - 1) setIndex(index + 1);
      else onComplete();
    };
    return (
      <DialogueBox
        speaker={current.speaker}
        text={current.text}
        avatar={current.avatar}
        side={current.side}
        onNext={handleNext}
        isLast={index === outroScript.length - 1}
      />
    );
  }
}