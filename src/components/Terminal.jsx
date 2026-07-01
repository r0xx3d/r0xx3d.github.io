import { useState, useEffect } from 'react';
import ThreatMatrix from './ThreatMatrix.jsx';
import WorldMonitor from './WorldMonitor.jsx';
import SyndicationNode from './SyndicationNode.jsx';
import MisinfoToilet from './MisinfoToilet.jsx';
import SyndicateJournal from './SyndicateJournal.jsx';

const NAV_NODES = [
  { id: 'MISINFORMATION_COLUMN', label: 'TOILET_OF_BABEL',  icon: '⌬' },
  { id: 'WORLD_MONITOR',         label: 'WORLD_MONITOR',    icon: '◉' },
  { id: 'THREAT_INTEL',          label: 'CTI_DASHBOARD',    icon: '◈' },
  { id: 'SYNDICATION',           label: 'SYNDICATION_NODE', icon: '▣' },
  { id: 'SYNDICATE_JOURNAL',     label: 'SYNDICATE_JOURNAL',icon: '▧' },
];

export default function Terminal() {
  const [activeNode, setActiveNode] = useState('MISINFORMATION_COLUMN');
  const [isExpanded, setIsExpanded] = useState(true);
  const [data, setData] = useState(null);
  const [bootPhase, setBootPhase] = useState(0);

  useEffect(() => {
    // Boot sequence animation
    const timers = [
      setTimeout(() => setBootPhase(1), 300),
      setTimeout(() => setBootPhase(2), 800),
      setTimeout(() => setBootPhase(3), 1400),
      setTimeout(() => setBootPhase(4), 2000),
    ];

    fetch('./data/terminal-state.json')
      .then(res => res.json())
      .then(d => {
        setTimeout(() => setData(d), 2200);
      })
      .catch(() => {
        console.warn('System offline. Awaiting chronological sync.');
        // Still exit boot after delay
        setTimeout(() => setBootPhase(5), 2500);
      });

    return () => timers.forEach(clearTimeout);
  }, []);

  // ── Boot Screen ──
  if (!data) {
    return (
      <div className="h-screen bg-black text-obsidian-200 font-mono flex flex-col items-center justify-center scan-overlay">
        <div className="space-y-2 text-xs tracking-wider uppercase">
          <p className={`transition-opacity duration-300 ${bootPhase >= 0 ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-obsidian-500">[INIT]</span> CONSOLE SECURE BOOT v1
          </p>
          <p className={`transition-opacity duration-300 ${bootPhase >= 1 ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-obsidian-500">[SYNC]</span> Establishing data streams...
          </p>
          <p className={`transition-opacity duration-300 ${bootPhase >= 2 ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-obsidian-500">[LOAD]</span> Parsing threat intelligence...
          </p>
          <p className={`transition-opacity duration-300 ${bootPhase >= 3 ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-obsidian-500">[EXEC]</span> Initializing hauntological engine...
          </p>
          <p className={`transition-opacity duration-300 ${bootPhase >= 4 ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-obsidian-400 boot-cursor">READY_</span>
          </p>
        </div>
      </div>
    );
  }

  // ── Main Terminal ──
  return (
    <div className="flex h-screen bg-black text-obsidian-300 font-sans text-sm selection:bg-white selection:text-black overflow-hidden scan-overlay">

      {/* ═══ LEFT BLOCK: Collapsible Obsidian Index ═══ */}
      <aside
        className={`transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] border-r border-obsidian-700 shrink-0 relative flex flex-col z-20 ${
          isExpanded ? 'w-64' : 'w-12'
        }`}
        style={{
          background: 'linear-gradient(180deg, #09090b 0%, #050506 50%, #000000 100%)',
          boxShadow: '4px 0 24px rgba(0,0,0,0.8)',
        }}
      >
        {/* Header */}
        <div className="h-12 border-b border-obsidian-700 flex items-center justify-between px-3 shrink-0">
          {isExpanded && (
            <h1 className="text-white font-bold tracking-[0.25em] text-[11px] uppercase font-mono">
              CONSOLE
            </h1>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-obsidian-500 hover:text-white transition-colors duration-200 focus:outline-none flex items-center justify-center w-6 h-6 bg-obsidian-900 border border-obsidian-700 hover:border-obsidian-500"
            aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isExpanded ? '«' : '»'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 flex flex-col gap-0.5 overflow-hidden">
          {NAV_NODES.map((node, index) => (
            <button
              key={node.id}
              id={`nav-${node.id.toLowerCase()}`}
              onClick={() => setActiveNode(node.id)}
              className={`w-full text-left flex items-center px-3 py-2.5 border-l-2 ${
                activeNode === node.id
                  ? 'border-l-obsidian-400 bg-obsidian-900/80 text-white font-medium'
                  : 'border-l-transparent text-obsidian-500 hover:bg-obsidian-900/40 hover:text-obsidian-300'
              } transition-all duration-200 uppercase tracking-wider focus:outline-none whitespace-nowrap`}
            >
              <span className="text-[10px] font-mono mr-2.5 opacity-40 w-4 text-center">
                {node.icon}
              </span>
              {isExpanded ? (
                <span className="text-[11px] font-mono">{node.label}</span>
              ) : (
                <span className="text-[10px] font-mono opacity-50">
                  0{index + 1}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        {isExpanded && (
          <div className="p-3 border-t border-obsidian-700 text-[9px] text-obsidian-500 tracking-wider font-mono space-y-1">
            <p>SYNC: {data.generated_at || new Date().toISOString()}</p>
            <p>STATUS: <span className="text-emerald-600">OPERATIONAL</span></p>
            <p>NODE: {activeNode}</p>
          </div>
        )}
      </aside>

      {/* ═══ RIGHT BLOCK: Main Viewport ═══ */}
      <main className="flex-1 flex flex-col relative bg-black min-w-0">
        {/* Header Bar */}
        <header className="h-12 border-b border-obsidian-700 flex items-center justify-between px-6 shrink-0 z-10"
          style={{ background: 'linear-gradient(90deg, #09090b, #050506)' }}
        >
          <h2 className="text-white text-[11px] font-bold tracking-[0.2em] uppercase font-mono">
            {activeNode.replace(/_/g, '.')}
          </h2>
          <div className="flex items-center gap-4 text-[9px] text-obsidian-500 font-mono tracking-wider">
            <span>UTC {new Date().toISOString().slice(11, 19)}</span>
            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse-slow" />
          </div>
        </header>

        {/* Content Area */}
        <div
          className="flex-1 p-6 lg:p-8 overflow-y-auto custom-scrollbar"
          style={{
            background: 'radial-gradient(ellipse at top right, rgba(24, 24, 27, 0.15), #000000 60%)',
          }}
        >
          <div className="max-w-6xl mx-auto animate-fade-in">
            {activeNode === 'THREAT_INTEL'      && <ThreatMatrix data={data.threat_intel} />}
            {activeNode === 'WORLD_MONITOR'     && <WorldMonitor data={data.world_monitor} />}
            {activeNode === 'SYNDICATION'       && <SyndicationNode data={data.syndication} />}
            {activeNode === 'SYNDICATE_JOURNAL' && <SyndicateJournal data={data.syndicate_journal} />}
            {activeNode === 'MISINFORMATION_COLUMN'    && <MisinfoToilet data={data.misinfo_toilet} />}
          </div>
        </div>
      </main>
    </div>
  );
}

