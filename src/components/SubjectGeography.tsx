import React, { useState, useEffect } from 'react';
import { SENEGAL_REGIONS, CURRICULUM_LESSONS } from '../data/senegalCurriculum';
import { Globe2, Droplets, Flame, Trees, MapPin, Sparkles, Building, Waves, CheckCircle2, Check } from 'lucide-react';
import { toggleLessonCompletion, isLessonCompleted } from '../services/studentProgress';

interface SubjectGeographyProps {
  onAskTutor: (query: string) => void;
}

export const SubjectGeography: React.FC<SubjectGeographyProps> = ({ onAskTutor }) => {
  const geographyLessons = CURRICULUM_LESSONS.filter((l) => l.subject === 'geography');
  const [activeTab, setActiveTab] = useState<'regions' | 'rivers' | 'lessons'>('regions');
  const [selectedRegionId, setSelectedRegionId] = useState(SENEGAL_REGIONS[0]?.id || 'dakar');
  const [selectedLessonId, setSelectedLessonId] = useState(geographyLessons[0]?.id || '');
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    const checkCompletion = () => {
      const ids = geographyLessons.filter((l) => isLessonCompleted(l.id)).map((l) => l.id);
      setCompletedLessons(ids);
    };
    checkCompletion();
    window.addEventListener('ie_progress_updated', checkCompletion);
    return () => window.removeEventListener('ie_progress_updated', checkCompletion);
  }, []);

  const activeRegion = SENEGAL_REGIONS.find((r) => r.id === selectedRegionId) || SENEGAL_REGIONS[0];
  const activeLesson = geographyLessons.find((l) => l.id === selectedLessonId) || geographyLessons[0];

  return (
    <div className="space-y-8">
      {/* Banner Card */}
      <div className="relative rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-900 text-white shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
          <div className="md:col-span-8 p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-sky-400 font-semibold mb-2">
                <span>وحدة الجغرافيا الإقليمية والتنموية</span>
                <span aria-hidden="true">·</span>
                <span>البيئة والموارد في السنغال وغرب إفريقيا</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                أقاليم السنغال، ثروات المياه، وحقول الطاقة الواعدة
              </h2>
              <p className="text-stone-300 text-sm mt-2 leading-relaxed max-w-xl">
                دراسة شاملة للمساحة والحدود (196,722 كم²)، وشبكة الأنهار (السنغال، غامبيا، كازامانس)، وحوض الفول السوداني، والصيد البحري، وصولاً إلى ثروات الغاز والنفط المكتشفة في سنغومار وتورتو آحميم.
              </p>
            </div>
            {/* Mode selector */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 bg-stone-800/80 rounded-xl border border-stone-700/60 w-fit">
              <button
                onClick={() => setActiveTab('regions')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'regions'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                مستكشف أقاليم السنغال
              </button>
              <button
                onClick={() => setActiveTab('rivers')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'rivers'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                الشبكة المائية والسدود (OMVS)
              </button>
              <button
                onClick={() => setActiveTab('lessons')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'lessons'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                الدروس المنهجية المقررة
              </button>
            </div>
          </div>
          <div className="md:col-span-4 h-48 md:h-auto relative">
            <img
              src="/src/assets/images/subject_geography_senegal_1794184746623.jpg"
              alt="جغرافيا السنغال ونهر السنغال وبساتين الباوباب"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-stone-900 md:from-stone-900/90 to-transparent" />
          </div>
        </div>
      </div>

      {/* Mode 1: Senegal Regions Interactive Explorer */}
      {activeTab === 'regions' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Regions List */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-sm font-bold text-stone-900 dark:text-white px-1">أقاليم جمهورية السنغال</h3>
            {SENEGAL_REGIONS.map((region) => {
              const isSelected = region.id === activeRegion.id;
              return (
                <div
                  key={region.id}
                  onClick={() => setSelectedRegionId(region.id)}
                  className={`cursor-pointer p-4 rounded-xl border text-right transition-all shadow-xs ${
                    isSelected
                      ? 'bg-sky-50/80 dark:bg-sky-950/40 border-sky-500 dark:border-sky-500'
                      : 'bg-white dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
                    <span className="font-semibold text-sky-700 dark:text-sky-400">{region.capital}</span>
                    <span className="font-mono text-[11px]">{region.frenchName}</span>
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white">{region.name}</h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-1">{region.climateZone}</p>
                </div>
              );
            })}
          </div>

          {/* Region Details Showcase */}
          <div className="lg:col-span-8 bg-white dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700/80 p-6 sm:p-8 space-y-6">
            <div className="border-b border-stone-200 dark:border-stone-700 pb-5">
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-xs text-sky-700 dark:text-sky-400 font-semibold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  حاضرة الإقليم: {activeRegion.capital}
                </span>
                <span className="text-xs text-stone-500 font-mono">{activeRegion.frenchName}</span>
              </div>
              <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white">{activeRegion.name}</h2>
              <p className="text-stone-600 dark:text-stone-300 text-sm mt-2 leading-relaxed">{activeRegion.description}</p>
            </div>

            {/* Climate & Nature */}
            <div className="p-4 rounded-xl bg-sky-50/60 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-800/50 space-y-1">
              <span className="text-xs font-bold text-sky-900 dark:text-sky-300 flex items-center gap-1.5">
                <Trees className="w-4 h-4 text-emerald-600" />
                المناخ والغطاء النباتي:
              </span>
              <p className="text-sm text-stone-800 dark:text-stone-200">{activeRegion.climateZone}</p>
            </div>

            {/* Economic Activities */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                <Building className="w-4 h-4 text-sky-600" />
                الأنشطة الاقتصادية والموارد الرئيسية في الإقليم
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeRegion.economicActivity.map((activity, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/40 text-xs text-stone-800 dark:text-stone-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                    <span>{activity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Heritage & Landmarks */}
            <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
              <span className="text-xs font-bold text-amber-900 dark:text-amber-300 block mb-1">المعلم التراثي أو الديني الأبرز:</span>
              <p className="text-sm text-stone-800 dark:text-stone-200">{activeRegion.historicalSite}</p>
            </div>

            {/* Ask Tutor */}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-700 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-stone-500 dark:text-stone-400">سؤال امتحاني عن جغرافيا هذا الإقليم؟</span>
              <button
                onClick={() => onAskTutor(`ما هي الخصائص الجغرافية والاقتصادية المميزة لإقليم (${activeRegion.name}) وموقعه في التنمية السنغالية؟`)}
                className="px-4 py-2 text-xs font-semibold text-sky-950 dark:text-sky-200 bg-sky-100 dark:bg-sky-900/40 hover:bg-sky-200 rounded-lg transition-colors"
              >
                سؤال مرشد الشيخ تيجان عن الإقليم
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Rivers & OMVS */}
      {activeTab === 'rivers' && (
        <div className="bg-white dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700/80 p-6 sm:p-8 space-y-6">
          <div className="border-b border-stone-200 dark:border-stone-700 pb-4">
            <span className="text-xs font-semibold text-sky-700 dark:text-sky-400">الشبكة الهيدروغرافية الحيوية</span>
            <h3 className="text-xl font-bold text-stone-900 dark:text-white mt-1">
              شرايين الحياة في السنغال: الأنهار الكبرى وسدود منظمة OMVS
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              محور أساسي في امتحان الجغرافيا: نهر السنغال، بحيرة غيير، وسد دياما وسد ماننتالي.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-900/40 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center">
                <Waves className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-stone-900 dark:text-white">نهر السنغال (Fleuve Sénégal)</h4>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                طوله 1700 كم، ينبع من هضبة فوتا جالون في غينيا، ويمر بمالي والسنغال وموريتانيا. يديره تجمع OMVS لتوليد الكهرباء والري الزراعي وتأمين الملاحة النهرية.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-900/40 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                <Droplets className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-stone-900 dark:text-white">سد دياما وسد ماننتالي (Diama & Manantali)</h4>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                سد دياما (قرب سانت لويس) يمنع صعود المياه المالحة من المحيط إلى الأراضي الزراعية، وسد ماننتالي في مالي يخزن مليارات الأمتار المكعبة ويولد الطاقة الكهرومائية للبلدان الثلاثة.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-900/40 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-stone-900 dark:text-white">حقول الغاز والنفط (GTA & Sangomar)</h4>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                الحقول البحرية العميقة التي تجعل من السنغال مصدراً جديداً للطاقة النظيفة، مما يوفر طفرة صناعية وموارد لدعم التعليم والتدريب التكنولوجي للشباب السنغالي.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mode 3: Lessons */}
      {activeTab === 'lessons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-sm font-bold text-stone-900 dark:text-white px-1">دروس الجغرافيا المقررة</h3>
            {geographyLessons.map((lesson) => {
              const isSelected = lesson.id === activeLesson.id;
              return (
                <div
                  key={lesson.id}
                  onClick={() => setSelectedLessonId(lesson.id)}
                  className={`cursor-pointer p-4 rounded-xl border text-right transition-all shadow-xs ${
                    isSelected
                      ? 'bg-sky-50/80 dark:bg-sky-950/40 border-sky-500 dark:border-sky-500'
                      : 'bg-white dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
                    <span className="text-sky-700 dark:text-sky-400 font-semibold">{lesson.level}</span>
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
                <span className="text-xs text-sky-700 dark:text-sky-400 font-semibold">{activeLesson.level}</span>
                <button
                  onClick={() => toggleLessonCompletion(activeLesson.id)}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                    completedLessons.includes(activeLesson.id)
                      ? 'bg-sky-700 text-white border-sky-700 shadow-xs'
                      : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:border-sky-500'
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
              <strong className="text-stone-900 dark:text-white block mb-1">الخلاصة الجغرافية:</strong>
              {activeLesson.summary}
            </div>

            <div className="space-y-4">
              <h4 className="text-base font-bold text-stone-900 dark:text-white">المحاور التنموية والشرح التفصيلي</h4>
              {activeLesson.content.map((p, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-stone-50/60 dark:bg-stone-900/30 border border-stone-200/60 dark:border-stone-800/60 text-stone-700 dark:text-stone-200 text-sm leading-relaxed">
                  {p}
                </div>
              ))}
            </div>

            {/* Key Terms */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-stone-900 dark:text-white">المصطلحات الجغرافية والاقتصادية</h4>
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
              <span className="text-xs font-bold text-amber-900 dark:text-amber-200 block mb-1">توجيهات الشيخ تيجان ا نداو لامتحان الجغرافيا:</span>
              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">{activeLesson.examTips}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
