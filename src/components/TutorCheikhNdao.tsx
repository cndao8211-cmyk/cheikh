import React, { useState } from 'react';
import { Send, Sparkles, Volume2, Bot, User, Loader2, BookOpen, Compass, Globe2 } from 'lucide-react';

interface TutorCheikhNdaoProps {
  initialPrompt?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const FREQUENT_QUESTIONS = [
  {
    subject: 'اللغة العربية',
    icon: BookOpen,
    text: 'اشرح لي الفرق بين الحال والتمييز مع نماذج إعرابية وشواهد من المنهج السنغالي.',
  },
  {
    subject: 'تاريخ السنغال',
    icon: Compass,
    text: 'ما هي الأسباب السياسية والاقتصادية لتفكك إمبراطورية جولوف بعد معركة دانكي (1549م)؟',
  },
  {
    subject: 'جغرافيا السنغال',
    icon: Globe2,
    text: 'ما هي أهمية حوض نهر السنغال ودور سد دياما وسد ماننتالي في الزراعة والأمن الغذائي؟',
  },
  {
    subject: 'المقاومة الوطنية',
    icon: Sparkles,
    text: 'كيف قاد الشيخ أحمدو بمب والحاج مالك سي المقاومة التربوية والثقافية ضد التغريب؟',
  },
];

export const TutorCheikhNdao: React.FC<TutorCheikhNdaoProps> = ({ initialPrompt = '' }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'أهلاً وسهلاً بكم يا طلاب العلم في السنغال الحبيبة. أنا مرشدكم الأكاديمي الرقمي في منصة IE التعليمية، بإشراف فضيلة الشيخ تيجان ا نداو. يسعدني أن أجيب عن جميع استفساراتكم في اللغة العربية وقواعدها، وتاريخ السنغال وممالكها، وجغرافيتها وتنميتها، تحضيراً للامتحانات والشهادات العليا. ما الذي تود مراجعته اليوم؟',
    },
  ]);
  const [input, setInput] = useState(initialPrompt);
  const [selectedSubject, setSelectedSubject] = useState('عام');
  const [isLoading, setIsLoading] = useState(false);
  const [speakingText, setSpeakingText] = useState<string | null>(null);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          subject: selectedSubject,
        }),
      });

      if (!response.ok) {
        throw new Error('فشل الرد من الخادم');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.reply || 'عذراً، لم يرد جواب.',
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'عذراً، تعذر الاتصال بالخادم في هذه اللحظة. يرجى التأكد من اتصالك بالإنترنت وتوفر مفتاح Gemini API في لوحة الإعدادات والمحاولة مجدداً.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setSpeakingText(text);
    const cleanText = text.replace(/[*#_]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.88;
    utterance.onend = () => setSpeakingText(null);
    utterance.onerror = () => setSpeakingText(null);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700/80 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-700 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xl shadow-xs">
              IE
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-semibold mb-0.5">
                <span>المرشد العلمي والأكاديمي المباشر</span>
                <span aria-hidden="true">·</span>
                <span>فضيلة الشيخ تيجان ا نداو</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white">
                غرفة الاستشارات العلمية والمراجعة الذكية
              </h2>
            </div>
          </div>

          {/* Subject Filter for AI */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800 self-start sm:self-auto">
            {['عام', 'اللغة العربية', 'التاريخ', 'الجغرافيا'].map((subj) => (
              <button
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedSubject === subj
                    ? 'bg-white dark:bg-stone-800 text-emerald-700 dark:text-emerald-400 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                {subj}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Question Pills */}
        <div className="space-y-1.5">
          <span className="text-xs text-stone-500 dark:text-stone-400 font-medium block">
            أسئلة شائعة في المنهج السنغالي:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {FREQUENT_QUESTIONS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSend(item.text)}
                  className="p-3 text-right text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-900/40 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors flex items-start gap-2.5 text-stone-700 dark:text-stone-300"
                >
                  <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2 leading-relaxed">{item.text}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chat Messages Box */}
      <div className="bg-white dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700/80 p-4 sm:p-6 space-y-4 min-h-[420px] flex flex-col justify-between">
        <div className="space-y-4 overflow-y-auto max-h-[550px] pr-2">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`flex gap-3 text-sm ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isUser
                      ? 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200'
                      : 'bg-emerald-700 text-white'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`p-4 rounded-2xl max-w-2xl leading-relaxed text-right space-y-2 ${
                    isUser
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-stone-900 dark:text-white'
                      : 'bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200'
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                  {!isUser && (
                    <div className="pt-2 border-t border-stone-200/50 dark:border-stone-700/50 flex items-center justify-between text-xs text-stone-500">
                      <span>إرشاد الشيخ تيجان ا نداو</span>
                      <button
                        onClick={() => handleSpeak(msg.content)}
                        className="flex items-center gap-1 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{speakingText === msg.content ? 'جاري الاستماع...' : 'استماع صوتي'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3 text-sm text-stone-500">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <span className="p-3 bg-stone-100 dark:bg-stone-900 rounded-xl">
                المرشد العلمي يراجع مصادر المنهج ويصيغ الإجابة المنهجية...
              </span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="pt-3 border-t border-stone-200 dark:border-stone-700">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب سؤالك في النحو، تاريخ السنغال، الجغرافيا، أو الامتحانات..."
              className="flex-1 px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all text-right"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center gap-2 disabled:opacity-50 transition-all shrink-0"
            >
              <Send className="w-4 h-4 rotate-180" />
              <span>إرسال السؤال</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
