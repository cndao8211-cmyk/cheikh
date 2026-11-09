import React, { useState } from 'react';
import { MapsGroundingExplorer } from './MapsGroundingExplorer';
import { VideoStudio } from './VideoStudio';
import { MusicGenerator } from './MusicGenerator';
import { Film, Globe, Music, Sparkles } from 'lucide-react';

export const MediaStudioSuite: React.FC = () => {
  const [activeMediaTab, setActiveMediaTab] = useState<'maps' | 'video' | 'music'>('maps');

  return (
    <div className="space-y-6">
      {/* Top Segmented Control */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-white dark:bg-stone-800/80 p-4 rounded-2xl border border-stone-200 dark:border-stone-700">
        <div>
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">استوديو الوسائط والبيانات لشركة IE</span>
          <h2 className="text-xl font-bold text-stone-900 dark:text-white">الخرائط الذكية · الفيديو السينمائي · الصوتيات</h2>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
          <button
            onClick={() => setActiveMediaTab('maps')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeMediaTab === 'maps'
                ? 'bg-white dark:bg-stone-800 text-sky-700 dark:text-sky-300 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            خرائط Google Grounding
          </button>
          <button
            onClick={() => setActiveMediaTab('video')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeMediaTab === 'video'
                ? 'bg-white dark:bg-stone-800 text-purple-700 dark:text-purple-300 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            توليد الفيديو (Omni Flash)
          </button>
          <button
            onClick={() => setActiveMediaTab('music')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeMediaTab === 'music'
                ? 'bg-white dark:bg-stone-800 text-rose-700 dark:text-rose-300 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            الموسيقى والأناشيد (Lyria)
          </button>
        </div>
      </div>

      {activeMediaTab === 'maps' && <MapsGroundingExplorer />}
      {activeMediaTab === 'video' && <VideoStudio />}
      {activeMediaTab === 'music' && <MusicGenerator />}
    </div>
  );
};
