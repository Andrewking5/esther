import React, { useState } from 'react';
import { Mail, Menu, X, Globe } from 'lucide-react';
import { useLang } from '../contexts/LanguageContext';
import { Lang, langLabels } from '../i18n';

const navEmojis: Record<string, string> = {
  research: '🔬',
  skills: '🧬',
  resume: '📚',
  experience: '💼',
  contact: '💌',
};

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection, setActiveSection }) => {
  const { lang, setLang, t } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const navItems = [
    { id: 'research', label: t.nav.research },
    { id: 'skills', label: t.nav.skills },
    { id: 'resume', label: t.nav.resume },
    { id: 'experience', label: t.nav.experience },
    { id: 'contact', label: t.nav.contact },
  ];

  const handleNav = (id: string) => {
    setActiveSection(id);
    setMobileOpen(false);
  };

  return (
    <nav className="sticky top-0 w-full z-50 glass-nav border-b border-pink-100/60">
      <div className="flex justify-between items-center px-6 md:px-8 py-4 max-w-7xl mx-auto">
        <div
          className="text-2xl font-headline italic text-emerald-800 cursor-pointer flex items-center gap-2"
          onClick={() => handleNav('home')}
        >
          <span>🧪</span>
          {t.nav.brand}
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex gap-5 items-center">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`font-headline tracking-tight transition-all flex items-center gap-1.5 px-2 py-1 rounded-lg ${
                activeSection === item.id
                  ? 'text-pink-600 bg-pink-50/60'
                  : 'text-slate-500 hover:text-emerald-700 hover:bg-emerald-50/40'
              }`}
            >
              <span className="text-xs">{navEmojis[item.id]}</span>
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-mono text-emerald-800 hover:bg-pink-50 transition-all border border-pink-100"
            >
              <Globe size={14} />
              <span className="hidden sm:inline">{langLabels[lang]}</span>
            </button>
            {langOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-pink-100 py-1 z-50 min-w-[140px]">
                  {(Object.keys(langLabels) as Lang[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => { setLang(l); setLangOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm font-mono transition-colors ${
                        lang === l ? 'text-pink-600 bg-pink-50' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {langLabels[l]}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <a href="mailto:estheryeh1124@gmail.com" className="p-2 hover:bg-pink-50/50 rounded-full transition-all text-pink-500">
            <Mail size={20} />
          </a>

          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-200 hidden sm:block avatar-glow">
            <img
              src="/profile.jpg"
              alt="En-Tzu Yeh"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 hover:bg-pink-50/50 rounded-full transition-all text-slate-700"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-pink-100/50 bg-white/95 backdrop-blur-xl">
          <div className="flex flex-col px-6 py-4 gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`text-left py-3 px-4 rounded-xl font-headline transition-colors flex items-center gap-2 ${
                  activeSection === item.id
                    ? 'text-pink-600 bg-pink-50'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{navEmojis[item.id]}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
