import React, { useState, useEffect } from 'react';
import {
  calculateStats,
  updateStudentProfile,
  getProgress,
  saveProgress,
} from '../services/studentProgress';
import { CURRICULUM_LESSONS } from '../data/senegalCurriculum';
import {
  User,
  Award,
  CheckCircle2,
  BookOpen,
  Compass,
  Globe2,
  BarChart3,
  Calendar,
  RotateCcw,
  Sparkles,
  Edit2,
  Save,
} from 'lucide-react';

export const StudentProfile: React.FC = () => {
  const [stats, setStats] = useState(() => calculateStats(CURRICULUM_LESSONS.length));
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(stats.studentName);
  const [schoolInput, setSchoolInput] = useState(stats.schoolOrDaara);

  const refreshStats = () => {
    setStats(calculateStats(CURRICULUM_LESSONS.length));
  };

  useEffect(() => {
    refreshStats();
    const handleUpdate = () => refreshStats();
    window.addEventListener('ie_progress_updated', handleUpdate);
    return () => window.removeEventListener('ie_progress_updated', handleUpdate);
  }, []);

  const handleSaveProfile = () => {
    updateStudentProfile(nameInput, schoolInput);
    setIsEditing(false);
    refreshStats();
  };

  const handleReset = () => {
    if (confirm('هل أنت متأكد من رغبتك في إعادة ضبط سجل الدروس المكتملة ونتائج الامتحانات؟')) {
      saveProgress({
        completedLessonIds: [],
        quizHistory: [],
        studentName: stats.studentName,
        schoolOrDaara: stats.schoolOrDaara,
      });
      refreshStats();
    }
  };

  // Calculate subject-specific completion
  const arabicTotal = CURRICULUM_LESSONS.filter((l) => l.subject === 'arabic').length;
  const historyTotal = CURRICULUM_LESSONS.filter((l) => l.subject === 'history').length;
  const geographyTotal = CURRICULUM_LESSONS.filter((l) => l.subject === 'geography').length;

  const currentData = getProgress();
  const completedArabic = CURRICULUM_LESSONS.filter(
    (l) => l.subject === 'arabic' && currentData.completedLessonIds.includes(l.id)
  ).length;
  const completedHistory = CURRICULUM_LESSONS.filter(
    (l) => l.subject === 'history' && currentData.completedLessonIds.includes(l.id)
  ).length;
  const completedGeography = CURRICULUM_LESSONS.filter(
    (l) => l.subject === 'geography' && currentData.completedLessonIds.includes(l.id)
  ).length;

  return (
    <div className="space-y-6">
      {/* Student Identity Card */}
      <div className="bg-white dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700/80 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-700 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-2xl shadow-sm">
              <User className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="px-2.5 py-1 text-base font-bold rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white"
                  />
                ) : (
                  <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white">
                    {stats.studentName}
                  </h2>
                )}
                <button
                  onClick={() => {
                    if (isEditing) handleSaveProfile();
                    else setIsEditing(true);
                  }}
                  className="p-1 text-stone-400 hover:text-emerald-700 transition-colors"
                >
                  {isEditing ? <Save className="w-4 h-4 text-emerald-600" /> : <Edit2 className="w-4 h-4" />}
                </button>
              </div>

              {isEditing ? (
                <input
                  type="text"
                  value={schoolInput}
                  onChange={(e) => setSchoolInput(e.target.value)}
                  placeholder="المعهد / الجامعة / المدرسة بالسنغال..."
                  className="mt-1 px-2.5 py-0.5 text-xs rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-900 text-stone-700 dark:text-stone-300 w-full"
                />
              ) : (
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  {stats.schoolOrDaara} · <span className="text-emerald-700 dark:text-emerald-400 font-semibold">منصة IE بإشراف الشيخ تيجان ا نداو</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleReset}
              className="text-xs text-stone-400 hover:text-red-600 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:border-red-300 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة ضبط التقدم</span>
            </button>
          </div>
        </div>

        {/* Big Visual Progress Bar */}
        <div className="space-y-3 p-5 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-stone-800 dark:text-stone-200">
              إجمالي إنجاز المنهج الدراسي المعتمد:
            </span>
            <span className="text-emerald-700 dark:text-emerald-400 text-base font-extrabold tabular-nums">
              {stats.progressPercent}%
            </span>
          </div>

          {/* Progress Bar Container */}
          <div className="w-full h-3.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${stats.progressPercent}%` }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-stone-500 dark:text-stone-400 pt-1">
            <span>
              أتممت <strong className="text-stone-900 dark:text-white tabular-nums">{stats.completedCount}</strong> من أصل{' '}
              <strong className="tabular-nums">{CURRICULUM_LESSONS.length}</strong> دروس مقررة
            </span>
            <span>
              متوسط درجات الامتحانات: <strong className="text-emerald-700 dark:text-emerald-400 tabular-nums">{stats.avgScore}%</strong>
            </span>
          </div>
        </div>

        {/* Subject-specific Progress Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-stone-900 dark:text-white">
              <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                <BookOpen className="w-4 h-4" />
                اللغة العربية
              </span>
              <span className="tabular-nums">
                {completedArabic} / {arabicTotal}
              </span>
            </div>
            <div className="w-full h-2 bg-stone-100 dark:bg-stone-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all"
                style={{ width: `${(completedArabic / Math.max(1, arabicTotal)) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-stone-900 dark:text-white">
              <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                <Compass className="w-4 h-4" />
                تاريخ السنغال
              </span>
              <span className="tabular-nums">
                {completedHistory} / {historyTotal}
              </span>
            </div>
            <div className="w-full h-2 bg-stone-100 dark:bg-stone-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-600 rounded-full transition-all"
                style={{ width: `${(completedHistory / Math.max(1, historyTotal)) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-stone-900 dark:text-white">
              <span className="flex items-center gap-1.5 text-sky-700 dark:text-sky-400">
                <Globe2 className="w-4 h-4" />
                الجغرافيا والتنمية
              </span>
              <span className="tabular-nums">
                {completedGeography} / {geographyTotal}
              </span>
            </div>
            <div className="w-full h-2 bg-stone-100 dark:bg-stone-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-600 rounded-full transition-all"
                style={{ width: `${(completedGeography / Math.max(1, geographyTotal)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Academic Badges & Laurels */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            أوسمة الإنجاز الأكاديمي لفضيلة الشيخ تيجان ا نداو
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div
              className={`p-3.5 rounded-xl border text-center space-y-1 transition-all ${
                completedArabic >= 1
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-950 dark:text-emerald-200 font-bold'
                  : 'bg-stone-50 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 text-stone-400 opacity-60'
              }`}
            >
              <div className="text-2xl">📜</div>
              <div className="text-[11px]">وسام الآجرومية</div>
              <span className="text-[10px] block font-normal">{completedArabic >= 1 ? 'مكتمل' : 'قيد الدراسة'}</span>
            </div>

            <div
              className={`p-3.5 rounded-xl border text-center space-y-1 transition-all ${
                completedHistory >= 1
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-950 dark:text-amber-200 font-bold'
                  : 'bg-stone-50 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 text-stone-400 opacity-60'
              }`}
            >
              <div className="text-2xl">🏛️</div>
              <div className="text-[11px]">وسام مؤرخ تكرور</div>
              <span className="text-[10px] block font-normal">{completedHistory >= 1 ? 'مكتمل' : 'قيد الدراسة'}</span>
            </div>

            <div
              className={`p-3.5 rounded-xl border text-center space-y-1 transition-all ${
                completedGeography >= 1
                  ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-400 text-sky-950 dark:text-sky-200 font-bold'
                  : 'bg-stone-50 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 text-stone-400 opacity-60'
              }`}
            >
              <div className="text-2xl">🌍</div>
              <div className="text-[11px]">وسام الجغرافي</div>
              <span className="text-[10px] block font-normal">{completedGeography >= 1 ? 'مكتمل' : 'قيد الدراسة'}</span>
            </div>

            <div
              className={`p-3.5 rounded-xl border text-center space-y-1 transition-all ${
                stats.totalQuizzes >= 2 && stats.avgScore >= 70
                  ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-400 text-purple-950 dark:text-purple-200 font-bold'
                  : 'bg-stone-50 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 text-stone-400 opacity-60'
              }`}
            >
              <div className="text-2xl">🏆</div>
              <div className="text-[11px]">فارس البكالوريا</div>
              <span className="text-[10px] block font-normal">
                {stats.totalQuizzes >= 2 && stats.avgScore >= 70 ? 'مكتمل' : 'اختباران + 70%'}
              </span>
            </div>
          </div>
        </div>

        {/* Quiz History Records Table */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            سجل نتائج الاختبارات والامتحانات التفاعلية (المحفوظ محلياً):
          </h3>

          {stats.quizHistory.length === 0 ? (
            <div className="p-6 rounded-xl border border-dashed border-stone-300 dark:border-stone-700 text-center text-xs text-stone-400">
              لم تقم بحل أي اختبار بعد. توجه إلى «بنك الامتحانات» واختبر معلوماتك ليتم تسجيل نتيجتك هنا تلقائياً!
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-700">
              <table className="w-full text-right text-xs">
                <thead className="bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400">
                  <tr>
                    <th className="p-3">المادة</th>
                    <th className="p-3">الدرجة المحصلة</th>
                    <th className="p-3">النسبة المئوية</th>
                    <th className="p-3">تاريخ الاختبار</th>
                    <th className="p-3">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
                  {stats.quizHistory.map((rec) => (
                    <tr key={rec.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/40">
                      <td className="p-3 font-bold text-stone-900 dark:text-white">{rec.subject}</td>
                      <td className="p-3 tabular-nums font-semibold">
                        {rec.score} / {rec.total}
                      </td>
                      <td className="p-3 tabular-nums font-bold text-emerald-700 dark:text-emerald-400">
                        {rec.percentage}%
                      </td>
                      <td className="p-3 text-stone-500 tabular-nums">{rec.date}</td>
                      <td className="p-3">
                        {rec.percentage >= 70 ? (
                          <span className="text-emerald-700 dark:text-emerald-400 font-bold">ممتاز ✓</span>
                        ) : rec.percentage >= 50 ? (
                          <span className="text-amber-600 font-bold">ناجح</span>
                        ) : (
                          <span className="text-red-500 font-bold">يحتاج مراجعة</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
