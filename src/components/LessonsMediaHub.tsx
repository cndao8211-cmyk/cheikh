import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Compass,
  Globe2,
  FileText,
  Video,
  Image as ImageIcon,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  ExternalLink,
  Download,
  Play,
  X,
  Upload,
  Layers,
  Sparkles,
  Award,
  Eye,
  Trash2,
  Paperclip
} from 'lucide-react';
import { Lesson, SubjectId } from '../types/curriculum';
import { getAllLessons, addCustomLesson, deleteCustomLesson } from '../services/lessonsManager';
import { isLessonCompleted, toggleLessonCompletion } from '../services/studentProgress';

interface LessonsMediaHubProps {
  onAskTutor?: (query: string) => void;
}

export const LessonsMediaHub: React.FC<LessonsMediaHubProps> = ({ onAskTutor }) => {
  const [lessons, setLessons] = useState<Lesson[]>(getAllLessons());
  const [selectedSubject, setSelectedSubject] = useState<'all' | SubjectId>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Active lesson preview modal
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeMediaTab, setActiveMediaTab] = useState<'content' | 'video' | 'pdf' | 'images'>('content');

  // Add lesson modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newSubtitle, setNewSubtitle] = useState<string>('');
  const [newSubject, setNewSubject] = useState<SubjectId>('arabic');
  const [newLevel, setNewLevel] = useState<string>('ثانوي / بكالوريا ومعاهد');
  const [newSummary, setNewSummary] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  
  // Media attachments in form
  const [newVideoTitle, setNewVideoTitle] = useState<string>('');
  const [newVideoUrl, setNewVideoUrl] = useState<string>('');
  const [newPdfTitle, setNewPdfTitle] = useState<string>('');
  const [newPdfFileName, setNewPdfFileName] = useState<string>('');
  const [newPdfUrl, setNewPdfUrl] = useState<string>('');
  const [newImageTitle, setNewImageTitle] = useState<string>('');
  const [newImageUrl, setNewImageUrl] = useState<string>('');

  // Form feedback state
  const [formError, setFormError] = useState<string | null>(null);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setLessons(getAllLessons());
    };
    window.addEventListener('ie_lessons_updated', handleUpdate);
    return () => window.removeEventListener('ie_lessons_updated', handleUpdate);
  }, []);

  const filteredLessons = lessons.filter((l) => {
    const matchesSubject = selectedSubject === 'all' || l.subject === selectedSubject;
    const matchesSearch =
      l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const handleToggleComplete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLessonCompletion(id);
    setLessons([...lessons]); // force re-render
  };

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!newTitle.trim() || !newSummary.trim()) {
      setFormError('الرجاء إدخال عنوان وملخص الدرس للمتابعة.');
      return;
    }

    const videos = newVideoTitle.trim()
      ? [
          {
            id: `v-${Date.now()}`,
            title: newVideoTitle,
            url: newVideoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: '15:00',
            description: `درس مرئي يشرح ${newTitle} بإشراف فضيلة الشيخ تيجان ا نداو`,
          },
        ]
      : [];

    const pdfFiles = newPdfTitle.trim()
      ? [
          {
            id: `pdf-${Date.now()}`,
            title: newPdfTitle,
            fileName: newPdfFileName || `${newTitle.replace(/\s+/g, '_')}.pdf`,
            size: '2.5 MB',
            url: newPdfUrl || '#',
            description: `مذكرة دراسية وملخص بصيغة PDF لدرس ${newTitle}`,
          },
        ]
      : [];

    const images = newImageTitle.trim()
      ? [
          {
            id: `img-${Date.now()}`,
            title: newImageTitle,
            url: newImageUrl || '/assets/aistudio/file_00000000f46071f5830b0339c53ac6d7_2f20e753.png',
            caption: newImageTitle,
          },
        ]
      : [];

    addCustomLesson({
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || 'درس جديد مضاف من فضيلة الشيخ تيجان ا نداو',
      subject: newSubject,
      level: newLevel,
      summary: newSummary.trim(),
      content: newContent.trim() ? newContent.split('\n').filter(Boolean) : [newSummary.trim()],
      videos,
      pdfFiles,
      images,
    });

    // Reset form
    setNewTitle('');
    setNewSubtitle('');
    setNewSummary('');
    setNewContent('');
    setNewVideoTitle('');
    setNewVideoUrl('');
    setNewPdfTitle('');
    setNewPdfFileName('');
    setNewPdfUrl('');
    setNewImageTitle('');
    setNewImageUrl('');
    setIsAddModalOpen(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('هل أنت متأكد من حذف هذا الدرس المضاف؟')) {
      deleteCustomLesson(id);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Action Bar */}
      <div className="bg-white dark:bg-stone-800/80 rounded-3xl border border-stone-200 dark:border-stone-700/80 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-stone-200 dark:border-stone-700 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <Layers className="w-4 h-4" />
              <span>فهرس ومستودع الدروس والوسائط الشامل (Media & Curriculum Hub)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
              الدروس والمذكرات والوسائط (فيديو · PDF · صور)
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
              استعراض وتصنيف كافة الوحدات الدراسية مع مذكرات الـ PDF، الشروحات المرئية، والمخطوطات التوضيحية بإشراف فضيلة الشيخ تيجان ا نداو.
            </p>
          </div>

          {/* Add Lesson Button - Creator / Teacher Studio */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0 self-start md:self-auto"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>+ إضافة درس جديد ومرفقات (فيديو / PDF / صور)</span>
          </button>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Subject Tabs */}
          <div className="flex items-center flex-wrap gap-2 p-1.5 bg-stone-100 dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800">
            <button
              onClick={() => setSelectedSubject('all')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 ${
                selectedSubject === 'all'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              الكل ({lessons.length})
            </button>
            <button
              onClick={() => setSelectedSubject('arabic')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                selectedSubject === 'arabic'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>اللغة العربية ({lessons.filter((l) => l.subject === 'arabic').length})</span>
            </button>
            <button
              onClick={() => setSelectedSubject('history')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                selectedSubject === 'history'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>تاريخ السنغال ({lessons.filter((l) => l.subject === 'history').length})</span>
            </button>
            <button
              onClick={() => setSelectedSubject('geography')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                selectedSubject === 'geography'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>الجغرافيا والتنمية ({lessons.filter((l) => l.subject === 'geography').length})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px] flex-1 lg:max-w-xs">
            <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث في الدروس أو المرفقات..."
              className="w-full pr-10 pl-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Media Legend Strip */}
        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-stone-500 border-t border-stone-100 dark:border-stone-800">
          <span className="font-semibold text-stone-700 dark:text-stone-300">أنواع المرفقات المتاحة لكل درس:</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/40 font-mono">
            <FileText className="w-3.5 h-3.5" />
            <span>ملفات مذكرات PDF</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900/40 font-mono">
            <Video className="w-3.5 h-3.5" />
            <span>شروحات فيديو مرئية</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-900/40 font-mono">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>خرائط وصور ومخطوطات</span>
          </span>
        </div>
      </div>

      {/* Grid of Lessons with Media Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map((lesson) => {
          const completed = isLessonCompleted(lesson.id);
          const hasPdf = (lesson.media?.pdfFiles?.length || 0) > 0;
          const hasVideo = (lesson.media?.videos?.length || 0) > 0;
          const hasImages = (lesson.media?.images?.length || 0) > 0;

          return (
            <div
              key={lesson.id}
              onClick={() => {
                setActiveLesson(lesson);
                setActiveMediaTab('content');
              }}
              className="group cursor-pointer bg-white dark:bg-stone-800/80 rounded-3xl border border-stone-200 dark:border-stone-700/80 p-6 flex flex-col justify-between space-y-5 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all shadow-xs hover:shadow-md relative overflow-hidden"
            >
              {completed && (
                <div className="absolute top-4 left-4 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>تم إنجاز الدرس</span>
                </div>
              )}

              <div className="space-y-3">
                {/* Subject and Level Badges */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      lesson.subject === 'arabic'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                        : lesson.subject === 'history'
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                        : 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300'
                    }`}
                  >
                    {lesson.subject === 'arabic'
                      ? 'اللغة العربية'
                      : lesson.subject === 'history'
                      ? 'تاريخ السنغال'
                      : 'الجغرافيا والتنمية'}
                  </span>
                  <span className="text-[11px] text-stone-400 font-mono">{lesson.level}</span>
                </div>

                {/* Lesson Title & Subtitle */}
                <h3 className="text-lg font-black text-stone-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                  {lesson.title}
                </h3>
                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                  {lesson.summary}
                </p>
              </div>

              {/* Media Attachments Strip (Icons for PDF, Video, Images) */}
              <div className="space-y-3 pt-3 border-t border-stone-100 dark:border-stone-800">
                <span className="text-[11px] font-bold text-stone-400 block">المرفقات والوسائط المتاحة:</span>
                
                <div className="flex flex-wrap items-center gap-2">
                  {/* PDF Badge */}
                  {hasPdf ? (
                    <span
                      title="يحتوي على مذكرة PDF قابلة للتنزيل"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/40 text-[11px] font-bold"
                    >
                      <FileText className="w-3.5 h-3.5 text-red-600" />
                      <span>{lesson.media?.pdfFiles?.length} ملف PDF</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-stone-400">بدون PDF</span>
                  )}

                  {/* Video Badge */}
                  {hasVideo ? (
                    <span
                      title="يحتوي على شرح فيديو مصور"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900/40 text-[11px] font-bold"
                    >
                      <Video className="w-3.5 h-3.5 text-purple-600" />
                      <span>فيديو مصور</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-stone-400">بدون فيديو</span>
                  )}

                  {/* Images Badge */}
                  {hasImages ? (
                    <span
                      title="يحتوي على صور وخرائط ومخطوطات توضيحية"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-900/40 text-[11px] font-bold"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-sky-600" />
                      <span>{lesson.media?.images?.length} صور/خرائط</span>
                    </span>
                  ) : null}
                </div>

                {/* Bottom Actions */}
                <div className="pt-2 flex items-center justify-between text-xs font-bold">
                  <span className="text-emerald-700 dark:text-emerald-400 group-hover:underline flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>عرض الدرس والمرفقات</span>
                  </span>

                  <button
                    type="button"
                    onClick={(e) => handleToggleComplete(lesson.id, e)}
                    className={`px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1 text-[11px] ${
                      completed
                        ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-300 text-emerald-800 dark:text-emerald-300'
                        : 'border-stone-200 dark:border-stone-700 text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{completed ? 'منجز' : 'تحديد كمنجز'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lesson & Media Viewer Modal */}
      {activeLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-emerald-800 to-stone-900 text-white flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-300 block">
                  {activeLesson.subject === 'arabic'
                    ? 'اللغة العربية وآدابها'
                    : activeLesson.subject === 'history'
                    ? 'تاريخ السنغال وغرب إفريقيا'
                    : 'الجغرافيا والتنمية السنغالية'}{' '}
                  · {activeLesson.level}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">{activeLesson.title}</h2>
                <p className="text-xs text-stone-200">{activeLesson.subtitle}</p>
              </div>

              <button
                onClick={() => setActiveLesson(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Tabs Header inside Modal */}
            <div className="bg-stone-100 dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700 px-6 py-2.5 flex items-center gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveMediaTab('content')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeMediaTab === 'content'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>نص ومحاور الدرس</span>
              </button>

              <button
                onClick={() => setActiveMediaTab('pdf')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeMediaTab === 'pdf'
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>ملفات الـ PDF ({activeLesson.media?.pdfFiles?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveMediaTab('video')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeMediaTab === 'video'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>شروحات الفيديو ({activeLesson.media?.videos?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveMediaTab('images')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeMediaTab === 'images'
                    ? 'bg-sky-700 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>الصور والخرائط ({activeLesson.media?.images?.length || 0})</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-right">
              {/* Tab 1: Content */}
              {activeMediaTab === 'content' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm text-emerald-950 dark:text-emerald-200 leading-relaxed font-semibold">
                    {activeLesson.summary}
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm text-stone-700 dark:text-stone-200 leading-relaxed">
                    {activeLesson.content.map((p, idx) => (
                      <p key={idx} className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-700/60">
                        {p}
                      </p>
                    ))}
                  </div>

                  {activeLesson.examTips && (
                    <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
                      <strong>توجيهات للامتحان السنغالي:</strong> {activeLesson.examTips}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: PDF Files */}
              {activeMediaTab === 'pdf' && (
                <div className="space-y-4">
                  {downloadNotice && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{downloadNotice}</span>
                    </div>
                  )}

                  <h4 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-red-600" />
                    <span>الملفات والمذكرات بصيغة PDF المرفقة بهذا الدرس:</span>
                  </h4>

                  {activeLesson.media?.pdfFiles && activeLesson.media.pdfFiles.length > 0 ? (
                    <div className="space-y-3">
                      {activeLesson.media.pdfFiles.map((pdf) => (
                        <div
                          key={pdf.id}
                          className="p-4 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center shrink-0">
                              <FileText className="w-6 h-6" />
                            </div>
                            <div>
                              <h5 className="font-bold text-sm text-stone-900 dark:text-white">{pdf.title}</h5>
                              <p className="text-xs text-stone-500">{pdf.description}</p>
                              <div className="text-[11px] font-mono text-stone-400 mt-0.5">
                                اسم الملف: {pdf.fileName} {pdf.size && `(${pdf.size})`}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <a
                              href={pdf.url || '#'}
                              download={pdf.fileName}
                              onClick={(e) => {
                                if (!pdf.url || pdf.url === '#') {
                                  e.preventDefault();
                                  setDownloadNotice(`تم تجهيز تحميل مذكرة (${pdf.fileName}) للاطلاع والمذاكرة.`);
                                  setTimeout(() => setDownloadNotice(null), 4000);
                                }
                              }}
                              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                            >
                              <Download className="w-4 h-4" />
                              <span>تنزيل المذكرة (PDF)</span>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-stone-500 p-6 text-center">لا توجد ملفات PDF مرفقة بهذا الدرس حالياً.</p>
                  )}
                </div>
              )}

              {/* Tab 3: Videos */}
              {activeMediaTab === 'video' && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                    <Video className="w-4 h-4 text-purple-600" />
                    <span>المحاضرات والشروحات المرئية (فيديو) المرفقة:</span>
                  </h4>

                  {activeLesson.media?.videos && activeLesson.media.videos.length > 0 ? (
                    <div className="space-y-4">
                      {activeLesson.media.videos.map((vid) => (
                        <div
                          key={vid.id}
                          className="p-4 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <h5 className="font-bold text-sm text-stone-900 dark:text-white">{vid.title}</h5>
                            {vid.duration && (
                              <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                                المدة: {vid.duration}
                              </span>
                            )}
                          </div>
                          
                          <p className="text-xs text-stone-500">{vid.description}</p>

                          {/* Video Player Shell */}
                          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-stone-800 flex items-center justify-center group">
                            {vid.url.includes('youtube.com') || vid.url.includes('youtu.be') ? (
                              <iframe
                                src={vid.url}
                                title={vid.title}
                                className="w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            ) : (
                              <div className="text-center p-6 space-y-3 text-white">
                                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                                  <Play className="w-8 h-8 text-amber-400 fill-amber-400" />
                                </div>
                                <div className="text-xs font-bold text-stone-300">مشغل الفيديو التعليمي</div>
                                <a
                                  href={vid.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  <span>فتح المحاضرة في نافذة مستقلة</span>
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-stone-500 p-6 text-center">لا توجد فيديوهات مرفقة بهذا الدرس حالياً.</p>
                  )}
                </div>
              )}

              {/* Tab 4: Images & Maps */}
              {activeMediaTab === 'images' && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-sky-600" />
                    <span>الصور التوضيحية والخرائط والمخطوطات:</span>
                  </h4>

                  {activeLesson.media?.images && activeLesson.media.images.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {activeLesson.media.images.map((img) => (
                        <div
                          key={img.id}
                          className="rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 overflow-hidden space-y-2 p-3"
                        >
                          <div className="rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 h-56 bg-stone-900">
                            <img
                              src={img.url}
                              alt={img.title}
                              className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="text-right p-1">
                            <h5 className="font-bold text-xs text-stone-900 dark:text-white">{img.title}</h5>
                            {img.caption && <p className="text-[11px] text-stone-500 mt-0.5">{img.caption}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-stone-500 p-6 text-center">لا توجد صور توضيحية مرفقة بهذا الدرس حالياً.</p>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 dark:bg-stone-800/80 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveLesson(null)}
                className="px-5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300"
              >
                إغلاق
              </button>

              <button
                type="button"
                onClick={() => {
                  toggleLessonCompletion(activeLesson.id);
                  setLessons([...lessons]);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {isLessonCompleted(activeLesson.id) ? 'إلغاء التحديد كمنجز' : 'تحديد الدرس كمنجز في ملفي'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Lesson & Upload Media Studio Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-emerald-800 to-stone-900 text-white flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <Upload className="w-4 h-4" />
                  <span>استوديو رفع الدروس وإرفاق الوسائط · خاص بالمشرف الشيخ تيجان ا نداو</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black">إضافة درس جديد مع الفيديو وملفات PDF والصور</h3>
                <p className="text-xs text-stone-200">
                  أدخل تفاصيل الدرس وأرفق روابط المواد المرئية والمذكرات ليتم نشرها لجميع الطلاب فوراً.
                </p>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateLesson} className="p-6 space-y-5 overflow-y-auto flex-1 text-right">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-xs font-semibold text-red-700 dark:text-red-300">
                  {formError}
                </div>
              )}

              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                    المادة الدراسية:
                  </label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value as SubjectId)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="arabic">اللغة العربية وآدابها</option>
                    <option value="history">تاريخ السنغال وغرب إفريقيا</option>
                    <option value="geography">الجغرافيا والتنمية السنغالية</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                    المستوى الدراسي:
                  </label>
                  <input
                    type="text"
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value)}
                    placeholder="مثال: ثانوي / بكالوريا ومعاهد"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                    عنوان الدرس الرئيسي (Titre de la leçon):
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="مثال: قواعد الاستثناء وحروفه وشواهد دواوين شعراء السنغال"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                    العنوان الفرعي أو التوضيحي:
                  </label>
                  <input
                    type="text"
                    value={newSubtitle}
                    onChange={(e) => setNewSubtitle(e.target.value)}
                    placeholder="مثال: شرح مبسط موجه لطلاب البكالوريا العربية"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                    ملخص الدرس (خلاصة موجزة):
                  </label>
                  <textarea
                    rows={2}
                    value={newSummary}
                    onChange={(e) => setNewSummary(e.target.value)}
                    placeholder="اكتب خلاصة سريعة للدرس تظهر في بطاقة الدرس..."
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                    نص ومحاور الدرس الكاملة (Contenu de la leçon):
                  </label>
                  <textarea
                    rows={4}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="اكتب فقرات الدرس، القواعد، الشواهد، وتوجيهات الحفظ والمراجعة..."
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                  />
                </div>
              </div>

              {/* Attachments Section */}
              <div className="space-y-4 pt-4 border-t border-stone-200 dark:border-stone-700">
                <h4 className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                  <Paperclip className="w-4 h-4 text-emerald-600" />
                  <span>إرفاق الوسائط والملفات بهذا الدرس:</span>
                </h4>

                {/* 1. Video Attachment */}
                <div className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 space-y-2">
                  <div className="text-xs font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                    <Video className="w-4 h-4" />
                    <span>مرفق فيديو (محاضرة مرئية):</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newVideoTitle}
                      onChange={(e) => setNewVideoTitle(e.target.value)}
                      placeholder="عنوان الفيديو (مثال: شرح الدرس صوت وصورة)"
                      className="text-xs p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                    />
                    <input
                      type="text"
                      value={newVideoUrl}
                      onChange={(e) => setNewVideoUrl(e.target.value)}
                      placeholder="رابط الفيديو (YouTube embed أو رابط مباشر)"
                      className="text-xs p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-mono text-left"
                    />
                  </div>
                </div>

                {/* 2. PDF Attachment */}
                <div className="p-3.5 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 space-y-2">
                  <div className="text-xs font-bold text-red-900 dark:text-red-300 flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    <span>مرفق مذكرة أو ملخص PDF:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={newPdfTitle}
                      onChange={(e) => setNewPdfTitle(e.target.value)}
                      placeholder="عنوان المذكرة (مثال: ملخص الدرس PDF)"
                      className="text-xs p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                    />
                    <input
                      type="text"
                      value={newPdfFileName}
                      onChange={(e) => setNewPdfFileName(e.target.value)}
                      placeholder="اسم الملف (مثال: lesson_notes.pdf)"
                      className="text-xs p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-mono"
                    />
                    <input
                      type="text"
                      value={newPdfUrl}
                      onChange={(e) => setNewPdfUrl(e.target.value)}
                      placeholder="رابط التحميل (أو اتركه فارغاً)"
                      className="text-xs p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-mono text-left"
                    />
                  </div>
                </div>

                {/* 3. Image Attachment */}
                <div className="p-3.5 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900/40 space-y-2">
                  <div className="text-xs font-bold text-sky-900 dark:text-sky-300 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4" />
                    <span>مرفق صورة توضيحية أو خريطة أو مخطوطة:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newImageTitle}
                      onChange={(e) => setNewImageTitle(e.target.value)}
                      placeholder="وصف الصورة (مثال: خريطة الأقاليم أو لوح الإعراب)"
                      className="text-xs p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                    />
                    <input
                      type="text"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="رابط الصورة (URL)"
                      className="text-xs p-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-mono text-left"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex items-center justify-between gap-3 border-t border-stone-200 dark:border-stone-700">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>حفظ ونشر الدرس لجميع الطلاب فوراً</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
