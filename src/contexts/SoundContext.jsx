import { createContext, useContext, useEffect, useRef, useState } from 'react';

const SoundContext = createContext();

export function SoundProvider({ children }) {
  const [musicOn, setMusicOn] = useState(true);
  const [sfxOn, setSfxOn] = useState(true);
  const musicRef = useRef(null);
  const typingRef = useRef(null);
  const clickRef = useRef(null);
  const lastTypingTime = useRef(0);

  // Инициализация аудио
  useEffect(() => {
    musicRef.current = new Audio('/sounds/background.mp3');
    musicRef.current.loop = true;
    musicRef.current.volume = 0.15;

    typingRef.current = new Audio('/sounds/typing.mp3');
    typingRef.current.volume = 0.4;

    clickRef.current = new Audio('/sounds/click.mp3');
    clickRef.current.volume = 0.3;

    return () => {
      musicRef.current?.pause();
      typingRef.current?.pause();
      clickRef.current?.pause();
    };
  }, []);

  // Запуск музыки при первом взаимодействии
  useEffect(() => {
    const startMusic = () => {
      if (musicOn && musicRef.current) {
        musicRef.current.play().catch(() => {});
      }
      document.removeEventListener('click', startMusic);
      document.removeEventListener('keydown', startMusic);
    };
    document.addEventListener('click', startMusic);
    document.addEventListener('keydown', startMusic);
    return () => {
      document.removeEventListener('click', startMusic);
      document.removeEventListener('keydown', startMusic);
    };
  }, [musicOn]);

  // Управление музыкой
  useEffect(() => {
    if (!musicRef.current) return;
    if (musicOn) {
      musicRef.current.play().catch(() => {});
    } else {
      musicRef.current.pause();
    }
  }, [musicOn]);

  // Звук печати — с защитой от накопления
  const playTyping = () => {
    if (!sfxOn || !typingRef.current) return;

    // Защита: не чаще, чем раз в 80 мс
    const now = Date.now();
    if (now - lastTypingTime.current < 80) return;
    lastTypingTime.current = now;

    try {
      typingRef.current.currentTime = 0;
      typingRef.current.play().catch(() => {});
    } catch (e) {
      // игнорируем ошибки
    }
  };

  const playClick = () => {
    if (!sfxOn || !clickRef.current) return;
    try {
      clickRef.current.currentTime = 0;
      clickRef.current.play().catch(() => {});
    } catch (e) {}
  };

  return (
    <SoundContext.Provider
      value={{
        musicOn,
        sfxOn,
        toggleMusic: () => setMusicOn((v) => !v),
        toggleSfx: () => setSfxOn((v) => !v),
        playTyping,
        playClick,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  return useContext(SoundContext);
}