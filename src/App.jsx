import { useState } from 'react';
import { motion } from 'framer-motion';
import IntroScreen from './screens/IntroScreen';
import Block1 from './screens/Block1';
import Block2 from './screens/Block2';
import Block3 from './screens/Block3';
import Block4 from './screens/Block4';
import Block5 from './screens/Block5';
import Block6 from './screens/Block6';
import Block7 from './screens/Block7';
import Block8 from './screens/Block8';
import Block9 from './screens/Block9';
import Block10 from './screens/Block10';
import Block11 from './screens/Block11';
import LevelSelect from './screens/LevelSelect';
import SoundToggle from './components/SoundToggle';
import { useSound } from './contexts/SoundContext';
import { loadProgress, markCompleted } from './utils/progress';
import './screens/LevelSelect.css';
import './App.css';

function App() {
  const [screen, setScreen] = useState('start');
  const [progress, setProgress] = useState(loadProgress());
  const { playClick } = useSound();

  const hasProgress = progress.completed.length > 0;

  const goToBlock = (blockId) => {
    playClick();
    if (blockId === 'intro')  return setScreen('intro');
    if (blockId === 'block1') return setScreen('block1');
    if (blockId === 'block2') return setScreen('block2');
    if (blockId === 'block3') return setScreen('block3');
    if (blockId === 'block4') return setScreen('block4');
    if (blockId === 'block5') return setScreen('block5');
    if (blockId === 'block6') return setScreen('block6');
    if (blockId === 'block7') return setScreen('block7');
    if (blockId === 'block8') return setScreen('block8');
    if (blockId === 'block9') return setScreen('block9');
    if (blockId === 'block10') return setScreen('block10');
    if (blockId === 'block11') return setScreen('block11');
    setScreen('placeholder');
  };

  const completeBlock = (blockId) => {
    playClick();
    const updated = markCompleted(blockId);
    setProgress(updated);
    setScreen('levels');
  };

  return (
    <div className="app">
      <SoundToggle />

      {screen === 'start' && (
        <StartScreen
          onStart={() => setScreen('intro')}
          onContinue={() => setScreen('levels')}
          hasProgress={hasProgress}
        />
      )}

      {screen === 'levels' && (
        <LevelSelect
          onSelect={goToBlock}
          onBack={() => setScreen('start')}
          onReset={() => setProgress(loadProgress())}
        />
      )}

      {screen === 'intro' && (
        <IntroScreen
          onComplete={() => completeBlock('intro')}
          onBack={() => setScreen('levels')}
        />
      )}

      {screen === 'block1' && <Block1 onComplete={() => completeBlock('block1')} onBack={() => setScreen('levels')} />}
      {screen === 'block2' && <Block2 onComplete={() => completeBlock('block2')} onBack={() => setScreen('levels')} />}
      {screen === 'block3' && <Block3 onComplete={() => completeBlock('block3')} onBack={() => setScreen('levels')} />}
      {screen === 'block4' && <Block4 onComplete={() => completeBlock('block4')} onBack={() => setScreen('levels')} />}
      {screen === 'block5' && <Block5 onComplete={() => completeBlock('block5')} onBack={() => setScreen('levels')} />}
      {screen === 'block6' && <Block6 onComplete={() => completeBlock('block6')} onBack={() => setScreen('levels')} />}
      {screen === 'block7' && <Block7 onComplete={() => completeBlock('block7')} onBack={() => setScreen('levels')} />}
      {screen === 'block8' && <Block8 onComplete={() => completeBlock('block8')} onBack={() => setScreen('levels')} />}
      {screen === 'block9' && <Block9 onComplete={() => completeBlock('block9')} onBack={() => setScreen('levels')} />}
      {screen === 'block10' && <Block10 onComplete={() => completeBlock('block10')} onBack={() => setScreen('levels')} />}
      {screen === 'block11' && <Block11 onComplete={() => completeBlock('block11')} onBack={() => setScreen('levels')} />}

      {screen === 'placeholder' && (
        <div className="placeholder">
          <h2>В разработке</h2>
          <p>Этот блок ещё не готов. Скоро добавим!</p>
          <button onClick={() => setScreen('levels')}>← К карте миссий</button>
        </div>
      )}
    </div>
  );
}

function StartScreen({ onStart, onContinue, hasProgress }) {
  return (
    <motion.div
      className="start-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="grid-bg" />
      <div className="glow glow-1" />
      <div className="glow glow-2" />

      <motion.div
        className="start-content"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        <motion.div
          className="badge"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        >
          🛡️
        </motion.div>

        <h1 className="title">
          Кибер<span className="accent">Патруль</span>
        </h1>
        <p className="subtitle">Школа в опасности. Ты — её защитник.</p>

        {hasProgress && (
          <motion.button
            className="btn-primary"
            onClick={onContinue}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            style={{ marginBottom: 14 }}
          >
            Продолжить миссию →
          </motion.button>
        )}

        <motion.button
          className={hasProgress ? 'btn-secondary' : 'btn-primary'}
          onClick={onStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          {hasProgress ? 'Начать заново' : 'Начать миссию'}
        </motion.button>

        <p className="hint">
          {hasProgress ? 'Твой прогресс сохранён' : 'Нажми, чтобы войти в систему'}
        </p>
      </motion.div>
    </motion.div>
  );
}

export default App;