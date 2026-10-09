import { useState } from 'react';
import DialogueBox from '../components/DialogueBox';
import DragOrder from '../components/DragOrder';

const introScript = [
  {
    speaker: 'Анастасия Александровна',
    text: 'Телефон — это твой маленький компьютер. Там твои фото, переписки, банк, аккаунты. И его тоже надо защищать.',
    avatar: '/mentor.png',
    side: 'right',
  },
  {
    speaker: 'Ты',
    text: 'А я думал, телефон сам защищён...',
    avatar: '/hero.png',
    side: 'left',
  },
  {
    speaker: 'Анастасия Александровна',
    text: 'Нет. А ещё телефон можно потерять. Сейчас я покажу тебе ситуацию. Расставь действия в правильном порядке — что делать, если телефон пропал.',
    avatar: '/mentor.png',
    side: 'right',
  },
];

const outroScript = [
  {
    speaker: 'Анастасия Александровна',
    text: 'Отлично! Теперь ты знаешь порядок действий. Первое — позвонить, потом проверить геолокацию, заблокировать, сообщить взрослым и, если нужно, обратиться в полицию.',
    avatar: '/mentor.png',
    side: 'right',
  },
  {
    speaker: 'Ты',
    text: 'Понял! Теперь я знаю, что делать, если потеряю телефон.',
    avatar: '/hero.png',
    side: 'left',
  },
  {
    speaker: 'Анастасия Александровна',
    text: 'Молодец. Осталось два блока. Следующий — про цифровую репутацию. Это важно для будущего.',
    avatar: '/mentor.png',
    side: 'right',
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
        <button className="back-btn" onClick={onBack}>← К карте</button>
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
        <button className="back-btn" onClick={onBack}>← К карте</button>
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