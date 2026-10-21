import { useState } from 'react';
import DialogueBox from '../components/DialogueBox';

const script = [
  {
    speaker: 'Анастасия Александровна',
    text: 'Привет! Меня зовут Анастасия Александровна, я учитель информатики. У нас беда: ночью хакер «Фантом» взломал сайт школы и рассылает странные сообщения.',
    avatar: '/mentor.png',
    side: 'right',
  },
  {
    speaker: 'Ты',
    text: 'Ого! А что делать? Мы можем это остановить?',
    avatar: '/hero.png',
    side: 'left',
  },
  {
    speaker: 'Анастасия Александровна',
    text: 'Я собираю команду «КиберПатруль». Ты в деле? Нам нужно пройти 11 испытаний, чтобы защитить школу.',
    avatar: '/mentor.png',
    side: 'right',
  },
];

export default function IntroScreen({ onComplete, onBack }) {
  const [index, setIndex] = useState(0);
  const current = script[index];

  const handleNext = () => {
    if (index < script.length - 1) {
      setIndex(index + 1);
    } else {
      onComplete();
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
        isLast={index === script.length - 1}
      />
      <button className="back-btn" onClick={onBack}>← В меню</button>
    </>
  );
}