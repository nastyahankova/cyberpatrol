import { useState } from 'react';
import { motion } from 'framer-motion';
import './PasswordGame.css';

const CHIPS = {
  lowercase: ['а', 'б', 'в', 'г', 'д', 'е', 'к', 'м', 'н', 'о', 'р', 'с'],
  uppercase: ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'К', 'М', 'Н', 'О', 'Р', 'С'],
  digits: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  symbols: ['!', '@', '#', '$', '%', '&', '*', '?', '_', '-'],
};

function evaluatePassword(pwd) {
  let score = 0;
  const checks = {
    len12: pwd.length >= 12,
    lower: /[a-zа-я]/.test(pwd),
    upper: /[A-ZА-Я]/.test(pwd),
    digit: /\d/.test(pwd),
    symbol: /[^A-Za-zА-Яа-я0-9]/.test(pwd),
  };
  if (checks.len12) score++;
  if (checks.lower) score++;
  if (checks.upper) score++;
  if (checks.digit) score++;
  if (checks.symbol) score++;
  return { score, checks };
}

function getStrength(score) {
  if (score <= 2) return { label: 'Очень слабый', color: '#ff5252', time: '1 сек' };
  if (score <= 3) return { label: 'Средний', color: '#ffb800', time: '10 секунд' };
  return { label: 'Надёжный', color: '#00e676', time: '100+ лет' };
}

export default function PasswordGame({ onComplete }) {
  const [password, setPassword] = useState('');
  const [showResult, setShowResult] = useState(false);

  const { score, checks } = evaluatePassword(password);
  const strength = getStrength(score);
  const progress = (score / 6) * 100;

  const addChar = (char) => setPassword((p) => p + char);
  const removeLast = () => setPassword((p) => p.slice(0, -1));
  const clear = () => setPassword('');

  const handleCheck = () => {
    setShowResult(true);
  };

  const handleContinue = () => {
    if (score >= 5) {
      onComplete();
    } else {
      setShowResult(false);
    }
  };

  return (
    <div className="pwd-game">
      <div className="pwd-header">
        <h2>🔐 Создай надёжный пароль</h2>
        <p>Хакер пытается подобрать пароль. Сделай его таким, чтобы взлом занял века.</p>
      </div>

      <div className="pwd-field-wrap">
        <input
          type="text"
          className="pwd-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Введи пароль или собери из символов ниже"
          autoFocus
        />
        <button className="pwd-clear" onClick={clear} title="Очистить">✕</button>
      </div>

      <div className="pwd-strength">
        <div className="pwd-strength-bar">
          <motion.div
            className="pwd-strength-fill"
            style={{ background: strength.color }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="pwd-strength-label" style={{ color: strength.color }}>
          {password ? strength.label : 'Начни вводить пароль'}
        </div>
      </div>

      <div className="pwd-checks">
        <Check active={checks.len12} label="12+ символов" />
        <Check active={checks.lower} label="Строчные буквы" />
        <Check active={checks.upper} label="Заглавные буквы" />
        <Check active={checks.digit} label="Цифры" />
        <Check active={checks.symbol} label="Символы (!@#$)" />
      </div>

      <div className="pwd-chips">
        {Object.entries(CHIPS).map(([key, arr]) => (
          <div className="chip-row" key={key}>
            {arr.map((c) => (
              <button key={c} className="chip" onClick={() => addChar(c)}>
                {c}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="pwd-actions">
        <button className="btn-ghost" onClick={removeLast}>← Удалить</button>
        <motion.button
          className="btn-primary"
          onClick={handleCheck}
          disabled={!password}
          whileHover={{ scale: password ? 1.05 : 1 }}
          whileTap={{ scale: password ? 0.97 : 1 }}
        >
          Проверить пароль
        </motion.button>
      </div>

      {showResult && (
        <motion.div
          className="pwd-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="pwd-modal"
            initial={{ scale: 0.8, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            {score >= 4 ? (
              <>
                <div className="pwd-modal-icon success">✅</div>
                <h3>Пароль надёжный!</h3>
                <p>Хакеру понадобится <b>{strength.time}</b>, чтобы его взломать. Ты справился!</p>
                <button className="btn-primary" onClick={handleContinue}>
                  Продолжить →
                </button>
              </>
            ) : (
              <>
                <div className="pwd-modal-icon fail">⚠️</div>
                <h3>Пароль слишком слабый</h3>
                <p>Хакер взломает его за <b>{strength.time}</b>.</p>
                <p className="pwd-tip">
                  Подсказка: сделай пароль длиннее 12 символов и добавь заглавные буквы, цифры и знаки.
                </p>
                <button className="btn-primary" onClick={handleContinue}>
                  Попробовать снова
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function Check({ active, label }) {
  return (
    <div className={`pwd-check ${active ? 'active' : ''}`}>
      <span className="pwd-check-dot">{active ? '✓' : '○'}</span>
      <span>{label}</span>
    </div>
  );
}