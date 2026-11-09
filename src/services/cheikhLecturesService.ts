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

const STORAGE_VIDEOS_KEY = 'ie_cheikh_videos_v1';
const STORAGE_PDFS_KEY = 'ie_cheikh_pdfs_v1';

// Seed default video lectures of Cheikh Tidiane Ndao
export const DEFAULT_CHEIKH_VIDEOS: CheikhVideoLecture[] = [
  {
    id: 'vid-ch-1',
    title: 'درس مرئي: شرح الآجرومية وباب النواسخ (كان وأخواتها وإن وأخواتها)',
    subject: 'arabic',
    subjectTitle: 'اللغة العربية وآدابها',
    duration: '24:15',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'شرح منهجي مفصل لقواعد الإعراب، والنواسخ، مع نماذج إعرابية تطبيقية لطلاب البكالوريا والمعاهد بالسنغال.',
    teacherName: 'فضيلة الشيخ تيجان ا نداو',
    teacherTitle: 'المؤسس والمشرف العلمي العام',
    thumbnailUrl: '/assets/aistudio/file_00000000f46071f5830b0339c53ac6d7_2f20e753.png',
    keyPoints: [
      'التمييز الدقيق بين عمل كان وأخواتها وإن وأخواتها',
      'إعراب الشواهد القرآنية والشعرية السنغالية',
      'الأخطاء الشائعة في إعراب أسماء النواسخ في امتحان البكالوريا',
      'تطبيقات عملية من متن الآجرومية'
    ],
    viewsCount: 1420,
    dateAdded: '2026-11-01',
    hasPdfNotes: true,
    linkedPdfId: 'pdf-ch-1'
  },
  {
    id: 'vid-ch-2',
    title: 'درس مرئي: تاريخ ممالك السنغال (حضارة تكرور وإمبراطورية جولوف الكبرى)',
    subject: 'history',
    subjectTitle: 'تاريخ السنغال وغرب إفريقيا',
    duration: '28:40',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'استعراض تاريخي بالخرائط لمسار مملكة تكرور ودخول الإسلام مع وارجابي بن رابيس سنة 1040م وتوسع دولة جولوف.',
    teacherName: 'فضيلة الشيخ تيجان ا نداو',
    teacherTitle: 'المؤسس والمشرف العلمي العام',
    thumbnailUrl: '/assets/aistudio/file_00000000f46071f5830b0339c53ac6d7_2f20e753.png',
    keyPoints: [
      'نشأة تكرور في حوض نهر السنغال وأهميتها التجارية',
      'دور الإسلام كعامل وحدة سياسية واجتماعية',
      'انفصال الممالك: كايور، باوول، سين، وسالوم',
      'أهم الأسئلة المقالية التاريخية المتكررة في البكالوريا'
    ],
    viewsCount: 1890,
    dateAdded: '2026-10-25',
    hasPdfNotes: true,
    linkedPdfId: 'pdf-ch-2'
  },
  {
    id: 'vid-ch-3',
    title: 'درس مرئي: الجغرافيا التنموية وأقاليم السنغال الـ 14 والموارد الاقتصادية',
    subject: 'geography',
    subjectTitle: 'الجغرافيا والتنمية السنغالية',
    duration: '21:50',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'شرح تحليلي لتقسيم السنغال الإقليمي، حوض النهر، زراعة الفول السوداني، واكتشافات النفط والغاز في سان لويس وسانغامار.',
    teacherName: 'فضيلة الشيخ تيجان ا نداو',
    teacherTitle: 'المؤسس والمشرف العلمي العام',
    thumbnailUrl: '/assets/aistudio/file_00000000f46071f5830b0339c53ac6d7_2f20e753.png',
    keyPoints: [
      'التقسيم الإداري والمناخي للأقاليم الـ 14',
      'حوض نهر السنغال والسدود الكبرى (دياما ومننتالي)',
      'تحديات التنمية الحضرية في إقليم داكار',
      'قطاعات المستقبل: الغاز الطبيعي والطاقة المتجددة'
    ],
    viewsCount: 1150,
    dateAdded: '2026-11-04',
    hasPdfNotes: true,
    linkedPdfId: 'pdf-ch-3'
  },
  {
    id: 'vid-ch-4',
    title: 'درس مرئي: البلاغة النبوية في دواوين شعراء السنغال (الشيخ بمب والحاج مالك)',
    subject: 'arabic',
    subjectTitle: 'اللغة العربية وآدابها',
    duration: '26:15',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'قراءة نقدية وبلاغية في الاستعارات والجناس والطباق في قصائد مديح المصطفى ﷺ لشعراء السنغال الكبار.',
    teacherName: 'فضيلة الشيخ تيجان ا نداو',
    teacherTitle: 'المؤسس والمشرف العلمي العام',
    thumbnailUrl: '/assets/aistudio/file_00000000f46071f5830b0339c53ac6d7_2f20e753.png',
    keyPoints: [
      'الخصائص البلاغية والأسلوبية لشعر الشيخ أحمدو بمب الخديم',
      'شعر الحاج مالك سي ونفحات المديح والتربية الروحية',
      'نماذج تحليل النصوص لطلاب الشهادة الثانوية العربية',
      'كيف تجيب على سؤال التحليل الأدبي بدرجة كاملة'
    ],
    viewsCount: 2040,
    dateAdded: '2026-10-18',
    hasPdfNotes: true,
    linkedPdfId: 'pdf-ch-4'
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
    const raw = localStorage.getItem(STORAGE_VIDEOS_KEY);
    if (!raw) return DEFAULT_CHEIKH_VIDEOS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CHEIKH_VIDEOS;
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
