// Все блоки игры
export const BLOCKS = [
  { id: 'intro',   title: 'Знакомство',              icon: '👋', short: 'Введение' },
  { id: 'block1',  title: 'Пароли и доступы',        icon: '🔐', short: 'Пароли' },
  { id: 'block2',  title: 'Фишинг',                  icon: '🎣', short: 'Фишинг' },
  { id: 'block3',  title: 'Социальная инженерия',    icon: '💬', short: 'Общение' },
  { id: 'block4',  title: 'Финансовые схемы',        icon: '💰', short: 'Финансы' },
  { id: 'block5',  title: 'Приватность и данные',    icon: '🕵️', short: 'Приватность' },
  { id: 'block6',  title: 'Вредоносное ПО',          icon: '🦠', short: 'Вирусы' },
  { id: 'block7',  title: 'Кибербуллинг',            icon: '🛡️', short: 'Травля' },
  { id: 'block8',  title: 'Игровые угрозы',          icon: '🎮', short: 'Игры' },
  { id: 'block9',  title: 'Мобильная безопасность',  icon: '📱', short: 'Телефон' },
  { id: 'block10', title: 'Цифровая репутация',      icon: '🌐', short: 'Репутация' },
  { id: 'block11', title: 'Финальная атака',         icon: '⚔️', short: 'Финал' },
];

const STORAGE_KEY = 'cyberpatrol_progress_v2';

// Структура прогресса:
// {
//   completed: ['intro', 'block1', ...],
//   lastPlayed: 'block2',
//   results: {
//     block1: { correct: 5, total: 6 },
//     block2: { correct: 7, total: 8 },
//     ...
//   },
//   finalBattle: { correct: 8, total: 10, rank: 'Киберзащитник' }
// }

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completed: [], lastPlayed: null, results: {}, finalBattle: null };
    const parsed = JSON.parse(raw);
    return {
      completed: parsed.completed || [],
      lastPlayed: parsed.lastPlayed || null,
      results: parsed.results || {},
      finalBattle: parsed.finalBattle || null,
    };
  } catch {
    return { completed: [], lastPlayed: null, results: {}, finalBattle: null };
  }
}

export function markCompleted(blockId, result = null) {
  const progress = loadProgress();
  if (!progress.completed.includes(blockId)) {
    progress.completed.push(blockId);
  }
  progress.lastPlayed = blockId;
  if (result) {
    if (blockId === 'block11') {
      progress.finalBattle = result;
    } else {
      progress.results[blockId] = result;
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  return progress;
}

export function resetProgress() {
  localStorage.removeItem(STORAGE_KEY);
}

export function isBlockUnlocked(blockId, progress) {
  const index = BLOCKS.findIndex((b) => b.id === blockId);
  if (index <= 0) return true;
  const prevBlock = BLOCKS[index - 1];
  return progress.completed.includes(prevBlock.id);
}

// Процент прогресса — теперь учитывает ВСЕ блоки, включая финальную атаку
export function getProgressPercent(progress) {
  const total = BLOCKS.length - 1; // без intro = 11 блоков
  const done = progress.completed.filter((id) => id !== 'intro').length;
  return Math.min(100, Math.round((done / total) * 100));
}

// Получить ранг по результату финальной битвы
export function getRankFromScore(score, total) {
  const percent = (score / total) * 100;
  if (percent >= 90) return 'Легенда КиберПатруля';
  if (percent >= 70) return 'Киберзащитник';
  if (percent >= 50) return 'Патрульный';
  return 'Новичок';
}

// Средний балл по всем пройденным блокам
export function getAverageScore(progress) {
  const results = Object.values(progress.results);
  if (results.length === 0) return 0;
  const totalCorrect = results.reduce((sum, r) => sum + r.correct, 0);
  const totalQuestions = results.reduce((sum, r) => sum + r.total, 0);
  return Math.round((totalCorrect / totalQuestions) * 100);
}

// Достижения
export function getAchievements(progress) {
  const achievements = [];

  // Пройдено всё
  const allBlocksDone = BLOCKS.filter(b => b.id !== 'intro')
    .every(b => progress.completed.includes(b.id));
  if (allBlocksDone) {
    achievements.push({ id: 'all', icon: '🏆', title: 'Полный курс', desc: 'Пройдены все миссии' });
  }

  // Финальная битва пройдена
  if (progress.completed.includes('block11')) {
    achievements.push({ id: 'final', icon: '⚔️', title: 'Победитель', desc: 'Финальная битва пройдена' });
  }

  // Легенда
  if (progress.finalBattle && progress.finalBattle.rank === 'Легенда КиберПатруля') {
    achievements.push({ id: 'legend', icon: '👑', title: 'Легенда', desc: 'Максимальный ранг в финале' });
  }

  // Идеальные блоки (без ошибок)
  const perfectBlocks = Object.entries(progress.results)
    .filter(([_, r]) => r.correct === r.total)
    .length;
  if (perfectBlocks >= 5) {
    achievements.push({ id: 'perfect5', icon: '💎', title: 'Безупречно', desc: '5+ блоков без ошибок' });
  }
  if (perfectBlocks >= 10) {
    achievements.push({ id: 'perfect10', icon: '⭐', title: 'Идеально', desc: '10+ блоков без ошибок' });
  }

  // Первый пройденный блок
  if (progress.completed.length >= 2) {
    achievements.push({ id: 'first', icon: '🎯', title: 'Первый шаг', desc: 'Первый блок пройден' });
  }

  return achievements;
}