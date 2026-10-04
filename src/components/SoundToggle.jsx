import { useSound } from '../contexts/SoundContext';
import './SoundToggle.css';

export default function SoundToggle() {
  const { musicOn, sfxOn, toggleMusic, toggleSfx } = useSound();

  return (
    <div className="sound-toggle">
      <button
        className={`sound-btn ${musicOn ? 'on' : 'off'}`}
        onClick={toggleMusic}
        title={musicOn ? 'Выключить музыку' : 'Включить музыку'}
      >
        {musicOn ? '🎵' : '🔇'}
      </button>
      <button
        className={`sound-btn ${sfxOn ? 'on' : 'off'}`}
        onClick={toggleSfx}
        title={sfxOn ? 'Выключить звуки' : 'Включить звуки'}
      >
        {sfxOn ? '🔊' : '🔈'}
      </button>
    </div>
  );
}