import { useState } from 'react';
import DialogueBox from '../components/DialogueBox';
import SortingGame from '../components/SortingGame';

const introScript = [
  {
    speaker: 'Анастасия Александровна',
    text: 'Социальная инженерия работает через общение. Но есть ещё одна большая тема — финансовые мошенники. Они обещают «лёгкие деньги».',
    avatar: '/mentor.png',
    side: 'right',
  },
  {
    speaker: 'Ты',
    text: 'Как это — лёгкие деньги? Разве так бывает?',
    avatar: '/hero.png',
    side: 'left',
  },
  {
    speaker: 'Анастасия Александровна',
    text: 'Не бывает! Но мошенники умеют это красиво подать. Сейчас увидишь 6 предложений. Твоя задача — разделить их на надёжные и мошеннические.',
    avatar: '/mentor.png',
    side: 'right',
  },
];

const outroScript = [
  {
    speaker: 'Анастасия Александровна',
    text: 'Отлично! Теперь ты знаешь главные признаки обмана: слишком высокая доходность, срочность, «секретные схемы» и просьбы перевести деньги лично.',
    avatar: '/mentor.png',
    side: 'right',
  },
  {
    speaker: 'Ты',
    text: 'То есть если обещают быстро и много — это подозрительно?',
    avatar: '/hero.png',
    side: 'left',
  },
  {
    speaker: 'Анастасия Александровна',
    text: 'Именно. Настоящие инвестиции — это долго и скучно, но надёжно. Двигаемся дальше!',
    avatar: '/mentor.png',
    side: 'right',
  },
];

export default function Block4({ onComplete, onBack }) {
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
        <SortingGame
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