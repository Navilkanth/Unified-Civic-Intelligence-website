import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function TrustLedger() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/charity/ledger').then(r => { setEntries(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? entries : entries.filter(e => e.entry_type === filter);
  const TYPE_COLORS = {
    donation: 'emerald',
    beneficiary: 'blue',
    expense: 'amber',
    invoice: 'purple',
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-civic-navy mb-2">Public Trust Ledger</h1>
      <p className="text-slate-600 mb-2">Immutable record of every donation, beneficiary served, and invoice — full financial transparency.</p>
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Blockchain verification:</span>
        <span className="text-xs bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-full">Coming Soon</span>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['all','donation','beneficiary','expense','invoice'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm capitalize transition ${filter === f ? 'bg-civic-navy text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />)}</div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filtered.map(e => {
              const color = TYPE_COLORS[e.entry_type] || 'slate';
              return (
                <div key={e.id} className="px-5 py-4 flex items-center gap-4">
                  <span className={`px-2 py-0.5 text-xs font-semibold bg-${color}-50 text-${color}-700 border border-${color}-100 rounded-full capitalize`}>
                    {e.entry_type}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">{e.description || 'Record'}</p>
                    {e.reference && <p className="text-xs text-slate-400 mt-0.5">Ref: {e.reference}</p>}
                  </div>
                  <div className="text-right">
                    {e.amount && <p className="font-bold text-slate-700">₹{Number(e.amount).toLocaleString()}</p>}
                    <p className="text-xs text-slate-400">{e.created_at ? new Date(e.created_at).toLocaleDateString() : ''}</p>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <p className="py-12 text-center text-slate-400 text-sm">No ledger entries found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
