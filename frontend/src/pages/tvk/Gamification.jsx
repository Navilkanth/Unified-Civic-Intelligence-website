import { useState, useEffect } from 'react';
import api from '../../utils/api';

const MEDAL_ICONS = { gold: '🥇', silver: '🥈', bronze: '🥉' };

export default function Gamification() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tvk/gamification').then(r => { setLeaderboard(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl text-civic-navy mb-2">🏆 Volunteer Gamification</h1>
      <p className="text-slate-600 mb-8">Earn points, medals, and badges for your contributions. Rise in the rankings!</p>

      {/* Achievement badges */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: '⭐', title: 'Top Volunteer', desc: 'Most tasks completed this month' },
          { icon: '🩸', title: 'Blood Donation Champion', desc: 'Led 3+ blood donation drives' },
          { icon: '🏟', title: 'Best Booth Coordinator', desc: 'Highest booth coverage score' },
        ].map(b => (
          <div key={b.title} className="bg-gradient-to-br from-civic-navy to-civic-teal text-white rounded-xl p-5 shadow">
            <div className="text-4xl mb-2">{b.icon}</div>
            <h3 className="font-semibold">{b.title}</h3>
            <p className="text-xs text-blue-100 mt-1">{b.desc}</p>
          </div>
        ))}
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h2 className="font-semibold text-civic-navy">District Leaderboard</h2>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-slate-100 rounded animate-pulse" />)}</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {leaderboard.map((v, idx) => (
              <div key={v.id || idx} className={`flex items-center gap-4 px-6 py-4 ${idx < 3 ? 'bg-civic-gold/5' : ''}`}>
                <span className="w-8 text-center font-bold text-lg">
                  {MEDAL_ICONS[['gold','silver','bronze'][idx]] || `#${idx + 1}`}
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{v.name || `Volunteer #${v.id}`}</p>
                  <p className="text-xs text-slate-500">{v.district || 'Unknown district'}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-civic-teal text-lg">{v.points || 0}</p>
                  <p className="text-xs text-slate-400">points</p>
                </div>
              </div>
            ))}
            {leaderboard.length === 0 && (
              <div className="py-12 text-center text-slate-400">
                <p className="text-3xl mb-2">🏅</p>
                <p>Leaderboard will populate as volunteers earn points.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
