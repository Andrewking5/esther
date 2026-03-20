import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView } from 'motion/react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Users,
  GraduationCap,
  Beaker,
  Globe,
  Brain,
  Microscope,
  Dna,
  BarChart3,
  Quote,
  CheckCircle2,
  ChevronRight,
  Briefcase,
  BookOpen,
  Award,
  Target,
  Eye,
  Zap,
  FileText,
  Heart,
} from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { LanguageProvider, useLang } from './contexts/LanguageContext';

/* ═══════════════════════════════════════════════════════════════
   SHARED COMPONENTS & HOOKS
   ═══════════════════════════════════════════════════════════════ */

/* ─── Cursor Glow ─── */
const CursorGlow = () => {
  const [pos, setPos] = useState({ x: -500, y: -500 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const leave = () => setVisible(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseleave', leave);
    };
  }, []);

  return <div className="cursor-glow hidden md:block" style={{ left: pos.x, top: pos.y, opacity: visible ? 1 : 0 }} />;
};

/* ─── Typewriter Effect ─── */
const Typewriter: React.FC<{ text: string; speed?: number; className?: string }> = ({ text, speed = 60, className = '' }) => {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span className={className}>
      {displayed}
      <span className={`typewriter-cursor ${done ? 'opacity-0' : ''}`} />
    </span>
  );
};

/* ─── Stagger Grid — children animate in one-by-one ─── */
const StaggerGrid = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.15, once: true });

  return (
    <div ref={ref} className={className}>
      {React.Children.map(children, (child, i) => {
        // Extract col-span / grid classes from child so motion wrapper doesn't break grid layout
        const childEl = child as React.ReactElement;
        const childClass: string = childEl?.props?.className || '';
        const gridClasses = (childClass.match(/((?:md:|lg:)?col-span-\d+)/g) || []).join(' ');

        return (
          <motion.div
            className={gridClasses}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
          >
            {child}
          </motion.div>
        );
      })}
    </div>
  );
};

/* ─── Skill Marquee (cute version with emojis) ─── */
const skillEmojis: Record<string, string> = {
  'PCR': '🧬', 'qPCR': '🧬', 'RT-PCR': '🧬', 'DNA/RNA Extraction': '🔬',
  'Gel Electrophoresis': '⚡', 'SDS-PAGE': '📊', 'Western Blot': '🎯',
  'LC': '💧', 'LC/MS': '💧', 'TLC': '🔍', 'Cell Culture': '🦠',
  'Aseptic Technique': '✨', 'Streak Isolation': '🧫',
  'Mouse IP Injection': '🐭', 'Mouse IM Injection': '🐭',
  'Blood Collection': '🩸', 'Serum Separation': '🧪',
  'Excel': '📈', 'Column Chromatography': '🧪',
};

const SkillMarquee = ({ items }: { items: string[] }) => {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden py-6 -mx-6 md:-mx-8">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 mx-2 rounded-full bg-white border border-pink-100 text-sm font-mono text-slate-600 whitespace-nowrap hover:border-pink-300 hover:text-pink-600 hover:bg-pink-50/50 transition-all card-cute"
          >
            <span>{skillEmojis[item] || '🔹'}</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ─── Test Tube Scroll Progress ─── */
const TestTubeProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="test-tube-container hidden lg:flex">
      <div className="text-xs mb-2">🧪</div>
      <div className="test-tube">
        <div
          className="test-tube-liquid"
          style={{ height: `${progress * 100}%` }}
        />
        {progress > 0.1 && progress < 0.95 && (
          <>
            <div className="test-tube-bubble" style={{ left: '4px', bottom: `${progress * 60}%`, animationDelay: '0s' }} />
            <div className="test-tube-bubble" style={{ left: '8px', bottom: `${progress * 40}%`, animationDelay: '0.7s' }} />
          </>
        )}
      </div>
      <div className="font-mono text-[9px] text-pink-400 mt-1">{Math.round(progress * 100)}%</div>
    </div>
  );
};

/* ─── Emoji Progress Circle ─── */
const sectionEmojis: Record<string, string> = {
  home: '🏠', research: '🔬', skills: '🧬', resume: '📚', experience: '💼', contact: '💌',
};

const EmojiProgress = ({ activeSection }: { activeSection: string }) => {
  const [progress, setProgress] = useState(0);
  const radius = 20;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="emoji-progress hidden md:block">
      <svg width="52" height="52" viewBox="0 0 52 52">
        <circle cx="26" cy="26" r={radius} fill="white" stroke="#fce7f3" strokeWidth="3" />
        <circle
          cx="26" cy="26" r={radius}
          fill="none"
          stroke="url(#progress-gradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          className="emoji-progress-ring"
        />
        <defs>
          <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6ee7b7" />
            <stop offset="50%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#f9a8d4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-lg">
        {sectionEmojis[activeSection] || '🏠'}
      </div>
    </div>
  );
};

/* ─── Wave Divider ─── */
const WaveDivider = ({ flip = false }: { flip?: boolean }) => (
  <div className={`wave-divider ${flip ? 'rotate-180' : ''}`}>
    <svg viewBox="0 0 1200 40" preserveAspectRatio="none">
      <path
        d="M0,20 C150,40 350,0 600,20 C850,40 1050,0 1200,20 L1200,40 L0,40 Z"
        fill="#fdf2f8"
        opacity="0.5"
      />
      <path
        d="M0,25 C200,35 400,10 600,25 C800,35 1000,15 1200,25 L1200,40 L0,40 Z"
        fill="#ecfdf5"
        opacity="0.3"
      />
    </svg>
  </div>
);

/* ─── Section wrapper with scroll-triggered animation ─── */
const Section = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { amount: 0.15, once: true });

  return (
    <section id={id} ref={ref} className="scroll-mt-20">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </section>
  );
};

/* ─── Active section detection ─── */
function useActiveSection(sectionIds: string[]) {
  const [active, setActive] = useState(sectionIds[0]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: '-40% 0px -50% 0px' }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [sectionIds]);

  return active;
}

/* ─── Counter animation ─── */
const AnimatedCounter = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let frame: number;
    const duration = 1500;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value, isInView]);

  return <span ref={ref}>{count}{suffix}</span>;
};

/* ═══════════════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════════════ */

function AppInner() {
  const sectionIds = ['home', 'research', 'skills', 'resume', 'experience', 'contact'];
  const activeSection = useActiveSection(sectionIds);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col grain-overlay">
      <TestTubeProgress />
      <EmojiProgress activeSection={activeSection} />
      <Navbar activeSection={activeSection} setActiveSection={scrollTo} />
      <main className="flex-grow">
        <Section id="home"><HomeContent /></Section>
        <WaveDivider />
        <Section id="research"><ResearchContent /></Section>
        <WaveDivider flip />
        <Section id="skills"><SkillsContent /></Section>
        <WaveDivider />
        <Section id="resume"><ResumeContent /></Section>
        <WaveDivider flip />
        <Section id="experience"><ExperienceContent /></Section>
        <WaveDivider />
        <Section id="contact"><ContactContent /></Section>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppInner />
    </LanguageProvider>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HOME
   ═══════════════════════════════════════════════════════════════ */
const HomeContent = () => {
  const { t, lang } = useLang();
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-20">
      {/* Hero with Typewriter */}
      <section className="grid grid-cols-12 gap-6 md:gap-8 mb-20 md:mb-32">
        <div className="col-span-12 md:col-span-8">
          <div className="flex items-center gap-6 mb-6">
            <motion.div
              className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-pink-200 shadow-lg shrink-0 avatar-glow"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            >
              <img src="/profile.jpg" alt="En-Tzu Yeh" className="w-full h-full object-cover" />
            </motion.div>
            <div>
              <motion.span
                className="font-mono text-emerald-600 tracking-[0.2em] uppercase text-xs mb-2 block"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {t.home.subtitle}
              </motion.span>
              <h1 className="font-headline text-4xl md:text-7xl text-slate-900 leading-[1.1]">
                <Typewriter text={t.home.name} speed={80} key={`name-${lang}`} />
                <br />
                <span className="italic text-emerald-700">
                  <Typewriter text={t.home.nameCn} speed={120} key={`nameCn-${lang}`} />
                </span>
              </h1>
            </div>
          </div>
          <motion.p
            className="text-sm md:text-base text-slate-500 font-mono mb-8 max-w-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            {t.home.tagline}
          </motion.p>
          <motion.div
            className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -translate-y-12 translate-x-12 blur-3xl group-hover:bg-emerald-100 transition-all duration-700"></div>
            <p className="text-lg md:text-xl font-headline leading-relaxed text-slate-700 max-w-2xl relative z-10">
              {t.home.quote}
            </p>
          </motion.div>
        </div>
        <div className="col-span-12 md:col-span-4 flex flex-col gap-6 justify-end">
          <motion.div
            className="border-l border-slate-200 pl-6 md:pl-8 pb-4"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-2">{t.home.locationStrategy}</p>
            <p className="text-sm text-slate-600">{t.home.locationDesc}</p>
          </motion.div>
          <motion.div
            className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-emerald-700 mb-3">{t.home.jobIntent}</h3>
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block">{t.home.targetPosition}</span>
                <p className="text-xs text-slate-700 leading-relaxed">{t.home.positions}</p>
              </div>
              <div className="flex gap-6">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block">{t.home.availability}</span>
                  <p className="text-xs text-emerald-700 font-medium">{t.home.availableNow}</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block">{t.home.expectedLocation}</span>
                  <p className="text-xs text-slate-700">{t.home.shenzhen}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Leadership & Skills — Stagger */}
      <section className="mb-20 md:mb-32">
        <div className="flex items-baseline gap-4 mb-12">
          <h2 className="font-headline text-3xl md:text-4xl italic">{t.home.leadershipTitle}</h2>
          <div className="h-px flex-grow bg-slate-200"></div>
        </div>
        <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between min-h-[280px] card-cute transition-all">
            <div>
              <div className="flex justify-between items-start mb-6">
                <Users className="text-emerald-600" size={32} />
                <span className="font-mono text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">{t.home.campusLeadership}</span>
              </div>
              <h3 className="font-headline text-2xl md:text-3xl mb-4">{t.home.uniqloTitle}</h3>
              <p className="text-slate-600 max-w-md text-sm">{t.home.uniqloDesc}</p>
              <p className="text-xs font-mono text-slate-400 mt-3">{t.home.uniqloDate}</p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col card-cute transition-all">
            <GraduationCap className="text-emerald-600 mb-6" size={32} />
            <h3 className="font-headline text-2xl mb-2">{t.home.tutorTitle}</h3>
            <p className="text-xs font-mono text-slate-400 mb-3">{t.home.tutorDate}</p>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">{t.home.tutorDesc}</p>
            <div className="mt-auto pt-4 border-t border-slate-100">
              <span className="font-mono text-[10px] text-emerald-600 uppercase tracking-wider">{t.home.educationalTech}</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-600 to-teal-500 text-white p-8 rounded-2xl flex flex-col justify-between hover:from-emerald-700 hover:to-teal-600 transition-all">
            <div>
              <h3 className="font-headline text-2xl mb-2">{t.home.buddyTitle}</h3>
              <p className="text-xs font-mono text-emerald-200 mb-3">{t.home.buddyDate}</p>
              <p className="text-emerald-100 text-sm">{t.home.buddyDesc}</p>
            </div>
            <div className="flex gap-2 mt-6">
              <span>🌏</span>
              <span className="font-mono text-xs">{t.home.globalMindset}</span>
            </div>
          </div>
          <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-100 card-cute transition-all">
            <div>
              <h3 className="font-headline text-2xl mb-2">{t.home.softSkillsTitle}</h3>
              <p className="text-slate-600 text-sm mb-4">{t.home.softSkillsDesc}</p>
              <div className="flex flex-wrap gap-2">
                {[t.home.problemSolving, t.home.teamCollaboration, t.home.adaptability].map(skill => (
                  <span key={skill} className="bg-slate-50 text-slate-500 text-[10px] font-mono px-3 py-1.5 rounded-full">{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </StaggerGrid>
      </section>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   RESEARCH
   ═══════════════════════════════════════════════════════════════ */
const ResearchContent = () => {
  const { t } = useLang();
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-20">
      <header className="mb-20 md:mb-32">
        <p className="font-mono text-emerald-600 uppercase tracking-widest mb-4">{t.research.profileLabel}</p>
        <h1 className="font-headline text-5xl md:text-8xl font-bold tracking-tighter text-slate-900 leading-tight mb-8">
          {t.research.name} <span className="italic font-normal text-emerald-700">{t.research.nameCn}</span>
        </h1>
        <p className="text-lg md:text-2xl text-slate-600 font-headline italic max-w-2xl border-l-2 border-emerald-200 pl-6">
          {t.research.intro}
        </p>
      </header>

      {/* Technical Mastery — Stagger */}
      <section className="mb-20 md:mb-32">
        <div className="flex items-baseline gap-4 mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">{t.research.techMastery}</h2>
          <div className="h-[1px] flex-grow bg-slate-200"></div>
          <span className="font-mono text-xs uppercase tracking-widest opacity-50">{t.research.techMasteryLabel}</span>
        </div>
        <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-slate-100 hover:border-emerald-200 transition-all">
            <div className="flex justify-between items-start mb-12 md:mb-16">
              <Beaker className="text-emerald-600" size={40} />
            </div>
            <h3 className="font-headline text-2xl md:text-3xl font-bold mb-4">{t.research.molBioTitle}</h3>
            <p className="text-slate-600 mb-8 max-w-md text-sm md:text-base">{t.research.molBioDesc}</p>
            <div className="flex flex-wrap gap-2">
              {['qPCR', 'RT-PCR', 'Electrophoresis', 'SDS-PAGE', 'Western Blot'].map(tag => (
                <span key={tag} className="px-4 py-1 rounded-full bg-emerald-50 text-emerald-700 font-mono text-xs">{tag}</span>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-800 to-teal-700 rounded-2xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <Brain size={120} />
            </div>
            <div className="flex justify-between items-start mb-12 md:mb-16">
              <Microscope size={40} />
              <div className="text-right">
                <span className="font-mono text-[10px] uppercase tracking-tighter opacity-60">{t.research.animalExpLab}</span>
                <p className="font-mono text-xs text-emerald-300 mt-1">{t.research.animalExpDate}</p>
              </div>
            </div>
            <h3 className="font-headline text-2xl md:text-3xl font-bold mb-4">{t.research.animalExpTitle}</h3>
            <p className="opacity-80 text-sm leading-relaxed">{t.research.animalExpDesc}</p>
          </div>
        </StaggerGrid>
      </section>

      {/* Selected Research Project */}
      <section className="mb-20 md:mb-32 py-16 md:py-24 px-8 md:px-12 bg-slate-50 rounded-[2rem] relative overflow-hidden">
        <div className="max-w-4xl relative z-10">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-block px-3 py-1 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] uppercase tracking-widest">{t.research.selectedProject}</span>
            <span className="font-mono text-xs text-slate-400">{t.research.projectDate}</span>
          </div>
          <h2 className="font-headline text-3xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">
            {t.research.projectTitle}<br /><span className="text-emerald-700 italic">{t.research.projectTitleHighlight}</span>
          </h2>
          <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-12">
            <div>
              <h4 className="font-mono text-xs text-emerald-700 font-bold uppercase mb-4 tracking-widest">{t.research.insightsLabel}</h4>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">{t.research.insightsText}</p>
            </div>
            <div className="space-y-6">
              {[
                { title: t.research.methodology1Title, desc: t.research.methodology1Desc },
                { title: t.research.methodology2Title, desc: t.research.methodology2Desc }
              ].map(item => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="text-emerald-700" size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{item.title}</p>
                    <p className="text-sm text-slate-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </StaggerGrid>
        </div>
      </section>

    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   SKILLS — with Marquee
   ═══════════════════════════════════════════════════════════════ */
const SkillsContent = () => {
  const { t } = useLang();

  const allSkills = [
    'PCR', 'qPCR', 'RT-PCR', 'DNA/RNA Extraction', 'Gel Electrophoresis',
    'SDS-PAGE', 'Western Blot', 'LC', 'LC/MS', 'TLC',
    'Cell Culture', 'Aseptic Technique', 'Streak Isolation',
    'Mouse IP Injection', 'Mouse IM Injection', 'Blood Collection',
    'Serum Separation', 'Excel', 'Column Chromatography',
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-20">
      <div className="flex items-baseline gap-4 mb-12 md:mb-16">
        <h2 className="font-headline text-3xl md:text-5xl">{t.skills.title}</h2>
        <span className="h-px flex-1 bg-slate-200"></span>
        <span className="font-mono text-xs text-slate-400 tracking-widest hidden md:block">{t.skills.coreCompetencies}</span>
      </div>

      {/* ★ Skill Marquee */}
      <SkillMarquee items={allSkills} />

      {/* Major Fields — Stagger */}
      <StaggerGrid className="grid grid-cols-12 gap-6 mb-12 mt-8">
        <div className="col-span-12 md:col-span-8 bg-white p-8 md:p-10 rounded-2xl border border-slate-100 relative overflow-hidden group card-cute transition-all">
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <span className="font-mono text-[10px] tracking-widest text-emerald-600 mb-4 block">{t.skills.researchField}</span>
              <h4 className="font-headline text-2xl md:text-3xl mb-4">{t.skills.bioTechTitle}</h4>
              <p className="text-slate-600 max-w-md leading-relaxed text-sm md:text-base">{t.skills.bioTechDesc}</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {['PCR', 'SDS-PAGE', 'Western Blot', 'LC/MS', 'TLC', 'Cell Culture'].map(tag => (
                <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-mono rounded-full">{tag}</span>
              ))}
            </div>
          </div>
          <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-5 pointer-events-none">
            <Dna className="w-full h-full text-emerald-900" />
          </div>
        </div>
        <div className="col-span-12 md:col-span-4 bg-slate-900 text-white p-8 md:p-10 rounded-2xl flex flex-col justify-between hover:bg-slate-800 transition-colors">
          <div>
            <span className="font-mono text-[10px] tracking-widest text-emerald-400 mb-4 block">{t.skills.techManagement}</span>
            <h4 className="font-headline text-2xl md:text-3xl mb-4">{t.skills.techMgmtTitle}</h4>
            <p className="text-sm text-slate-300 leading-relaxed">{t.skills.techMgmtDesc}</p>
          </div>
          <div className="mt-8 flex gap-4">
            <BarChart3 className="text-emerald-400" size={24} />
            <Send className="text-emerald-400" size={24} />
          </div>
        </div>
        <div className="col-span-12 md:col-span-4 bg-emerald-700 text-white p-8 md:p-10 rounded-2xl flex flex-col justify-between hover:bg-emerald-800 transition-colors">
          <div>
            <h4 className="font-headline text-2xl md:text-3xl mb-4">{t.skills.crossFieldTitle}</h4>
            <p className="text-sm opacity-80 leading-relaxed">{t.skills.crossFieldDesc}</p>
          </div>
          <span className="font-mono text-[10px] tracking-[0.2em] opacity-60 mt-6">{t.skills.bridgeGap}</span>
        </div>
        <div className="col-span-12 md:col-span-8 bg-white p-8 md:p-10 rounded-2xl border border-slate-100 card-cute transition-all">
          <div>
            <span className="font-mono text-[10px] tracking-widest text-emerald-600 mb-4 block">{t.skills.labExperience}</span>
            <h4 className="font-headline text-2xl mb-2">{t.skills.labExpTitle}</h4>
            <p className="text-slate-600 text-sm leading-relaxed">{t.skills.labExpDesc}</p>
          </div>
        </div>
      </StaggerGrid>

      {/* Detailed Skills Grid — Stagger */}
      <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-2xl border border-slate-100 card-cute transition-all">
          <Beaker className="text-emerald-600 mb-4" size={28} />
          <h4 className="font-headline text-xl mb-4">{t.skills.expSkillsTitle}</h4>
          <ul className="space-y-3">
            {[t.skills.skill_pcr, t.skills.skill_protein, t.skills.skill_micro, t.skills.skill_lc, t.skills.skill_tlc, t.skills.skill_animal].map((skill, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <ChevronRight className="text-emerald-500 shrink-0 mt-0.5" size={14} />
                <span>{skill}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-slate-100 card-cute transition-all">
          <BarChart3 className="text-emerald-600 mb-4" size={28} />
          <h4 className="font-headline text-xl mb-4">{t.skills.dataToolsTitle}</h4>
          <ul className="space-y-3">
            {[t.skills.skill_excel, t.skills.skill_image, t.skills.skill_report].map((skill, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <ChevronRight className="text-emerald-500 shrink-0 mt-0.5" size={14} />
                <span>{skill}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h5 className="font-mono text-[10px] text-emerald-600 uppercase tracking-widest mb-3">{t.skills.langSkillsTitle}</h5>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">{t.skills.skill_chinese}</span>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => <div key={i} className="w-2 h-2 rounded-full bg-emerald-500" />)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">{t.skills.skill_english}</span>
                <div className="flex gap-1">
                  {[1,2,3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-emerald-500" />)}
                  {[4,5].map(i => <div key={i} className="w-2 h-2 rounded-full bg-slate-200" />)}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 text-white p-8 rounded-2xl">
          <BookOpen className="text-emerald-400 mb-4" size={28} />
          <h4 className="font-headline text-xl mb-4">{t.skills.academicTitle}</h4>
          <p className="text-sm text-slate-300 leading-relaxed">{t.skills.academicDesc}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {['90+', 'Oncology', 'Cell Signaling', 'Biopharmaceutics'].map(tag => (
              <span key={tag} className="px-3 py-1 bg-emerald-900/50 text-emerald-300 text-[10px] font-mono rounded-full">{tag}</span>
            ))}
          </div>
        </div>
      </StaggerGrid>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   RESUME
   ═══════════════════════════════════════════════════════════════ */
const ResumeContent = () => {
  const { t } = useLang();
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-20">
      {/* Hero */}
      <section className="flex flex-col md:flex-row gap-12 md:gap-16 items-baseline mb-20 md:mb-32">
        <div className="md:w-2/3">
          <span className="font-mono text-emerald-600 uppercase tracking-[0.2em] mb-4 block">{t.resume.personalNarrative}</span>
          <h1 className="font-headline text-5xl md:text-8xl text-slate-900 leading-tight tracking-tighter mb-8">
            {t.resume.name} <span className="italic font-light text-slate-400 text-3xl md:text-6xl">{t.resume.nameEn}</span>
          </h1>
          <div className="font-headline italic text-xl md:text-3xl text-slate-700 mb-8">{t.resume.motto}</div>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl leading-relaxed">{t.resume.bio}</p>
        </div>
        <div className="md:w-1/3 flex flex-col items-end">
          <motion.div
            className="bg-emerald-100 p-8 rounded-2xl shadow-sm rotate-2"
            whileHover={{ rotate: 0, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="font-mono text-emerald-800 text-5xl md:text-6xl font-bold">
              <AnimatedCounter value={193} />
            </div>
            <div className="font-mono text-emerald-700 text-sm mt-2 tracking-widest uppercase">{t.resume.creditsEarned}</div>
            <p className="mt-4 text-emerald-800 font-headline italic text-sm">{t.resume.creditsNote}</p>
          </motion.div>
        </div>
      </section>

      {/* Education */}
      <section className="bg-slate-50 py-16 md:py-24 rounded-[2rem] px-8 md:px-12 mb-20 md:mb-32">
        <StaggerGrid className="flex flex-col md:flex-row gap-12 items-start">
          <div className="md:w-1/2">
            <h2 className="font-headline text-3xl md:text-4xl mb-12">{t.resume.educationTitle}</h2>
            <div className="relative pl-8 border-l border-slate-200">
              <div className="absolute -left-1.5 top-2 w-3 h-3 rounded-full bg-emerald-600"></div>
              <h3 className="font-headline text-2xl text-slate-900">{t.resume.university}</h3>
              <p className="font-mono text-emerald-600 text-sm tracking-widest uppercase mt-1">{t.resume.universityEn}</p>
              <p className="font-mono text-xs text-slate-400 mt-1">{t.resume.eduDate}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <span className="bg-white px-3 py-1 rounded-full text-xs font-mono border border-slate-100">{t.resume.major}</span>
                <span className="bg-white px-3 py-1 rounded-full text-xs font-mono border border-slate-100">{t.resume.doubleMajor}</span>
                <span className="bg-emerald-50 px-3 py-1 rounded-full text-xs font-mono border border-emerald-100 text-emerald-700">{t.resume.degree}</span>
              </div>
              <p className="mt-6 text-slate-600 leading-relaxed text-sm">{t.resume.eduDesc}</p>
              <div className="mt-6">
                <span className="font-mono text-[10px] text-emerald-600 uppercase tracking-widest">{t.resume.mainCourses}</span>
                <p className="text-sm text-slate-500 mt-2">{t.resume.courses}</p>
              </div>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <MapPin className="text-emerald-600 mb-4" size={28} />
              <h3 className="font-headline text-xl mb-4">{t.resume.shenzhenTitle}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{t.resume.shenzhenDesc}</p>
            </div>
          </div>
        </StaggerGrid>
      </section>

      {/* Academic Milestones — Stagger */}
      <section className="mb-20 md:mb-32">
        <div className="flex items-baseline gap-4 mb-12 md:mb-16">
          <h2 className="font-headline text-3xl md:text-5xl">{t.resume.milestoneTitle}</h2>
          <span className="h-px flex-1 bg-slate-200"></span>
          <span className="font-mono text-xs text-slate-400 tracking-widest hidden md:block">{t.resume.academicExcellence}</span>
        </div>
        <StaggerGrid className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm card-cute transition-all">
            <div className="flex justify-between items-start mb-6">
              <Beaker className="text-emerald-600" size={40} />
              <div className="text-right">
                <span className="font-mono text-4xl font-bold text-emerald-700"><AnimatedCounter value={90} suffix="+" /></span>
                <span className="block text-[10px] font-mono text-slate-400">{t.resume.gpaScore}</span>
              </div>
            </div>
            <h3 className="font-headline text-2xl mb-4">{t.resume.oncology}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{t.resume.oncologyDesc}</p>
          </div>
          <div className="bg-slate-50 p-8 rounded-2xl flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs text-emerald-600 tracking-widest mb-4 block">{t.resume.milestone}</span>
              <h3 className="font-headline text-xl mb-2">{t.resume.cellSignaling}</h3>
              <p className="text-slate-400 text-xs italic">{t.resume.cellSignalingEn}</p>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-200 flex justify-between items-end">
              <span className="font-mono text-3xl font-bold text-slate-900"><AnimatedCounter value={92} /></span>
              <CheckCircle2 className="text-emerald-600" size={24} />
            </div>
          </div>
          <div className="bg-emerald-800 text-white p-8 rounded-2xl flex flex-col justify-between">
            <h3 className="font-headline text-xl">{t.resume.specializations}</h3>
            <ul className="font-mono text-xs space-y-2 mt-8 opacity-90">
              {['BIOTECHNOLOGY', 'TECH MANAGEMENT', 'MOLECULAR BIOLOGY'].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-emerald-400 rounded-full"></div> {item}
                </li>
              ))}
            </ul>
          </div>
        </StaggerGrid>
      </section>

      {/* Personality & Soft Skills — Stagger */}
      <section className="mb-20 md:mb-32">
        <div className="flex items-baseline gap-4 mb-12 md:mb-16">
          <h2 className="font-headline text-3xl md:text-5xl">{t.resume.softSkillsTitle}</h2>
          <span className="h-px flex-1 bg-slate-200"></span>
        </div>
        <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { icon: <Users size={24} />, title: t.resume.teamworkTitle, desc: t.resume.teamworkDesc, dark: false },
            { icon: <Eye size={24} />, title: t.resume.insightTitle, desc: t.resume.insightDesc, dark: false },
            { icon: <Zap size={24} />, title: t.resume.challengeTitle, desc: t.resume.challengeDesc, dark: true, wide: true },
            { icon: <Target size={24} />, title: t.resume.quickLearnTitle, desc: t.resume.quickLearnDesc, dark: false },
            { icon: <FileText size={24} />, title: t.resume.detailTitle, desc: t.resume.detailDesc, dark: false },
          ].map((item) => (
            <div
              key={item.title}
              className={`p-8 rounded-2xl border transition-colors hover:shadow-md ${
                item.dark
                  ? 'bg-slate-900 text-white border-slate-800 md:col-span-2'
                  : 'bg-white border-slate-100 hover:border-emerald-200'
              }`}
            >
              <div className={`mb-4 ${item.dark ? 'text-emerald-400' : 'text-emerald-600'}`}>{item.icon}</div>
              <h3 className="font-headline text-xl mb-3">{item.title}</h3>
              <p className={`text-sm leading-relaxed ${item.dark ? 'text-slate-300' : 'text-slate-600'}`}>{item.desc}</p>
            </div>
          ))}
        </StaggerGrid>
      </section>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   EXPERIENCE
   ═══════════════════════════════════════════════════════════════ */
const ExperienceContent = () => {
  const { t } = useLang();

  const experiences = [
    {
      title: t.experience.uniqloTitle,
      date: t.experience.uniqloDate,
      tasks: [t.experience.uniqloTask1, t.experience.uniqloTask2],
      icon: <Briefcase size={24} />,
      accent: 'bg-red-50 text-red-700 border-red-100',
      iconColor: 'text-red-600',
    },
    {
      title: t.experience.tutorTitle,
      date: t.experience.tutorDate,
      tasks: [t.experience.tutorTask1, t.experience.tutorTask2],
      icon: <BookOpen size={24} />,
      accent: 'bg-blue-50 text-blue-700 border-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      title: t.experience.buddyTitle,
      date: t.experience.buddyDate,
      tasks: [t.experience.buddyTask1, t.experience.buddyTask2],
      icon: <Globe size={24} />,
      accent: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      iconColor: 'text-emerald-600',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-20">
      <div className="flex items-baseline gap-4 mb-12 md:mb-16">
        <h2 className="font-headline text-3xl md:text-5xl">{t.experience.title}</h2>
        <span className="h-px flex-1 bg-slate-200"></span>
        <span className="font-mono text-xs text-slate-400 tracking-widest hidden md:block">{t.experience.workExperience}</span>
      </div>

      {/* Timeline — Stagger */}
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-200 hidden md:block"></div>
        <StaggerGrid className="space-y-8">
          {experiences.map((exp) => (
            <div key={exp.title} className="flex gap-6 md:gap-10">
              <div className="hidden md:flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-white border-2 border-slate-200 z-10 ${exp.iconColor}`}>
                  {exp.icon}
                </div>
              </div>
              <div className="flex-1 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`md:hidden w-10 h-10 rounded-full flex items-center justify-center ${exp.iconColor} bg-slate-50`}>
                      {exp.icon}
                    </div>
                    <h3 className="font-headline text-xl md:text-2xl">{exp.title}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-mono border ${exp.accent}`}>{exp.date}</span>
                </div>
                <ul className="space-y-2 mt-4">
                  {exp.tasks.map((task, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-slate-600">
                      <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </StaggerGrid>
      </div>

      {/* Skills & Certs — Stagger */}
      <section className="mt-16 md:mt-24">
        <div className="flex items-baseline gap-4 mb-12">
          <h2 className="font-headline text-3xl md:text-4xl">{t.experience.skillsCerts}</h2>
          <div className="h-px flex-grow bg-slate-200"></div>
        </div>
        <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-100">
            <Globe className="text-emerald-600 mb-4" size={28} />
            <h4 className="font-headline text-lg mb-4">{t.experience.langAbility}</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">{t.experience.chinese}</span>
                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-emerald-500 rounded-full" initial={{ width: 0 }} whileInView={{ width: '100%' }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 }} />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">{t.experience.english}</span>
                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-emerald-500 rounded-full" initial={{ width: 0 }} whileInView={{ width: '60%' }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.5 }} />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-100">
            <Award className="text-emerald-600 mb-4" size={28} />
            <h4 className="font-headline text-lg mb-4">{t.experience.software}</h4>
            <div className="flex flex-wrap gap-2">
              {['Excel', 'Word', 'PowerPoint'].map(s => (
                <span key={s} className="px-3 py-1.5 bg-slate-50 text-slate-600 text-xs font-mono rounded-full">{s}</span>
              ))}
            </div>
          </div>
          <div className="bg-emerald-700 text-white p-8 rounded-2xl">
            <Beaker className="mb-4" size={28} />
            <h4 className="font-headline text-lg mb-4">{t.experience.labSkills}</h4>
            <p className="text-sm text-emerald-100 leading-relaxed">{t.experience.labSkillsList}</p>
          </div>
        </StaggerGrid>
      </section>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   CONTACT
   ═══════════════════════════════════════════════════════════════ */
const ContactContent = () => {
  const { t } = useLang();
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-20">
      <section className="bg-white rounded-3xl p-8 md:p-20 shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #ec4899 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <span className="font-mono text-emerald-600 uppercase tracking-widest text-xs mb-6 block">{t.contact.readyLabel}</span>
          <h2 className="font-headline text-3xl md:text-5xl mb-8 text-slate-900">
            {t.contact.title} {t.contact.titleEn && <span className="text-slate-400">/ {t.contact.titleEn}</span>}
          </h2>
          <p className="text-slate-600 mb-12 text-base md:text-lg">{t.contact.desc}</p>
          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 text-left mb-12">
            {[
              { label: t.contact.email, value: t.contact.emailValue, icon: <Mail size={16} />, href: `mailto:${t.contact.emailValue}` },
              { label: t.contact.phone, value: t.contact.phoneValue, icon: <Phone size={16} />, href: `tel:${t.contact.phoneValue.replace(/-/g, '')}` },
              { label: t.contact.phone2, value: t.contact.phone2Value, icon: <Phone size={16} />, href: `tel:${t.contact.phone2Value.replace(/[\s-]/g, '')}` },
              { label: t.contact.location, value: t.contact.locationValue, icon: <MapPin size={16} /> },
              { label: t.contact.birthplace, value: t.contact.birthplaceValue, icon: <Heart size={16} /> },
            ].map(item => (
              <div key={item.label} className="bg-slate-50 p-5 md:p-6 rounded-xl border border-slate-100 card-cute transition-all">
                <span className="font-mono text-[10px] text-slate-400 uppercase block mb-2">{item.label}</span>
                <div className="flex items-center gap-2 text-slate-900 font-medium text-sm">
                  {item.icon}
                  {'href' in item && item.href ? (
                    <a href={item.href} className="truncate hover:text-emerald-700 transition-colors">{item.value}</a>
                  ) : (
                    <span className="truncate">{item.value}</span>
                  )}
                </div>
              </div>
            ))}
          </StaggerGrid>
          <a
            href="mailto:estheryeh1124@gmail.com"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-pink-500 text-white px-10 py-4 rounded-full font-mono uppercase tracking-widest text-sm hover:from-emerald-700 hover:to-pink-600 transition-all shadow-lg shadow-pink-500/20"
          >
            {t.contact.sendMessage}
            <Send size={16} />
          </a>
        </div>
      </section>
    </div>
  );
};
