import { useState } from 'react';
import DialogueBox from '../components/DialogueBox';
import MobileGame from '../components/MobileGame';

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
    text: 'Нет. Если не настроить защиту — злоумышленники могут легко добраться до твоих данных. Сейчас проверим, как ты справишься с настройками.',
    avatar: '/mentor.png',
    side: 'right',
  },
];

const outroScript = [
  {
    speaker: 'Анастасия Александровна',
    text: 'Отлично! Запомни главное: блокировка экрана — биометрия, обновления — сразу, разрешения — только нужные. И не заходи в банк через публичный Wi-Fi.',
    avatar: '/mentor.png',
    side: 'right',
  },
  {
    speaker: 'Ты',
    text: 'Понял! Теперь телефон точно защищён.',
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
        <MobileGame onComplete={() => { setIndex(0); setPhase('outro'); }} />
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