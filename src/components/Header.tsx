import React from 'react';
import { BookOpen, Moon, Sun, Sparkles, Building2, Gamepad2, Video } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
  onLaunchGame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  toggleTheme,
  onLaunchGame,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single Brand Wordmark with Founder's Avatar */}
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 text-right font-extrabold text-xl tracking-tight text-emerald-800 dark:text-emerald-400 hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-600 shrink-0 shadow-sm">
                <img
                  src="/assets/aistudio/file_00000000f46071f5830b0339c53ac6d7_2f20e753.png"
                  alt="فضيلة الشيخ تيجان ا نداو"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-emerald-700 text-white text-[9px] flex items-center justify-center font-bold">
                IE
              </div>
            </div>
            <div className="flex flex-col text-right">
              <span className="leading-tight text-stone-900 dark:text-white font-bold text-base sm:text-lg">منصة IE لطلاب السنغال</span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400 font-normal">بإشراف فضيلة الشيخ تيجان ا نداو</span>
            </div>
          </button>

          {/* Zone 2: Navigation links */}
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-stone-600 dark:text-stone-300">
            <button
              onClick={() => setActiveTab('home')}
              className={`hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'home'
                  ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-semibold'
                  : 'border-transparent'
              }`}
            >
              الرئيسية
            </button>
            <button
              onClick={() => setActiveTab('lectures')}
              className={`hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1.5 ${
                activeTab === 'lectures'
                  ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
                  : 'border-transparent text-emerald-800 dark:text-emerald-300'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-blue-500" />
              <span>فيديوهات وأوراق الشيخ (فيديو & PDF)</span>
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'education'
                  ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-semibold'
                  : 'border-transparent'
              }`}
            >
              الدروس والمناهج (PDF وفيديو)
            </button>
            <button
              onClick={() => setActiveTab('company')}
              className={`hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'company'
                  ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-semibold'
                  : 'border-transparent'
              }`}
            >
              شركة IE والربحية
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'members'
                  ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-semibold'
                  : 'border-transparent'
              }`}
            >
              الأعضاء والاشتراكات
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'media'
                  ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-semibold'
                  : 'border-transparent'
              }`}
            >
              الوسائط والخرائط
            </button>
            <button
              onClick={() => setActiveTab('voice')}
              className={`flex items-center gap-1.5 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'voice'
                  ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-semibold'
                  : 'border-transparent'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              المحادثة الحية
            </button>
          </nav>

          {/* Zone 3: PWA Install + Theme toggle + Game */}
          <div className="flex items-center gap-2.5 shrink-0">
            <PWAInstallButton variant="header" />
            
            <button
              onClick={toggleTheme}
              aria-label="تبديل المظهر"
              className="p-2 rounded-lg text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={onLaunchGame}
              className="hidden sm:flex px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 items-center gap-1.5"
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              لعبة قوافل السنغال 3D
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
