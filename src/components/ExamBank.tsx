import React, { useState } from 'react';
import { MOCK_QUIZ_QUESTIONS } from '../data/senegalCurriculum';
import { QuizQuestion, SubjectId } from '../types/curriculum';
import { Award, CheckCircle2, XCircle, RotateCcw, Sparkles, HelpCircle, Loader2, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { recordQuizCompletion } from '../services/studentProgress';

interface ExamBankProps {
  onAskTutor: (query: string) => void;
}

export const ExamBank: React.FC<ExamBankProps> = ({ onAskTutor }) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectId | 'all'>('all');
  const [questions, setQuestions] = useState<QuizQuestion[]>(MOCK_QUIZ_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const filteredQuestions = selectedSubject === 'all'
    ? questions
    : questions.filter((q) => q.subject === selectedSubject);

  const activeQuestion = filteredQuestions[currentIndex] || filteredQuestions[0];

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === activeQuestion.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < filteredQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsQuizCompleted(true);
      const subjectLabel =
        selectedSubject === 'arabic'
          ? 'اللغة العربية والبلاغة'
          : selectedSubject === 'history'
          ? 'تاريخ السنغال والممالك'
          : selectedSubject === 'geography'
          ? 'الجغرافيا السنغالية'
          : 'الاختبار الشامل العام';
      recordQuizCompletion(subjectLabel, score, filteredQuestions.length);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsQuizCompleted(false);
  };

  const handleGenerateAiQuestions = async () => {
    setIsGeneratingAi(true);
    setGenerateError(null);
    try {
      const subjectLabel =
        selectedSubject === 'arabic'
          ? 'اللغة العربية والبلاغة'
          : selectedSubject === 'history'
          ? 'تاريخ السنغال وممالك غرب إفريقيا'
          : selectedSubject === 'geography'
          ? 'جغرافيا السنغال والموارد'
          : 'مواد المنهج السنغالي العام';

      const res = await fetch('/api/exam/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subjectLabel,
          topic: 'المنهج الرسمي لشهادة البكالوريا العربية السنغالية',
          difficulty: 'متقدم',
        }),
      });

      if (!res.ok) {
        throw new Error('تعذر توليد الأسئلة');
      }

      const data = await res.json();
      if (Array.isArray(data.questions) && data.questions.length > 0) {
        const mappedQuestions: QuizQuestion[] = data.questions.map((q: any, i: number) => ({
          id: Date.now() + i,
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          explanation: q.explanation,
          subject: selectedSubject === 'all' ? 'arabic' : selectedSubject,
          yearReference: 'أسئلة مرشد الشيخ تيجان المولدة ذكياً',
        }));
        setQuestions((prev) => [...mappedQuestions, ...prev]);
        setCurrentIndex(0);
        setSelectedOption(null);
        setIsAnswerSubmitted(false);
        setIsQuizCompleted(false);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    } catch (err: any) {
      console.error(err);
      setGenerateError('تعذر توليد أسئلة جديدة حالياً. يمكنك الاستمرار في حل بنك الأسئلة المتاح.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700/80 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-700 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-semibold mb-1">
              <span>بنك الامتحانات الرسمية للسنغال</span>
              <span aria-hidden="true">·</span>
              <span>Baccalauréat Arabe & Concours</span>
            </div>
            <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white">
              الاختبارات التفاعلية والتقييم الذاتي
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
              اختبر معلوماتك في اللغة العربية، تاريخ الممالك، وجغرافيا السنغال مع تصحيح فوري وتعليل منهجي معتمد.
            </p>
          </div>

          <button
            onClick={handleGenerateAiQuestions}
            disabled={isGeneratingAi}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg shadow-sm transition-all flex items-center gap-2 whitespace-nowrap shrink-0 disabled:opacity-60"
          >
            {isGeneratingAi ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                جاري توليد نماذج جديدة...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                توليد أسئلة جديدة ذكياً
              </>
            )}
          </button>
        </div>

        {generateError && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-xs">
            {generateError}
          </div>
        )}

        {/* Subject Filter Bar (Interactive Buttons) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800">
            <button
              onClick={() => {
                setSelectedSubject('all');
                handleRestartQuiz();
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedSubject === 'all'
                  ? 'bg-white dark:bg-stone-800 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              جميع المواد ({questions.length})
            </button>
            <button
              onClick={() => {
                setSelectedSubject('arabic');
                handleRestartQuiz();
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedSubject === 'arabic'
                  ? 'bg-white dark:bg-stone-800 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              اللغة العربية
            </button>
            <button
              onClick={() => {
                setSelectedSubject('history');
                handleRestartQuiz();
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedSubject === 'history'
                  ? 'bg-white dark:bg-stone-800 text-amber-700 dark:text-amber-400 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              التاريخ والممالك
            </button>
            <button
              onClick={() => {
                setSelectedSubject('geography');
                handleRestartQuiz();
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedSubject === 'geography'
                  ? 'bg-white dark:bg-stone-800 text-sky-700 dark:text-sky-400 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              الجغرافيا
            </button>
          </div>

          <div className="text-xs text-stone-500 dark:text-stone-400 font-medium">
            النتيجة الحالية:{' '}
            <strong className="text-emerald-700 dark:text-emerald-400 tabular-nums">
              {score}
            </strong>{' '}
            من{' '}
            <span className="tabular-nums">
              {filteredQuestions.length}
            </span>
          </div>
        </div>
      </div>

      {/* Quiz Active Card or Completed Screen */}
      {!isQuizCompleted && activeQuestion ? (
        <div className="bg-white dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700/80 p-6 sm:p-8 space-y-6">
          {/* Question Header & Progress */}
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 border-b border-stone-200 dark:border-stone-700 pb-3">
            <span>
              السؤال <strong className="text-stone-900 dark:text-white tabular-nums">{currentIndex + 1}</strong> من{' '}
              <strong className="tabular-nums">{filteredQuestions.length}</strong>
            </span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">
              {activeQuestion.yearReference || 'امتحان رسمي معتمد'}
            </span>
          </div>

          {/* Question Text */}
          <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-white leading-relaxed">
            {activeQuestion.question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {activeQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              let optionStyle =
                'bg-stone-50/70 dark:bg-stone-900/40 border-stone-200 dark:border-stone-700 hover:border-emerald-500 text-stone-800 dark:text-stone-200';

              if (isAnswerSubmitted) {
                if (idx === activeQuestion.correctIndex) {
                  optionStyle = 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-bold';
                } else if (isSelected) {
                  optionStyle = 'bg-red-50 dark:bg-red-950/50 border-red-500 text-red-950 dark:text-red-200 line-through';
                } else {
                  optionStyle = 'opacity-50 border-stone-200 dark:border-stone-800 text-stone-500';
                }
              } else if (isSelected) {
                optionStyle = 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-600 text-emerald-900 dark:text-emerald-200 font-semibold';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswerSubmitted}
                  className={`w-full p-4 rounded-xl border text-right transition-all flex items-center justify-between gap-3 text-sm ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-stone-200 dark:bg-stone-700 text-xs font-bold flex items-center justify-center shrink-0">
                      {['أ', 'ب', 'ج', 'د'][idx]}
                    </span>
                    <span>{option}</span>
                  </div>
                  {isAnswerSubmitted && idx === activeQuestion.correctIndex && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {isAnswerSubmitted && isSelected && idx !== activeQuestion.correctIndex && (
                    <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-200 dark:border-stone-700">
            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg shadow-sm transition-all disabled:opacity-40"
              >
                تأكيد الإجابة
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg shadow-sm transition-all"
              >
                {currentIndex + 1 < filteredQuestions.length ? 'السؤال التالي' : 'عرض النتيجة النهائية'}
              </button>
            )}

            <button
              onClick={() => onAskTutor(`أشكل علي هذا السؤال في الامتحان: "${activeQuestion.question}"، هل يمكنك شرح فكرته بالتفصيل؟`)}
              className="text-xs text-stone-600 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4 text-amber-500" />
              <span>طلب شرح السؤال من الشيخ تيجان ا نداو</span>
            </button>
          </div>

          {/* Explanation Callout once answered */}
          {isAnswerSubmitted && (
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300 space-y-1.5">
              <strong className="text-emerald-700 dark:text-emerald-400 block font-bold text-sm">
                التعليل العلمي المنهجي:
              </strong>
              <p className="leading-relaxed">{activeQuestion.explanation}</p>
            </div>
          )}
        </div>
      ) : (
        /* Completed Screen */
        <div className="bg-white dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700/80 p-8 sm:p-12 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 mx-auto flex items-center justify-center">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-2xl font-extrabold text-stone-900 dark:text-white">
              تهانينا! أتممت بنجاح هذا الاختبار
            </h3>
            <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
              لقد أجبت بنجاح على أسئلة المنهج السنغالي المعتمدة.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 max-w-sm mx-auto">
            <div className="text-xs text-stone-500">مجموع درجاتك في الامتحان</div>
            <div className="text-4xl font-black text-emerald-700 dark:text-emerald-400 tabular-nums my-1">
              {score} / {filteredQuestions.length}
            </div>
            <div className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              النسبة المئوية: <span className="tabular-nums">{Math.round((score / filteredQuestions.length) * 100)}%</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleRestartQuiz}
              className="px-5 py-2.5 text-xs font-semibold text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              إعادة حل الاختبار
            </button>
            <button
              onClick={handleGenerateAiQuestions}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              توليد دفعة جديدة من الأسئلة
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
