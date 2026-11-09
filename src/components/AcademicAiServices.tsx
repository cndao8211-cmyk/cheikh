import React, { useState } from 'react';
import {
  FileText,
  Feather,
  BookMarked,
  Sparkles,
  Loader2,
  CheckCircle2,
  Award,
  ChevronLeft,
  ChevronRight,
  RotateCw,
} from 'lucide-react';

export const AcademicAiServices: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'essay' | 'poetry' | 'flashcards'>('essay');

  // Essay Grader state
  const [essayTopic, setEssayTopic] = useState('دور المقاومة الروحية للشيخ أحمدو بمب في حفظ الهوية السنغالية');
  const [essayText, setEssayText] = useState(
    'لقد شكلت المقاومة الروحية في السنغال نموذجاً فريداً ضد الاستعمار الفرنسي. اعتمد الشيخ أحمدو بمب مباكي على غرس العقيدة الصحيحة، وتأسيس الزوايا القرآنية، وتربية النفوس على العمل والزراعة، مما حمى الشخصية الإسلامية للمجتمع دون اللجوء إلى السلاح المباشر.'
  );
  const [isGrading, setIsGrading] = useState(false);
  const [essayResult, setEssayResult] = useState<any | null>(null);

  // Poetry Analyzer state
  const [poemVerses, setPoemVerses] = useState(
    'بِالعِلْمِ يُدْرِكُ مَا يَرْجُوهُ طَالِبُهُ ... وَلَيْسَ يَخْشَى مَعَ الإِتْقَانِ خُسْرَانَا'
  );
  const [isAnalyzingPoem, setIsAnalyzingPoem] = useState(false);
  const [poemResult, setPoemResult] = useState<any | null>(null);

  // Flashcards state
  const [lessonTopic, setLessonTopic] = useState('نواسخ الابتداء: كان وأخواتها وإنّ وأخواتها');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryResult, setSummaryResult] = useState<any | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  const handleGradeEssay = async () => {
    if (!essayText.trim()) return;
    setIsGrading(true);
    try {
      const res = await fetch('/api/academic/grade-essay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: essayTopic, studentText: essayText }),
      });
      const data = await res.json();
      setEssayResult(data.result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGrading(false);
    }
  };

  const handleAnalyzePoem = async () => {
    if (!poemVerses.trim()) return;
    setIsAnalyzingPoem(true);
    try {
      const res = await fetch('/api/academic/analyze-poem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verses: poemVerses }),
      });
      const data = await res.json();
      setPoemResult(data.result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzingPoem(false);
    }
  };

  const handleSummarizeLesson = async () => {
    if (!lessonTopic.trim()) return;
    setIsSummarizing(true);
    try {
      const res = await fetch('/api/academic/summarize-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: lessonTopic, content: '' }),
      });
      const data = await res.json();
      setSummaryResult(data.result);
      setCurrentCardIndex(0);
      setIsCardFlipped(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Service Switcher */}
      <div className="bg-white dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700/80 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-700 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-semibold mb-1">
              <span>حزمة الخدمات الأكاديمية الذكية (AI Academic Services)</span>
              <span aria-hidden="true">·</span>
              <span>معهد IE بإشراف الشيخ تيجان ا نداو</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white">
              أدوات الذكاء الاصطناعي الأكاديمي لطلاب السنغال
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
              مصحح الإنشاء الأدبي، محلل العروض والبلاغة للشعر السنغالي، ومولد بطاقات المراجعة الذكية للبكالوريا.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('essay')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                activeTab === 'essay'
                  ? 'bg-white dark:bg-stone-800 text-emerald-700 dark:text-emerald-300 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              مصحح الإنشاء الأدبي
            </button>
            <button
              onClick={() => setActiveTab('poetry')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                activeTab === 'poetry'
                  ? 'bg-white dark:bg-stone-800 text-amber-700 dark:text-amber-300 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <Feather className="w-3.5 h-3.5" />
              محلل العروض والشعر
            </button>
            <button
              onClick={() => setActiveTab('flashcards')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                activeTab === 'flashcards'
                  ? 'bg-white dark:bg-stone-800 text-purple-700 dark:text-purple-300 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <BookMarked className="w-3.5 h-3.5" />
              بطاقات المراجعة الذكية
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Essay & Composition Grader */}
      {activeTab === 'essay' && (
        <div className="bg-white dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700/80 p-6 sm:p-8 space-y-6">
          <div className="border-b border-stone-200 dark:border-stone-700 pb-3">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
              مصحح الإنشاء والتحرير لشهادة البكالوريا العربية السنغالية
            </span>
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mt-1">
              تقييم المقال وفق معايير وزارة التربية والتعليم ومعاهد السنغال
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                عنوان أو موضوع الامتحان الإنشائي:
              </label>
              <input
                type="text"
                value={essayTopic}
                onChange={(e) => setEssayTopic(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white text-xs text-right"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                نص مقالك الإنشائي للمراجعة والتصحيح:
              </label>
              <textarea
                rows={5}
                value={essayText}
                onChange={(e) => setEssayText(e.target.value)}
                placeholder="اكتب مقالك الإنشائي هنا..."
                className="w-full p-3.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white text-xs leading-relaxed text-right"
              />
            </div>

            <button
              onClick={handleGradeEssay}
              disabled={isGrading || !essayText.trim()}
              className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 disabled:opacity-50 transition-all"
            >
              {isGrading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
              <span>تصحيح المقال وتقييم الدرجة (من 20)</span>
            </button>
          </div>

          {essayResult && (
            <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-4 text-right">
              <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
                <div>
                  <span className="text-xs text-stone-500">التقدير العام:</span>
                  <div className="text-sm font-bold text-stone-900 dark:text-white">{essayResult.appraisal}</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800">
                  <span className="text-[10px] text-emerald-800 dark:text-emerald-300 block">درجة البكالوريا</span>
                  <div className="text-2xl font-black text-emerald-800 dark:text-emerald-300 tabular-nums">
                    {essayResult.scoreOutOf20} / 20
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-xs text-stone-700 dark:text-stone-300">
                <div>
                  <strong className="text-stone-900 dark:text-white block mb-1">ملاحظات السلامة اللغوية والنحوية:</strong>
                  <p className="bg-white dark:bg-stone-800 p-3 rounded-lg border border-stone-200 dark:border-stone-700">
                    {essayResult.languageCritique}
                  </p>
                </div>

                <div>
                  <strong className="text-stone-900 dark:text-white block mb-1">نقد الأفكار والشواهد التاريخية:</strong>
                  <p className="bg-white dark:bg-stone-800 p-3 rounded-lg border border-stone-200 dark:border-stone-700">
                    {essayResult.contentCritique}
                  </p>
                </div>

                <div>
                  <strong className="text-emerald-700 dark:text-emerald-400 block mb-1">صياغة نموذجية مقترحة:</strong>
                  <p className="bg-emerald-50/60 dark:bg-emerald-950/20 p-3 rounded-lg border border-emerald-200 dark:border-emerald-900 font-amiri text-sm leading-relaxed">
                    « {essayResult.correctedModelExcerpt} »
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-300">
                  <strong>نصيحة الشيخ تيجان ا نداو للامتحان:</strong> {essayResult.adviceForExam}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Poetry & Prosody Analyzer */}
      {activeTab === 'poetry' && (
        <div className="bg-white dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700/80 p-6 sm:p-8 space-y-6">
          <div className="border-b border-stone-200 dark:border-stone-700 pb-3">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
              محلل العروض، البحور، والبلاغة للشعر السنغالي والعربي
            </span>
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mt-1">
              استخراج البحر الشعري، التفعيلات، الروي والقافية، والمحسنات البديعية
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                البيت الشعري أو الشاهد الأدبي:
              </label>
              <textarea
                rows={3}
                value={poemVerses}
                onChange={(e) => setPoemVerses(e.target.value)}
                placeholder="اكتب البيت الشعري بالتشكيل إن أمكن..."
                className="w-full p-3.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white text-sm font-amiri leading-relaxed text-right"
              />
            </div>

            <button
              onClick={handleAnalyzePoem}
              disabled={isAnalyzingPoem || !poemVerses.trim()}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 disabled:opacity-50 transition-all"
            >
              {isAnalyzingPoem ? <Loader2 className="w-4 h-4 animate-spin" /> : <Feather className="w-4 h-4" />}
              <span>تحليل البحر والعروض والبلاغة</span>
            </button>
          </div>

          {poemResult && (
            <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-4 text-right">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                  <span className="text-xs text-stone-400">البحر الشعري:</span>
                  <div className="text-base font-bold text-amber-700 dark:text-amber-400 mt-0.5">
                    {poemResult.meterName}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                  <span className="text-xs text-stone-400">التفعيلات الخليلية:</span>
                  <div className="text-xs font-mono font-bold text-stone-800 dark:text-stone-200 mt-0.5">
                    {poemResult.tafeela}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                  <span className="text-xs text-stone-400">الروي والقافية:</span>
                  <div className="text-base font-bold text-stone-800 dark:text-stone-200 mt-0.5">
                    {poemResult.rawi}
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-xs text-stone-700 dark:text-stone-300">
                <div>
                  <strong className="text-stone-900 dark:text-white block mb-1">المحسنات البيانية والبديعية:</strong>
                  <div className="flex flex-wrap gap-2">
                    {poemResult.rhetoricalGems?.map((gem: string, i: number) => (
                      <span key={i} className="px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-900">
                        {gem}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <strong className="text-stone-900 dark:text-white block mb-1">المعنى الإجمالي والتربوي:</strong>
                  <p className="bg-white dark:bg-stone-800 p-3 rounded-lg border border-stone-200 dark:border-stone-700 leading-relaxed">
                    {poemResult.poeticMeaning}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Flashcards & Summarizer */}
      {activeTab === 'flashcards' && (
        <div className="bg-white dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700/80 p-6 sm:p-8 space-y-6">
          <div className="border-b border-stone-200 dark:border-stone-700 pb-3">
            <span className="text-xs font-bold text-purple-700 dark:text-purple-400">
              بطاقات المراجعة الذكية (Interactive Flashcards)
            </span>
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mt-1">
              تثبيت وحفظ القواعد والتواريخ الجغرافية والتاريخية بأسلوب البطاقات القابلة للقلب
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={lessonTopic}
              onChange={(e) => setLessonTopic(e.target.value)}
              placeholder="اكتب اسم الدرس لتوليد بطاقات المراجعة..."
              className="flex-1 p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white text-xs text-right"
            />
            <button
              onClick={handleSummarizeLesson}
              disabled={isSummarizing || !lessonTopic.trim()}
              className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 disabled:opacity-50 transition-all shrink-0"
            >
              {isSummarizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
              <span>توليد البطاقات والملخص</span>
            </button>
          </div>

          {summaryResult && summaryResult.flashcards && summaryResult.flashcards.length > 0 && (
            <div className="space-y-6 max-w-lg mx-auto">
              {/* Flippable Card Container */}
              <div
                onClick={() => setIsCardFlipped((prev) => !prev)}
                className="cursor-pointer min-h-[200px] p-8 rounded-2xl border-2 border-purple-300 dark:border-purple-700 bg-gradient-to-br from-purple-50 to-stone-50 dark:from-stone-900 dark:to-purple-950/40 shadow-md transition-all hover:shadow-lg flex flex-col justify-between text-center select-none"
              >
                <div className="flex items-center justify-between text-xs text-purple-600 dark:text-purple-400">
                  <span>بطاقة {currentCardIndex + 1} من {summaryResult.flashcards.length}</span>
                  <span className="flex items-center gap-1">
                    <RotateCw className="w-3.5 h-3.5" />
                    اضغط للقلب ({isCardFlipped ? 'الوجه الخلفي: الجواب' : 'الوجه الأمامي: السؤال'})
                  </span>
                </div>

                <div className="py-6">
                  {!isCardFlipped ? (
                    <div className="text-lg font-bold text-stone-900 dark:text-white leading-relaxed">
                      {summaryResult.flashcards[currentCardIndex].front}
                    </div>
                  ) : (
                    <div className="text-base font-semibold text-purple-950 dark:text-purple-200 leading-relaxed bg-white dark:bg-stone-800 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                      {summaryResult.flashcards[currentCardIndex].back}
                    </div>
                  )}
                </div>

                <div className="text-[11px] text-stone-400">
                  {isCardFlipped ? 'اضغط مرة أخرى لإعادة إخفاء الجواب' : 'فكر في الإجابة ثم اضغط لإظهار الحل'}
                </div>
              </div>

              {/* Card Navigation */}
              <div className="flex items-center justify-between">
                <button
                  disabled={currentCardIndex === 0}
                  onClick={() => {
                    setCurrentCardIndex((prev) => Math.max(0, prev - 1));
                    setIsCardFlipped(false);
                  }}
                  className="px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-700 text-xs disabled:opacity-40 flex items-center gap-1"
                >
                  <ChevronRight className="w-4 h-4" />
                  السابقة
                </button>
                <span className="text-xs text-stone-500 font-mono">
                  {currentCardIndex + 1} / {summaryResult.flashcards.length}
                </span>
                <button
                  disabled={currentCardIndex === summaryResult.flashcards.length - 1}
                  onClick={() => {
                    setCurrentCardIndex((prev) => Math.min(summaryResult.flashcards.length - 1, prev + 1));
                    setIsCardFlipped(false);
                  }}
                  className="px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-700 text-xs disabled:opacity-40 flex items-center gap-1"
                >
                  التالية
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Memory Mnemonic */}
              {summaryResult.memoryMnemonic && (
                <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-xs space-y-1">
                  <strong className="text-purple-800 dark:text-purple-300 block">قاعدة الحفظ السريع:</strong>
                  <p className="text-stone-700 dark:text-stone-300 leading-relaxed">{summaryResult.memoryMnemonic}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
