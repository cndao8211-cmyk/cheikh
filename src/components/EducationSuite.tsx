import React, { useState } from 'react';
import { SubjectArabic } from './SubjectArabic';
import { SubjectHistory } from './SubjectHistory';
import { SubjectGeography } from './SubjectGeography';
import { ExamBank } from './ExamBank';
import { TutorCheikhNdao } from './TutorCheikhNdao';
import { StudentProfile } from './StudentProfile';
import { AcademicAiServices } from './AcademicAiServices';
import { LessonsMediaHub } from './LessonsMediaHub';
import { CheikhLecturesAndPapersHub } from './CheikhLecturesAndPapersHub';
import { BookOpen, Compass, Globe2, Award, Sparkles, User, Wand2, Layers, Video } from 'lucide-react';

interface EducationSuiteProps {
  initialSubject?: 'cheikh_lectures' | 'media_hub' | 'profile' | 'academic_ai' | 'arabic' | 'history' | 'geography' | 'exams' | 'tutor';
  onAskTutor: (query: string) => void;
}

export const EducationSuite: React.FC<EducationSuiteProps> = ({
  initialSubject = 'cheikh_lectures',
  onAskTutor,
}) => {
  const [activeSubj, setActiveSubj] = useState<
    'cheikh_lectures' | 'media_hub' | 'profile' | 'academic_ai' | 'arabic' | 'history' | 'geography' | 'exams' | 'tutor'
  >(initialSubject);

  return (
    <div className="space-y-6">
      {/* Subject and Tools Selector Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-white dark:bg-stone-800/80 p-4 rounded-2xl border border-stone-200 dark:border-stone-700">
        <div>
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">منظومة التعليم والجامع بالسنغال</span>
          <h2 className="text-xl font-bold text-stone-900 dark:text-white">المناهج المعتمدة ومتابعة الإنجاز والذكاء الأكاديمي</h2>
        </div>

        <div className="flex items-center flex-wrap gap-1.5 p-1 bg-stone-100 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
          <button
            onClick={() => setActiveSubj('cheikh_lectures')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeSubj === 'cheikh_lectures'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-blue-400" />
            <span>قاعة شروحات الشيخ (فيديو & PDF)</span>
          </button>
          <button
            onClick={() => setActiveSubj('media_hub')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeSubj === 'media_hub'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>فهرس الدروس والمواد</span>
          </button>
          <button
            onClick={() => setActiveSubj('profile')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeSubj === 'profile'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            الملف ونسبة التقدم
          </button>
          <button
            onClick={() => setActiveSubj('academic_ai')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeSubj === 'academic_ai'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            الخدمات الأكاديمية الذكية
          </button>
          <button
            onClick={() => setActiveSubj('arabic')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeSubj === 'arabic'
                ? 'bg-white dark:bg-stone-800 text-emerald-700 dark:text-emerald-300 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            اللغة العربية
          </button>
          <button
            onClick={() => setActiveSubj('history')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeSubj === 'history'
                ? 'bg-white dark:bg-stone-800 text-amber-700 dark:text-amber-300 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            التاريخ والممالك
          </button>
          <button
            onClick={() => setActiveSubj('geography')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeSubj === 'geography'
                ? 'bg-white dark:bg-stone-800 text-sky-700 dark:text-sky-300 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            الجغرافيا والتنمية
          </button>
          <button
            onClick={() => setActiveSubj('exams')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeSubj === 'exams'
                ? 'bg-white dark:bg-stone-800 text-purple-700 dark:text-purple-300 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            بنك الامتحانات
          </button>
          <button
            onClick={() => setActiveSubj('tutor')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeSubj === 'tutor'
                ? 'bg-white dark:bg-stone-800 text-emerald-700 dark:text-emerald-300 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            مرشد الشيخ تيجان
          </button>
        </div>
      </div>

      {activeSubj === 'cheikh_lectures' && <CheikhLecturesAndPapersHub onAskTutor={onAskTutor} />}
      {activeSubj === 'media_hub' && <LessonsMediaHub onAskTutor={onAskTutor} />}
      {activeSubj === 'profile' && <StudentProfile />}
      {activeSubj === 'academic_ai' && <AcademicAiServices />}
      {activeSubj === 'arabic' && <SubjectArabic onAskTutor={onAskTutor} />}
      {activeSubj === 'history' && <SubjectHistory onAskTutor={onAskTutor} />}
      {activeSubj === 'geography' && <SubjectGeography onAskTutor={onAskTutor} />}
      {activeSubj === 'exams' && <ExamBank onAskTutor={onAskTutor} />}
      {activeSubj === 'tutor' && <TutorCheikhNdao />}
    </div>
  );
};
