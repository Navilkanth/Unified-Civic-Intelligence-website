import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function Sponsors() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/charity/sponsors').then(r => { setSponsors(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl text-civic-navy mb-2">Our Donors & Sponsors</h1>
      <p className="text-slate-600 mb-8">Recognizing those who make welfare possible. Transparency builds trust and inspires others to contribute.</p>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-40 bg-slate-100 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sponsors.map(s => (
            <div key={s.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition text-center">
              <div className="h-16 w-16 rounded-full bg-civic-gold/10 border-2 border-civic-gold/30 flex items-center justify-center mx-auto mb-3 text-2xl">
                🤝
              </div>
              <h3 className="font-semibold text-civic-navy">{s.name}</h3>
              {s.organization && <p className="text-sm text-slate-500">{s.organization}</p>}
              {s.total_donated && (
                <p className="mt-2 text-lg font-bold text-civic-teal">₹{s.total_donated.toLocaleString()}</p>
              )}
              {s.appreciation_quote && (
                <p className="text-xs italic text-slate-400 mt-2">"{s.appreciation_quote}"</p>
              )}
            </div>
          ))}
          {sponsors.length === 0 && (
            <div className="col-span-3 py-16 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
              <p className="text-4xl mb-3">❤️</p>
              <p>Be the first to sponsor and appear here!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
