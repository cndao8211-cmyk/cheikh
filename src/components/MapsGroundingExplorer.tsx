import React, { useState } from 'react';
import { MapPin, Search, Globe, Building2, Landmark, Compass, Loader2, Sparkles, Navigation } from 'lucide-react';

const PRESET_PLACES = [
  {
    name: 'جامعة الشيخ أنتا ديوب (UCAD) - داكار',
    query: 'Cheikh Anta Diop University Dakar Senegal coordinates location and academic faculties',
    category: 'تعليمي وجامعي',
  },
  {
    name: 'المسجد الكبير في توبا ومكتبة الشيخ الخديم',
    query: 'Great Mosque of Touba Senegal geographical location history and regional access',
    category: 'ديني وتراثي',
  },
  {
    name: 'جزيرة غوري التاريخية (Île de Gorée) وميناء داكار',
    query: 'Ile de Goree Dakar Senegal maritime harbor coordinates and heritage',
    category: 'تاريخ وسياحة',
  },
  {
    name: 'سد دياما وسانت لويس على نهر السنغال',
    query: 'Diama Dam Saint Louis Senegal river OMVS coordinates and agricultural impact',
    category: 'مائي وزراعي',
  },
  {
    name: 'حقل غاز تورتو آحميم (GTA) وحقل سنغومار',
    query: 'Sangomar oilfield and Grand Tortue Ahmeyim LNG Senegal offshore location and economic zones',
    category: 'طاقة وموارد',
  },
  {
    name: 'حوض الفول السوداني وميناء الملح في كاولاخ',
    query: 'Kaolack Senegal peanut basin Saloum river port location and trade routes',
    category: 'اقتصادي وتجاري',
  },
];

export const MapsGroundingExplorer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(PRESET_PLACES[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [mapResult, setMapResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFetchPlace = async (queryText: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/maps/grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText }),
      });

      if (!res.ok) {
        throw new Error('تعذر جلب بيانات الخريطة');
      }

      const data = await res.json();
      setMapResult(data.result);
    } catch (err: any) {
      console.error(err);
      setError('تعذر استخراج بيانات الخرائط الحية. تأكد من تفعيل خدمة خرائط Google.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700/80 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-700 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-sky-700 dark:text-sky-400 font-semibold mb-1">
              <span>نظم الاستكشاف المكاني والخرائط الحية</span>
              <span aria-hidden="true">·</span>
              <span>Google Maps Grounding (Gemini 3.8 Flash)</span>
            </div>
            <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white">
              مستكشف معالم ومشاريع السنغال بالخرائط الحية
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
              بيانات موثقة جغرافياً في الوقت الفعلي لأهم الجامعات والمعالم التاريخية والموانئ ومشاريع الطاقة في جمهورية السنغال.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300">
            <Globe className="w-4 h-4" />
            <span>متصل ببيانات خرائط Google</span>
          </div>
        </div>

        {/* Quick Location Pills */}
        <div className="space-y-2">
          <span className="text-xs text-stone-500 dark:text-stone-400 font-medium block">
            المواقع والمعالم الاستراتيجية بالسنغال:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {PRESET_PLACES.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedPlace(p);
                  setSearchQuery(p.name);
                  handleFetchPlace(p.query);
                }}
                className={`p-3 text-right rounded-xl border text-xs transition-all flex items-start gap-2 ${
                  selectedPlace.name === p.name
                    ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-500 text-sky-950 dark:text-sky-200 font-semibold'
                    : 'bg-stone-50/70 dark:bg-stone-900/40 border-stone-200 dark:border-stone-700 hover:border-stone-300 text-stone-700 dark:text-stone-300'
                }`}
              >
                <MapPin className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold leading-snug">{p.name}</div>
                  <span className="text-[10px] text-stone-400 font-normal">{p.category}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Search Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim()) {
              handleFetchPlace(searchQuery);
            }
          }}
          className="flex items-center gap-2 pt-2"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن أي مدينة، جامعة، مصنع، أو معلم جغرافي في السنغال..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-600 text-right"
          />
          <button
            type="submit"
            disabled={isLoading || !searchQuery.trim()}
            className="px-5 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-semibold text-xs flex items-center gap-1.5 disabled:opacity-50 transition-all shrink-0"
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            <span>فحص المكان</span>
          </button>
        </form>
      </div>

      {/* Result Display Card */}
      {isLoading && (
        <div className="p-8 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-sky-600 animate-spin mx-auto" />
          <p className="text-xs text-stone-500">
            جاري استعلام بيانات خرائط Google وتحليل الموقع الجغرافي للسنغال...
          </p>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {mapResult && !isLoading && (
        <div className="bg-white dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700/80 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-700 pb-3">
            <span className="text-xs font-bold text-sky-700 dark:text-sky-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              التقرير الجغرافي الموثق بخرائط Google
            </span>
            <span className="text-xs text-stone-400 font-mono">Senegal Geospatial Data</span>
          </div>

          <div className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed whitespace-pre-wrap bg-stone-50 dark:bg-stone-900/50 p-5 rounded-xl border border-stone-200 dark:border-stone-800 font-cairo">
            {mapResult}
          </div>
        </div>
      )}
    </div>
  );
};
