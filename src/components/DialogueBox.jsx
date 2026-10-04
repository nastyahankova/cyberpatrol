import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSound } from '../contexts/SoundContext';
import './DialogueBox.css';

export default function DialogueBox({ speaker, text, avatar, side, onNext, isLast }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const { playTyping } = useSound();

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        playTyping(); // ← звук при каждой букве
        i++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [text]);

  const handleClick = () => {
    if (isTyping) {
      setDisplayedText(text);
      setIsTyping(false);
    } else {
      onNext();
    }
  };

  return (
    <div className="dialogue-overlay" onClick={handleClick}>
      <motion.div
        className={`dialogue-avatar avatar-${side}`}
        initial={{ x: side === 'left' ? -100 : 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 15 }}
      >
        <img src={avatar} alt={speaker} />
      </motion.div>

      <motion.div
        className="dialogue-box"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="dialogue-speaker">{speaker}</div>
        <div className="dialogue-text">
          {displayedText}
          {isTyping && <span className="cursor">|</span>}
        </div>
        {!isTyping && (
          <div className="dialogue-hint">
            {isLast ? 'Нажми, чтобы продолжить →' : 'Нажми, чтобы дальше →'}
          </div>
        )}
      </motion.div>
    </div>
  );
}