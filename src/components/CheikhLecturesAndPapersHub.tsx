import React, { useState, useEffect } from 'react';
import {
  Video,
  FileText,
  Play,
  Download,
  Plus,
  Search,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  Compass,
  Globe2,
  Award,
  Clock,
  Eye,
  FileCheck,
  X,
  Upload,
  Printer,
  Sparkles,
  Layers,
  ChevronRight,
  Share2
} from 'lucide-react';
import {
  CheikhVideoLecture,
  CheikhPdfPaper,
  getCheikhVideos,
  getCheikhPdfs,
  addCheikhVideo,
  addCheikhPdf,
  deleteCheikhVideo,
  deleteCheikhPdf
} from '../services/cheikhLecturesService';

interface CheikhLecturesAndPapersHubProps {
  onAskTutor?: (query: string) => void;
}

export const CheikhLecturesAndPapersHub: React.FC<CheikhLecturesAndPapersHubProps> = ({ onAskTutor }) => {
  const [videos, setVideos] = useState<CheikhVideoLecture[]>(getCheikhVideos());
  const [pdfs, setPdfs] = useState<CheikhPdfPaper[]>(getCheikhPdfs());
  
  // View mode & filters
  const [activeMediaType, setActiveMediaType] = useState<'all' | 'video' | 'pdf'>('all');
  const [selectedSubject, setSelectedSubject] = useState<'all' | 'arabic' | 'history' | 'geography' | 'bac_exams'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active items for modals
  const [selectedVideo, setSelectedVideo] = useState<CheikhVideoLecture | null>(null);
  const [selectedPdf, setSelectedPdf] = useState<CheikhPdfPaper | null>(null);

  // Modals for adding new content by Cheikh Tidiane Ndao
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Video Form State
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoSubject, setNewVideoSubject] = useState<'arabic' | 'history' | 'geography' | 'bac_exams'>('arabic');
  const [newVideoDuration, setNewVideoDuration] = useState('20:00');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoDescription, setNewVideoDescription] = useState('');
  const [newVideoPoints, setNewVideoPoints] = useState('');
  const [videoFormError, setVideoFormError] = useState<string | null>(null);

  // PDF Form State
  const [newPdfTitle, setNewPdfTitle] = useState('');
  const [newPdfSubject, setNewPdfSubject] = useState<'arabic' | 'history' | 'geography' | 'bac_exams'>('arabic');
  const [newPdfFileName, setNewPdfFileName] = useState('');
  const [newPdfPages, setNewPdfPages] = useState('8');
  const [newPdfSize, setNewPdfSize] = useState('2.5 MB');
  const [newPdfDescription, setNewPdfDescription] = useState('');
  const [newPdfSummary, setNewPdfSummary] = useState('');
  const [pdfFormError, setPdfFormError] = useState<string | null>(null);

  // Toast / feedback message
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNoticeMessage(msg);
    setTimeout(() => setNoticeMessage(null), 4000);
  };

  useEffect(() => {
    const handleUpdate = () => {
      setVideos(getCheikhVideos());
      setPdfs(getCheikhPdfs());
    };
    window.addEventListener('ie_cheikh_media_updated', handleUpdate);
    return () => window.removeEventListener('ie_cheikh_media_updated', handleUpdate);
  }, []);

  // Filtered lists
  const filteredVideos = videos.filter((v) => {
    const matchSubj = selectedSubject === 'all' || v.subject === selectedSubject;
    const matchSearch =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSubj && matchSearch;
  });

  const filteredPdfs = pdfs.filter((p) => {
    const matchSubj = selectedSubject === 'all' || p.subject === selectedSubject;
    const matchSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSubj && matchSearch;
  });

  // Handle Add Video
  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    setVideoFormError(null);
    if (!newVideoTitle.trim() || !newVideoDescription.trim()) {
      setVideoFormError('الرجاء إدخال عنوان الشرح ووصف المحتوى.');
      return;
    }

    const keyPoints = newVideoPoints.trim()
      ? newVideoPoints.split('\n').filter((l) => l.trim().length > 0)
      : ['شرح تفصيلي للمحاور الأساسية مع فضيلة الشيخ تيجان ا نداو'];

    const subjectTitles: Record<string, string> = {
      arabic: 'اللغة العربية وآدابها',
      history: 'تاريخ السنغال وغرب إفريقيا',
      geography: 'الجغرافيا والتنمية السنغالية',
      bac_exams: 'نماذج البكالوريا والامتحانات',
    };

    addCheikhVideo({
      title: newVideoTitle.trim(),
      subject: newVideoSubject,
      subjectTitle: subjectTitles[newVideoSubject] || 'المنهج المعتمد',
      duration: newVideoDuration.trim() || '20:00',
      videoUrl: newVideoUrl.trim() || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      description: newVideoDescription.trim(),
      teacherName: 'فضيلة الشيخ تيجان ا نداو',
      teacherTitle: 'المؤسس والمشرف العلمي العام',
      thumbnailUrl: '/assets/aistudio/file_00000000f46071f5830b0339c53ac6d7_2f20e753.png',
      keyPoints,
    });

    setIsVideoModalOpen(false);
    setNewVideoTitle('');
    setNewVideoDescription('');
    setNewVideoUrl('');
    setNewVideoPoints('');
    showToast('تم نشر فيديو الشرح بنجاح ليظهر فوراً لجميع الطلاب.');
  };

  // Handle Add PDF
  const handleSavePdf = (e: React.FormEvent) => {
    e.preventDefault();
    setPdfFormError(null);
    if (!newPdfTitle.trim() || !newPdfDescription.trim()) {
      setPdfFormError('الرجاء إدخال عنوان الورقة والمذكرة ووصفها.');
      return;
    }

    const previewSummary = newPdfSummary.trim()
      ? newPdfSummary.split('\n').filter((l) => l.trim().length > 0)
      : ['محتوى الورقة معتمد من فضيلة الشيخ تيجان ا نداو للمراجعة والامتحانات'];

    const subjectTitles: Record<string, string> = {
      arabic: 'اللغة العربية وآدابها',
      history: 'تاريخ السنغال وغرب إفريقيا',
      geography: 'الجغرافيا والتنمية السنغالية',
      bac_exams: 'نماذج البكالوريا والامتحانات',
    };

    addCheikhPdf({
      title: newPdfTitle.trim(),
      subject: newPdfSubject,
      subjectTitle: subjectTitles[newPdfSubject] || 'المنهج المعتمد',
      fileName: newPdfFileName.trim() || `${newPdfTitle.replace(/\s+/g, '_')}.pdf`,
      fileSize: newPdfSize.trim() || '3.2 MB',
      pagesCount: parseInt(newPdfPages, 10) || 10,
      downloadUrl: '#',
      description: newPdfDescription.trim(),
      teacherName: 'فضيلة الشيخ تيجان ا نداو',
      previewSummary,
    });

    setIsPdfModalOpen(false);
    setNewPdfTitle('');
    setNewPdfDescription('');
    setNewPdfFileName('');
    setNewPdfSummary('');
    showToast('تمت إضافة ورقة الـ PDF والمذكرة بنجاح في مكتبة الطلاب.');
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* Toast Notice */}
      {noticeMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-emerald-700 text-white shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-bold animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
          <span>{noticeMessage}</span>
        </div>
      )}

      {/* Hero Header: Official Auditorium of Cheikh Tidiane Ndao */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-emerald-950 text-white border-2 border-emerald-600/40 shadow-2xl p-6 sm:p-8 lg:p-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Cheikh Official Portrait Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-xl ring-4 ring-emerald-500/20">
                <img
                  src="/assets/aistudio/file_00000000f46071f5830b0339c53ac6d7_2f20e753.png"
                  alt="فضيلة الشيخ تيجان ا نداو"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md border border-white/20">
                المشرف العام
              </div>
            </div>

            <div className="space-y-1.5 text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>قاعة الشروحات المباشرة والمذكرات المعتمدة</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                فيديوهات الشرح وأوراق <span className="text-emerald-400">PDF</span> لفضيلة الشيخ تيجان ا نداو
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
                المكان المخصص لجميع فيديوهات الدروس أثناء الشرح، مع الأوراق والمذكرات المرفقة بصيغة PDF؛ متاحة لجميع طلاب السنغال للمشاهدة والتحميل والمذاكرة والطباعة المباشرة.
              </p>
            </div>
          </div>

          {/* Cheikh Actions: Upload Video or PDF */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full lg:w-auto">
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="flex-1 lg:flex-none px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Video className="w-4 h-4 text-emerald-200" />
              <span>+ إضافة فيديو شرح جديد</span>
            </button>
            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="flex-1 lg:flex-none px-4 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4 text-red-200" />
              <span>+ إضافة ورقة / مذكرة PDF</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Pill Strip */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xl sm:text-2xl font-black text-emerald-300 tabular-nums">{videos.length}</div>
            <div className="text-[11px] text-stone-300 mt-0.5">دروس فيديو مصورة</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xl sm:text-2xl font-black text-red-300 tabular-nums">{pdfs.length}</div>
            <div className="text-[11px] text-stone-300 mt-0.5">أوراق ومذكرات PDF رسمية</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xl sm:text-2xl font-black text-amber-300 tabular-nums">100%</div>
            <div className="text-[11px] text-stone-300 mt-0.5">معتمدة لمنهج السنغال</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xl sm:text-2xl font-black text-sky-300 tabular-nums">متاحة للجميع</div>
            <div className="text-[11px] text-stone-300 mt-0.5">مشاهدة وتحميل مباشر</div>
          </div>
        </div>
      </div>

      {/* Control Toolbar: Media Type Switcher & Subject Filter & Search */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Media Type Tabs (All / Videos / PDFs) */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700 w-full sm:w-auto">
            <button
              onClick={() => setActiveMediaType('all')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeMediaType === 'all'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>الكل ({videos.length + pdfs.length})</span>
            </button>
            <button
              onClick={() => setActiveMediaType('video')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeMediaType === 'video'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-blue-500" />
              <span>فيديوهات الشرح ({videos.length})</span>
            </button>
            <button
              onClick={() => setActiveMediaType('pdf')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeMediaType === 'pdf'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-red-500" />
              <span>أوراق ومذكرات PDF ({pdfs.length})</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في الفيديوهات أو المذكرات..."
              className="w-full text-xs pr-10 pl-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Subject Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 text-xs">
          <span className="text-stone-500 dark:text-stone-400 font-semibold whitespace-nowrap pl-1">
            تصنيف المادة:
          </span>
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap shrink-0 ${
              selectedSubject === 'all'
                ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
            }`}
          >
            جميع المواد
          </button>
          <button
            onClick={() => setSelectedSubject('arabic')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              selectedSubject === 'arabic'
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>اللغة العربية وآدابها</span>
          </button>
          <button
            onClick={() => setSelectedSubject('history')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              selectedSubject === 'history'
                ? 'bg-amber-700 text-white'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>تاريخ السنغال وغرب إفريقيا</span>
          </button>
          <button
            onClick={() => setSelectedSubject('geography')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              selectedSubject === 'geography'
                ? 'bg-sky-700 text-white'
                : 'bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 hover:bg-sky-100'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>الجغرافيا والتنمية السنغالية</span>
          </button>
          <button
            onClick={() => setSelectedSubject('bac_exams')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              selectedSubject === 'bac_exams'
                ? 'bg-purple-700 text-white'
                : 'bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 hover:bg-purple-100'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>نماذج البكالوريا والامتحانات</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: VIDEOS OF CHEIKH TIDIANE NDAO (فيديوهات الشرح أثناء الدرس) */}
      {(activeMediaType === 'all' || activeMediaType === 'video') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-stone-900 dark:text-white">
                  فيديوهات الشرح أثناء الدرس (شكل ملفات الفيديو)
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  شروحات مرئية تفاعلية يظهر فيها فضيلة الشيخ تيجان ا نداو يشرح القواعد والتاريخ والجغرافيا على اللوح.
                </p>
              </div>
            </div>

            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {filteredVideos.length} فيديو متاح للطلاب
            </span>
          </div>

          {filteredVideos.length === 0 ? (
            <div className="p-10 rounded-2xl border-2 border-dashed border-stone-200 dark:border-stone-800 text-center space-y-2">
              <Video className="w-8 h-8 text-stone-400 mx-auto" />
              <p className="text-xs text-stone-500">لا توجد فيديوهات مطابقة للبحث أو المادة المحددة.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  className="group relative rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between"
                >
                  {/* Video Media Banner Card with Cheikh's Portrait & Play Reel */}
                  <div className="relative aspect-video w-full bg-stone-950 overflow-hidden cursor-pointer" onClick={() => setSelectedVideo(video)}>
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover object-top opacity-85 group-hover:scale-105 group-hover:opacity-95 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-emerald-500 transition-all border-2 border-white/40">
                        <Play className="w-6 h-6 fill-white mr-1" />
                      </div>
                    </div>

                    {/* Top Subject Tag & Duration Badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-stone-900/90 backdrop-blur-md text-white text-[11px] font-bold border border-white/20">
                        {video.subjectTitle}
                      </span>
                    </div>

                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-white text-[11px] font-mono font-bold">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{video.duration}</span>
                    </div>

                    {/* Bottom Teacher Info */}
                    <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-white text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full border border-emerald-400 overflow-hidden shrink-0">
                          <img
                            src="/assets/aistudio/file_00000000f46071f5830b0339c53ac6d7_2f20e753.png"
                            alt="فضيلة الشيخ"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-bold text-[11px]">{video.teacherName}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-stone-300">
                        <Eye className="w-3 h-3" />
                        <span className="tabular-nums">{video.viewsCount} مشاهدة</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between text-right">
                    <div className="space-y-2">
                      <h4
                        onClick={() => setSelectedVideo(video)}
                        className="text-base font-bold text-stone-900 dark:text-white hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer leading-snug"
                      >
                        {video.title}
                      </h4>
                      <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                        {video.description}
                      </p>

                      {/* Key Points Checklist */}
                      <div className="pt-2 space-y-1 bg-stone-50 dark:bg-stone-800/50 p-2.5 rounded-xl border border-stone-100 dark:border-stone-800 text-[11px]">
                        <span className="font-bold text-stone-800 dark:text-stone-200 block mb-1">
                          محاور الشرح على لوح الدرس:
                        </span>
                        {video.keyPoints.slice(0, 3).map((pt, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-stone-600 dark:text-stone-400">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedVideo(video)}
                        className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>فتح ومشاهدة الشرح</span>
                      </button>

                      {video.hasPdfNotes && (
                        <button
                          onClick={() => {
                            const matchedPdf = pdfs.find((p) => p.id === video.linkedPdfId) || pdfs[0];
                            if (matchedPdf) setSelectedPdf(matchedPdf);
                          }}
                          className="px-3 py-2 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>ورقة PDF المرفقة</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: PDF PAPERS & STUDY SHEETS (المكان الذي أضع فيه أوراقي PDF) */}
      {(activeMediaType === 'all' || activeMediaType === 'pdf') && (
        <div className="space-y-4 pt-4 border-t border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-stone-900 dark:text-white">
                  أوراق ومذكرات الـ PDF الرسمية (شكل ملفات الـ PDF)
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  ملفات أوراق الشيخ تيجان ا نداو؛ ملخصات النحو، أطلس ممالك السنغال، والمذكرات الجغرافية وبنك البكالوريا.
                </p>
              </div>
            </div>

            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
              {filteredPdfs.length} ملف PDF متاح للتحميل والطباعة
            </span>
          </div>

          {filteredPdfs.length === 0 ? (
            <div className="p-10 rounded-2xl border-2 border-dashed border-stone-200 dark:border-stone-800 text-center space-y-2">
              <FileText className="w-8 h-8 text-stone-400 mx-auto" />
              <p className="text-xs text-stone-500">لا توجد ملفات PDF مطابقة للبحث المحدد.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPdfs.map((pdf) => (
                <div
                  key={pdf.id}
                  className="group relative rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 hover:border-red-500 dark:hover:border-red-500 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between"
                >
                  {/* Top Header Strip with PDF Ribbon & Subject */}
                  <div className="p-5 pb-3 bg-gradient-to-r from-red-50 via-stone-50 to-white dark:from-red-950/30 dark:via-stone-900 dark:to-stone-900 border-b border-stone-100 dark:border-stone-800 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {/* Physical PDF Document Icon Badge */}
                      <div className="w-12 h-14 rounded-xl bg-gradient-to-b from-red-600 to-red-700 text-white flex flex-col items-center justify-center shadow-md relative overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                        <div className="text-[9px] font-black tracking-widest uppercase">PDF</div>
                        <FileText className="w-5 h-5 text-red-100 mt-0.5" />
                        <div className="absolute top-0 right-0 w-3 h-3 bg-red-400/40 rounded-bl-sm" />
                      </div>

                      <div className="space-y-1 text-right">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                            {pdf.subjectTitle}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            {pdf.pagesCount} صفحات
                          </span>
                        </div>
                        <h4
                          onClick={() => setSelectedPdf(pdf)}
                          className="text-base font-bold text-stone-900 dark:text-white hover:text-red-600 transition-colors cursor-pointer leading-snug"
                        >
                          {pdf.title}
                        </h4>
                      </div>
                    </div>

                    <div className="text-left shrink-0">
                      <span className="text-[11px] font-bold text-stone-500 font-mono block">
                        {pdf.fileSize}
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        {pdf.downloadCount} تنزيل
                      </span>
                    </div>
                  </div>

                  {/* Body description & pages summary */}
                  <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between text-right">
                    <div className="space-y-2.5">
                      <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                        {pdf.description}
                      </p>

                      {/* Document Outline Preview */}
                      <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-1 text-[11px]">
                        <div className="flex items-center justify-between text-stone-800 dark:text-stone-200 font-bold mb-1">
                          <span>محتويات صفحات المذكرة:</span>
                          <span className="text-[10px] font-mono text-stone-400">{pdf.fileName}</span>
                        </div>
                        {pdf.previewSummary.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-stone-600 dark:text-stone-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                            <span className="line-clamp-1">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dual Action Buttons (Preview & Download) */}
                    <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedPdf(pdf)}
                        className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-white text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-stone-500" />
                        <span>معاينة وقراءة الورقة</span>
                      </button>

                      <a
                        href={pdf.downloadUrl}
                        download={pdf.fileName}
                        onClick={(e) => {
                          if (pdf.downloadUrl === '#') {
                            e.preventDefault();
                            showToast(`تم تجهيز تحميل وطباعة ورقة: ${pdf.fileName}`);
                          }
                        }}
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>تحميل وطباعة المذكرة (PDF)</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: VIDEO PLAYER THEATER MODAL */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-stone-900 rounded-3xl border border-stone-800 shadow-2xl overflow-hidden my-6 flex flex-col text-white">
            
            {/* Top Modal Bar */}
            <div className="p-4 sm:p-5 bg-stone-950 flex items-center justify-between border-b border-stone-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-emerald-500 overflow-hidden shrink-0">
                  <img
                    src="/assets/aistudio/file_00000000f46071f5830b0339c53ac6d7_2f20e753.png"
                    alt={selectedVideo.teacherName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-emerald-400 block">{selectedVideo.teacherName}</span>
                  <h3 className="text-sm sm:text-base font-extrabold line-clamp-1">{selectedVideo.title}</h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedVideo(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Screen */}
            <div className="relative aspect-video w-full bg-black">
              {selectedVideo.videoUrl.includes('youtube') ? (
                <iframe
                  src={selectedVideo.videoUrl}
                  title={selectedVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-stone-950 p-6 text-center space-y-3">
                  <Play className="w-12 h-12 text-emerald-500" />
                  <p className="text-xs text-stone-300">جاري تشغيل الشرح المرئي للشيخ تيجان ا نداو...</p>
                </div>
              )}
            </div>

            {/* Video Details & Study Notes Below Screen */}
            <div className="p-6 space-y-4 text-right bg-stone-900 max-h-72 overflow-y-auto">
              <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                    {selectedVideo.subjectTitle}
                  </span>
                  <span className="text-stone-400 font-mono">المدة: {selectedVideo.duration}</span>
                </div>
                <span className="text-stone-400 text-[11px]">تاريخ الإضافة: {selectedVideo.dateAdded}</span>
              </div>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {selectedVideo.description}
              </p>

              {/* Whiteboard Key Takeaways */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                <h5 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>محاور لوح الدرس وأبرز ما تم شرحه:</span>
                </h5>
                <ul className="space-y-1.5 text-xs text-stone-300">
                  {selectedVideo.keyPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Tutor Prompt */}
              {onAskTutor && (
                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => {
                      onAskTutor(`لدي سؤال حول درس: ${selectedVideo.title}`);
                      setSelectedVideo(null);
                    }}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>اسأل مرشد الشيخ تيجان الذكي حول محتوى هذا الشرح</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: PDF DOCUMENT READER & PRINT MODAL */}
      {selectedPdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden my-6 flex flex-col text-stone-900 dark:text-white">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-red-700 to-stone-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-red-200 font-bold">معاينة الورقة والمذكرة المعتمدة</div>
                  <h3 className="text-base sm:text-lg font-black line-clamp-1">{selectedPdf.title}</h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="طباعة الورقة"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedPdf(null)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Content Simulation (Clean Academic Sheet View) */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh] text-right bg-stone-50 dark:bg-stone-950">
              {/* Sheet Academic Header */}
              <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3 text-xs text-stone-500">
                  <div>جمهورية السنغال · وزارة التربية والتعليم</div>
                  <div className="font-bold text-emerald-700 dark:text-emerald-400">منصة IE الأكاديمية</div>
                  <div>المشرف: فضيلة الشيخ تيجان ا نداو</div>
                </div>

                <div className="text-center py-2 space-y-1">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300">
                    {selectedPdf.subjectTitle}
                  </span>
                  <h3 className="text-xl font-black text-stone-900 dark:text-white pt-1">
                    {selectedPdf.title}
                  </h3>
                  <div className="text-xs font-mono text-stone-400">
                    ملف رقمي: {selectedPdf.fileName} · الحجم: {selectedPdf.fileSize} · {selectedPdf.pagesCount} صفحات
                  </div>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed border-t border-stone-100 dark:border-stone-800 pt-3">
                  {selectedPdf.description}
                </p>
              </div>

              {/* Pages Outline Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-stone-700 dark:text-stone-300 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span>فهرس ومحاور صفحات الورقة والمذكرة:</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedPdf.previewSummary.map((sec, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-1"
                    >
                      <div className="text-[11px] font-bold text-red-600 dark:text-red-400">
                        القسم {idx + 1}
                      </div>
                      <div className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed">
                        {sec}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guidance for Students */}
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                <span className="font-bold block">توجيه من فضيلة الشيخ تيجان ا نداو للطلاب:</span>
                <p className="leading-relaxed text-[11px]">
                  «هذه المذكرة مكملة لشرح الدرس المرئي؛ يُرجى مراجعتها وتطبيق إعراب الشواهد وحل التمارين المقترحة قبل موعد الامتحانات، مع التركيز على سلم التنقيط المعتمد للبكالوريا السنغالية».
                </p>
              </div>
            </div>

            {/* Bottom Modal Actions */}
            <div className="p-4 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedPdf(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                إغلاق المعاينة
              </button>

              <a
                href={selectedPdf.downloadUrl}
                download={selectedPdf.fileName}
                onClick={(e) => {
                  if (selectedPdf.downloadUrl === '#') {
                    e.preventDefault();
                    showToast(`تم تجهيز تحميل وطباعة ورقة: ${selectedPdf.fileName}`);
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>تحميل الورقة بصيغة PDF وطباعتها فوراً</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CHEIKH TIDIANE NDAO - ADD NEW LECTURE VIDEO */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col text-right">
            
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-emerald-800 to-stone-900 text-white flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                  <Video className="w-4 h-4" />
                  <span>استوديو الشيخ تيجان ا نداو</span>
                </div>
                <h3 className="text-xl font-black">إضافة فيديو شرح جديد أثناء الدرس</h3>
                <p className="text-xs text-stone-300">
                  سيتم نشر هذا الشرح ليراه جميع الطلاب في المنصة مع إمكانية ربط أوراق ومذكرات PDF.
                </p>
              </div>

              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveVideo} className="p-6 space-y-4 overflow-y-auto flex-1 text-right">
              {videoFormError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-300 text-xs font-semibold text-red-700 dark:text-red-300">
                  {videoFormError}
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  عنوان الدرس والشرح المرئي: *
                </label>
                <input
                  type="text"
                  value={newVideoTitle}
                  onChange={(e) => setNewVideoTitle(e.target.value)}
                  placeholder="مثال: درس مرئي: شرح التوابع في النحو وشواهد الشعر السنغالي"
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                    المادة:
                  </label>
                  <select
                    value={newVideoSubject}
                    onChange={(e) => setNewVideoSubject(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="arabic">اللغة العربية وآدابها</option>
                    <option value="history">تاريخ السنغال وغرب إفريقيا</option>
                    <option value="geography">الجغرافيا والتنمية السنغالية</option>
                    <option value="bac_exams">نماذج البكالوريا والامتحانات</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                    مدة الفيديو (دقيقة:ثانية):
                  </label>
                  <input
                    type="text"
                    value={newVideoDuration}
                    onChange={(e) => setNewVideoDuration(e.target.value)}
                    placeholder="25:00"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-mono text-left focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  رابط الفيديو (يوتيوب أو رابط مباشر):
                </label>
                <input
                  type="text"
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/embed/..."
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-mono text-left focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-stone-400 mt-1 block">
                  يمكن وضع رابط تضمين يوتيوب، أو تركه فارغاً ليتم استخدام المشغل الداخلي التلقائي.
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  وصف الشرح وما يحتويه: *
                </label>
                <textarea
                  rows={3}
                  value={newVideoDescription}
                  onChange={(e) => setNewVideoDescription(e.target.value)}
                  placeholder="اكتب خلاصة ما يشرحه الشيخ في هذا الفيديو وأهم النقاط التي يركز عليها..."
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  محاور لوح الدرس (اكتب كل محور في سطر):
                </label>
                <textarea
                  rows={3}
                  value={newVideoPoints}
                  onChange={(e) => setNewVideoPoints(e.target.value)}
                  placeholder="المحور الأول: تعريف النعت وتطابقه&#10;المحور الثاني: شواهد دواوين شعراء السنغال&#10;المحور الثالث: حل أسئلة البكالوريا"
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-colors"
                >
                  نشر فيديو الشرح لجميع الطلاب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: CHEIKH TIDIANE NDAO - ADD NEW PDF PAPER / STUDY SHEET */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col text-right">
            
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-red-800 to-stone-900 text-white flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-red-300">
                  <FileText className="w-4 h-4" />
                  <span>مكتبة مذكرات وأوراق الشيخ تيجان ا نداو</span>
                </div>
                <h3 className="text-xl font-black">إضافة ورقة أو مذكرة PDF جديدة</h3>
                <p className="text-xs text-stone-300">
                  ضع أوراقك ومذكراتك بصيغة PDF ليتمكن جميع الطلاب من قراءتها وتنزيلها وطباعتها.
                </p>
              </div>

              <button
                onClick={() => setIsPdfModalOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSavePdf} className="p-6 space-y-4 overflow-y-auto flex-1 text-right">
              {pdfFormError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-300 text-xs font-semibold text-red-700 dark:text-red-300">
                  {pdfFormError}
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  عنوان الورقة أو المذكرة (PDF): *
                </label>
                <input
                  type="text"
                  value={newPdfTitle}
                  onChange={(e) => setNewPdfTitle(e.target.value)}
                  placeholder="مثال: ورقة عمل: إعراب الشواهد البلاغية والآجرومية"
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                    المادة:
                  </label>
                  <select
                    value={newPdfSubject}
                    onChange={(e) => setNewPdfSubject(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="arabic">اللغة العربية وآدابها</option>
                    <option value="history">تاريخ السنغال وغرب إفريقيا</option>
                    <option value="geography">الجغرافيا والتنمية السنغالية</option>
                    <option value="bac_exams">نماذج البكالوريا والامتحانات</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                    اسم الملف (Nom du fichier):
                  </label>
                  <input
                    type="text"
                    value={newPdfFileName}
                    onChange={(e) => setNewPdfFileName(e.target.value)}
                    placeholder="cheikh_ndao_notes.pdf"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-mono text-left focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                    عدد الصفحات:
                  </label>
                  <input
                    type="number"
                    value={newPdfPages}
                    onChange={(e) => setNewPdfPages(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-mono text-left focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                    حجم الملف التقديري:
                  </label>
                  <input
                    type="text"
                    value={newPdfSize}
                    onChange={(e) => setNewPdfSize(e.target.value)}
                    placeholder="2.5 MB"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-mono text-left focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  وصف الورقة والمذكرة ومحتواها: *
                </label>
                <textarea
                  rows={3}
                  value={newPdfDescription}
                  onChange={(e) => setNewPdfDescription(e.target.value)}
                  placeholder="مذكرة دراسية أعدها فضيلة الشيخ تيجان ا نداو لطلاب الشهادة الثانوية العربية بالسنغال..."
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                  محتويات صفحات المذكرة (سطر لكل جزء):
                </label>
                <textarea
                  rows={3}
                  value={newPdfSummary}
                  onChange={(e) => setNewPdfSummary(e.target.value)}
                  placeholder="الصفحة 1-3: جدول تفصيلي بالقواعد النحوية&#10;الصفحة 4-6: شواهد إعرابية من امتحانات البكالوريا&#10;الصفحة 7-8: تمارين مع الإجابات النموذجية"
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsPdfModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-colors"
                >
                  نشر ورقة الـ PDF لجميع الطلاب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
