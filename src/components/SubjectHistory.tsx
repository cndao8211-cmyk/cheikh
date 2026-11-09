import React, { useState, useEffect } from 'react';
import { SENEGAL_EMPIRES, SENEGAL_TIMELINE, CURRICULUM_LESSONS } from '../data/senegalCurriculum';
import { Compass, Calendar, Shield, BookOpen, ChevronRight, Award, ExternalLink, CheckCircle2, Check } from 'lucide-react';
import { toggleLessonCompletion, isLessonCompleted } from '../services/studentProgress';

interface SubjectHistoryProps {
  onAskTutor: (query: string) => void;
}

export const SubjectHistory: React.FC<SubjectHistoryProps> = ({ onAskTutor }) => {
  const historyLessons = CURRICULUM_LESSONS.filter((l) => l.subject === 'history');
  const [activeSubTab, setActiveSubTab] = useState<'empires' | 'timeline' | 'lessons'>('empires');
  const [selectedEmpireId, setSelectedEmpireId] = useState(SENEGAL_EMPIRES[0]?.id || 'tekrur');
  const [selectedLessonId, setSelectedLessonId] = useState(historyLessons[0]?.id || '');
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    const checkCompletion = () => {
      const ids = historyLessons.filter((l) => isLessonCompleted(l.id)).map((l) => l.id);
      setCompletedLessons(ids);
    };
    checkCompletion();
    window.addEventListener('ie_progress_updated', checkCompletion);
    return () => window.removeEventListener('ie_progress_updated', checkCompletion);
  }, []);

  const activeEmpire = SENEGAL_EMPIRES.find((e) => e.id === selectedEmpireId) || SENEGAL_EMPIRES[0];
  const activeLesson = historyLessons.find((l) => l.id === selectedLessonId) || historyLessons[0];

  return (
    <div className="space-y-8">
      {/* Banner Card with Archival Map */}
      <div className="relative rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-900 text-white shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
          <div className="md:col-span-8 p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-2">
                <span>وحدة التاريخ والحضارة السنغالية</span>
                <span aria-hidden="true">·</span>
                <span>تاريخ غرب إفريقيا والعالم الإسلامي</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                أمجاد ممالك السنغال وملاحم المقاومة الوطنية
              </h2>
              <p className="text-stone-300 text-sm mt-2 leading-relaxed max-w-xl">
                من مملكة تكرور وإمبراطورية جولوف الموحدة، إلى ثورة إمامة فوتا تورو، ومقاومة لط ديور والجهاد الروحي للعلماء الأجلاء لحفظ كرامة وهوية الأمة السنغالية.
              </p>
            </div>
            {/* Mode selector */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 bg-stone-800/80 rounded-xl border border-stone-700/60 w-fit">
              <button
                onClick={() => setActiveSubTab('empires')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  activeSubTab === 'empires'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                الممالك والإمبراطوريات السنغالية
              </button>
              <button
                onClick={() => setActiveSubTab('timeline')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  activeSubTab === 'timeline'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                الخط الزمني (1040م - 1960م)
              </button>
              <button
                onClick={() => setActiveSubTab('lessons')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  activeSubTab === 'lessons'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                دروس المنهج المقررة
              </button>
            </div>
          </div>
          <div className="md:col-span-4 h-48 md:h-auto relative">
            <img
              src="/src/assets/images/subject_senegal_history_1794184745729.jpg"
              alt="خريطة ممالك وإمبراطوريات السنغال التاريخية"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-stone-900 md:from-stone-900/90 to-transparent" />
          </div>
        </div>
      </div>

      {/* Mode 1: Senegal Empires Showcase */}
      {activeSubTab === 'empires' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Empires List */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-sm font-bold text-stone-900 dark:text-white px-1">اختر المملكة للدراسة</h3>
            {SENEGAL_EMPIRES.map((empire) => {
              const isSelected = empire.id === activeEmpire.id;
              return (
                <div
                  key={empire.id}
                  onClick={() => setSelectedEmpireId(empire.id)}
                  className={`cursor-pointer p-4 rounded-xl border text-right transition-all shadow-xs ${
                    isSelected
                      ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-500 dark:border-amber-500'
                      : 'bg-white dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
                    <span className="font-mono">{empire.period}</span>
                    <span className="font-semibold text-amber-700 dark:text-amber-400">{empire.capital}</span>
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white leading-snug">{empire.name}</h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-mono">{empire.frenchName}</p>
                </div>
              );
            })}
          </div>

          {/* Empire Deep Dive Card */}
          <div className="lg:col-span-8 bg-white dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700/80 p-6 sm:p-8 space-y-6">
            <div className="border-b border-stone-200 dark:border-stone-700 pb-5">
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-xs text-amber-700 dark:text-amber-400 font-semibold">{activeEmpire.period}</span>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-mono">العاصمة: {activeEmpire.capital}</span>
              </div>
              <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white">{activeEmpire.name}</h2>
              <p className="text-stone-500 dark:text-stone-400 text-sm mt-0.5 font-mono">{activeEmpire.frenchName}</p>
            </div>

            {/* Significance Callout */}
            <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
              <span className="text-xs font-bold text-amber-900 dark:text-amber-300 block mb-1">الأهمية الاستراتيجية والتاريخية:</span>
              <p className="text-sm text-stone-800 dark:text-stone-200 leading-relaxed">{activeEmpire.significance}</p>
            </div>

            {/* Details */}
            <div className="space-y-3">
              <h4 className="text-base font-bold text-stone-900 dark:text-white">التحليل الأكاديمي والسياسي</h4>
              <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed bg-stone-50/70 dark:bg-stone-900/40 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
                {activeEmpire.details}
              </p>
            </div>

            {/* Notable Historical Figures */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-stone-900 dark:text-white">أبرز القادة والملوك والشخصيات</h4>
              <div className="flex flex-wrap gap-2">
                {activeEmpire.notableFigures.map((fig, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-700/60 text-xs font-semibold text-stone-800 dark:text-stone-200"
                  >
                    <Shield className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    {fig}
                  </span>
                ))}
              </div>
            </div>

            {/* Inquire to AI Tutor */}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-700 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-stone-500 dark:text-stone-400">هل تحتاج لتحضير مقال إنشائي عن هذه المملكة؟</span>
              <button
                onClick={() => onAskTutor(`اكتب لي تحليلاً منهجياً مفصلاً لامتحان التاريخ عن: ${activeEmpire.name} وأسباب ازدهارها وتأثيرها في السنغال`)}
                className="px-4 py-2 text-xs font-semibold text-amber-950 dark:text-amber-200 bg-amber-100 dark:bg-amber-900/40 hover:bg-amber-200 rounded-lg transition-colors flex items-center gap-1.5"
              >
                سؤال مرشد الشيخ تيجان عن هذه المملكة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Interactive Timeline */}
      {activeSubTab === 'timeline' && (
        <div className="bg-white dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700/80 p-6 sm:p-8 space-y-6">
          <div className="border-b border-stone-200 dark:border-stone-700 pb-4">
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">التسلسل الزمني التاريخي للسنغال</span>
            <h3 className="text-xl font-bold text-stone-900 dark:text-white mt-1">
              محطات فاصلة في تاريخ السنغال من القرن الحادي عشر إلى الاستقلال
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              أهم التواريخ والأحداث المصيرية المعتمدة في امتحانات شهادة البكالوريا والجامعة.
            </p>
          </div>

          <div className="relative border-r-2 border-stone-200 dark:border-stone-700 mr-4 sm:mr-8 pr-6 sm:pr-8 space-y-8">
            {SENEGAL_TIMELINE.map((item, idx) => (
              <div key={idx} className="relative group">
                {/* Dot Marker on Timeline */}
                <div className="absolute -right-[31px] sm:-right-[39px] top-1 w-4 h-4 rounded-full bg-amber-600 border-4 border-white dark:border-stone-800 shadow-xs" />
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 hover:border-amber-400 transition-colors">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-extrabold text-sm sm:text-base text-amber-700 dark:text-amber-400 tabular-nums">
                      {item.year}
                    </span>
                    <span className="text-xs text-stone-400">
                      {item.category === 'scholarship'
                        ? 'إصلاح علمي وديني'
                        : item.category === 'resistance'
                        ? 'مقاومة وطنية'
                        : item.category === 'republic'
                        ? 'الدولة الحديثة'
                        : 'تأسيس سياسي'}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-stone-900 dark:text-white">{item.title}</h4>
                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-1.5 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mode 3: Curriculum Lessons */}
      {activeSubTab === 'lessons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-sm font-bold text-stone-900 dark:text-white px-1">دروس التاريخ المقررة</h3>
            {historyLessons.map((lesson) => {
              const isSelected = lesson.id === activeLesson.id;
              return (
                <div
                  key={lesson.id}
                  onClick={() => setSelectedLessonId(lesson.id)}
                  className={`cursor-pointer p-4 rounded-xl border text-right transition-all shadow-xs ${
                    isSelected
                      ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-500 dark:border-amber-500'
                      : 'bg-white dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
                    <span className="text-amber-700 dark:text-amber-400 font-semibold">{lesson.level}</span>
                    {completedLessons.includes(lesson.id) && (
                      <span className="text-emerald-600 font-bold flex items-center gap-0.5 text-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        مكتمل
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white mt-1 leading-snug">{lesson.title}</h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2">{lesson.subtitle}</p>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-8 bg-white dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700/80 p-6 sm:p-8 space-y-6">
            <div className="border-b border-stone-200 dark:border-stone-700 pb-4">
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-xs text-amber-700 dark:text-amber-400 font-semibold">{activeLesson.level}</span>
                <button
                  onClick={() => toggleLessonCompletion(activeLesson.id)}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                    completedLessons.includes(activeLesson.id)
                      ? 'bg-amber-700 text-white border-amber-700 shadow-xs'
                      : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:border-amber-500'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{completedLessons.includes(activeLesson.id) ? 'الدرس مكتمل بنجاح ✓' : 'تحديد الدرس كمكتمل'}</span>
                </button>
              </div>
              <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white mt-1">{activeLesson.title}</h2>
              <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">{activeLesson.subtitle}</p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
              <strong className="text-stone-900 dark:text-white block mb-1">الخلاصة التحليلية:</strong>
              {activeLesson.summary}
            </div>

            <div className="space-y-4">
              <h4 className="text-base font-bold text-stone-900 dark:text-white">محاور الدرس والشواهد التاريخية</h4>
              {activeLesson.content.map((p, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-stone-50/60 dark:bg-stone-900/30 border border-stone-200/60 dark:border-stone-800/60 text-stone-700 dark:text-stone-200 text-sm leading-relaxed">
                  {p}
                </div>
              ))}
            </div>

            {/* Key Terms */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-stone-900 dark:text-white">المفاهيم والأعلام في المنهج السنغالي</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeLesson.keyTerms.map((term, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/40">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <strong className="text-stone-900 dark:text-white">{term.term}</strong>
                      <span className="font-mono text-stone-400 text-[11px]">{term.frenchTerm}</span>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-300">{term.explanation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Exam Tips */}
            <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
              <span className="text-xs font-bold text-amber-900 dark:text-amber-200 block mb-1">نصيحة الشيخ تيجان ا نداو لاختبار التاريخ:</span>
              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">{activeLesson.examTips}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
