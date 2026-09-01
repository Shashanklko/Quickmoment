import React, { useState } from 'react';
import { AWARENESS_EPISODES, AwarenessEpisode } from '../../services/liveRssNewsService';
import { Play, ChevronLeft, ChevronRight, X, Film, Sparkles } from 'lucide-react';

interface InvestorAwarenessCardProps {
  className?: string;
}

export const InvestorAwarenessCard: React.FC<InvestorAwarenessCardProps> = ({ className = '' }) => {
  const [activeEpisodeIdx, setActiveEpisodeIdx] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const currentEpisode: AwarenessEpisode = AWARENESS_EPISODES[activeEpisodeIdx];

  const goToPrev = () => {
    setActiveEpisodeIdx((prev) => (prev === 0 ? AWARENESS_EPISODES.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setActiveEpisodeIdx((prev) => (prev === AWARENESS_EPISODES.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div
        className={`rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/80 border border-slate-800 p-6 shadow-xl relative overflow-hidden ${className}`}
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Investor Awareness Series</h3>
              <span className="text-[10px] text-slate-400">Financial Mastery & Advisory Insights</span>
            </div>
          </div>

          <span className="text-[11px] font-mono font-bold text-indigo-400 bg-indigo-950/80 border border-indigo-800/40 px-2.5 py-0.5 rounded-full">
            {activeEpisodeIdx + 1} / {AWARENESS_EPISODES.length}
          </span>
        </div>

        {/* Video Trigger Thumbnail Box */}
        <div className="relative group rounded-2xl overflow-hidden bg-slate-950 aspect-video mb-4 cursor-pointer shadow-lg border border-slate-800 hover:border-indigo-500/80 transition-all">
          <img
            src={`https://img.youtube.com/vi/${currentEpisode.id}/hqdefault.jpg`}
            alt={currentEpisode.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors pointer-events-none" />

          {/* Large Play Button Overlay */}
          <div
            onClick={() => setIsModalOpen(true)}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white"
          >
            <div className="w-14 h-14 rounded-full bg-red-600/90 group-hover:bg-red-600 group-hover:scale-110 flex items-center justify-center shadow-2xl transition-all">
              <Play className="w-6 h-6 fill-white ml-0.5" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider bg-slate-950/80 px-2.5 py-0.5 rounded-md backdrop-blur-xs">
              Watch Episode
            </span>
          </div>

          {/* Carousel Left / Right Arrows */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goToPrev();
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-slate-950/70 hover:bg-slate-900 text-white backdrop-blur-xs transition-colors cursor-pointer"
            aria-label="Previous Episode"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-slate-950/70 hover:bg-slate-900 text-white backdrop-blur-xs transition-colors cursor-pointer"
            aria-label="Next Episode"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Episode Info */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">
            <span>{currentEpisode.category}</span>
            <span>•</span>
            <span className="text-slate-400 font-mono">{currentEpisode.duration}</span>
          </div>
          <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug mb-1">
            {currentEpisode.title}
          </h4>
          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
            {currentEpisode.description}
          </p>
        </div>

        {/* Carousel Dot Indicators */}
        <div className="flex items-center justify-center gap-2">
          {AWARENESS_EPISODES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveEpisodeIdx(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === activeEpisodeIdx ? 'w-6 bg-indigo-500' : 'w-2 bg-slate-700 hover:bg-slate-500'
              }`}
              aria-label={`Jump to episode ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Embedded YouTube Player Modal */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white line-clamp-1">
                {currentEpisode.title}
              </h4>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* YouTube Iframe */}
            <div className="aspect-video w-full bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${currentEpisode.id}?autoplay=1`}
                title={currentEpisode.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
