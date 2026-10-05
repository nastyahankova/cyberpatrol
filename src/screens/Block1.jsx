import { useState } from 'react';
import DialogueBox from '../components/DialogueBox';
import PasswordGame from '../components/PasswordGame';

const introScript = [
  {
    speaker: 'Анастасия Александровна',
    text: 'Сайт школы взломали через слабый пароль администратора. Классика! Давай разберёмся, как делать пароли, которые невозможно подобрать.',
    avatar: '/mentor.png',
    side: 'right',
  },
  {
    speaker: 'Ты',
    text: 'А что, есть такие пароли?',
    avatar: '/hero.png',
    side: 'left',
  },
  {
    speaker: 'Анастасия Александровна',
    text: 'Конечно! Сейчас ты сам соберёшь такой. Хакер будет пытаться его взломать — а мы посмотрим, кто кого.',
    avatar: '/mentor.png',
    side: 'right',
  },
];

const outroScript = [
  {
    speaker: 'Анастасия Александровна',
    text: 'Отлично! Вот такой пароль хакеру не по зубам. Запомни: длиннее 12 символов, буквы разного регистра, цифры и знаки.',
    avatar: '/mentor.png',
    side: 'right',
  },
  {
    speaker: 'Ты',
    text: 'Понял! Теперь я знаю, как защитить аккаунт.',
    avatar: '/hero.png',
    side: 'left',
  },
  {
    speaker: 'Анастасия Александровна',
    text: 'Молодец. Но пароль — это только начало. Скоро хакер атакует снова. Готов ко второму испытанию?',
    avatar: '/mentor.png',
    side: 'right',
  },
];

export default function Block1({ onComplete, onBack }) {
  const [phase, setPhase] = useState('intro'); // intro | game | outro
  const [index, setIndex] = useState(0);

  // --- ФАЗА ВСТУПЛЕНИЯ ---
  if (phase === 'intro') {
    const current = introScript[index];
    const handleNext = () => {
      if (index < introScript.length - 1) setIndex(index + 1);
      else {
        setIndex(0);
        setPhase('game');
      }
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

  // --- ФАЗА ИГРЫ ---
  if (phase === 'game') {
    return (
      <>
        <PasswordGame onComplete={() => { setIndex(0); setPhase('outro'); }} />
        <button className="back-btn" onClick={onBack}>← В меню</button>
      </>
    );
  }

  // --- ФАЗА ЗАВЕРШЕНИЯ ---
  if (phase === 'outro') {
    const current = outroScript[index];
    const handleNext = () => {
      if (index < outroScript.length - 1) setIndex(index + 1);
      else onComplete({ correct: 1, total: 1 });
    };
    return (
      <>
        <DialogueBox
          speaker={current.speaker}
          text={current.text}
          avatar={current.avatar}
          side={current.side}
          onNext={handleNext}
          isLast={index === outroScript.length - 1}
        />
      </>
    );
  }
}