import React from 'react';
import { ArrowLeft, BookOpen, Compass, Globe2, Sparkles, Award, CheckCircle2, Download } from 'lucide-react';

interface HeroProps {
  onSelectSubject: (tab: string) => void;
  onOpenTutor: () => void;
  onOpenPayment?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectSubject, onOpenTutor, onOpenPayment }) => {
  return (
    <section className="relative overflow-hidden bg-stone-100/70 dark:bg-stone-900/60 border-b border-stone-200 dark:border-stone-800 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Split Grid: Narrative & Scholarship on Right, Visual Hero Showcase on Left (RTL) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text Content Area */}
          <div className="lg:col-span-7 space-y-6">
            {/* Academic Kicker - clean unboxed typography */}
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-800 dark:text-emerald-400">
              <span className="font-semibold">جمهورية السنغال</span>
              <span aria-hidden="true">·</span>
              <span>طلاب الجامع والمعاهد والمدارس العربية</span>
              <span aria-hidden="true">·</span>
              <span>المنهج المعتمد</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight leading-tight" style={{ textWrap: 'balance' }}>
              منصة <span className="text-emerald-700 dark:text-emerald-400">IE</span> الأكاديمية لطلاب السنغال
            </h1>

            {/* Supervisor Attribution */}
            <div className="inline-flex items-center gap-3 p-3 bg-white dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700/70 shadow-xs">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-600 shrink-0">
                <img
                  src="/assets/aistudio/file_00000000f46071f5830b0339c53ac6d7_2f20e753.png"
                  alt="فضيلة الشيخ تيجان ا نداو"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="text-right">
                <div className="text-xs text-stone-500 dark:text-stone-400">المؤسس والمشرف العلمي العام</div>
                <div className="text-sm font-bold text-stone-900 dark:text-stone-100">فضيلة الشيخ تيجان ا نداو (Cheikh Tidiane Ndao)</div>
              </div>
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed font-normal max-w-2xl">
              المنصة التعليمية المتكاملة لخدمة طلاب التعليم العربي والإسلامي في السنغال؛ تجمع بين الرصانة اللغوية، والعمق التاريخي لممالك غرب إفريقيا، والجغرافيا التنموية، مع بنك امتحانات البكالوريا والدفع السريع عبر Wave و Orange Money.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onSelectSubject('lectures')}
                className="px-5 py-3 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-xl shadow-sm transition-all flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                <BookOpen className="w-4 h-4 text-emerald-200" />
                <span>قاعة فيديوهات الشيخ وأوراق PDF (الشروحات الرسمية)</span>
              </button>

              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('open_pwa_install_guide'));
                  }
                }}
                className="px-5 py-3 text-sm font-bold text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                title="Télécharger et installer l'application sur votre ordinateur"
              >
                <Download className="w-4 h-4 text-stone-950" />
                <span>تحميل وتثبيت على الكمبيوتر (Installer PC)</span>
              </button>

              {onOpenPayment && (
                <button
                  onClick={onOpenPayment}
                  className="px-5 py-3 text-sm font-semibold text-white bg-stone-800 hover:bg-stone-700 rounded-xl shadow-sm transition-all flex items-center gap-2 whitespace-nowrap shrink-0 border border-stone-700"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>تأكيد الاشتراك (Wave & Orange Money)</span>
                </button>
              )}

              <button
                onClick={onOpenTutor}
                className="px-5 py-3 text-sm font-semibold text-stone-800 dark:text-stone-200 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700 rounded-xl shadow-xs transition-all flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                استشارة المرشد الذكي
              </button>
            </div>
          </div>

          {/* Hero Visual Showcase - Official Opening Portrait */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-600/30 dark:border-emerald-500/30 shadow-2xl bg-stone-900 group">
              <img
                src="/assets/aistudio/file_00000000f46071f5830b0339c53ac6d7_2f20e753.png"
                alt="فضيلة الشيخ تيجان ا نداو يقدم دروس اللغة العربية"
                className="w-full h-[400px] lg:h-[480px] object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 text-white text-right">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-600/80 backdrop-blur-md text-[11px] font-bold text-white w-fit mb-2">
                  <Award className="w-3.5 h-3.5" />
                  <span>صورة الافتتاح الرسمية للمؤسس</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  فضيلة الشيخ تيجان ا نداو (Cheikh Tidiane Ndao)
                </h3>
                <p className="text-xs text-stone-200 mt-1 leading-relaxed">
                  «دروسي عن اللغة العربية» · رائد المبادرة والنهضة الأكاديمية لطلاب معاهد وجامع السنغال.
                </p>
                <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between text-[11px] text-emerald-300">
                  <span>منصة IE الأكاديمية</span>
                  <span>السنغال · Sénégal</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Core Curriculum Cards Quick Strip */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Arabic */}
          <div
            onClick={() => onSelectSubject('arabic')}
            className="group cursor-pointer p-5 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700/80 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all shadow-xs hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xs text-stone-500 dark:text-stone-400">النحو والصرف والشعر</span>
            </div>
            <h2 className="text-lg font-bold text-stone-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
              اللغة العربية وآدابها
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-300 mt-2 leading-relaxed">
              شرح الآجرومية والبلاغة، ودراسة دواوين شعراء السنغال الأجلاء (الشيخ بمب، الحاج مالك، والشيخ إبراهيم نياس).
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <span>دخول وحدة اللغة</span>
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>

          {/* History */}
          <div
            onClick={() => onSelectSubject('history')}
            className="group cursor-pointer p-5 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700/80 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all shadow-xs hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xs text-stone-500 dark:text-stone-400">الممالك والمقاومة</span>
            </div>
            <h2 className="text-lg font-bold text-stone-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
              تاريخ السنغال وغرب إفريقيا
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-300 mt-2 leading-relaxed">
              تاريخ تكرور، وإمبراطورية جولوف، كايور، فوتا تورو، والمقاومة الوطنية والروحية ضد الاستعمار الفرنسي.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
              <span>استكشاف الخرائط والأحداث</span>
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Geography */}
          <div
            onClick={() => onSelectSubject('geography')}
            className="group cursor-pointer p-5 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700/80 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all shadow-xs hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-400 flex items-center justify-center">
                <Globe2 className="w-5 h-5" />
              </div>
              <span className="text-xs text-stone-500 dark:text-stone-400">14 إقليماً والموارد</span>
            </div>
            <h2 className="text-lg font-bold text-stone-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-sky-400 transition-colors">
              الجغرافيا والتنمية السنغالية
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-300 mt-2 leading-relaxed">
              التضاريس، حوض نهر السنغال، الأقاليم المناخية، زراعة الفول السوداني، الصيد البحري، وحقول الغاز والنفط الجديدة.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-sky-700 dark:text-sky-400">
              <span>استكشاف أقاليم السنغال</span>
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Tabular Quantitative Rigor Metric Strip */}
        <div className="mt-8 pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-around gap-4 text-center">
          <div>
            <div className="text-2xl font-extrabold text-stone-900 dark:text-white tabular-nums">14</div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">إقليماً إدارياً ومناخياً موثقاً</div>
          </div>
          <div className="w-px h-8 bg-stone-200 dark:bg-stone-800 hidden sm:block" />
          <div>
            <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 tabular-nums">100%</div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">مطابق للمنهج السنغالي الرسمي</div>
          </div>
          <div className="w-px h-8 bg-stone-200 dark:bg-stone-800 hidden sm:block" />
          <div>
            <div className="text-2xl font-extrabold text-stone-900 dark:text-white tabular-nums">1040م</div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">عمق تاريخي موثق من تكرور</div>
          </div>
          <div className="w-px h-8 bg-stone-200 dark:bg-stone-800 hidden sm:block" />
          <div>
            <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">24/7</div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">إرشاد علمي وتدريب للامتحانات</div>
          </div>
        </div>
      </div>
    </section>
  );
};
