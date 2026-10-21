import { useState } from 'react';
import DialogueBox from '../components/DialogueBox';
import ProfileSetup from '../components/ProfileSetup';

const introScript = [
  {
    speaker: 'Анастасия Александровна',
    text: 'Даже безобидное фото или открытый профиль могут раскрыть твой адрес и планы. Давай настроим приватность так, чтобы мошенники остались ни с чем.',
    avatar: '/mentor.png',
    side: 'right',
  },
  {
    speaker: 'Ты',
    text: 'Настроим! Где тут самое важное?',
    avatar: '/hero.png',
    side: 'left',
  },
];

const outroScript = [
  {
    speaker: 'Анастасия Александровна',
    text: 'Отлично! Запомни главное правило: перед публикацией подумай — «А что этот пост расскажет обо мне незнакомцу?»',
    avatar: '/mentor.png',
    side: 'right',
  },
  {
    speaker: 'Ты',
    text: 'Понял. Лучше перестраховаться, чем потом жалеть.',
    avatar: '/hero.png',
    side: 'left',
  },
];

export default function Block5({ onComplete, onBack }) {
  const [phase, setPhase] = useState('intro');
  const [index, setIndex] = useState(0);
  const [gameResult, setGameResult] = useState(null);

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
        <button className="back-btn" onClick={onBack}>← В меню</button>
      </>
    );
  }

  if (phase === 'game') {
    return (
      <>
        <ProfileSetup
          onComplete={(result) => {
            setGameResult(result);
            setIndex(0);
            setPhase('outro');
          }}
        />
        <button className="back-btn" onClick={onBack}>← В меню</button>
      </>
    );
  }

  if (phase === 'outro') {
    const current = outroScript[index];
    const handleNext = () => {
      if (index < outroScript.length - 1) setIndex(index + 1);
      else onComplete(gameResult);
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