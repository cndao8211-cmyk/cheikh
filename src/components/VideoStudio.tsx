import React, { useState } from 'react';
import { Film, Video, Image, Upload, Play, Sparkles, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const SAMPLE_TEMPLATES = [
  {
    title: 'تحريك مخطوطة شعر علماء السنغال',
    prompt: 'Cinematic slow zoom into classical Arabic calligraphy parchment with ink glistening and dust particles floating in sunlight in an ancient Senegalese madrasa.',
    imagePath: '/src/assets/images/subject_arabic_literature_1794184746556.jpg',
  },
  {
    title: 'قوافل الممالك على نهر السنغال',
    prompt: 'Senegalese trading boat with wooden hull gently gliding across the golden Senegal river at sunset near historic Saint-Louis.',
    imagePath: '/src/assets/images/subject_geography_senegal_1794184746623.jpg',
  },
  {
    title: 'تاريخ إمبراطورية جولوف وخريطة تكرور',
    prompt: 'Camera panning over an ancient parchment map of Jolof Empire and Fouta Toro with soft candlelight flickering.',
    imagePath: '/src/assets/images/subject_senegal_history_1794184745729.jpg',
  },
];

export const VideoStudio: React.FC = () => {
  const [prompt, setPrompt] = useState(SAMPLE_TEMPLATES[0].prompt);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [selectedImage, setSelectedImage] = useState<string | null>(SAMPLE_TEMPLATES[0].imagePath);
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateVideo = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);
    setStatusMessage('جاري الاتصال بنموذج gemini-omni-1.2-flash عبر Interactions API...');

    try {
      const res = await fetch('/api/video/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          imageBase64: selectedImage,
          aspectRatio,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'تعذر توليد الفيديو');
      }

      if (data.videoBase64) {
        setVideoUrl(data.videoBase64);
        setStatusMessage('تم توليد الفيديو بنجاح بواسطة gemini-omni-1.2-flash!');
      } else {
        setStatusMessage(data.message || 'تمت معالجة الطلب بالكامل.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'يتطلب نموذج gemini-omni-1.2-flash تفعيل باقة الفوترة في لوحة المفاتيح.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700/80 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-700 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-purple-700 dark:text-purple-400 font-semibold mb-1">
              <span>استوديو الوسائط والإنتاج المرئي لشركة IE</span>
              <span aria-hidden="true">·</span>
              <span>Gemini Omni 1.2 Flash (Interactions API)</span>
            </div>
            <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white">
              توليد وتحريك مقاطع الفيديو الذكية (Text & Image to Video)
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
              تحويل النصوص التاريخية والتعليمية وصور المخطوطات السنغالية إلى مقاطع فيديو متحركة عالية الدقة بدقة 720p ونسبتي 16:9 و 9:16.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300">
            <Film className="w-4 h-4" />
            <span>gemini-omni-1.2-flash</span>
          </div>
        </div>

        {/* Ready Presets */}
        <div className="space-y-2">
          <span className="text-xs text-stone-500 dark:text-stone-400 font-medium block">
            قوالب تعليمية سنغالية جاهزة للتحريك:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {SAMPLE_TEMPLATES.map((tmpl, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(tmpl.prompt);
                  setSelectedImage(tmpl.imagePath);
                }}
                className={`p-3 text-right rounded-xl border text-xs transition-all flex items-center gap-3 ${
                  prompt === tmpl.prompt
                    ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 text-purple-950 dark:text-purple-200 font-semibold'
                    : 'bg-stone-50/70 dark:bg-stone-900/40 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-stone-300'
                }`}
              >
                <img
                  src={tmpl.imagePath}
                  alt={tmpl.title}
                  className="w-12 h-12 rounded-lg object-cover shrink-0"
                />
                <span className="leading-snug">{tmpl.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Configuration Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-2">
          {/* Prompt Area */}
          <div className="md:col-span-8 space-y-3">
            <label className="text-xs font-bold text-stone-900 dark:text-white block">
              أمر التحريك أو وصف المشهد السينمائي (Prompt):
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="اكتب تفاصيل حركة الكاميرا، الشخصيات، الإضاءة، والمشهد..."
              className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-600 text-right leading-relaxed"
            />

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-700 dark:text-stone-300">
                <span>أبعاد الفيديو:</span>
                <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800">
                  <button
                    onClick={() => setAspectRatio('16:9')}
                    className={`px-2.5 py-1 rounded text-xs transition-colors ${
                      aspectRatio === '16:9'
                        ? 'bg-white dark:bg-stone-800 text-purple-700 dark:text-purple-300 shadow-xs font-bold'
                        : 'text-stone-500'
                    }`}
                  >
                    16:9 أفقي عريض
                  </button>
                  <button
                    onClick={() => setAspectRatio('9:16')}
                    className={`px-2.5 py-1 rounded text-xs transition-colors ${
                      aspectRatio === '9:16'
                        ? 'bg-white dark:bg-stone-800 text-purple-700 dark:text-purple-300 shadow-xs font-bold'
                        : 'text-stone-500'
                    }`}
                  >
                    9:16 طولي للجوال
                  </button>
                </div>
              </div>

              <label className="cursor-pointer text-xs font-semibold text-purple-700 dark:text-purple-400 hover:underline flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>رفع صورة من جهازك للتحريك</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Selected Image Preview */}
          <div className="md:col-span-4 p-3 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 flex flex-col justify-between">
            <span className="text-[11px] text-stone-500 font-medium block mb-2">إطار البداية (Image Source):</span>
            {selectedImage ? (
              <div className="relative rounded-lg overflow-hidden border border-stone-200 dark:border-stone-700 h-28">
                <img
                  src={selectedImage}
                  alt="إطار بداية الفيديو"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-1 left-1 bg-stone-900/80 text-white rounded p-1 text-[10px]"
                >
                  إلغاء
                </button>
              </div>
            ) : (
              <div className="h-28 rounded-lg border-2 border-dashed border-stone-300 dark:border-stone-700 flex items-center justify-center text-xs text-stone-400">
                توليد نصي مباشر بدون صورة
              </div>
            )}

            <button
              onClick={handleGenerateVideo}
              disabled={isGenerating || !prompt.trim()}
              className="w-full mt-3 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>جاري معالجة الفيديو...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>توليد الفيديو (Gemini Omni)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {statusMessage && (
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-purple-800 dark:text-purple-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Video Output Box */}
      {videoUrl && (
        <div className="bg-white dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700/80 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-700 pb-3">
            <h3 className="text-base font-bold text-stone-900 dark:text-white">الفيديو المولد</h3>
            <span className="text-xs text-stone-400 font-mono">{aspectRatio} · 10s · 720p</span>
          </div>
          <div className="rounded-xl overflow-hidden bg-black max-w-2xl mx-auto shadow-lg">
            <video src={videoUrl} controls autoPlay loop className="w-full h-auto" />
          </div>
        </div>
      )}
    </div>
  );
};
