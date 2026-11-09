import React, { useState } from 'react';
import { Music, Play, Pause, Volume2, Sparkles, Loader2, AlertCircle } from 'lucide-react';

const MUSIC_PRESETS = [
  {
    title: 'لحن المذاكرة والتركيز الهادئ (أوتار الكورا السنغالية والعود)',
    prompt: 'Calm ambient acoustic traditional West African kora and soft wooden flute instrumental for deep scholarly focus and reading Arabic manuscripts, peaceful meditative 30 seconds.',
  },
  {
    title: 'نشيد طلب العلم والهمة في معاهد السنغال',
    prompt: 'Uplifting spiritual West African Islamic vocal chant melody celebrating youth seeking knowledge in Dakar and Touba, acoustic percussion and harmonious chorus.',
  },
  {
    title: 'موسيقى ملحمية لتاريخ ممالك تكرور وجولوف',
    prompt: 'Cinematic historical orchestral score with African sabar drums, brass fanfare and triumphant strings commemorating Senegalese medieval empires.',
  },
];

export const MusicGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState(MUSIC_PRESETS[0].prompt);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch('/api/music/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'تعذر توليد الموسيقى');
      }

      if (data.audioBase64) {
        setAudioUrl(data.audioBase64);
        setLyrics(data.lyrics || null);
      } else {
        setLyrics(data.lyrics || 'تم تجهيز الكلمات واللحن المقترح.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'يتطلب توليد الموسيقى بنموذج Lyria تفعيل باقة الفوترة الخاصة بالمستخدم.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700/80 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-700 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-rose-700 dark:text-rose-400 font-semibold mb-1">
              <span>استوديو الصوتيات والأناشيد التعليمية لشركة IE</span>
              <span aria-hidden="true">·</span>
              <span>Google Lyria (lyria-3-clip-preview)</span>
            </div>
            <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white">
              توليد الموسيقى والأناشيد التعليمية بالذكاء الاصطناعي
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
              إنشاء مقاطع موسيقية تصويرية وأناشيد تحفيزية تجمع بين المقامات العربية وإيقاعات الكورا والسبار السنغالية الأصيلة.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300">
            <Music className="w-4 h-4" />
            <span>lyria-3-clip-preview</span>
          </div>
        </div>

        {/* Presets */}
        <div className="space-y-2">
          <span className="text-xs text-stone-500 dark:text-stone-400 font-medium block">
            أنماط وألحان سنغالية جاهزة:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {MUSIC_PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setPrompt(p.prompt)}
                className={`p-3 text-right rounded-xl border text-xs transition-all ${
                  prompt === p.prompt
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-950 dark:text-rose-200 font-semibold'
                    : 'bg-stone-50/70 dark:bg-stone-900/40 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-stone-300'
                }`}
              >
                <div className="font-bold leading-snug">{p.title}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Input */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-bold text-stone-900 dark:text-white block">
            وصف اللحن، الآلات الموسيقية، والإيقاع:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="اكتب وصف الموسيقى، الآلات (كورا، عود، دف)، الإيقاع..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-rose-600 text-right"
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="px-5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs flex items-center gap-1.5 disabled:opacity-50 transition-all shrink-0"
            >
              {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>توليد المقطع (Lyria)</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Audio Playback Card */}
      {audioUrl && (
        <div className="bg-white dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700/80 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-700 pb-3">
            <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-rose-600" />
              المقطع الموسيقي المولد بواسطة Lyria
            </h3>
            <span className="text-xs text-stone-400 font-mono">WAV · 30s Audio Clip</span>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 max-w-md mx-auto">
            <audio controls src={audioUrl} className="w-full" autoPlay />
          </div>

          {lyrics && (
            <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 text-xs text-stone-700 dark:text-stone-300 space-y-1">
              <strong className="text-rose-800 dark:text-rose-300 block">الكلمات المصاحبة:</strong>
              <p className="leading-relaxed whitespace-pre-wrap">{lyrics}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
