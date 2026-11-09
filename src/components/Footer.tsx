import React from 'react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-16 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
              IE
            </div>
            <div>
              <span className="font-bold text-stone-900 dark:text-white">منصة IE التعليمية للسنغال</span>
              <span className="mx-2 text-stone-300 dark:text-stone-700">|</span>
              <span>بإشراف فضيلة الشيخ تيجان ا نداو</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs">
            <button onClick={() => onNavigate('home')} className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
              الرئيسية
            </button>
            <button onClick={() => onNavigate('lectures')} className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors font-semibold text-emerald-800 dark:text-emerald-300">
              شروحات وأوراق الشيخ (فيديو & PDF)
            </button>
            <button onClick={() => onNavigate('education')} className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
              المناهج والإنجاز
            </button>
            <button onClick={() => onNavigate('company')} className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
              شركة IE والربحية
            </button>
            <button onClick={() => onNavigate('members')} className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
              الأعضاء والاشتراكات (Wave & OM)
            </button>
            <button onClick={() => onNavigate('media')} className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
              الوسائط والخرائط
            </button>
            <button onClick={() => onNavigate('voice')} className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
              المحادثة الحية
            </button>
          </div>

          <div className="text-xs text-stone-400">
            مجموعة ومؤسسات IE · خدمة لطلاب معاهد وجامع السنغال بإشراف فضيلة الشيخ تيجان ا نداو © {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </footer>
  );
};
