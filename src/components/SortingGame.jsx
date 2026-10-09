import { useState } from 'react';
import { motion } from 'framer-motion';
import { financialOffers } from '../data/financialSchemes';
import './sorting.css';

export default function SortingGame({ onComplete }) {
  const [placed, setPlaced] = useState({});
  const [finished, setFinished] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const unplaced = financialOffers.filter((o) => !placed[o.id]);

  const handleSelectOffer = (offer) => {
    if (finished) return;
    setSelectedOffer(offer);
  };

  const handlePlace = (category) => {
    if (!selectedOffer || finished) return;
    setPlaced((prev) => ({ ...prev, [selectedOffer.id]: category }));
    setSelectedOffer(null);
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

  const isCorrect = (offer) => {
    return (
      (offer.isScam && placed[offer.id] === 'scam') ||
      (!offer.isScam && placed[offer.id] === 'safe')
    );
  };

  const correctCount = financialOffers.filter((o) => isCorrect(o)).length;
  const allPlaced = financialOffers.every((o) => placed[o.id]);

  const renderOffer = (offer, inColumn) => {
    let className = 'sort-offer';
    if (selectedOffer?.id === offer.id) className += ' selected';
    if (finished && inColumn) {
      className += isCorrect(offer) ? ' correct' : ' wrong';
    }
    return (
      <motion.div
        key={offer.id}
        className={className}
        onClick={() => {
          if (finished) return;
          if (inColumn) handleUndo(offer.id);
          else handleSelectOffer(offer);
        }}
        whileHover={!finished ? { scale: 1.02 } : {}}
        whileTap={!finished ? { scale: 0.98 } : {}}
        layout
      >
        <div className="sort-offer-icon">{offer.icon}</div>
        <div className="sort-offer-content">
          <div className="sort-offer-title">{offer.title}</div>
          <div className="sort-offer-short">{offer.short}</div>
        </div>
        {finished && inColumn && (
          <div className="sort-offer-mark">{isCorrect(offer) ? '✅' : '❌'}</div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="sort-game">
      <div className="sort-header">
        <h2>📊 Раздели предложения</h2>
        <p>
          Перед тобой 6 финансовых предложений. Нажимай на предложение, а затем
          выбери, куда его отнести: <b>надёжное</b> или <b>мошенническое</b>.
        </p>
      </div>

      {!finished && (
        <div className="sort-pool">
          <div className="sort-pool-label">
            Предложения ({unplaced.length} осталось)
          </div>
          <div className="sort-pool-list">
            {unplaced.length === 0 ? (
              <div className="sort-pool-empty">
                Все предложения распределены. Нажми «Проверить».
              </div>
            ) : (
              unplaced.map((o) => renderOffer(o, false))
            )}
          </div>
        </div>
      )}

      {selectedOffer && !finished && (
        <motion.div
          className="sort-actions"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="sort-actions-label">
            Куда отнести «{selectedOffer.title}»?
          </div>
          <div className="sort-actions-buttons">
            <button className="sort-btn safe" onClick={() => handlePlace('safe')}>
              ✅ Надёжное
            </button>
            <button className="sort-btn scam" onClick={() => handlePlace('scam')}>
              ⚠️ Мошенническое
            </button>
          </div>
        </motion.div>
      )}

      <div className="sort-columns">
        <div className="sort-column safe-col">
          <div className="sort-column-header">✅ Надёжные</div>
          <div className="sort-column-list">
            {financialOffers
              .filter((o) => placed[o.id] === 'safe')
              .map((o) => renderOffer(o, true))}
          </div>
        </div>

        <div className="sort-column scam-col">
          <div className="sort-column-header">⚠️ Мошеннические</div>
          <div className="sort-column-list">
            {financialOffers
              .filter((o) => placed[o.id] === 'scam')
              .map((o) => renderOffer(o, true))}
          </div>
        </div>
      </div>

      {!finished ? (
        <button
          className="btn-primary sort-check-btn"
          onClick={handleCheck}
          disabled={!allPlaced}
        >
          Проверить {!allPlaced && `(${Object.keys(placed).length}/6)`}
        </button>
      ) : (
        <motion.div
          className="sort-feedback"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="sort-feedback-title">
            {correctCount === financialOffers.length
              ? '🎉 Отлично! Ты правильно распределил все предложения!'
              : `Правильно: ${correctCount} из ${financialOffers.length}`}
          </div>

          <div className="sort-feedback-list">
            {financialOffers.map((o) => (
              <div key={o.id} className="sort-feedback-item">
                <span className={`sort-feedback-icon ${o.isScam ? 'danger' : 'safe'}`}>
                  {o.isScam ? '⚠️' : '✅'}
                </span>
                <div>
                  <div className="sort-feedback-label">
                    {o.icon} <b>{o.title}</b>
                  </div>
                  <div className="sort-feedback-reason">{o.reason}</div>
                </div>
              </div>
            ))}
          </div>

          <button
            className="btn-primary"
            onClick={() => onComplete({ correct: correctCount, total: financialOffers.length })}
          >
            Продолжить →
          </button>
        </motion.div>
      )}
    </div>
  );
}