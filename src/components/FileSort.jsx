import { useState } from 'react';
import { motion } from 'framer-motion';
import { files } from '../data/malwareData';
import './filesort.css';

export default function FileSort({ onComplete }) {
  const [placed, setPlaced] = useState({});
  const [finished, setFinished] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const unplaced = files.filter((f) => !placed[f.id]);

  const handleSelectFile = (file) => {
    if (finished) return;
    setSelectedFile(file);
  };

  const handlePlace = (category) => {
    if (!selectedFile || finished) return;
    setPlaced((prev) => ({ ...prev, [selectedFile.id]: category }));
    setSelectedFile(null);
  };

  const handleUndo = (id) => {
    if (finished) return;
    setPlaced((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleCheck = () => {
    setFinished(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isCorrect = (file) => {
    return (
      (file.isDangerous && placed[file.id] === 'danger') ||
      (!file.isDangerous && placed[file.id] === 'safe')
    );
  };

  const correctCount = files.filter((f) => isCorrect(f)).length;
  const allPlaced = files.every((f) => placed[f.id]);

  const renderFile = (file, inColumn) => {
    let className = 'fs-file';
    if (selectedFile?.id === file.id) className += ' selected';
    if (finished && inColumn) {
      className += isCorrect(file) ? ' correct' : ' wrong';
    }
    return (
      <motion.div
        key={file.id}
        className={className}
        onClick={() => {
          if (finished) return;
          if (inColumn) handleUndo(file.id);
          else handleSelectFile(file);
        }}
        whileHover={!finished ? { scale: 1.02 } : {}}
        whileTap={!finished ? { scale: 0.98 } : {}}
        layout
      >
        <div className="fs-file-icon">{file.icon}</div>
        <div className="fs-file-content">
          <div className="fs-file-name">{file.name}</div>
          <div className="fs-file-info">{file.size} • {file.source}</div>
          <div className="fs-file-short">{file.short}</div>
        </div>
        {finished && inColumn && (
          <div className="fs-file-mark">{isCorrect(file) ? '✅' : '❌'}</div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="fs-game">
      <div className="fs-header">
        <h2>📁 Раздели файлы</h2>
        <p>
          Ты скачал файлы из интернета. Нажимай на файл, а затем выбери, куда его
          отнести: <b>безопасный</b> или <b>опасный</b>.
        </p>
      </div>

      {!finished && (
        <div className="fs-pool">
          <div className="fs-pool-label">
            Файлы ({unplaced.length} осталось)
          </div>
          <div className="fs-pool-list">
            {unplaced.length === 0 ? (
              <div className="fs-pool-empty">
                Все файлы распределены. Нажми «Проверить».
              </div>
            ) : (
              unplaced.map((f) => renderFile(f, false))
            )}
          </div>
        </div>
      )}

      {selectedFile && !finished && (
        <motion.div
          className="fs-actions"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="fs-actions-label">
            Куда отнести «{selectedFile.name}»?
          </div>
          <div className="fs-actions-buttons">
            <button className="fs-btn safe" onClick={() => handlePlace('safe')}>
              ✅ Безопасный
            </button>
            <button className="fs-btn danger" onClick={() => handlePlace('danger')}>
              ⚠️ Опасный
            </button>
          </div>
        </motion.div>
      )}

      <div className="fs-columns">
        <div className="fs-column safe-col">
          <div className="fs-column-header">✅ Безопасные</div>
          <div className="fs-column-list">
            {files
              .filter((f) => placed[f.id] === 'safe')
              .map((f) => renderFile(f, true))}
          </div>
        </div>

        <div className="fs-column danger-col">
          <div className="fs-column-header">⚠️ Опасные</div>
          <div className="fs-column-list">
            {files
              .filter((f) => placed[f.id] === 'danger')
              .map((f) => renderFile(f, true))}
          </div>
        </div>
      </div>

      {!finished ? (
        <button
          className="btn-primary fs-check-btn"
          onClick={handleCheck}
          disabled={!allPlaced}
        >
          Проверить {!allPlaced && `(${Object.keys(placed).length}/6)`}
        </button>
      ) : (
        <motion.div
          className="fs-feedback"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="fs-feedback-title">
            {correctCount === files.length
              ? '🎉 Отлично! Ты правильно распределил все файлы!'
              : `Правильно: ${correctCount} из ${files.length}`}
          </div>

          <div className="fs-feedback-list">
            {files.map((f) => (
              <div key={f.id} className="fs-feedback-item">
                <span className={`fs-feedback-icon ${f.isDangerous ? 'danger' : 'safe'}`}>
                  {f.isDangerous ? '⚠️' : '✅'}
                </span>
                <div>
                  <div className="fs-feedback-label">
                    {f.icon} <b>{f.name}</b>
                  </div>
                  <div className="fs-feedback-reason">{f.reason}</div>
                </div>
              </div>
            ))}
          </div>

          <button
            className="btn-primary"
            onClick={() => onComplete({ correct: correctCount, total: files.length })}
          >
            Продолжить →
          </button>
        </motion.div>
      )}
    </div>
  );
}