export interface QuizRecord {
  id: string;
  subject: string;
  score: number;
  total: number;
  date: string;
  percentage: number;
}

export interface StudentProgressData {
  completedLessonIds: string[];
  quizHistory: QuizRecord[];
  studentName: string;
  schoolOrDaara: string;
}

const STORAGE_KEY = 'ie_student_progress_v1';

export function getProgress(): StudentProgressData {
  if (typeof window === 'undefined') {
    return {
      completedLessonIds: [],
      quizHistory: [],
      studentName: 'طالب معهد IE',
      schoolOrDaara: 'الجامع والمعاهد بالسنغال',
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse progress from localStorage', e);
  }

  return {
    completedLessonIds: [],
    quizHistory: [],
    studentName: 'طالب معهد IE',
    schoolOrDaara: 'الجامع والمعاهد بالسنغال',
  };
}

export function saveProgress(data: StudentProgressData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event('ie_progress_updated'));
  } catch (e) {
    console.error('Failed to save progress to localStorage', e);
  }
}

export function toggleLessonCompletion(lessonId: string): boolean {
  const current = getProgress();
  const exists = current.completedLessonIds.includes(lessonId);
  let updated: string[];

  if (exists) {
    updated = current.completedLessonIds.filter((id) => id !== lessonId);
  } else {
    updated = [...current.completedLessonIds, lessonId];
  }

  saveProgress({
    ...current,
    completedLessonIds: updated,
  });

  return !exists;
}

export function isLessonCompleted(lessonId: string): boolean {
  const current = getProgress();
  return current.completedLessonIds.includes(lessonId);
}

export function recordQuizCompletion(subject: string, score: number, total: number): void {
  const current = getProgress();
  const newRecord: QuizRecord = {
    id: Date.now().toString(),
    subject,
    score,
    total,
    date: new Date().toLocaleDateString('ar-SN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    percentage: Math.round((score / Math.max(1, total)) * 100),
  };

  saveProgress({
    ...current,
    quizHistory: [newRecord, ...current.quizHistory.slice(0, 19)], // keep last 20
  });
}

export function updateStudentProfile(name: string, school: string): void {
  const current = getProgress();
  saveProgress({
    ...current,
    studentName: name,
    schoolOrDaara: school,
  });
}

export function calculateStats(totalAvailableLessons: number = 6) {
  const current = getProgress();
  const completedCount = current.completedLessonIds.length;
  const progressPercent = Math.min(
    100,
    Math.round((completedCount / Math.max(1, totalAvailableLessons)) * 100)
  );

  const totalQuizzes = current.quizHistory.length;
  const avgScore =
    totalQuizzes > 0
      ? Math.round(
          current.quizHistory.reduce((acc, q) => acc + q.percentage, 0) / totalQuizzes
        )
      : 0;

  return {
    completedCount,
    totalAvailableLessons,
    progressPercent,
    totalQuizzes,
    avgScore,
    quizHistory: current.quizHistory,
    studentName: current.studentName,
    schoolOrDaara: current.schoolOrDaara,
  };
}
