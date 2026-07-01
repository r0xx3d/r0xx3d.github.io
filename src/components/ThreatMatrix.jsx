import { useState } from 'react';

export default function ThreatMatrix({ data }) {
  const [activeTab, setActiveTab] = useState('cisa');
  const [expandedRow, setExpandedRow] = useState(null);

  const cisaData = data?.cisa_kev || [];
  const urlhausData = data?.urlhaus || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="border-b border-obsidian-700 pb-4">
        <h3 className="text-xl font-semibold text-white tracking-tight mb-1 font-sans">
          CTI Dashboard
        </h3>
        <p className="text-obsidian-500 text-[10px] uppercase tracking-[0.2em] font-mono">
          Active exploitation intelligence — CISA KEV · URLhaus · NVD
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-0">
        <button
          id="tab-cisa-kev"
          onClick={() => { setActiveTab('cisa'); setExpandedRow(null); }}
          className={`text-[10px] uppercase tracking-[0.15em] font-mono px-4 py-2 border transition-colors ${
            activeTab === 'cisa'
              ? 'border-obsidian-600 bg-obsidian-900 text-white'
              : 'border-obsidian-700 text-obsidian-500 hover:text-obsidian-300 hover:border-obsidian-600'
          }`}
        >
          CISA KEV ({cisaData.length})
        </button>
        <button
          id="tab-urlhaus"
          onClick={() => { setActiveTab('urlhaus'); setExpandedRow(null); }}
          className={`text-[10px] uppercase tracking-[0.15em] font-mono px-4 py-2 border border-l-0 transition-colors ${
            activeTab === 'urlhaus'
              ? 'border-obsidian-600 bg-obsidian-900 text-white'
              : 'border-obsidian-700 text-obsidian-500 hover:text-obsidian-300 hover:border-obsidian-600'
          }`}
        >
          URLhaus ({urlhausData.length})
        </button>
      </div>

      {/* ── CISA KEV Table ── */}
      {activeTab === 'cisa' && (
        <div className="stagger-fade space-y-1">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-3 px-4 py-2 text-[9px] text-obsidian-500 uppercase tracking-[0.15em] font-mono border-b border-obsidian-700">
            <div className="col-span-2">CVE ID</div>
            <div className="col-span-2">Vendor</div>
            <div className="col-span-3">Vulnerability</div>
            <div className="col-span-2">Product</div>
            <div className="col-span-1">Added</div>
            <div className="col-span-2">Due Date</div>
          </div>

          {/* Rows */}
          {cisaData.map((entry, i) => (
            <div key={i}>
              <div
                className={`grid grid-cols-12 gap-3 px-4 py-2.5 cursor-pointer transition-colors border-l-2 ${
                  expandedRow === i
                    ? 'bg-obsidian-900/60 border-l-threat-critical'
                    : 'hover:bg-obsidian-900/30 border-l-transparent'
                }`}
                onClick={() => setExpandedRow(expandedRow === i ? null : i)}
              >
                <div className="col-span-2 font-mono text-[11px] text-threat-critical font-medium">
                  {entry.cveID}
                </div>
                <div className="col-span-2 text-obsidian-300 text-xs truncate">
                  {entry.vendorProject}
                </div>
                <div className="col-span-3 text-obsidian-200 text-xs truncate">
                  {entry.vulnerabilityName}
                </div>
                <div className="col-span-2 text-obsidian-400 text-xs font-mono truncate">
                  {entry.product}
                </div>
                <div className="col-span-1 text-obsidian-500 text-[10px] font-mono">
                  {formatDate(entry.dateAdded)}
                </div>
                <div className="col-span-2 text-obsidian-500 text-[10px] font-mono">
                  {formatDate(entry.dueDate)}
                </div>
              </div>

              {/* Expanded Detail */}
              {expandedRow === i && (
                <div className="px-4 py-3 bg-obsidian-950 border-l-2 border-l-obsidian-700 ml-0 animate-slide-up">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-[9px] text-obsidian-500 uppercase tracking-widest font-mono mb-1">Description</p>
                      <p className="text-obsidian-300 text-xs leading-relaxed">
                        {entry.shortDescription}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] text-obsidian-500 uppercase tracking-widest font-mono mb-1">Required Action</p>
                      <p className="text-obsidian-300 text-xs leading-relaxed">
                        {entry.requiredAction}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── URLhaus Table ── */}
      {activeTab === 'urlhaus' && (
        <div className="stagger-fade space-y-1">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-3 px-4 py-2 text-[9px] text-obsidian-500 uppercase tracking-[0.15em] font-mono border-b border-obsidian-700">
            <div className="col-span-5">URL</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Threat</div>
            <div className="col-span-1">Tags</div>
            <div className="col-span-2">Date Added</div>
          </div>

          {/* Rows */}
          {urlhausData.map((entry, i) => (
            <div
              key={i}
              className="grid grid-cols-12 gap-3 px-4 py-2.5 hover:bg-obsidian-900/30 transition-colors"
            >
              <div className="col-span-5 font-mono text-[10px] text-obsidian-300 truncate" title={entry.url}>
                {entry.url}
              </div>
              <div className="col-span-2">
                <span className={`inline-flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-mono ${
                  entry.url_status === 'online' ? 'text-threat-online' : 'text-threat-offline'
                }`}>
                  <span className={`w-1 h-1 rounded-full ${
                    entry.url_status === 'online' ? 'bg-threat-online' : 'bg-threat-offline'
                  }`} />
                  {entry.url_status}
                </span>
              </div>
              <div className="col-span-2 text-obsidian-400 text-[10px] font-mono">
                {entry.threat}
              </div>
              <div className="col-span-1 flex flex-wrap gap-1">
                {(entry.tags || []).slice(0, 2).map((tag, ti) => (
                  <span key={ti} className="text-[8px] px-1.5 py-0.5 bg-obsidian-800 text-obsidian-400 font-mono">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="col-span-2 text-obsidian-500 text-[10px] font-mono">
                {formatDate(entry.date_added)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Entry count */}
      <div className="pt-4 border-t border-obsidian-700">
        <p className="text-[9px] text-obsidian-600 uppercase tracking-[0.2em] font-mono">
          {activeTab === 'cisa'
            ? `${cisaData.length} actively exploited vulnerabilities tracked`
            : `${urlhausData.length} malware distribution urls monitored`
          }
        </p>
      </div>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  } catch {
    return dateStr;
  }
}

