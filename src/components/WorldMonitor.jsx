import { useState } from 'react';

const SOURCE_LABELS = {
  'Al Jazeera': { color: 'text-emerald-500', short: 'AJ' },
  'BBC':        { color: 'text-sky-400',     short: 'BBC' },
  'Reuters':    { color: 'text-orange-400',  short: 'RTR' },
  'The Intercept': { color: 'text-rose-400', short: 'INT' },
  'OSINT Industries': { color: 'text-violet-400', short: 'OSI' },
};

export default function WorldMonitor({ data }) {
  const [activeSource, setActiveSource] = useState('all');
  const [expandedItem, setExpandedItem] = useState(null);

  const sources = ['all', ...Object.keys(SOURCE_LABELS)];

  const filtered = activeSource === 'all'
    ? data
    : data.filter(e => e.source === activeSource);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="border-b border-obsidian-700 pb-4">
        <h3 className="text-xl font-semibold text-white tracking-tight mb-1 font-sans">
          World Monitor
        </h3>
        <p className="text-obsidian-500 text-[10px] uppercase tracking-[0.2em] font-mono">
          Global neuro-feed — geopolitical signal aggregation
        </p>
      </div>

      {/* Source Filter */}
      <div className="flex flex-wrap gap-1.5">
        {sources.map(source => (
          <button
            key={source}
            id={`filter-source-${source.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => { setActiveSource(source); setExpandedItem(null); }}
            className={`text-[9px] uppercase tracking-[0.15em] font-mono px-3 py-1.5 border transition-colors ${
              activeSource === source
                ? 'border-obsidian-500 bg-obsidian-900 text-white'
                : 'border-obsidian-700 text-obsidian-500 hover:border-obsidian-600 hover:text-obsidian-400'
            }`}
          >
            {source === 'all' ? `ALL (${data.length})` : source}
          </button>
        ))}
      </div>

      {/* Feed Items */}
      <div className="stagger-fade space-y-1.5">
        {filtered.map((entry, i) => {
          const srcMeta = SOURCE_LABELS[entry.source] || { color: 'text-obsidian-400', short: '???' };
          const isExpanded = expandedItem === i;

          return (
            <article
              key={i}
              className={`obsidian-card cursor-pointer transition-all duration-200 ${
                isExpanded ? 'border-obsidian-600' : ''
              }`}
              onClick={() => setExpandedItem(isExpanded ? null : i)}
            >
              <div className="p-4 flex items-start gap-4">
                {/* Source Badge */}
                <div className="shrink-0 w-10 h-10 bg-obsidian-850 border border-obsidian-700 flex items-center justify-center">
                  <span className={`text-[9px] font-mono font-bold tracking-wider ${srcMeta.color}`}>
                    {srcMeta.short}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className={`text-[9px] uppercase tracking-[0.15em] font-mono ${srcMeta.color}`}>
                      {entry.source}
                    </span>
                    <span className="text-[9px] text-obsidian-600">|</span>
                    <span className="text-[9px] text-obsidian-500 font-mono">
                      {formatTimeAgo(entry.pubDate)}
                    </span>
                  </div>
                  <h4 className="text-obsidian-200 text-sm leading-snug line-clamp-2 hover:text-white transition-colors">
                    {entry.title}
                  </h4>
                </div>

                {/* Expand indicator */}
                <span className={`text-obsidian-600 text-[10px] transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
                  ▸
                </span>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-0 border-t border-obsidian-800 mx-4 animate-slide-up">
                  <p className="text-obsidian-400 text-xs leading-relaxed mt-3 mb-3">
                    {entry.summary || 'No synopsis available.'}
                  </p>
                  <a
                    href={entry.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="text-[9px] uppercase tracking-[0.15em] font-mono text-obsidian-500 hover:text-white border border-obsidian-700 hover:border-obsidian-500 px-3 py-1.5 transition-colors inline-block"
                  >
                    Source Document →
                  </a>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Count */}
      {filtered.length === 0 && (
        <p className="text-obsidian-600 text-[10px] uppercase tracking-[0.2em] font-mono text-center py-16">
          &gt; No signals detected in this channel.
        </p>
      )}

      <div className="pt-4 border-t border-obsidian-700">
        <p className="text-[9px] text-obsidian-600 uppercase tracking-[0.2em] font-mono">
          {filtered.length} dispatch{filtered.length !== 1 ? 'es' : ''} in stream
        </p>
      </div>
    </div>
  );
}

function formatTimeAgo(dateStr) {
  if (!dateStr) return '—';
  try {
    const now = new Date();
    const then = new Date(dateStr);
    const diffMs = now - then;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return 'recent';
  } catch {
    return dateStr;
  }
}
