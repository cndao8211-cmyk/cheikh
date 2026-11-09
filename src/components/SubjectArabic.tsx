import React, { useState, useEffect } from 'react';
import { CURRICULUM_LESSONS } from '../data/senegalCurriculum';
import { Volume2, CheckCircle2, ChevronRight, Sparkles, FileText, Check } from 'lucide-react';
import { toggleLessonCompletion, isLessonCompleted } from '../services/studentProgress';

interface SubjectArabicProps {
  onAskTutor: (query: string) => void;
}

interface InteractiveParsingSample {
  id: string;
  sentence: string;
  translationFr: string;
  source: string;
  words: {
    text: string;
    pos: string; // Part of speech
    analysis: string; // Full I'rab
  }[];
}

const PARSING_SAMPLES: InteractiveParsingSample[] = [
  {
    id: 'sample-1',
    sentence: 'إِنَّ العِلْمَ يَرْفَعُ قَدْرَ صَاحِبِهِ',
    translationFr: 'Certes, le savoir élève le rang de son détenteur.',
    source: 'من شواهد الأدب والتعليم السنغالي',
    words: [
      { text: 'إِنَّ', pos: 'حرف توكيد ونصب', analysis: 'حرف مشبه بالفعل ناسخ مبني على الفتح لا محل له من الإعراب ينصب المبتدأ ويرفع الخبر.' },
      { text: 'العِلْمَ', pos: 'اسم إنّ', analysis: 'اسم إنّ منصوب وعلامة نصبه الفتحة الظاهرة على آخره.' },
      { text: 'يَرْفَعُ', pos: 'فعل مضارع', analysis: 'فعل مضارع مرفوع لتجرده من الناصب والجازم وعلامة رفعه الضمة الظاهرة، والفاعل ضمير مستتر تقديره هو يعود على العلم.' },
      { text: 'قَدْرَ', pos: 'مفعول به', analysis: 'مفعول به منصوب وعلامة نصبه الفتحة الظاهرة وهو مضاف.' },
      { text: 'صَاحِبِهِ', pos: 'مضاف إليه', analysis: 'صاحب: مضاف إليه مجرور بالكسرة، والهاء: ضمير متصل مبني في محل جر مضاف إليه. وجملة (يرفع قدر صاحبه) في محل رفع خبر إنّ.' },
    ],
  },
  {
    id: 'sample-2',
    sentence: 'كَانَ الشَّيْخُ حَرِيصاً عَلَى التَّعْلِيمِ',
    translationFr: 'Le cheikh était soucieux de l’enseignement.',
    source: 'تطبيقات كان وأخواتها في المنهج السنغالي',
    words: [
      { text: 'كَانَ', pos: 'فعل ماضٍ ناقص', analysis: 'فعل ماضٍ ناقص ناسخ يرفع المبتدأ وينصب الخبر، مبني على الفتح.' },
      { text: 'الشَّيْخُ', pos: 'اسم كان', analysis: 'اسم كان مرفوع وعلامة رفعه الضمة الظاهرة على آخره.' },
      { text: 'حَرِيصاً', pos: 'خبر كان', analysis: 'خبر كان منصوب وعلامة نصبه الفتحة الظاهرة (تنوين الفتح).' },
      { text: 'عَلَى', pos: 'حرف جر', analysis: 'حرف جر مبني على السكون لا محل له من الإعراب.' },
      { text: 'التَّعْلِيمِ', pos: 'اسم مجرور', analysis: 'اسم مجرور بعلى وعلامة جره الكسرة الظاهرة على آخره.' },
    ],
  },
];

export const SubjectArabic: React.FC<SubjectArabicProps> = ({ onAskTutor }) => {
  const arabicLessons = CURRICULUM_LESSONS.filter((l) => l.subject === 'arabic');
  const [selectedLessonId, setSelectedLessonId] = useState(arabicLessons[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'lessons' | 'parsing' | 'anthology'>('lessons');
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(0);
  const [speakingText, setSpeakingText] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    const checkCompletion = () => {
      const ids = arabicLessons.filter((l) => isLessonCompleted(l.id)).map((l) => l.id);
      setCompletedLessons(ids);
    };
    checkCompletion();
    window.addEventListener('ie_progress_updated', checkCompletion);
    return () => window.removeEventListener('ie_progress_updated', checkCompletion);
  }, []);

  const activeLesson = arabicLessons.find((l) => l.id === selectedLessonId) || arabicLessons[0];
  const activeParsing = PARSING_SAMPLES[selectedSampleIndex];

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setSpeakingText(text);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.85;
    utterance.onend = () => setSpeakingText(null);
    utterance.onerror = () => setSpeakingText(null);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-8">
      {/* Banner Card */}
      <div className="relative rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-900 text-white shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
          <div className="md:col-span-8 p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-2">
                <span>وحدة اللغة العربية وآدابها</span>
                <span aria-hidden="true">·</span>
                <span>المستوى الثانوي والجامعي بالسنغال</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                لغة القرآن ومنظومات علماء السنغال
              </h2>
              <p className="text-stone-300 text-sm mt-2 leading-relaxed max-w-xl">
                تأصيل قواعد النحو والصرف والبيان، مع التركيز على منظومة الآجرومية ودراسة الأدب العربي السنغالي وشعر المديح والتربية لفضيلة الشيوخ (بمب، مالك سي، والشيخ إبراهيم نياس).
              </p>
            </div>
            {/* Mode selector segmented controls */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 bg-stone-800/80 rounded-xl border border-stone-700/60 w-fit">
              <button
                onClick={() => setActiveTab('lessons')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'lessons'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                الدروس المنهجية
              </button>
              <button
                onClick={() => setActiveTab('parsing')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'parsing'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                المحلل النحوي التفاعلي (الإعراب)
              </button>
              <button
                onClick={() => setActiveTab('anthology')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'anthology'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                ديوان شعراء السنغال
              </button>
            </div>
          </div>
          <div className="md:col-span-4 h-48 md:h-auto relative">
            <img
              src="/src/assets/images/subject_arabic_literature_1794184746556.jpg"
              alt="المخطوطات العربية وشعر علماء السنغال"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-stone-900 md:from-stone-900/90 to-transparent" />
          </div>
        </div>
      </div>

      {/* Mode 1: Curriculum Lessons */}
      {activeTab === 'lessons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Lessons List Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-sm font-bold text-stone-900 dark:text-white px-1">قائمة الدروس المعتمدة</h3>
            {arabicLessons.map((lesson) => {
              const isSelected = lesson.id === activeLesson.id;
              return (
                <div
                  key={lesson.id}
                  onClick={() => setSelectedLessonId(lesson.id)}
                  className={`cursor-pointer p-4 rounded-xl border text-right transition-all shadow-xs ${
                    isSelected
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-500'
                      : 'bg-white dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
                    <span>{lesson.level}</span>
                    <span className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
                      {completedLessons.includes(lesson.id) ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          مكتمل
                        </span>
                      ) : (
                        'درس معتمد'
                      )}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white leading-snug">{lesson.title}</h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2">{lesson.subtitle}</p>
                </div>
              );
            })}

            {/* Quick Consultation CTA */}
            <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-right space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>لديك سؤال في الإعراب أو البلاغة؟</span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                استشر مساعد الشيخ تيجان ا نداو الذكي لشرح أي بيت شعري أو قاعدة نحوية في الامتحان.
              </p>
              <button
                onClick={() => onAskTutor(`أريد شرحاً مبسطاً لقاعدة: ${activeLesson.title}`)}
                className="w-full mt-2 py-2 text-xs font-semibold text-stone-900 dark:text-white bg-white dark:bg-stone-800 border border-amber-300 dark:border-amber-700 rounded-lg hover:bg-amber-100/50 transition-colors"
              >
                سؤال المرشد عن هذا الدرس
              </button>
            </div>
          </div>

          {/* Lesson Main Reader */}
          <div className="lg:col-span-8 bg-white dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700/80 p-6 sm:p-8 space-y-6">
            <div className="border-b border-stone-200 dark:border-stone-700 pb-5">
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">{activeLesson.level}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleLessonCompletion(activeLesson.id)}
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                      completedLessons.includes(activeLesson.id)
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:border-emerald-500'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{completedLessons.includes(activeLesson.id) ? 'الدرس مكتمل بنجاح ✓' : 'تحديد الدرس كمكتمل'}</span>
                  </button>
                  <button
                    onClick={() => handleSpeak(activeLesson.title + '. ' + activeLesson.summary)}
                    className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 p-1.5 rounded-lg border border-stone-200 dark:border-stone-700"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{speakingText ? 'جاري الاستماع...' : 'استمع للدرس'}</span>
                  </button>
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white">{activeLesson.title}</h2>
              <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">{activeLesson.subtitle}</p>
            </div>

            {/* Summary Box */}
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 text-sm leading-relaxed">
              <span className="font-bold text-stone-900 dark:text-white block mb-1">الخلاصة المنهجية:</span>
              {activeLesson.summary}
            </div>

            {/* Detailed Content Paragraphs */}
            <div className="space-y-4">
              <h4 className="text-base font-bold text-stone-900 dark:text-white">المحتوى والشرح التفصيلي</h4>
              {activeLesson.content.map((paragraph, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-stone-50/50 dark:bg-stone-900/30 border border-stone-200/60 dark:border-stone-800/60 text-stone-700 dark:text-stone-200 text-sm leading-relaxed">
                  {paragraph}
                </div>
              ))}
            </div>

            {/* Verses or Quotes if present */}
            {activeLesson.versesOrQuotes && activeLesson.versesOrQuotes.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-stone-900 dark:text-white">شواهد من أدب علماء السنغال</h4>
                {activeLesson.versesOrQuotes.map((vq, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 space-y-2">
                    <p className="font-amiri text-lg sm:text-xl font-bold text-emerald-900 dark:text-emerald-300 text-center py-1">
                      « {vq.text} »
                    </p>
                    <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 pt-2 border-t border-emerald-100 dark:border-emerald-900/50">
                      <span>الناظم: <strong className="text-stone-800 dark:text-stone-200">{vq.author}</strong></span>
                      <button
                        onClick={() => handleSpeak(vq.text)}
                        className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 hover:underline"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        نطق الشاهد
                      </button>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-300 italic">{vq.context}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Key Vocabulary Table */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-stone-900 dark:text-white">المفردات والمصطلحات المقابلة (Arabe / Français)</h4>
              <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-700">
                <table className="w-full text-right text-xs">
                  <thead className="bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400">
                    <tr>
                      <th className="p-3 font-semibold">المصطلح العربي</th>
                      <th className="p-3 font-semibold">المصطلح بالفرنسية (Bac)</th>
                      <th className="p-3 font-semibold">المدلول الإعرابي والبياني</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
                    {activeLesson.keyTerms.map((term, idx) => (
                      <tr key={idx} className="hover:bg-stone-50/60 dark:hover:bg-stone-900/40">
                        <td className="p-3 font-bold text-stone-900 dark:text-white">{term.term}</td>
                        <td className="p-3 font-mono text-stone-500 dark:text-stone-400">{term.frenchTerm || '—'}</td>
                        <td className="p-3 text-stone-600 dark:text-stone-300">{term.explanation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Exam Advice Box */}
            <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-900 dark:text-amber-200 block">وصية الشيخ تيجان ا نداو للامتحان:</span>
                <p className="text-xs text-stone-700 dark:text-stone-300 mt-1 leading-relaxed">{activeLesson.examTips}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Interactive Sentence Parser (المحلل النحوي التفاعلي) */}
      {activeTab === 'parsing' && (
        <div className="bg-white dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700/80 p-6 sm:p-8 space-y-6">
          <div className="border-b border-stone-200 dark:border-stone-700 pb-4">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">مختبر الإعراب التفاعلي</span>
            <h3 className="text-xl font-bold text-stone-900 dark:text-white mt-1">
              محلل الجمل والشواهد النحوية كلمة بكلمة
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              اضغط على أي كلمة من الجملة لرؤية موقعها الإعرابي، حالتها، وحكمها المنهجي.
            </p>
          </div>

          {/* Sample Sentence Selector */}
          <div className="flex flex-wrap gap-2">
            {PARSING_SAMPLES.map((sample, idx) => (
              <button
                key={sample.id}
                onClick={() => {
                  setSelectedSampleIndex(idx);
                  setSelectedWordIndex(0);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                  selectedSampleIndex === idx
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700'
                }`}
              >
                النموذج {idx + 1}: {sample.sentence.slice(0, 24)}...
              </button>
            ))}
          </div>

          {/* Big Interactive Sentence Display */}
          <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-center space-y-4">
            <span className="text-xs text-stone-500 dark:text-stone-400 font-medium block">
              {activeParsing.source} — <span className="font-mono text-stone-400">{activeParsing.translationFr}</span>
            </span>

            {/* Word Buttons */}
            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 dir-rtl py-4">
              {activeParsing.words.map((w, index) => {
                const isSelected = selectedWordIndex === index;
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedWordIndex(index)}
                    className={`font-amiri text-2xl sm:text-3xl font-bold px-3 py-2 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-md scale-105'
                        : 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white border-stone-300 dark:border-stone-700 hover:border-emerald-500'
                    }`}
                  >
                    {w.text}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => handleSpeak(activeParsing.sentence)}
                className="px-3 py-1.5 text-xs text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800 rounded-lg border border-stone-300 dark:border-stone-700 hover:bg-stone-100 flex items-center gap-1.5"
              >
                <Volume2 className="w-3.5 h-3.5" />
                استماع للجملة كاملة
              </button>
            </div>
          </div>

          {/* Active Word Breakdown Card */}
          {selectedWordIndex !== null && activeParsing.words[selectedWordIndex] && (
            <div className="p-5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-500 dark:text-stone-400">تحليل الكلمة المحددة</span>
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-emerald-700 text-white">
                  {activeParsing.words[selectedWordIndex].pos}
                </span>
              </div>
              <div className="font-amiri text-3xl font-bold text-emerald-950 dark:text-emerald-200">
                {activeParsing.words[selectedWordIndex].text}
              </div>
              <div className="text-sm text-stone-800 dark:text-stone-200 leading-relaxed bg-white dark:bg-stone-800 p-4 rounded-lg border border-stone-200 dark:border-stone-700">
                <strong className="text-emerald-700 dark:text-emerald-400 block mb-1">الإعراب الكامل النموذجي:</strong>
                {activeParsing.words[selectedWordIndex].analysis}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 3: Anthology of Senegalese Scholars */}
      {activeTab === 'anthology' && (
        <div className="bg-white dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700/80 p-6 sm:p-8 space-y-6">
          <div className="border-b border-stone-200 dark:border-stone-700 pb-4">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">ديوان الشواهد الأدبية السنغالية</span>
            <h3 className="text-xl font-bold text-stone-900 dark:text-white mt-1">
              قصائد ومنظومات كبار أئمة وعلماء السنغال
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              مقتطفات شعرية في المديح والتوحيد والأخلاق مع دراسة العروض والقافية.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">الشيخ أحمدو بمب الخديم (توبا)</span>
                <span className="text-xs text-stone-500">بحر الرجز</span>
              </div>
              <h4 className="text-base font-bold text-stone-900 dark:text-white">منظومة «مسالك الجنان»</h4>
              <p className="font-amiri text-lg font-bold text-stone-800 dark:text-stone-200 py-2 border-y border-stone-200 dark:border-stone-800">
                إِنَّ سَبِيلَ الرُّشْدِ وَالفَلاَحِ ... إِخْلاَصُ أَعْمَالٍ مَعَ الصَّلاَحِ
              </p>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                منظومة تربوية شاملة تتناول تهذيب النفس ومقاصد الشريعة، وتدرس في معاهد السنغال كنموذج رصين للأدب التعليمي الموزون.
              </p>
              <button
                onClick={() => handleSpeak('إِنَّ سَبِيلَ الرُّشْدِ وَالفَلاَحِ إِخْلاَصُ أَعْمَالٍ مَعَ الصَّلاَحِ')}
                className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-semibold"
              >
                <Volume2 className="w-3.5 h-3.5" />
                استماع للشاهد
              </button>
            </div>

            <div className="p-5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">الشيخ الحاج مالك سي (تيفاوان)</span>
                <span className="text-xs text-stone-500">بحر البسيط</span>
              </div>
              <h4 className="text-base font-bold text-stone-900 dark:text-white">قصيدة «كفاية الراغبين» في النحو والتربية</h4>
              <p className="font-amiri text-lg font-bold text-stone-800 dark:text-stone-200 py-2 border-y border-stone-200 dark:border-stone-800">
                تَفَقَّهْ فِي دِينِ الإِلَهِ فَإِنَّهُ ... نَجَاةٌ لِمَنْ يَرْجُو الأَمَانَ وَمَوْئِلاَ
              </p>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                حث على طلب العلم والتفقه في العربية والشريعة، اشتهرت في حلقات العلم بمدينة تيفاوان وسانت لويس وداكار.
              </p>
              <button
                onClick={() => handleSpeak('تَفَقَّهْ فِي دِينِ الإِلَهِ فَإِنَّهُ نَجَاةٌ لِمَنْ يَرْجُو الأَمَانَ وَمَوْئِلاَ')}
                className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-semibold"
              >
                <Volume2 className="w-3.5 h-3.5" />
                استماع للشاهد
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
