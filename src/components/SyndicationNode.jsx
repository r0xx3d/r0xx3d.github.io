import { useState } from 'react';

export default function SyndicationNode({ data }) {
  const [expandedItem, setExpandedItem] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="border-b border-obsidian-700 pb-4">
          <h3 className="text-xl font-semibold text-white tracking-tight mb-1 font-sans">
            Syndication Node
          </h3>
          <p className="text-obsidian-500 text-[10px] uppercase tracking-[0.2em] font-mono">
            Personal feed interleave — LiveJournal · blogs · dispatches
          </p>
        </div>
        <p className="text-obsidian-600 text-[10px] uppercase tracking-[0.2em] font-mono text-center py-16">
          &gt; No syndicated transmissions available. Configure feed sources in harvester.js
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="border-b border-obsidian-700 pb-4">
        <h3 className="text-xl font-semibold text-white tracking-tight mb-1 font-sans">
          Syndication Node
        </h3>
        <p className="text-obsidian-500 text-[10px] uppercase tracking-[0.2em] font-mono">
          Personal feed interleave — LiveJournal · blogs · dispatches
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-[7px] top-0 bottom-0 w-px bg-obsidian-800" />

        <div className="stagger-fade space-y-4">
          {data.map((entry, i) => {
            const isExpanded = expandedItem === i;

            return (
              <div key={i} className="relative flex gap-4 pl-6">
                {/* Timeline dot */}
                <div className={`absolute left-0 top-3 w-[15px] h-[15px] border-2 ${
                  isExpanded
                    ? 'border-obsidian-400 bg-obsidian-800'
                    : 'border-obsidian-700 bg-obsidian-900'
                } transition-colors`} />

                {/* Card */}
                <article
                  className={`flex-1 obsidian-card cursor-pointer ${
                    isExpanded ? 'border-obsidian-600' : ''
                  }`}
                  onClick={() => setExpandedItem(isExpanded ? null : i)}
                >
                  <div className="p-4">
                    {/* Meta */}
                    <div className="flex items-center gap-3 mb-2">
                      {entry.author && (
                        <span className="text-[10px] font-mono text-obsidian-400 uppercase tracking-wider">
                          {entry.author}
                        </span>
                      )}
                      <span className="text-[9px] text-obsidian-600">|</span>
                      <span className="text-[9px] text-obsidian-500 font-mono">
                        {formatDate(entry.pubDate)}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="text-obsidian-200 text-sm leading-snug mb-2">
                      {entry.title}
                    </h4>

                    {/* Preview / Expanded */}
                    {isExpanded ? (
                      <div className="animate-slide-up">
                        <div className="border-t border-obsidian-800 pt-3 mt-2">
                          <p className="text-obsidian-400 text-xs leading-relaxed whitespace-pre-wrap">
                            {entry.content || 'No content body available.'}
                          </p>
                          {entry.link && (
                            <a
                              href={entry.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="mt-3 text-[9px] uppercase tracking-[0.15em] font-mono text-obsidian-500 hover:text-white border border-obsidian-700 hover:border-obsidian-500 px-3 py-1.5 transition-colors inline-block"
                            >
                              Open Source →
                            </a>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-obsidian-500 text-xs line-clamp-2 leading-relaxed">
                        {entry.content?.slice(0, 150) || ''}
                        {entry.content?.length > 150 ? '...' : ''}
                      </p>
                    )}
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>

      {/* Count */}
      <div className="pt-4 border-t border-obsidian-700">
        <p className="text-[9px] text-obsidian-600 uppercase tracking-[0.2em] font-mono">
          {data.length} syndicated node{data.length !== 1 ? 's' : ''} interleaved
        </p>
      </div>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

