import { useState } from 'react';
import DialogueBox from '../components/DialogueBox';
import PhishingGame from '../components/PhishingGame';

const introScript = [
  {
    speaker: 'Анастасия Александровна',
    text: 'Пароли мы укрепили. Но хакер не сдаётся — теперь он рассылает поддельные сообщения от имени школы и банков.',
    avatar: '/mentor.png',
    side: 'right',
  },
  {
    speaker: 'Ты',
    text: 'То есть фишинг? Я слышал это слово, но не очень понимаю.',
    avatar: '/hero.png',
    side: 'left',
  },
  {
    speaker: 'Анастасия Александровна',
    text: 'Фишинг — это когда мошенник притворяется тем, кому ты доверяешь. Сейчас покажу несколько примеров. Твоя задача — отличить настоящие сообщения от поддельных.',
    avatar: '/mentor.png',
    side: 'right',
  },
];

const outroScript = [
  {
    speaker: 'Анастасия Александровна',
    text: 'Молодец! Ты научился распознавать фишинг. Запомни главное: не переходи по ссылкам из подозрительных сообщений и проверяй отправителя.',
    avatar: '/mentor.png',
    side: 'right',
  },
  {
    speaker: 'Ты',
    text: 'А если всё-таки перешёл?',
    avatar: '/hero.png',
    side: 'left',
  },
  {
    speaker: 'Анастасия Александровна',
    text: 'Тогда сразу расскажи взрослым и поменяй пароли. Но лучше — не переходить. Готов к следующему испытанию?',
    avatar: '/mentor.png',
    side: 'right',
  },
];

export default function Block2({ onComplete, onBack }) {
  const [phase, setPhase] = useState('intro');
  const [index, setIndex] = useState(0);

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

  if (phase === 'game') {
    return (
      <>
        <PhishingGame onComplete={() => { setIndex(0); setPhase('outro'); }} />
        <button className="back-btn" onClick={onBack}>← В меню</button>
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