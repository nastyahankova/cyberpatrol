import { useState } from 'react';
import DialogueBox from '../components/DialogueBox';
import ReputationGame from '../components/ReputationGame';

const introScript = [
  {
    speaker: 'Анастасия Александровна',
    text: 'Ты научился защищать телефон. Но есть ещё одна важная тема — цифровая репутация. То, что ты публикуешь в интернете, остаётся навсегда.',
    avatar: '/mentor.png',
    side: 'right',
  },
  {
    speaker: 'Ты',
    text: 'А разве кто-то смотрит мои старые посты?',
    avatar: '/hero.png',
    side: 'left',
  },
  {
    speaker: 'Анастасия Александровна',
    text: 'Смотрят. Учителя, приёмная комиссия, будущие работодатели. Сейчас проверим, что можно оставлять в сети, а что лучше удалить.',
    avatar: '/mentor.png',
    side: 'right',
  },
];

const outroScript = [
  {
    speaker: 'Анастасия Александровна',
    text: 'Молодец! Запомни: интернет помнит всё. Перед публикацией спроси себя: «А не пожалею ли я об этом через 5 лет?»',
    avatar: '/mentor.png',
    side: 'right',
  },
  {
    speaker: 'Ты',
    text: 'Понял. Лучше лишний раз подумать, чем потом удалять.',
    avatar: '/hero.png',
    side: 'left',
  },
  {
    speaker: 'Анастасия Александровна',
    text: 'Именно. Остался последний блок — финальная атака. Там ты применишь всё, чему научился. Готов?',
    avatar: '/mentor.png',
    side: 'right',
  },
];

export default function Block10({ onComplete, onBack }) {
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
        <ReputationGame onComplete={() => { setIndex(0); setPhase('outro'); }} />
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