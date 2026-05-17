import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import api from '../../utils/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DonationTransparency() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/charity/transparency').then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const chartData = data ? {
    labels: (data.campaigns || []).map(c => c.title),
    datasets: [
      { label: 'Raised (₹)', data: (data.campaigns || []).map(c => c.raised), backgroundColor: 'rgba(13,107,118,0.8)' },
      { label: 'Distributed (₹)', data: (data.campaigns || []).map(c => c.distributed), backgroundColor: 'rgba(201,162,39,0.8)' },
    ]
  } : null;

  const stats = data?.summary || {};

  return (
    <div>
      <h1 className="font-display text-3xl text-civic-navy mb-2">Donation Transparency Dashboard</h1>
      <p className="text-slate-600 mb-8">Live view of all donations raised, distributed, active campaigns, and beneficiaries helped.</p>

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />)}</div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Raised', value: `₹${(stats.total_raised || 0).toLocaleString()}`, color: 'emerald' },
              { label: 'Total Distributed', value: `₹${(stats.total_distributed || 0).toLocaleString()}`, color: 'teal' },
              { label: 'Active Campaigns', value: stats.active_campaigns || 0, color: 'blue' },
              { label: 'Families Helped', value: stats.beneficiaries || 0, color: 'amber' },
            ].map(s => (
              <div key={s.label} className={`bg-${s.color}-50 border border-${s.color}-100 rounded-xl p-5 text-center`}>
                <p className={`text-3xl font-bold text-${s.color}-700`}>{s.value}</p>
                <p className={`text-xs font-semibold text-${s.color}-600 mt-1 uppercase tracking-wider`}>{s.label}</p>
              </div>
            ))}
          </div>

          {chartData && chartData.labels.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
              <h2 className="font-semibold text-civic-navy mb-4">Campaign-wise Breakdown</h2>
              <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
            </div>
          )}

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h2 className="font-semibold text-civic-navy">Recent Donations</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {(data?.recent_donations || []).map(d => (
                <div key={d.id} className="px-6 py-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-slate-800">{d.donor_name || 'Anonymous Donor'}</p>
                    <p className="text-xs text-slate-500">{d.campaign || 'General Fund'} · {d.created_at ? new Date(d.created_at).toLocaleDateString() : ''}</p>
                  </div>
                  <p className="font-bold text-emerald-600">₹{(d.amount || 0).toLocaleString()}</p>
                </div>
              ))}
              {(!data?.recent_donations || data.recent_donations.length === 0) && (
                <p className="px-6 py-8 text-center text-slate-400 text-sm">No donations recorded yet.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
