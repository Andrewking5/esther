import React, { useState } from 'react';
import { useLang } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLang();
  const [clicks, setClicks] = useState(0);
  const [showEgg, setShowEgg] = useState(false);

  const handleEgg = () => {
    const next = clicks + 1;
    setClicks(next);
    if (next >= 5) {
      setShowEgg(true);
      setTimeout(() => { setShowEgg(false); setClicks(0); }, 3000);
    }
  };

  return (
    <footer className="w-full border-t border-pink-100/50 mt-20 bg-gradient-to-r from-pink-50/30 via-white to-emerald-50/30">
      <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 py-10 gap-4 max-w-7xl mx-auto">
        <div
          className="font-mono text-[10px] uppercase tracking-widest text-pink-400 cursor-default select-none"
          onClick={handleEgg}
        >
          {showEgg ? '🧬✨ 你發現了隱藏彩蛋！很高興認識你~ 💕' : '🧪 En-Tzu Yeh · 2025'}
        </div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-slate-400 text-center">
          {t.footer.copyright}
        </div>
        <div className="flex gap-6">
          <a href="#" className="font-mono text-[10px] uppercase tracking-widest text-pink-400 opacity-60 hover:opacity-100 transition-opacity">
            {t.footer.privacy}
          </a>
          <a href="/resume.pdf" download className="font-mono text-[10px] uppercase tracking-widest text-emerald-600 opacity-60 hover:opacity-100 transition-opacity">
            {t.footer.downloadPdf}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
