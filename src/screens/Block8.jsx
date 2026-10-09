import { useState } from 'react';
import DialogueBox from '../components/DialogueBox';
import GamingChat from '../components/GamingChat';

const introScript = [
  {
    speaker: 'Анастасия Александровна',
    text: 'Ты любишь играть? В играх тоже полно мошенников. Они обещают скины, валюту, помощь — и обманывают.',
    avatar: '/mentor.png',
    side: 'right',
  },
  {
    speaker: 'Ты',
    text: 'А я думал, что в играх можно расслабиться...',
    avatar: '/hero.png',
    side: 'left',
  },
  {
    speaker: 'Анастасия Александровна',
    text: 'Можно. Но важно знать типичные схемы. Сейчас увидишь чат одной игры. Найди сообщения от мошенников.',
    avatar: '/mentor.png',
    side: 'right',
  },
];

const outroScript = [
  {
    speaker: 'Анастасия Александровна',
    text: 'Молодец! Запомни: настоящие подарки не требуют пароля, а «слишком дешёвая» валюта — обман. Покупай только в официальных магазинах.',
    avatar: '/mentor.png',
    side: 'right',
  },
  {
    speaker: 'Ты',
    text: 'Понял. Лучше переплатить в официальном магазине, чем потерять аккаунт.',
    avatar: '/hero.png',
    side: 'left',
  },
  {
    speaker: 'Анастасия Александровна',
    text: 'Именно. А теперь — следующий блок. Он про твой телефон. Ведь он с тобой всегда рядом.',
    avatar: '/mentor.png',
    side: 'right',
  },
];

export default function Block8({ onComplete, onBack }) {
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
        <GamingChat
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