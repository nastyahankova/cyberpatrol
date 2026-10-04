import { useState } from 'react';
import DialogueBox from '../components/DialogueBox';

const script = [
  {
    speaker: 'Учитель информатики',
    text: 'Привет! Меня зовут Анастасия Александровна. Я веду информатику в вашей школе.',
    avatar: '/mentor.png',
    side: 'right',
  },
  {
    speaker: 'Ты',
    text: 'Здравствуйте! А что случилось? Почему все так взволнованы?',
    avatar: '/hero.png',
    side: 'left',
  },
  {
    speaker: 'Учитель информатики',
    text: 'Ночью кто-то взломал сайт нашей школы. Теперь от имени школы рассылают странные сообщения ученикам и родителям.',
    avatar: '/mentor.png',
    side: 'right',
  },
  {
    speaker: 'Ты',
    text: 'Ого... А что в этих сообщениях?',
    avatar: '/hero.png',
    side: 'left',
  },
  {
    speaker: 'Учитель информатики',
    text: 'Разное. Просят перейти по ссылкам, ввести данные, кому-то обещают «выигрыш». Настоящие мошенники.',
    avatar: '/mentor.png',
    side: 'right',
  },
  {
    speaker: 'Учитель информатики',
    text: 'Я собираю команду — «КиберПатруль школы». Ты в неё входишь. Готов помочь разобраться?',
    avatar: '/mentor.png',
    side: 'right',
  },
  {
    speaker: 'Ты',
    text: 'Конечно! С чего начнём?',
    avatar: '/hero.png',
    side: 'left',
  },
  {
    speaker: 'Учитель информатики',
    text: 'Сначала разберёмся, как вообще происходит взлом. И как от него защититься. Пойдём!',
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
      onComplete(); // переход к блоку 1
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