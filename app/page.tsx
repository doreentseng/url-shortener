'use client';

import { useState, useEffect } from 'react';

export default function ShortenerPage() {
  const [url, setUrl] = useState('');
  const [history, setHistory] = useState<{ short: string; long: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchHistory = async () => {
    const res = await fetch('/api/shorten');
    const data = await res.json();
    setHistory(data);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      if (res.ok) {
        setUrl('');
        await fetchHistory();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (short: string) => {
    const shortUrl = `${window.location.origin}/${short}`;
    navigator.clipboard.writeText(shortUrl);
    
    setCopiedId(short);
    
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">URL Shortener</h1>
          <p className="mt-1 text-slate-600">Ultra-fast redirection powered by Edge Runtime</p>
          <div className="mt-1 text-sm text-slate-400">
            by{' '}
            <a 
              href="https://doreentseng.github.io/"
              target="_blank" 
              rel="noopener noreferrer"
              className="text-teal-500 hover:text-teal-600 hover:underline transition-colors font-medium"
            >
              @doreentseng
            </a>
          </div>
        </header>

        {/* Input Section */}
        <section className="bg-white rounded-md shadow-sm border border-slate-200 p-6 mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              required
              placeholder="Paste a long URL (https://...)"
              className="flex-1 px-4 py-3 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-slate-700"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              disabled={loading}
              className="bg-teal-500 hover:bg-teal-700 text-white font-semibold px-8 py-3 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Processing...' : 'Shorten'}
            </button>
          </form>
          <p className="mt-3 text-sm text-slate-400 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            Shortened links will automatically expire after 30 days.
          </p>
        </section>

        <div className="mt-4 mb-4 flex items-start gap-3 bg-teal-50 border border-teal-100 p-4 rounded-md">
          <div className="text-teal-500 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          </div>
          <p className="text-sm text-teal-700 leading-relaxed">
            <strong>Quick Tip:</strong> After clicking &quot;Copy&quot;, paste the link into a <strong>new browser tab</strong> to verify the redirection works instantly!
          </p>
        </div>

        {/* Recent Activity Section */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">
            Recent Activity (Last 5)
          </h2>
          <div className="space-y-3">
            {history.map((item, index) => (
              <div 
                key={index} 
                className="bg-white p-4 rounded-md border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <p className="text-teal-600 font-mono font-medium truncate">
                    {window.location.origin}/{item.short}
                  </p>
                  <p className={`text-xs truncate mt-1 ${item.long ? 'text-slate-400' : 'text-red-500 font-medium'}`}>
                    {item.long || 'URL not found'}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(item.short)}
                  className={`text-sm px-4 py-2 rounded-md transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    copiedId === item.short 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-50 text-slate-600 hover:bg-teal-50 hover:text-teal-600'
                  }`}
                >
                  {copiedId === item.short ? 'Copied!' : 'Copy'}
                </button>
              </div>
            ))}
            {history.length === 0 && (
              <p className="text-center py-10 text-slate-400 italic">No records found yet</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}