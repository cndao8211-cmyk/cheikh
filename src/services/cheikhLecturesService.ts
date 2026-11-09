export interface CheikhVideoLecture {
  id: string;
  title: string;
  subject: 'arabic' | 'history' | 'geography' | 'bac_exams';
  subjectTitle: string;
  duration: string;
  videoUrl: string; // YouTube embed, MP4, or video stream
  description: string;
  teacherName: string;
  teacherTitle: string;
  thumbnailUrl: string;
  keyPoints: string[];
  viewsCount: number;
  dateAdded: string;
  hasPdfNotes?: boolean;
  linkedPdfId?: string;
}

export interface CheikhPdfPaper {
  id: string;
  title: string;
  subject: 'arabic' | 'history' | 'geography' | 'bac_exams';
  subjectTitle: string;
  fileName: string;
  fileSize: string;
  pagesCount: number;
  downloadUrl: string;
  description: string;
  teacherName: string;
  previewSummary: string[];
  downloadCount: number;
  dateAdded: string;
}

const STORAGE_VIDEOS_KEY = 'ie_cheikh_videos_v3_official';
const STORAGE_PDFS_KEY = 'ie_cheikh_pdfs_v1';

// Official video lectures and promotional videos of Cheikh Tidiane Ndao (IE Académie)
export const DEFAULT_CHEIKH_VIDEOS: CheikhVideoLecture[] = [
  {
    id: 'vid-ch-official-promo',
    title: 'الفيديو التعريفي الرسمي: أكاديمية IE - الأستاذ نداو (Apprendre · Réussir · Exceller)',
    subject: 'arabic',
    subjectTitle: 'أكاديمية IE - الأستاذ الشيخ تيجان ا نداو',
    duration: '0:08',
    videoUrl: '/assets/aistudio/Create_promotional_video_for_aca__df7acecd_e295e845.mp4',
    description: 'المقطع المرئي الرسمي للأستاذ الشيخ تيجان ا نداو: تقديم مواد الأكاديمية (Histoire, Géographie, Nahu & Sarf, Analyse du texte, Analyse du cours, Méthodologie & Conseils). تواصلوا معنا: 787130061.',
    teacherName: 'الأستاذ الشيخ تيجان ا نداو (Professeur Ndao)',
    teacherTitle: 'المؤسس والمشرف العام - IE Académie',
    thumbnailUrl: '/assets/aistudio/file_00000000f46071f5830b0339c53ac6d7_2f20e753.png',
    keyPoints: [
      'شعار الأكاديمية: Apprendre · Réussir · Exceller (التعلم، النجاح، التفوق)',
      'المقررات: التاريخ، الجغرافيا، لغة النحو والصرف، تحليل النصوص والدروس، المنهجية والنصائح',
      'دروس كاملة ومراجعات فعالة وتأطير شخصي لطلاب جامعة UCAB توبا والسنغال',
      'للتسجيل والتواصل المباشر عبر واتساب: 787130061 (Rejoignez-nous dès à présent!)'
    ],
    viewsCount: 3840,
    dateAdded: '2026-11-09',
    hasPdfNotes: true,
    linkedPdfId: 'pdf-ch-1'
  },
  {
    id: 'vid-ch-recruitment-call',
    title: 'فيديو التسجيل والالتحاق: دورات البكالوريا والمعاهد (Jang ak Réussir ci IE Académie)',
    subject: 'history',
    subjectTitle: 'التسجيل والتوجيه الأكاديمي',
    duration: '0:08',
    videoUrl: '/assets/aistudio/Animate_educational_recruitment___8518f167_860aa8b8.mp4',
    description: 'نداء الالتحاق المباشر ببرامج الأستاذ نداو لدراسة التاريخ والجغرافيا وقواعد النحو والصرف والاستعداد التام للامتحانات الرسمية.',
    teacherName: 'الأستاذ الشيخ تيجان ا نداو (Professeur Ndao)',
    teacherTitle: 'المؤسس والمشرف العام - IE Académie',
    thumbnailUrl: '/assets/aistudio/file_00000000f46071f5830b0339c53ac6d7_2f20e753.png',
    keyPoints: [
      'برنامج Jang Histoire, Géographie ak Nahwu Sarf, ba tax ngay réussir',
      'تغطية شاملة ومبسطة لطلاب الجامع والمعاهد والشهادة الثانوية',
      'أساليب تدريس متطورة وشروحات عملية ونماذج امتحانات سابقة',
      'اتصلوا بنا فوراً (Wotel léegi): واتساب وهاتف 787130061'
    ],
    viewsCount: 2950,
    dateAdded: '2026-11-09',
    hasPdfNotes: true,
    linkedPdfId: 'pdf-ch-2'
  },
  {
    id: 'vid-ch-methods-success',
    title: 'فيديو المنهجية وتحليل النصوص: أسرار التفوق بمرتبة الشرف (Méthodologie & Conseils)',
    subject: 'geography',
    subjectTitle: 'المنهجية وتحليل النصوص',
    duration: '0:08',
    videoUrl: '/assets/aistudio/Create_promotional_video_for_aca__737a80ba_c0761c59.mp4',
    description: 'إرشادات منهجية دقيقة لتحليل نصوص وموضوعات التاريخ والجغرافيا والنحو والصرف من الأستاذ نداو لضمان الدرجات الكاملة.',
    teacherName: 'الأستاذ الشيخ تيجان ا نداو (Professeur Ndao)',
    teacherTitle: 'المؤسس والمشرف العام - IE Académie',
    thumbnailUrl: '/assets/aistudio/file_00000000f46071f5830b0339c53ac6d7_2f20e753.png',
    keyPoints: [
      'خطوات تحليل النصوص (Analyse du texte) وتحليل الدروس (Analyse du cours)',
      'تجنب الأخطاء الشائعة في إعراب النحو والصرف والمقالات الجغرافية',
      'نصائح ذهبية للحصول على التقدير والامتياز في الامتحانات',
      'خدمة الدعم والاستفسار المستمر عبر رقم الواتساب: 787130061'
    ],
    viewsCount: 3120,
    dateAdded: '2026-11-09',
    hasPdfNotes: true,
    linkedPdfId: 'pdf-ch-3'
  }
];

// Seed default PDF study papers & sheets of Cheikh Tidiane Ndao
export const DEFAULT_CHEIKH_PDFS: CheikhPdfPaper[] = [
  {
    id: 'pdf-ch-1',
    title: 'ورقة ومذكرة: خلاصة النواسخ والإعراب النموذجي للبكالوريا',
    subject: 'arabic',
    subjectTitle: 'اللغة العربية وآدابها',
    fileName: 'cheikh_ndao_arabic_grammar_notes.pdf',
    fileSize: '2.8 MB',
    pagesCount: 12,
    downloadUrl: '#',
    description: 'ورقة عمل ومذكرة رسمية أعدها فضيلة الشيخ تيجان ا نداو تلخص أبواب النحو والآجرومية مع جداول مقارنة وتمارين محلولة.',
    teacherName: 'فضيلة الشيخ تيجان ا نداو',
    previewSummary: [
      'الصفحة 1-3: جدول تفصيلي لمعاني كان وأخواتها وأنواع أسمائها وأخبارها',
      'الصفحة 4-6: شروط عمل إن وأخواتها وأوجه إعراب (لا سيما) و (إنما)',
      'الصفحة 7-9: عشرون شاهداً إعرابياً مستخرجة من امتحانات البكالوريا الرسمية بالسنغال',
      'الصفحة 10-12: نماذج إجابة معتمدة وتوجيهات للأستاذ المصحح'
    ],
    downloadCount: 3120,
    dateAdded: '2026-11-01'
  },
  {
    id: 'pdf-ch-2',
    title: 'ورقة ومذكرة: خرائط وجداول ممالك السنغال ومسار المقاومة الوطنية',
    subject: 'history',
    subjectTitle: 'تاريخ السنغال وغرب إفريقيا',
    fileName: 'cheikh_ndao_senegal_history_atlas.pdf',
    fileSize: '4.5 MB',
    pagesCount: 16,
    downloadUrl: '#',
    description: 'مستند PDF يحتوي على خرائط ملونة لممالك جولوف، فوتا تورو، كايور، ومحطات معارك المقاومة (لط دِيور، الحاج عمر الفوتي، ألمامي ساموري توري).',
    teacherName: 'فضيلة الشيخ تيجان ا نداو',
    previewSummary: [
      'الصفحة 1-4: التسلسل الزمني لدخول الإسلام وتأسيس دولة تكرور 1040م',
      'الصفحة 5-8: خريطة إمبراطورية جولوف الكبرى وعاصمتها يانغ-يانغ وتجارة القوافل',
      'الصفحة 9-12: وثائق المقاومة الروحية والعسكرية ضد الاستعمار الفرنسي في السنغال',
      'الصفحة 13-16: بنك أسئلة التاريخ السنغالي المقالية وإجاباتها النموذجية'
    ],
    downloadCount: 2840,
    dateAdded: '2026-10-25'
  },
  {
    id: 'pdf-ch-3',
    title: 'ورقة ومذكرة: الأطلس الجغرافي والاقتصادي لأقاليم السنغال الـ 14',
    subject: 'geography',
    subjectTitle: 'الجغرافيا والتنمية السنغالية',
    fileName: 'cheikh_ndao_geography_14_regions.pdf',
    fileSize: '3.9 MB',
    pagesCount: 14,
    downloadUrl: '#',
    description: 'مذكرة شاملة بالأرقام الرسمية والإحصاءات لأقاليم السنغال، والمناخ، والمشاريع الكبرى (حوض النهر، حقول سانغامار، وغاز السلحفاة أحميم GTA).',
    teacherName: 'فضيلة الشيخ تيجان ا نداو',
    previewSummary: [
      'الصفحة 1-3: بطاقة تعريفية بالأقاليم الـ 14: المساحة، الكثافة السكانية، والعواصم الإقليمية',
      'الصفحة 4-7: حوض نهر السنغال: المشاريع الزراعية وسدود منظمة استثمار نهر السنغال (OMVS)',
      'الصفحة 8-11: خريطة الثروات الطبيعية: الفوسفات في تيفوان، الذهب في كيدوغو، والغاز البحري',
      'الصفحة 12-14: موضوعات مقالية وتدريبات على رسم الخريطة التوضيحية للسنغال'
    ],
    downloadCount: 2210,
    dateAdded: '2026-11-04'
  },
  {
    id: 'pdf-ch-4',
    title: 'ورقة ومذكرة: بنك نماذج امتحان البكالوريا السنغالية مع الإجابات النموذجية',
    subject: 'bac_exams',
    subjectTitle: 'نماذج البكالوريا والامتحانات',
    fileName: 'cheikh_ndao_bac_exams_senegal_all.pdf',
    fileSize: '6.2 MB',
    pagesCount: 24,
    downloadUrl: '#',
    description: 'أوراق امتحانات البكالوريا للسنوات السابقة للقسم العربي بالسنغال مع سلالم التنقيط وشروحات الشيخ تيجان ا نداو.',
    teacherName: 'فضيلة الشيخ تيجان ا نداو',
    previewSummary: [
      'الصفحة 1-6: اختبارات مادة اللغة العربية وآدابها (دورة 2021 - 2025)',
      'الصفحة 7-12: اختبارات مادة التاريخ السنغالي والإفريقي مع معايير التصحيح',
      'الصفحة 13-18: اختبارات مادة الجغرافيا وتطبيقات تحليل الجداول والخرائط',
      'الصفحة 19-24: الإجابات النموذجية وتوجيهات النجاح بمرتبة الشرف'
    ],
    downloadCount: 4500,
    dateAdded: '2026-10-15'
  }
];

export const getCheikhVideos = (): CheikhVideoLecture[] => {
  if (typeof window === 'undefined') return DEFAULT_CHEIKH_VIDEOS;
  try {
    // Clear old legacy key if present
    localStorage.removeItem('ie_cheikh_videos_v1');
    localStorage.removeItem('ie_cheikh_videos_v2');

    const raw = localStorage.getItem(STORAGE_VIDEOS_KEY);
    if (!raw) {
      saveCheikhVideos(DEFAULT_CHEIKH_VIDEOS);
      return DEFAULT_CHEIKH_VIDEOS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      saveCheikhVideos(DEFAULT_CHEIKH_VIDEOS);
      return DEFAULT_CHEIKH_VIDEOS;
    }
    // Filter out any dummy Rickroll / placeholder links
    const cleaned = parsed.filter(
      (v: CheikhVideoLecture) =>
        v.videoUrl &&
        !v.videoUrl.includes('dQw4w9WgXcQ') &&
        (v.videoUrl.endsWith('.mp4') || v.videoUrl.startsWith('/assets/'))
    );
    if (cleaned.length === 0) {
      saveCheikhVideos(DEFAULT_CHEIKH_VIDEOS);
      return DEFAULT_CHEIKH_VIDEOS;
    }
    return cleaned;
  } catch {
    return DEFAULT_CHEIKH_VIDEOS;
  }
};

export const saveCheikhVideos = (videos: CheikhVideoLecture[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_VIDEOS_KEY, JSON.stringify(videos));
  window.dispatchEvent(new CustomEvent('ie_cheikh_media_updated'));
};

export const addCheikhVideo = (video: Omit<CheikhVideoLecture, 'id' | 'viewsCount' | 'dateAdded'>): CheikhVideoLecture => {
  const current = getCheikhVideos();
  const newVideo: CheikhVideoLecture = {
    ...video,
    id: `vid-ch-${Date.now()}`,
    viewsCount: 1,
    dateAdded: new Date().toISOString().split('T')[0],
  };
  const updated = [newVideo, ...current];
  saveCheikhVideos(updated);
  return newVideo;
};

export const deleteCheikhVideo = (id: string): void => {
  const current = getCheikhVideos();
  const updated = current.filter((v) => v.id !== id);
  saveCheikhVideos(updated);
};

export const getCheikhPdfs = (): CheikhPdfPaper[] => {
  if (typeof window === 'undefined') return DEFAULT_CHEIKH_PDFS;
  try {
    const raw = localStorage.getItem(STORAGE_PDFS_KEY);
    if (!raw) return DEFAULT_CHEIKH_PDFS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CHEIKH_PDFS;
  } catch {
    return DEFAULT_CHEIKH_PDFS;
  }
};

export const saveCheikhPdfs = (pdfs: CheikhPdfPaper[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_PDFS_KEY, JSON.stringify(pdfs));
  window.dispatchEvent(new CustomEvent('ie_cheikh_media_updated'));
};

export const addCheikhPdf = (pdf: Omit<CheikhPdfPaper, 'id' | 'downloadCount' | 'dateAdded'>): CheikhPdfPaper => {
  const current = getCheikhPdfs();
  const newPdf: CheikhPdfPaper = {
    ...pdf,
    id: `pdf-ch-${Date.now()}`,
    downloadCount: 1,
    dateAdded: new Date().toISOString().split('T')[0],
  };
  const updated = [newPdf, ...current];
  saveCheikhPdfs(updated);
  return newPdf;
};

export const deleteCheikhPdf = (id: string): void => {
  const current = getCheikhPdfs();
  const updated = current.filter((p) => p.id !== id);
  saveCheikhPdfs(updated);
};
