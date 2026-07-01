import { useState } from 'react';

const DOMAIN_COLORS = {
  philosophy:   'text-domain-philosophy',
  anthropology: 'text-domain-anthropology',
  sociology:    'text-domain-sociology',
  history:      'text-domain-history',
  psychology:   'text-domain-psychology',
  science:      'text-domain-science',
  politics:     'text-domain-politics',
  linguistics:  'text-domain-linguistics',
};

const DOMAIN_BORDER_COLORS = {
  philosophy:   'border-l-domain-philosophy',
  anthropology: 'border-l-domain-anthropology',
  sociology:    'border-l-domain-sociology',
  history:      'border-l-domain-history',
  psychology:   'border-l-domain-psychology',
  science:      'border-l-domain-science',
  politics:     'border-l-domain-politics',
  linguistics:  'border-l-domain-linguistics',
};

const ALL_DOMAINS = [
  'all', 'philosophy', 'anthropology', 'sociology', 'history',
  'psychology', 'science', 'politics', 'linguistics',
];

export default function SyndicateJournal({ data }) {
  const [activeDomain, setActiveDomain] = useState('all');
  const [expanded, setExpanded] = useState(null);

  if (!data) return null;

  const filtered = activeDomain === 'all'
    ? data
    : data.filter(e => e.domain === activeDomain);

  // Domain counts for badges
  const domainCounts = {};
  data.forEach(e => {
    domainCounts[e.domain] = (domainCounts[e.domain] || 0) + 1;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="border-b border-obsidian-700 pb-4 mb-6">
        <h3 className="text-xl font-semibold text-white tracking-tight mb-1 font-sans">
          Syndicate Journal
        </h3>
        <p className="text-obsidian-500 text-[10px] uppercase tracking-[0.2em] font-mono mb-4">
          Open-access dispatch — philosophy · anthropology · science · history · psychology · sociology
        </p>

        {/* Domain Filter Bar */}
        <div className="flex flex-wrap gap-1.5">
          {ALL_DOMAINS.map(domain => (
            <button
              key={domain}
              id={`filter-domain-${domain}`}
              onClick={() => {
                setActiveDomain(domain);
                setExpanded(null);
              }}
              className={`text-[9px] uppercase tracking-[0.15em] font-mono px-3 py-1.5 border transition-all duration-200 ${
                activeDomain === domain
                  ? 'border-obsidian-500 bg-obsidian-900 text-white'
                  : 'border-obsidian-700 text-obsidian-500 hover:border-obsidian-600 hover:text-obsidian-400'
              }`}
            >
              {domain}
              {domain !== 'all' && domainCounts[domain] && (
                <span className="ml-1.5 text-obsidian-600">
                  {domainCounts[domain]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Entries */}
      <div className="stagger-fade space-y-2">
        {filtered.map((entry, i) => {
          const isExpanded = expanded === i;
          const domainColor = DOMAIN_COLORS[entry.domain] || 'text-obsidian-400';
          const borderColor = DOMAIN_BORDER_COLORS[entry.domain] || 'border-l-obsidian-700';

          return (
            <article
              key={i}
              className={`border bg-obsidian-950 cursor-pointer transition-all duration-200 border-l-2 ${borderColor} ${
                isExpanded
                  ? 'border-obsidian-600'
                  : 'border-obsidian-800 hover:border-obsidian-700'
              }`}
              onClick={() => setExpanded(isExpanded ? null : i)}
            >
              <div className="p-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Domain + Source */}
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-[9px] uppercase tracking-[0.15em] font-mono font-medium ${domainColor}`}>
                      {entry.domain}
                    </span>
                    <span className="text-[9px] text-obsidian-700">|</span>
                    <span className="text-[9px] text-obsidian-500 uppercase tracking-wider font-mono">
                      {entry.source}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-obsidian-200 text-sm leading-snug line-clamp-2 hover:text-white transition-colors">
                    {entry.title}
                  </h4>
                </div>

                {/* Date */}
                <span className="text-[9px] text-obsidian-600 shrink-0 font-mono whitespace-nowrap">
                  {formatDate(entry.pubDate)}
                </span>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-obsidian-800 animate-slide-up">
                  <p className="text-obsidian-400 text-xs leading-relaxed mt-3 mb-4">
                    {entry.summary || 'No abstract available.'}
                  </p>
                  <a
                    href={entry.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="text-[9px] uppercase tracking-[0.15em] font-mono text-obsidian-500 hover:text-white border border-obsidian-700 hover:border-obsidian-500 px-3 py-1.5 transition-colors inline-block"
                  >
                    Read Full Text →
                  </a>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <p className="text-obsidian-600 text-[10px] uppercase tracking-[0.2em] font-mono text-center py-16">
          &gt; No transmissions in this domain.
        </p>
      )}

      {/* Footer */}
      <div className="pt-4 border-t border-obsidian-700">
        <p className="text-[9px] text-obsidian-600 uppercase tracking-[0.2em] font-mono">
          {filtered.length} of {data.length} dispatch{data.length !== 1 ? 'es' : ''} rendered
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

