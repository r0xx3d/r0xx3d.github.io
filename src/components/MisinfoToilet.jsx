import { useState, useEffect, useRef } from 'react';

const CONNECTIVE_TISSUE = [
  '...as', 'while', 'because', 'therefore', 'the system notes that',
  'meanwhile', 'consequently', 'despite', 'within which', 'insofar as',
  'as if', 'not unlike', 'in the void where', 'underneath',
  'the signal resolves into', 'which is to say',
];

export default function MisinfoToilet({ data }) {
  const [activeBlock, setActiveBlock] = useState(null);
  const [glitchIndex, setGlitchIndex] = useState(-1);
  const containerRef = useRef(null);

  // Periodic glitch effect on random blocks
  useEffect(() => {
    const interval = setInterval(() => {
      if (data && data.length > 0) {
        const idx = Math.floor(Math.random() * data.length);
        setGlitchIndex(idx);
        setTimeout(() => setGlitchIndex(-1), 150);
      }
    }, 4000 + Math.random() * 6000);

    return () => clearInterval(interval);
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="border-b border-obsidian-700 pb-4">
          <h3 className="text-xl font-semibold text-white tracking-tight mb-1 font-sans">
            Toilet of Babel
          </h3>
          <p className="text-obsidian-500 text-[10px] uppercase tracking-[0.2em] font-mono">
            Hauntological engine offline — awaiting corpus injection
          </p>
        </div>
        <div className="text-center py-16">
          <p className="text-obsidian-600 text-[10px] uppercase tracking-[0.2em] font-mono animate-pulse-slow">
            &gt; SIGNAL_VOID — no schizo-analytic output generated this cycle
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" ref={containerRef}>
      {/* Header */}
      <div className="border-b border-obsidian-700 pb-4">
        <h3 className="text-xl font-semibold text-white tracking-tight mb-1 font-sans">
          Toilet of Babel
        </h3>
        <p className="text-obsidian-500 text-[10px] uppercase tracking-[0.2em] font-mono mb-3">
          Hauntological cut-up engine — Do not believe in everything they say
        </p>
      </div>

      {/* Cut-Up Blocks */}
      <div className="stagger-fade space-y-3">
        {data.map((block, i) => {
          const isActive = activeBlock === i;
          const isGlitching = glitchIndex === i;

          return (
            <div
              key={i}
              className={`relative border transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'border-obsidian-500 bg-obsidian-900/60'
                  : 'border-obsidian-800 bg-obsidian-950/50 hover:border-obsidian-700'
              } ${isGlitching ? 'animate-flicker' : ''}`}
              onClick={() => setActiveBlock(isActive ? null : i)}
            >
              {/* Block index / seed */}
              <div className="absolute top-2 right-3 text-[8px] font-mono text-obsidian-700 tracking-wider">
                [{String(i).padStart(3, '0')}] SEED:{block.seed || 0}
              </div>

              <div className="p-5 pr-20">
                {/* Splice (main output) */}
                <p className={`text-obsidian-200 text-sm leading-relaxed font-mono tracking-wide ${
                  isGlitching ? 'data-glow' : ''
                }`}>
                  {block.splice}
                </p>

                {/* Expanded: show components */}
                {isActive && (
                  <div className="mt-4 pt-4 border-t border-obsidian-800 space-y-3 animate-slide-up">
                    {/* Headline source */}
                    <div>
                      <span className="text-[8px] font-mono text-obsidian-600 uppercase tracking-[0.2em] block mb-1">
                        HEADLINE_SOURCE
                      </span>
                      <p className="text-obsidian-400 text-xs font-mono pl-3 border-l border-obsidian-700">
                        {block.headline}
                      </p>
                    </div>

                    {/* Philosophical fragment */}
                    <div>
                      <span className="text-[8px] font-mono text-obsidian-600 uppercase tracking-[0.2em] block mb-1">
                        CORPUS_FRAGMENT
                      </span>
                      <p className="text-obsidian-400 text-xs font-mono pl-3 border-l border-domain-philosophy italic">
                        {block.fragment}
                      </p>
                    </div>

                    {/* Connective tissue */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {CONNECTIVE_TISSUE.slice(0, 5).map((c, ci) => (
                        <span key={ci} className="text-[8px] px-2 py-0.5 bg-obsidian-800/50 text-obsidian-600 font-mono">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Left accent bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-0.5 transition-colors ${
                isActive ? 'bg-obsidian-400' : 'bg-obsidian-800'
              }`} />
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-obsidian-700">
        <div className="flex items-center justify-between">
          <p className="text-[9px] text-obsidian-600 uppercase tracking-[0.2em] font-mono">
            {data.length} schizo-analytic splice{data.length !== 1 ? 's' : ''} generated
          </p>
          <p className="text-[9px] text-obsidian-700 font-mono italic">
            "The future is already here — it's just not evenly distributed"
          </p>
        </div>
      </div>
    </div>
  );
}
