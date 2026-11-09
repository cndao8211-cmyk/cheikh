export type SubjectId = 'arabic' | 'history' | 'geography';

export interface LessonMedia {
  videos?: { id: string; title: string; url: string; duration?: string; description?: string }[];
  pdfFiles?: { id: string; title: string; fileName: string; size?: string; url?: string; description?: string }[];
  images?: { id: string; title: string; url: string; caption?: string }[];
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  subject: SubjectId;
  level: string; // 'ثانوي / بكالوريا' | 'جامعي' | 'معاهد'
  summary: string;
  content: string[];
  keyTerms: { term: string; explanation: string; frenchTerm?: string }[];
  examTips: string;
  versesOrQuotes?: { text: string; author: string; context: string }[];
  media?: LessonMedia;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  subject: SubjectId;
  yearReference?: string;
}

export interface SenegalEmpire {
  id: string;
  name: string;
  frenchName: string;
  period: string;
  capital: string;
  significance: string;
  notableFigures: string[];
  details: string;
}

export interface SenegalRegion {
  id: string;
  name: string;
  frenchName: string;
  capital: string;
  climateZone: string;
  economicActivity: string[];
  historicalSite: string;
  description: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  category: 'history' | 'resistance' | 'scholarship' | 'republic';
  description: string;
}
