import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function TVKNews() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tvk/news').then(r => { setItems(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-display text-3xl text-civic-navy">Live TVK Updates</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time announcements, speeches, and campaign news</p>
        </div>
        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-full">
          <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span> Live
        </span>
      </div>

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-28 bg-slate-100 rounded-xl animate-pulse" />)}</div>
      ) : (
        <div className="space-y-4">
          {items.map(item => (
            <article key={item.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="text-xs text-civic-teal font-semibold uppercase tracking-wider mb-1">{item.category || 'Announcement'}</p>
                  <h2 className="font-semibold text-civic-navy text-lg">{item.title}</h2>
                  <p className="text-slate-600 text-sm mt-2 leading-relaxed">{item.body}</p>
                </div>
                <div className="text-xs text-slate-400 whitespace-nowrap">{item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}</div>
              </div>
            </article>
          ))}
          {items.length === 0 && (
            <div className="py-16 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
              <p className="text-4xl mb-3">📢</p>
              <p>No announcements yet. Check back soon.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
