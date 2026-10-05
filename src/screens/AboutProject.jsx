import { motion } from 'framer-motion';
import { BLOCKS } from '../utils/progress';
import './AboutProject.css';

export default function AboutProject({ onBack, onLevels }) {
  return (
    <div className="about-screen">
      <div className="about-bg" />
      <div className="about-glow glow-1" />
      <div className="about-glow glow-2" />

      <button className="back-btn-inline" onClick={onBack}>← На главную</button>

      <motion.div
        className="about-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="about-badge">🛡️</div>
        <h1 className="about-title">
          Кибер<span className="accent">Патруль</span> школы
        </h1>
        <p className="about-tagline">Образовательная веб-игра по основам кибербезопасности</p>

        <div className="about-section">
          <h2>💡 Как появилась идея</h2>
          <p>
            Идея проекта появилась после того, как я заметила: мои младшие знакомые и одноклассники
            часто попадаются на уловки интернет-мошенников. Кто-то перешёл по фишинговой ссылке,
            кто-то потерял аккаунт в игре, а кто-то получил странное сообщение «от банка».
          </p>
          <p>
            Я поняла: школьникам не хватает знаний о том, как защитить себя в интернете. А скучные
            памятки и предупреждения учителей они не читают. Тогда я решила сделать то, что будет
            им интересно — игру, в которой можно не просто узнать о киберугрозах, но и столкнуться
            с ними лицом к лицу в безопасной обстановке.
          </p>
          <p>
            Так появился «КиберПатруль школы» — интерактивная веб-игра, где игрок становится
            защитником своей школы от хакеров и мошенников.
          </p>
        </div>

        <div className="about-section">
          <h2>🎯 Цель проекта</h2>
          <p>
            Научить школьников 5–9 классов основам кибербезопасности через игру: распознавать
            фишинг, защищать аккаунты, не попадаться на мошеннические схемы, безопасно вести себя
            в соцсетях и играх.
          </p>
        </div>

        <div className="about-section">
          <h2>🎮 Что внутри игры</h2>
          <p>Игра состоит из <b>11 миссий</b> и финального испытания. Каждая миссия — отдельная тема:</p>
          <div className="about-blocks">
            {BLOCKS.filter(b => b.id !== 'intro').map((block) => (
              <div key={block.id} className="about-block-item">
                <span className="about-block-icon">{block.icon}</span>
                <span className="about-block-title">{block.title}</span>
              </div>
            ))}
          </div>
          <p className="about-note">
            В финале игрок проходит 10 раундов из разных тем, получает ранг и может скачать
            именной сертификат в PDF.
          </p>
        </div>

        <div className="about-section">
          <h2>🛠️ Технологии</h2>
          <p className="about-tech">
            <span>React</span> · <span>Vite</span> · <span>Framer Motion</span> ·{' '}
            <span>LocalStorage</span> · <span>html2pdf.js</span> · <span>Vercel</span>
          </p>
          <p className="about-note">
            Игра работает в любом браузере — на компьютере, планшете, телефоне. Без установки.
          </p>
        </div>

        <div className="about-section">
          <h2>👤 Автор</h2>
          <div className="about-author">
            <p><b>Василевская Анастасия Андреевна</b>,<br />
              учащаяся 11 класса<br />
              ГУО «Средняя школа №1 г. Горки»
            </p>
            <p><b>Руководитель:</b><br />
              Понкратова Анастасия Александровна,<br />
              учитель информатики<br />
              ГУО «Средняя школа №1 г. Горки»
            </p>
            <p className="about-year">2026 год</p>
          </div>
        </div>

        <div className="about-actions">
          <button className="btn-primary" onClick={onLevels}>
            🎮 Перейти к миссиям
          </button>
          <button className="btn-secondary" onClick={onBack}>
            На главную
          </button>
        </div>
      </motion.div>
    </div>
  );
}