import { useState } from 'react';
import DialogueBox from '../components/DialogueBox';
import ProfileSetup from '../components/ProfileSetup';
import FeedBuilder from '../components/FeedBuilder';

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

const midScript = [
  {
    speaker: 'Анастасия Александровна',
    text: 'Отлично! Теперь ты знаешь, какие настройки безопаснее. Но приватность — это не только настройки, но и то, что ты публикуешь.',
    avatar: '/mentor.png',
    side: 'right',
  },
  {
    speaker: 'Ты',
    text: 'То есть даже обычное фото может быть опасным?',
    avatar: '/hero.png',
    side: 'left',
  },
  {
    speaker: 'Анастасия Александровна',
    text: 'Именно. Сейчас увидишь 10 постов. Выбери те, которые можно публиковать. Опасные лучше не выкладывать.',
    avatar: '/mentor.png',
    side: 'right',
  },
];

const outroScript = [
  {
    speaker: 'Анастасия Александровна',
    text: 'Молодец! Главное правило: перед публикацией подумай — «А что по этому фото можно обо мне узнать?»',
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
  const [feedResult, setFeedResult] = useState(null);

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
            setPhase('mid');
          }}
        />
        <button className="back-btn" onClick={onBack}>← К карте</button>
      </>
    );
  }

  if (phase === 'mid') {
    const current = midScript[index];
    const handleNext = () => {
      if (index < midScript.length - 1) setIndex(index + 1);
      else { setIndex(0); setPhase('feed'); }
    };
    return (
      <DialogueBox
        speaker={current.speaker}
        text={current.text}
        avatar={current.avatar}
        side={current.side}
        onNext={handleNext}
        isLast={index === midScript.length - 1}
      />
    );
  }

  if (phase === 'feed') {
    return (
      <>
        <FeedBuilder
          onComplete={(result) => {
            setFeedResult(result);
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
      else {
        const correct = (setupResult?.correct || 0) + (feedResult?.correct || 0);
        const total = (setupResult?.total || 0) + (feedResult?.total || 0);
        onComplete({ correct, total });
      }
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