import React, { useState } from 'react';
import { FitnessArticle, AdSenseConfig } from '../types/health';
import { FITNESS_ARTICLES } from '../utils/initialData';
import { BookOpen, Clock, Tag, ArrowRight, X, CheckCircle, Search, Sparkles } from 'lucide-react';
import { AdSenseBanner } from './AdSenseBanner';

interface FitnessEducationViewProps {
  config?: AdSenseConfig;
  onOpenAdManager?: () => void;
}

export const FitnessEducationView: React.FC<FitnessEducationViewProps> = ({
  config,
  onOpenAdManager,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<FitnessArticle | null>(null);

  const categories = ['All', 'Movement', 'Nutrition', 'Recovery', 'Wearables'];

  const filteredArticles = FITNESS_ARTICLES.filter((art) => {
    const matchesCat = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Evidence-Based Fitness Science
          </span>
          <span className="text-slate-500">·</span>
          <span className="text-xs text-slate-400">Peer-Reviewed Principles</span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
          Movement, Nutrition & Recovery Library
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Original educational guides exploring the exercise physiology behind daily step volume, sustainable caloric pacing, autonomic recovery (HRV), and wearable sensor capabilities.
        </p>

        {/* Search & Category Filter Bar */}
        <div className="mt-5 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search fitness science guides (steps, protein, HRV, hydration...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive Feed AdSense Placement */}
      <AdSenseBanner
        format="responsive-feed"
        config={config}
        onOpenAdManager={onOpenAdManager}
      />

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredArticles.map((article) => (
          <article
            key={article.id}
            onClick={() => setActiveArticle(article)}
            className="rounded-3xl bg-slate-900 border border-slate-800 p-5 hover:border-slate-700 transition-all cursor-pointer flex flex-col justify-between group shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-400 font-medium text-[11px]">
                  {article.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{article.readTime}</span>
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                {article.title}
              </h3>

              <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                {article.summary}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500">{article.author}</span>
              <span className="text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                <span>Read Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* Full Article Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl max-h-[92vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-400 font-medium text-xs">
                {activeArticle.category} · {activeArticle.readTime}
              </span>

              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4">
              <h2 className="text-xl font-bold text-white leading-tight">
                {activeArticle.title}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Published {activeArticle.publishedDate} by {activeArticle.author}
              </p>

              {/* Summary lead */}
              <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 my-4 text-xs text-slate-300 italic leading-relaxed">
                "{activeArticle.summary}"
              </div>

              {/* Full Article Content Paragraphs */}
              <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed font-normal">
                {activeArticle.content.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {/* In-Article AdSense Unit */}
              <AdSenseBanner
                format="in-article"
                config={config}
                onOpenAdManager={onOpenAdManager}
              />

              {/* Actionable Practical Takeaways Box */}
              <div className="mt-6 p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                  <span>Practical Action Takeaways</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-200">
                  {activeArticle.actionableTakeaways.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">·</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveArticle(null)}
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
