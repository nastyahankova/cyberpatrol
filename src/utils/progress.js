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

const STORAGE_KEY = 'cyberpatrol_progress_v1';

// Прочитать прогресс
export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completed: [], lastPlayed: null };
    return JSON.parse(raw);
  } catch {
    return { completed: [], lastPlayed: null };
  }
}

// Сохранить прохождение блока
export function markCompleted(blockId) {
  const progress = loadProgress();
  if (!progress.completed.includes(blockId)) {
    progress.completed.push(blockId);
  }
  progress.lastPlayed = blockId;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  return progress;
}

// Сбросить прогресс
export function resetProgress() {
  localStorage.removeItem(STORAGE_KEY);
}

// Проверить, открыт ли блок
export function isBlockUnlocked(blockId, progress) {
  const index = BLOCKS.findIndex((b) => b.id === blockId);
  if (index <= 0) return true; // Знакомство всегда открыто

  const prevBlock = BLOCKS[index - 1];
  return progress.completed.includes(prevBlock.id);
}

// Прогресс в процентах
export function getProgressPercent(progress) {
  const total = BLOCKS.length - 1; // без intro
  const done = progress.completed.length;
  return Math.round((done / total) * 100);
}