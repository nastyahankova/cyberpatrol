import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './Certificate.css';

export default function Certificate({ score, total, rank }) {
  const [name, setName] = useState('');
  const [issued, setIssued] = useState(false);
  const certRef = useRef(null);

  const today = new Date();
  const dateStr = today.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleIssue = () => {
    if (!name.trim()) return;
    setIssued(true);
  };

  const handleDownload = async () => {
    if (!certRef.current) return;
    const html2pdf = (await import('html2pdf.js')).default;

    const opt = {
      margin: 0,
      filename: `Сертификат_${name}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        scale: 3,
        backgroundColor: '#fafaf5',
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: certRef.current.scrollWidth,
        windowHeight: certRef.current.scrollHeight,
      },
      jsPDF: {
        unit: 'mm',
        format: [297, 210],
        orientation: 'landscape',
      },
      pagebreak: { mode: 'avoid-all' },
    };

    html2pdf().set(opt).from(certRef.current).save();
  };

  if (!issued) {
    return (
      <div className="cert-form">
        <h3>🎓 Получи свой сертификат</h3>
        <p>Введи своё имя — оно будет вписано в сертификат.</p>
        <input
          type="text"
          className="cert-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Твоё имя и фамилия"
          maxLength={40}
        />
        <button
          className="btn-primary"
          onClick={handleIssue}
          disabled={!name.trim()}
        >
          Создать сертификат
        </button>
      </div>
    );
  }

  return (
    <motion.div
      className="cert-wrapper"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 150 }}
    >
      <div className="cert-scroll">
        <div className="certificate" ref={certRef}>
          <div className="cert-border-outer">
            <div className="cert-border-inner">
              <div className="cert-shield">🛡️</div>
              <div className="cert-title">СЕРТИФИКАТ</div>
              <div className="cert-subtitle">подтверждает, что</div>
              <div className="cert-name">{name}</div>
              <div className="cert-desc">
                успешно прошёл курс<br />
                <b>«КиберПатруль школы»</b><br />
                по основам кибербезопасности
              </div>

              <div className="cert-result">
                <div className="cert-result-item">
                  <div className="cert-result-label">Результат</div>
                  <div className="cert-result-value">{score} из {total}</div>
                </div>
                <div className="cert-result-item">
                  <div className="cert-result-label">Ранг</div>
                  <div className="cert-result-value">{rank}</div>
                </div>
              </div>

              <div className="cert-footer">
                <div className="cert-teacher">
                  <div className="cert-teacher-line"></div>
                  <div className="cert-teacher-name">Учитель информатики</div>
                </div>
                <div className="cert-date">
                  <div className="cert-teacher-line"></div>
                  <div className="cert-teacher-name">{dateStr}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="cert-actions">
        <button className="btn-primary" onClick={handleDownload}>
          📥 Скачать PDF
        </button>
      </div>
    </motion.div>
  );
}