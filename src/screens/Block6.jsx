import { useState } from 'react';
import DialogueBox from '../components/DialogueBox';
import MalwareGame from '../components/MalwareGame';

const introScript = [
  {
    speaker: 'Анастасия Александровна',
    text: 'Приватность — это важно. Но есть ещё одна угроза — вредоносные программы. Вирусы, трояны, шпионы.',
    avatar: '/mentor.png',
    side: 'right',
  },
  {
    speaker: 'Ты',
    text: 'А как они попадают на компьютер?',
    avatar: '/hero.png',
    side: 'left',
  },
  {
    speaker: 'Анастасия Александровна',
    text: 'Чаще всего — когда ты сам что-то скачиваешь. Бесплатная игра, взломанная программа, файл от незнакомца. Сейчас проверим, сможешь ли ты отличить опасное от безопасного.',
    avatar: '/mentor.png',
    side: 'right',
  },
];

const outroScript = [
  {
    speaker: 'Анастасия Александровна',
    text: 'Отлично! Главное правило: скачивай только из официальных источников. Если что-то «слишком бесплатное» — это ловушка.',
    avatar: '/mentor.png',
    side: 'right',
  },
  {
    speaker: 'Ты',
    text: 'Понял. Лучше заплатить, чем потом чистить компьютер.',
    avatar: '/hero.png',
    side: 'left',
  },
  {
    speaker: 'Анастасия Александровна',
    text: 'Именно! А теперь — поговорим о том, что делать, если ты столкнулся с травлей в интернете.',
    avatar: '/mentor.png',
    side: 'right',
  },
];

export default function Block6({ onComplete, onBack }) {
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
        <MalwareGame onComplete={() => { setIndex(0); setPhase('outro'); }} />
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