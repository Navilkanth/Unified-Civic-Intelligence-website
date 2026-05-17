import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';

export default function WardDashboard() {
  const { wardId } = useParams();
  const [wards, setWards] = useState([]);
  const [selectedWard, setSelectedWard] = useState(wardId ? Number(wardId) : null);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    api.get('/governance/wards').then(res => setWards(res.data)).catch(console.error);
  }, []);

  const loadWard = (id) => {
    setSelectedWard(id);
    api.get(`/governance/wards/${id}/dashboard`)
      .then(res => setDashboardData(res.data))
      .catch(console.error);
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-civic-navy mb-4">Hyperlocal Ward Dashboard</h1>
      <p className="text-slate-600 mb-6">Select a ward to view its governance scores, recent complaints, and acquisition notices.</p>

      <div className="flex flex-wrap gap-2 mb-8">
        {wards.map(w => (
          <button 
            key={w.id} 
            onClick={() => loadWard(w.id)}
            className={`px-4 py-2 rounded-lg text-sm transition ${
              selectedWard === w.id ? 'bg-civic-teal text-white' : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            Ward {w.code}
          </button>
        ))}
      </div>

      {dashboardData && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-display text-civic-navy mb-4">{dashboardData.ward.name_en} ({dashboardData.ward.name_ta})</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-red-50 rounded-lg text-center">
                <p className="text-xs text-red-600 font-semibold uppercase tracking-wider">Complaint Score</p>
                <p className="text-3xl font-bold text-red-700 mt-2">{dashboardData.ward.complaint_score.toFixed(1)}</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-lg text-center">
                <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">Development</p>
                <p className="text-3xl font-bold text-emerald-700 mt-2">{dashboardData.ward.development_score.toFixed(1)}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Cleanliness</p>
                <p className="text-3xl font-bold text-blue-700 mt-2">{dashboardData.ward.cleanliness_score.toFixed(1)}</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg text-center">
                <p className="text-xs text-amber-600 font-semibold uppercase tracking-wider">Happiness Index</p>
                <p className="text-3xl font-bold text-amber-700 mt-2">{dashboardData.ward.happiness_index.toFixed(1)}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-civic-navy mb-4">Recent AI-Analyzed Complaints</h3>
              <ul className="space-y-3">
                {dashboardData.complaints.map(c => (
                  <li key={c.id} className="text-sm">
                    <p className="font-medium text-slate-800">{c.title}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Category: {c.ai_category || 'Unclassified'} | Sentiment: {c.sentiment_score !== null ? c.sentiment_score : 'N/A'}
                    </p>
                  </li>
                ))}
                {dashboardData.complaints.length === 0 && <li className="text-sm text-slate-500">No complaints reported.</li>}
              </ul>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-civic-navy mb-4">Land Acquisition Alerts</h3>
              <ul className="space-y-3">
                {dashboardData.alerts.map(a => (
                  <li key={a.id} className="text-sm p-3 bg-amber-50 border border-amber-100 rounded-lg">
                    <p className="font-medium text-amber-900">{a.title}</p>
                    <p className="text-xs text-amber-700 mt-1">Effective: {a.effective_date || 'TBD'}</p>
                  </li>
                ))}
                {dashboardData.alerts.length === 0 && <li className="text-sm text-slate-500">No active acquisition alerts.</li>}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
