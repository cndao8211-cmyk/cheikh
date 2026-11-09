import { Lesson, SubjectId } from '../types/curriculum';
import { CURRICULUM_LESSONS } from '../data/senegalCurriculum';

const CUSTOM_LESSONS_STORAGE_KEY = 'ie_custom_lessons_v1';

// Seed default media for existing curriculum lessons
const ENRICHED_DEFAULT_LESSONS: Lesson[] = CURRICULUM_LESSONS.map((lesson) => {
  if (lesson.id === 'arabic-grammar-1') {
    return {
      ...lesson,
      media: {
        videos: [
          {
            id: 'v-ar-1',
            title: 'شرح تفاعلي: كان وأخواتها وإنّ وأخواتها مع إعراب الشواهد',
            url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // standard embed or resource
            duration: '18:45',
            description: 'محاضرة مرئية تشرح الفروق الإعرابية وشواهد دواوين شعراء السنغال مع فضيلة الشيخ تيجان ا نداو.',
          },
        ],
        pdfFiles: [
          {
            id: 'pdf-ar-1',
            title: 'مذكرة القواعد النحوية المعتمدة للبكالوريا (PDF)',
            fileName: 'Al-Ajrumiyya_Senegal_Bac.pdf',
            size: '2.4 MB',
            description: 'ملخص مركز يحتوي على جداول كان وأخواتها ونماذج إعراب محلولة لامتحان البكالوريا العربية.',
          },
        ],
        images: [
          {
            id: 'img-ar-1',
            title: 'صورة لوح الدرس: تفريعات الحروف والأفعال الناسخة',
            url: '/assets/aistudio/file_00000000f46071f5830b0339c53ac6d7_2f20e753.png',
            caption: 'لوح الدرس التدريسي للشيخ تيجان ا نداو في اللغة العربية.',
          },
        ],
      },
    };
  }

  if (lesson.id === 'arabic-poetry-1') {
    return {
      ...lesson,
      media: {
        videos: [
          {
            id: 'v-ar-2',
            title: 'قراءة وتحليل في قصائد الشيخ أحمدو بمب والحاج مالك سي',
            url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: '22:10',
            description: 'تحليل بلاغي لقصائد المديح النبوي وشواهد البلاغة في الشعر السنغالي العربي.',
          },
        ],
        pdfFiles: [
          {
            id: 'pdf-ar-2',
            title: 'ديوان ومختارات شعراء السنغال - البكالوريا (PDF)',
            fileName: 'Diwan_Senegal_Poetry_Selected.pdf',
            size: '3.8 MB',
            description: 'مختارات شعرية كاملة مع الشرح اللغوي والتوجيهات الاختبارية.',
          },
        ],
        images: [
          {
            id: 'img-ar-2',
            title: 'مخطوطة شعرية نادرة لعلماء السنغال بالخط العربي الإفريقي',
            url: '/assets/aistudio/file_00000000f46071f5830b0339c53ac6d7_2f20e753.png',
            caption: 'نموذج للمخطوطات العربية المحفوظة في معاهد ومكتبات السنغال.',
          },
        ],
      },
    };
  }

  if (lesson.id === 'history-empires-1') {
    return {
      ...lesson,
      media: {
        videos: [
          {
            id: 'v-hi-1',
            title: 'وثائقي تاريخي: حضارة مملكة تكرور وإمبراطورية جولوف الكبرى',
            url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: '25:30',
            description: 'عرض تاريخي مصور لمسار دولة وارجابي بن رابيس وعاصمة جولوف يانغ-يانغ.',
          },
        ],
        pdfFiles: [
          {
            id: 'pdf-hi-1',
            title: 'أطلس تاريخ ممالك غرب إفريقيا والسنغال (PDF)',
            fileName: 'Senegal_Kingdoms_History_Atlas.pdf',
            size: '5.1 MB',
            description: 'خرائط تاريخية ومحطات هامة من القرن التاسع إلى القرن التاسع عشر.',
          },
        ],
        images: [
          {
            id: 'img-hi-1',
            title: 'خريطة انتشار الممالك السنغالية في العصر الوسيط',
            url: '/assets/aistudio/file_00000000f46071f5830b0339c53ac6d7_2f20e753.png',
            caption: 'حدود تكرور وجولوف وكايور وفوتا تورو وسين وسالوم.',
          },
        ],
      },
    };
  }

  if (lesson.id === 'history-resistance-1') {
    return {
      ...lesson,
      media: {
        videos: [
          {
            id: 'v-hi-2',
            title: 'سيرة البطل الوطني لط ديور والمقاومة في كايور وسالوم',
            url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: '19:40',
            description: 'شرح شامل لمعارك المقاومة الوطنية والروحية ضد المستعمر.',
          },
        ],
        pdfFiles: [
          {
            id: 'pdf-hi-2',
            title: 'ملف وثائقي: رموز المقاومة الوطنية السنغالية (PDF)',
            fileName: 'Senegal_Resistance_Heroes_Bac.pdf',
            size: '3.2 MB',
            description: 'نصوص تاريخية موثقة حول لط ديور، الألمامي عبد القادر، ومابا دياخو با.',
          },
        ],
        images: [
          {
            id: 'img-hi-2',
            title: 'لوحة تذكارية لموقع معركة ديكيلي التاريخية',
            url: '/assets/aistudio/file_00000000f46071f5830b0339c53ac6d7_2f20e753.png',
            caption: 'الموقع التاريخي لمعارك لط ديور جوب عام 1886م.',
          },
        ],
      },
    };
  }

  if (lesson.id === 'geo-regions-1') {
    return {
      ...lesson,
      media: {
        videos: [
          {
            id: 'v-geo-1',
            title: 'استكشاف أقاليم السنغال الـ 14: المناخ والتضاريس والسكان',
            url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: '21:15',
            description: 'جولة جغرافية مصورة تشرح الفروق المناخية بين الساحل وحوض النهر وكازامانس.',
          },
        ],
        pdfFiles: [
          {
            id: 'pdf-geo-1',
            title: 'خريطة وجداول الأقاليم الإدارية الـ 14 المعتمدة (PDF)',
            fileName: 'Senegal_14_Regions_Guide.pdf',
            size: '4.6 MB',
            description: 'بيانات المساحات، العواصم الإقليمية، والمناخ المعتمد في أسئلة الجغرافيا.',
          },
        ],
        images: [
          {
            id: 'img-geo-1',
            title: 'الخريطة الطبوغرافية والمناخية للسنغال',
            url: '/assets/aistudio/file_00000000f46071f5830b0339c53ac6d7_2f20e753.png',
            caption: 'توزيع الأقاليم من داكار غرباً إلى كيدوغو وماتام شرقاً وجنوباً.',
          },
        ],
      },
    };
  }

  if (lesson.id === 'geo-economy-1') {
    return {
      ...lesson,
      media: {
        videos: [
          {
            id: 'v-geo-2',
            title: 'الاقتصاد السنغالي الحديث: الفول السوداني، الصيد، وحقول الغاز الكبرى',
            url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: '24:00',
            description: 'دراسة تحليلية للموارد الاقتصادية السنغالية وآفاق التنمية المستقبلية.',
          },
        ],
        pdfFiles: [
          {
            id: 'pdf-geo-2',
            title: 'تقرير الجغرافيا الاقتصادية للسنغال - البكالوريا (PDF)',
            fileName: 'Senegal_Economic_Resources_Bac.pdf',
            size: '3.9 MB',
            description: 'إحصاءات الإنتاج الزراعي والصيد ومشاريع الطاقة الكبرى.',
          },
        ],
        images: [
          {
            id: 'img-geo-2',
            title: 'خريطة الموارد الطبيعية والموانئ السنغالية',
            url: '/assets/aistudio/file_00000000f46071f5830b0339c53ac6d7_2f20e753.png',
            caption: 'مناطق الإنتاج الزراعي وأحواض الطاقة البحرية والبرية.',
          },
        ],
      },
    };
  }

  return lesson;
});

export function getCustomLessons(): Lesson[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CUSTOM_LESSONS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load custom lessons', e);
  }
  return [];
}

export function saveCustomLessons(lessons: Lesson[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CUSTOM_LESSONS_STORAGE_KEY, JSON.stringify(lessons));
    window.dispatchEvent(new Event('ie_lessons_updated'));
  } catch (e) {
    console.error('Failed to save custom lessons', e);
  }
}

export function getAllLessons(): Lesson[] {
  const custom = getCustomLessons();
  return [...custom, ...ENRICHED_DEFAULT_LESSONS];
}

export function addCustomLesson(lessonData: {
  title: string;
  subtitle: string;
  subject: SubjectId;
  level: string;
  summary: string;
  content: string[];
  keyTerms?: { term: string; explanation: string; frenchTerm?: string }[];
  examTips?: string;
  videos?: { id: string; title: string; url: string; duration?: string; description?: string }[];
  pdfFiles?: { id: string; title: string; fileName: string; size?: string; url?: string; description?: string }[];
  images?: { id: string; title: string; url: string; caption?: string }[];
}): Lesson {
  const current = getCustomLessons();
  const id = `custom-lesson-${Date.now()}`;

  const newLesson: Lesson = {
    id,
    title: lessonData.title,
    subtitle: lessonData.subtitle || 'درس جديد مضاف من فضيلة الشيخ تيجان ا نداو',
    subject: lessonData.subject,
    level: lessonData.level || 'ثانوي / بكالوريا ومعاهد',
    summary: lessonData.summary,
    content: lessonData.content.length > 0 ? lessonData.content : [lessonData.summary],
    keyTerms: lessonData.keyTerms || [],
    examTips: lessonData.examTips || 'توجيه دراسي: مراجعة هذا الدرس وحفظ مفاهيمه الأساسية للاختبار.',
    media: {
      videos: lessonData.videos || [],
      pdfFiles: lessonData.pdfFiles || [],
      images: lessonData.images || [],
    },
  };

  const updated = [newLesson, ...current];
  saveCustomLessons(updated);
  return newLesson;
}

export function deleteCustomLesson(id: string): void {
  const current = getCustomLessons();
  const filtered = current.filter((l) => l.id !== id);
  saveCustomLessons(filtered);
}
