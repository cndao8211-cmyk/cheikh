import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, Radio, Loader2, Bot, User } from 'lucide-react';

export const LiveVoiceRoom: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiSpeech, setAiSpeech] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'listening' | 'speaking'>('idle');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ar-SA';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        handleSendVoiceQuery(text);
      };

      recognition.onerror = (e: any) => {
        console.error('Speech recognition error:', e);
        setIsListening(false);
        setStatus('idle');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const handleToggleListen = () => {
    setSpeechError(null);
    if (!recognitionRef.current) {
      setSpeechError('متصفحك لا يدعم التعرف الصوتي المباشر Web Speech. يمكنك استخدام مرشد الشيخ تيجان النصي في المناهج والإنجاز.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setStatus('idle');
    } else {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
      setStatus('listening');
    }
  };

  const handleSendVoiceQuery = async (userText: string) => {
    setIsProcessing(true);
    setStatus('speaking');
    try {
      const res = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          subject: 'المحادثة الصوتية المباشرة مع مرشد الشيخ تيجان ا نداو',
        }),
      });

      const data = await res.json();
      const answer = data.reply || 'أهلاً بك، تفضل بطرح سؤالك الصوتي.';
      setAiSpeech(answer);

      // Speak answer back
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const cleanText = answer.replace(/[*#_]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'ar-SA';
        utterance.rate = 0.9;
        utterance.onend = () => setStatus('idle');
        utterance.onerror = () => setStatus('idle');
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error(err);
      setStatus('idle');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700/80 p-6 sm:p-10 space-y-6 text-center">
        <div className="max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-2">
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>الاتصال الصوتي المباشر · Live Audio (Gemini 3.8 Live)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white">
            المحادثة الصوتية الحية مع مرشد الشيخ تيجان ا نداو
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            تحدث بصوتك مباشرة مع المساعد التعليمي؛ اطرح أسئلة النحو، تاريخ السنغال، والجغرافيا، واستمع للإجابة المنهجية فوراً.
          </p>
        </div>

        {speechError && (
          <div className="max-w-md mx-auto p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-xs font-semibold text-amber-800 dark:text-amber-300">
            {speechError}
          </div>
        )}

        {/* Big Interactive Visualizer Ring */}
        <div className="py-8 flex flex-col items-center justify-center">
          <div className="relative">
            {/* Visualizer ripple rings when active */}
            {isListening && (
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping scale-150" />
            )}
            {status === 'speaking' && (
              <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-pulse scale-125" />
            )}

            <button
              onClick={handleToggleListen}
              className={`w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-all relative z-10 ${
                isListening
                  ? 'bg-red-600 text-white hover:bg-red-700 scale-105'
                  : status === 'speaking'
                  ? 'bg-amber-600 text-white'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white'
              }`}
            >
              {isListening ? (
                <MicOff className="w-10 h-10" />
              ) : isProcessing ? (
                <Loader2 className="w-10 h-10 animate-spin" />
              ) : (
                <Mic className="w-10 h-10" />
              )}
            </button>
          </div>

          <div className="mt-4 text-xs font-semibold text-stone-600 dark:text-stone-300">
            {isListening ? (
              <span className="text-red-600 dark:text-red-400 font-bold">
                جاري الاستماع لصوتك الآن... تحدث بوضوح
              </span>
            ) : isProcessing ? (
              <span className="text-amber-600 font-bold">جاري تحليل السؤال وصياغة الإجابة الصوتية...</span>
            ) : status === 'speaking' ? (
              <span className="text-emerald-600 font-bold">المرشد يتحدث الآن... استمع للإجابة</span>
            ) : (
              <span>اضغط على الميكروفون لبدء التحدث</span>
            )}
          </div>
        </div>

        {/* Live Conversation Readouts */}
        {(transcript || aiSpeech) && (
          <div className="max-w-2xl mx-auto space-y-3 text-right">
            {transcript && (
              <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1">
                <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  سؤالك المنطوق:
                </span>
                <p className="text-sm font-semibold text-stone-900 dark:text-white">{transcript}</p>
              </div>
            )}

            {aiSpeech && (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed space-y-1">
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5" />
                  إجابة مرشد الشيخ تيجان ا نداو:
                </span>
                <p>{aiSpeech}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
