import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import Parser from 'rss-parser';

// Polyfill fetch for older Node versions if needed
if (!globalThis.fetch) {
  const nodeFetch = await import('node-fetch');
  globalThis.fetch = nodeFetch.default;
}

const parser = new Parser();

// Paths
const PUBLIC_DIR = path.join(process.cwd(), 'public', 'data');
const STATE_FILE = path.join(PUBLIC_DIR, 'terminal-state.json');
const CORPUS_DIR = path.join(process.cwd(), 'src', 'philosophy_corpus');

// Connective tissue for cut-up engine
const CONNECTIVE_TISSUE = [
  '...as', 'while', 'because', 'therefore', 'the system notes that',
  'meanwhile', 'consequently', 'despite', 'within which', 'insofar as',
  'as if', 'not unlike', 'in the void where', 'underneath',
  'the signal resolves into', 'which is to say'
];

async function fetchCisaKev() {
  try {
    console.log('[HARVEST] Fetching CISA KEV...');
    const res = await fetch('https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json');
    const data = await res.json();
    return data.vulnerabilities.slice(0, 15);
  } catch (err) {
    console.warn(`[ERROR] Failed to fetch CISA KEV: ${err.message}`);
    return [];
  }
}

async function fetchUrlhaus() {
  try {
    console.log('[HARVEST] Fetching URLhaus...');
    const res = await fetch('https://urlhaus-api.abuse.ch/v1/urls/recent/', {
      method: 'POST'
    });
    const data = await res.json();
    return (data.urls || []).slice(0, 20);
  } catch (err) {
    console.warn(`[ERROR] Failed to fetch URLhaus: ${err.message}`);
    return [];
  }
}

async function fetchWorldMonitor() {
  const feeds = [
    { url: 'https://www.aljazeera.com/xml/rss/all.xml', source: 'Al Jazeera' },
    { url: 'http://feeds.bbci.co.uk/news/world/rss.xml', source: 'BBC' },
    { url: 'https://feeds.reuters.com/reuters/worldNews', source: 'Reuters' },
    { url: 'https://theintercept.com/feed/?rss', source: 'The Intercept' },
    { url: 'https://osintindustries.net/feed/', source: 'OSINT Industries' }
  ];

  const results = [];
  for (const feed of feeds) {
    try {
      console.log(`[HARVEST] Fetching ${feed.source}...`);
      const parsed = await parser.parseURL(feed.url);
      const items = parsed.items.slice(0, 5).map(item => ({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate || item.isoDate,
        source: feed.source,
        summary: item.contentSnippet?.slice(0, 250) || ''
      }));
      results.push(...items);
    } catch (err) {
      console.warn(`[ERROR] Failed to fetch ${feed.source}: ${err.message}`);
    }
  }
  return results.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
}

async function fetchSyndication() {
  // Using some placeholder/example feeds
  const feeds = [
    { url: 'https://krebsonsecurity.com/feed/', author: 'KrebsOnSecurity' },
    { url: 'https://www.schneier.com/feed/atom/', author: 'Schneier on Security' }
  ];

  const results = [];
  for (const feed of feeds) {
    try {
      console.log(`[HARVEST] Fetching Syndication ${feed.author}...`);
      const parsed = await parser.parseURL(feed.url);
      const items = parsed.items.slice(0, 3).map(item => ({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate || item.isoDate,
        author: feed.author,
        content: item.contentSnippet?.slice(0, 300) || ''
      }));
      results.push(...items);
    } catch (err) {
      console.warn(`[ERROR] Failed to fetch ${feed.author}: ${err.message}`);
    }
  }
  return results.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
}

async function fetchSyndicateJournal() {
  const feeds = [
    { url: 'https://daily.jstor.org/feed/', domain: 'history', label: 'JSTOR Daily' },
    { url: 'https://www.sapiens.org/feed/', domain: 'anthropology', label: 'Sapiens' },
    { url: 'https://nautil.us/feed/', domain: 'science', label: 'Nautilus' },
    { url: 'https://www.quantamagazine.org/feed/', domain: 'science', label: 'Quanta' },
    { url: 'https://aeon.co/feed.rss', domain: 'philosophy', label: 'Aeon' },
    { url: 'https://www.bostonreview.net/feed', domain: 'sociology', label: 'Boston Review' },
    { url: 'https://behavioralscientist.org/feed/', domain: 'psychology', label: 'Behavioral Scientist' },
    { url: 'https://publicdomainreview.org/feed/', domain: 'history', label: 'Public Domain Review' },
    { url: 'https://languagelog.ldc.upenn.edu/nll/?feed=rss2', domain: 'linguistics', label: 'Language Log' },
    { url: 'https://roarmag.org/feed/', domain: 'politics', label: 'ROAR Magazine' },
    { url: 'https://arxiv.org/rss/cs.AI', domain: 'science', label: 'arXiv: cs.AI' },
    { url: 'https://www.frontiersin.org/journals/psychology/rss', domain: 'psychology', label: 'Frontiers Psychology' }
  ];

  const results = [];
  for (const feed of feeds) {
    try {
      console.log(`[HARVEST] Fetching Journal ${feed.label}...`);
      const parsed = await parser.parseURL(feed.url);
      const items = parsed.items.slice(0, 3).map(item => ({
        title: item.title || '',
        link: item.link || '',
        summary: item.contentSnippet?.slice(0, 300) || item.summary?.slice(0, 300) || '',
        pubDate: item.pubDate || item.isoDate || '',
        domain: feed.domain,
        source: feed.label,
      }));
      results.push(...items);
    } catch (err) {
      console.warn(`[ERROR] Failed to fetch Journal ${feed.label}: ${err.message}`);
    }
  }
  return results.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
}

function processMisinfoToilet(headlines) {
  console.log('[HARVEST] Processing Misinfo Toilet cut-ups...');
  
  // Read corpus
  let corpus = [];
  try {
    const files = fs.readdirSync(CORPUS_DIR);
    for (const file of files) {
      if (file.endsWith('.md')) {
        const content = fs.readFileSync(path.join(CORPUS_DIR, file), 'utf8');
        const sentences = content.split('\n').map(s => s.trim()).filter(s => s.length > 10);
        corpus.push(...sentences);
      }
    }
  } catch (err) {
    console.warn(`[ERROR] Failed to read corpus: ${err.message}`);
    // Provide fallback corpus if empty
    if (corpus.length === 0) {
      corpus = ["The future is already here, it's just not evenly distributed."];
    }
  }

  // Generate deterministic seed based on current hour
  const d = new Date();
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate() + d.getHours();
  
  // Simple seeded random function
  const seededRandom = (s) => {
    const x = Math.sin(s++) * 10000;
    return x - Math.floor(x);
  };
  
  let currentSeed = seed;

  const results = [];
  const numBlocks = Math.min(10, headlines.length);

  for (let i = 0; i < numBlocks; i++) {
    const headline = headlines[Math.floor(seededRandom(currentSeed++) * headlines.length)]?.title || "Unknown signal";
    const fragment = corpus[Math.floor(seededRandom(currentSeed++) * corpus.length)] || "Void fragment.";
    const connective = CONNECTIVE_TISSUE[Math.floor(seededRandom(currentSeed++) * CONNECTIVE_TISSUE.length)];
    
    // Lowercase first letter of fragment if it starts with a letter
    const lowerFragment = fragment.charAt(0).toLowerCase() + fragment.slice(1);
    
    results.push({
      headline,
      fragment,
      splice: `${headline} ${connective} ${lowerFragment}`,
      seed: seed + i
    });
  }

  return results;
}

async function run() {
  console.log('--- HARVEST CYCLE INITIATED ---');
  
  const state = {
    generated_at: new Date().toISOString(),
    threat_intel: {
      cisa_kev: [],
      urlhaus: []
    },
    world_monitor: [],
    syndication: [],
    syndicate_journal: [],
    misinfo_toilet: []
  };

  // Run fetches concurrently
  const [cisa, urlhaus, worldMonitor, syndication, journal] = await Promise.all([
    fetchCisaKev(),
    fetchUrlhaus(),
    fetchWorldMonitor(),
    fetchSyndication(),
    fetchSyndicateJournal()
  ]);

  state.threat_intel.cisa_kev = cisa;
  state.threat_intel.urlhaus = urlhaus;
  state.world_monitor = worldMonitor;
  state.syndication = syndication;
  state.syndicate_journal = journal;

  // Process cut-ups using world monitor headlines
  state.misinfo_toilet = processMisinfoToilet(worldMonitor);

  // Write to state file
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
  console.log(`[HARVEST] State written to ${STATE_FILE}`);
  console.log('--- HARVEST CYCLE COMPLETE ---');
}

run().catch(console.error);
