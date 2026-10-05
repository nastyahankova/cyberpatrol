import { useState } from 'react';
import DialogueBox from '../components/DialogueBox';
import PrivacySettings from '../components/PrivacySettings';
import PostsGame from '../components/PostsGame';

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
    text: 'Даже «безобидное» фото может раскрыть твой адрес, школу, привычки. Сейчас проверим. Сначала — настройки приватности.',
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
    text: 'Именно. Сейчас увидишь 6 публикаций. Реши, что можно выложить, а что — лучше скрыть.',
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
  const [settingsResult, setSettingsResult] = useState(null);
  const [postsResult, setPostsResult] = useState(null);

  if (phase === 'intro') {
    const current = introScript[index];
    const handleNext = () => {
      if (index < introScript.length - 1) setIndex(index + 1);
      else { setIndex(0); setPhase('settings'); }
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

  if (phase === 'settings') {
    return (
      <>
        <PrivacySettings
          onComplete={(result) => {
            setSettingsResult(result);
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
      else { setIndex(0); setPhase('posts'); }
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

  if (phase === 'posts') {
    return (
      <>
        <PostsGame
          onComplete={(result) => {
            setPostsResult(result);
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
        const correct = (settingsResult?.correct || 0) + (postsResult?.correct || 0);
        const total = (settingsResult?.total || 0) + (postsResult?.total || 0);
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