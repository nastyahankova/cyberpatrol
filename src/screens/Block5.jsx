import { useState } from 'react';
import DialogueBox from '../components/DialogueBox';
import ProfileSetup from '../components/ProfileSetup';

const introScript = [
  {
    speaker: 'Анастасия Александровна',
    text: 'Ты научился защищать деньги. Теперь поговорим о другом: что мы сами рассказываем о себе в интернете.',
    avatar: '/mentor.png',
    side: 'right',
  },
  {
    speaker: 'Ты',
    text: 'А что я могу рассказать? Я же ничего такого не публикую.',
    avatar: '/hero.png',
    side: 'left',
  },
  {
    speaker: 'Анастасия Александровна',
    text: 'Даже «безобидное» фото может раскрыть твой адрес, школу, привычки. Сейчас настроим твой профиль. Подумай, что безопаснее.',
    avatar: '/mentor.png',
    side: 'right',
  },
];

const outroScript = [
  {
    speaker: 'Анастасия Александровна',
    text: 'Молодец! Теперь ты знаешь, какие настройки приватности безопаснее. Главное правило: перед публикацией подумай — «А что по этому фото можно обо мне узнать?»',
    avatar: '/mentor.png',
    side: 'right',
  },
  {
    speaker: 'Ты',
    text: 'Понял. Лучше скрыть лишнее, чем потом жалеть.',
    avatar: '/hero.png',
    side: 'left',
  },
  {
    speaker: 'Анастасия Александровна',
    text: 'Верно. Следующий блок — про вирусы и вредоносные программы. Готов?',
    avatar: '/mentor.png',
    side: 'right',
  },
];

export default function Block5({ onComplete, onBack }) {
  const [phase, setPhase] = useState('intro');
  const [index, setIndex] = useState(0);
  const [setupResult, setSetupResult] = useState(null);

  if (phase === 'intro') {
    const current = introScript[index];
    const handleNext = () => {
      if (index < introScript.length - 1) setIndex(index + 1);
      else { setIndex(0); setPhase('setup'); }
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

  if (phase === 'setup') {
    return (
      <>
        <ProfileSetup
          onComplete={(result) => {
            setSetupResult(result);
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
      else onComplete(setupResult);
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