import { useState } from 'react';
import DialogueBox from '../components/DialogueBox';
import DragOrder from '../components/DragOrder';

const introScript = [
  {
    speaker: 'Анастасия Александровна',
    text: 'Хакер украл твой телефон! Действовать нужно быстро. Расставь шаги по порядку, чтобы спасти свои данные.',
    avatar: '/mentor.png',
    side: 'right',
  },
  {
    speaker: 'Ты',
    text: 'Не паникую, а действую по плану!',
    avatar: '/hero.png',
    side: 'left',
  },
];

const outroScript = [
  {
    speaker: 'Анастасия Александровна',
    text: 'Отлично! Первым делом нужно удалённо заблокировать телефон, а затем менять пароли от всех аккаунтов.',
    avatar: '/mentor.png',
    side: 'right',
  },
  {
    speaker: 'Ты',
    text: 'Запомнил. Теперь я готов к любым ситуациям.',
    avatar: '/hero.png',
    side: 'left',
  },
];

export default function Block9({ onComplete, onBack }) {
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
        <DragOrder
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