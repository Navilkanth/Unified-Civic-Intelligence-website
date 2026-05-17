import { useState, useEffect } from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import api from '../../utils/api';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Specific Tab states
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [welfareReqs, setWelfareReqs] = useState([]);
  const [donations, setDonations] = useState([]);
  const [volunteerData, setVolunteerData] = useState({ charity_activities: [], tvk_tasks: [] });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [statsRes, wardsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/governance/wards'),
      ]);
      setStats(statsRes.data);
      setWards(wardsRes.data);
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  // Lazy tab loader
  useEffect(() => {
    if (activeTab === 'complaints') fetchComplaints();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'welfare') fetchWelfare();
    if (activeTab === 'donations') fetchDonations();
    if (activeTab === 'volunteers') fetchVolunteers();
  }, [activeTab]);

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/admin/complaints');
      setComplaints(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchWelfare = async () => {
    try {
      const res = await api.get('/admin/welfare');
      setWelfareReqs(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchDonations = async () => {
    try {
      const res = await api.get('/admin/donations');
      setDonations(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchVolunteers = async () => {
    try {
      const res = await api.get('/admin/activities');
      setVolunteerData(res.data);
    } catch (err) { console.error(err); }
  };

  // Action handlers
  const handleComplaintStatus = async (complaintId, newStatus) => {
    setMessage('');
    setError('');
    try {
      await api.post(`/admin/complaints/${complaintId}/status`, { status: newStatus });
      setMessage('Complaint status updated successfully!');
      fetchComplaints();
      fetchInitialData();
    } catch (err) {
      setError('Failed to update complaint status.');
    }
  };

  const handleUserStatus = async (userId, payload) => {
    setMessage('');
    setError('');
    try {
      await api.post(`/admin/users/${userId}/status`, payload);
      setMessage('User updated successfully!');
      fetchUsers();
      fetchInitialData();
    } catch (err) {
      setError('Failed to update user configuration.');
    }
  };

  const handleWelfareStatus = async (requestId, newStatus) => {
    setMessage('');
    setError('');
    try {
      await api.post(`/admin/welfare/${requestId}/status`, { status: newStatus });
      setMessage(`Welfare request successfully ${newStatus}!`);
      fetchWelfare();
      fetchInitialData();
    } catch (err) {
      setError('Failed to process welfare request.');
    }
  };

  const radarData = wards.length ? {
    labels: wards.slice(0, 6).map(w => w.code),
    datasets: [{
      label: 'Development Score',
      data: wards.slice(0, 6).map(() => Math.floor(Math.random() * 50 + 40)),
      backgroundColor: 'rgba(13,107,118,0.2)',
      borderColor: '#0d6b76',
      pointBackgroundColor: '#0d6b76',
    }]
  } : null;

  const STAT_CARDS = stats ? [
    { label: 'Total Users', value: stats.total_users ?? 0, icon: '👥', color: 'indigo' },
    { label: 'Total Complaints', value: stats.total_complaints ?? 0, icon: '📋', color: 'rose' },
    { label: 'Active Projects', value: stats.active_projects ?? 0, icon: '🏗', color: 'amber' },
    { label: 'Welfare Requests', value: stats.welfare_requests ?? 0, icon: '🤲', color: 'emerald' },
    { label: 'Total Donations', value: `₹${(stats.total_donations ?? 0).toLocaleString()}`, icon: '💰', color: 'purple' },
    { label: 'Volunteers Registered', value: stats.volunteers ?? 0, icon: '🙋', color: 'teal' },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="font-display text-4xl text-civic-navy font-bold tracking-tight">Admin Operations Suite</h1>
          <p className="text-slate-500 text-sm mt-1">Platform-wide governance audit, user administration and service triage</p>
        </div>
        <span className="bg-civic-teal text-white font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-wider shadow-sm shrink-0">
          🔑 Secure Administrator Session
        </span>
      </div>

      {/* Operation Tabs Navigation */}
      <div className="flex overflow-x-auto border-b border-slate-200 gap-2 mb-8 pb-px">
        {[
          { id: 'overview', label: '📊 Stats & Radar', icon: '📊' },
          { id: 'complaints', label: '📋 Complaints Manager', icon: '📋' },
          { id: 'users', label: '👥 User Registry', icon: '👥' },
          { id: 'welfare', label: '🤲 Welfare Triage', icon: '🤲' },
          { id: 'donations', label: '💰 Donation Ledger', icon: '💰' },
          { id: 'volunteers', label: '🙋 Volunteer Tracker', icon: '🙋' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => { setActiveTab(t.id); setMessage(''); setError(''); }}
            className={`px-5 py-3 border-b-2 font-semibold text-sm transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === t.id
                ? 'border-civic-teal text-civic-teal'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Global Action alerts */}
      {message && (
        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl border border-green-200 mb-6 font-medium text-sm flex items-center gap-2 animate-fadeIn">
          <span>🎉</span> {message}
        </div>
      )}
      {error && (
        <div className="bg-rose-50 text-rose-700 px-4 py-3 rounded-xl border border-rose-200 mb-6 font-medium text-sm flex items-center gap-2 animate-fadeIn">
          <span>⚠️</span> {error}
        </div>
      )}

      {loading ? (
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-28 bg-slate-100 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {STAT_CARDS.map(s => (
                  <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-civic-teal transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
                        <p className="text-3xl font-extrabold text-civic-navy mt-2">{s.value}</p>
                      </div>
                      <span className="text-3xl bg-slate-50 p-2.5 rounded-xl border border-slate-100 shadow-inner">{s.icon}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {radarData && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-center">
                    <h2 className="font-bold text-lg text-civic-navy mb-4 flex items-center gap-2">
                      <span>📈</span> Ward Development Indices
                    </h2>
                    <div className="max-w-md mx-auto w-full">
                      <Radar data={radarData} options={{ scales: { r: { beginAtZero: true, max: 100 } } }} />
                    </div>
                  </div>
                )}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h2 className="font-bold text-lg text-civic-navy mb-4 flex items-center gap-2">
                    <span>📡</span> Smart Governance Alerts
                  </h2>
                  <div className="space-y-4">
                    {[
                      { signal: 'Elevated complaint frequency registered in North Zone (Ward 101)', level: 'high', time: '10m ago' },
                      { signal: 'AI sentiment detection reports high frustration levels in sewage categories', level: 'high', time: '1h ago' },
                      { signal: 'Volunteer attendance requirements met for SMART road resurfacing drive', level: 'low', time: '3h ago' },
                      { signal: 'Welfare scholarship requests surge — 12 pending approval', level: 'medium', time: '5h ago' },
                    ].map((s, i) => (
                      <div key={i} className={`flex items-start justify-between gap-4 p-4 rounded-xl border ${
                        s.level === 'high'
                          ? 'bg-red-50/50 border-red-100'
                          : s.level === 'medium'
                          ? 'bg-amber-50/50 border-amber-100'
                          : 'bg-emerald-50/50 border-emerald-100'
                      }`}>
                        <div className="flex items-center gap-3">
                          <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${s.level === 'high' ? 'bg-red-500' : s.level === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                          <p className="text-sm font-semibold text-slate-700">{s.signal}</p>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 shrink-0 uppercase">{s.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COMPLAINTS */}
          {activeTab === 'complaints' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="font-bold text-lg text-civic-navy">Public Complaint Queue</h2>
                <p className="text-slate-400 text-xs mt-1">Review citizens reported grievances, automatic NLP classifications, and update status</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-500">
                  <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-xs">
                    <tr>
                      <th className="px-6 py-4">Title & Description</th>
                      <th className="px-6 py-4">Ward</th>
                      <th className="px-6 py-4">AI Sentiment & Cat</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {complaints.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-slate-400">No public complaints found.</td>
                      </tr>
                    ) : (
                      complaints.map(c => (
                        <tr key={c.id} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4 max-w-md">
                            <p className="font-bold text-slate-800 text-sm">{c.title}</p>
                            <p className="text-slate-500 text-xs mt-1 leading-relaxed line-clamp-2">{c.body}</p>
                            <span className="text-[10px] text-slate-400 mt-2 block">Reported: {new Date(c.created_at).toLocaleString()}</span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-700 text-xs">{c.ward_name}</td>
                          <td className="px-6 py-4 space-y-1">
                            <span className="bg-civic-mist text-civic-teal px-2 py-0.5 rounded-full text-[10px] font-bold uppercase block w-fit">
                              🤖 {c.ai_category || 'Unclassified'}
                            </span>
                            <span className={`text-[10px] font-bold block ${c.sentiment_score < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                              Sentiment: {c.sentiment_score ?? 0.0}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                              c.status === 'resolved' ? 'bg-green-50 text-green-700' :
                              c.status === 'in_review' ? 'bg-amber-50 text-amber-700' :
                              c.status === 'rejected' ? 'bg-slate-100 text-slate-600' :
                              'bg-rose-50 text-rose-700'
                            }`}>
                              {c.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <select
                              value={c.status}
                              onChange={(e) => handleComplaintStatus(c.id, e.target.value)}
                              className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-civic-teal"
                            >
                              <option value="open">🔓 Open</option>
                              <option value="in_review">🔍 Review</option>
                              <option value="resolved">✅ Resolve</option>
                              <option value="rejected">❌ Reject</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: USERS */}
          {activeTab === 'users' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="font-bold text-lg text-civic-navy">User Management</h2>
                <p className="text-slate-400 text-xs mt-1">Review registered citizens, manage security roles, or toggle account status</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-500">
                  <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-xs">
                    <tr>
                      <th className="px-6 py-4">Name & Email</th>
                      <th className="px-6 py-4">Phone</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Account Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800 text-sm">{u.full_name}</p>
                          <p className="text-slate-400 text-xs mt-0.5">{u.email}</p>
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-slate-600">{u.phone || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {u.is_active ? 'Active' : 'Suspended'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                          <button
                            onClick={() => handleUserStatus(u.id, { is_active: !u.is_active })}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                              u.is_active ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'
                            }`}
                          >
                            {u.is_active ? 'Suspend' : 'Activate'}
                          </button>
                          <select
                            value={u.role}
                            onChange={(e) => handleUserStatus(u.id, { role: e.target.value })}
                            className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
                          >
                            <option value="citizen">Citizen</option>
                            <option value="volunteer">Volunteer</option>
                            <option value="councillor">Councillor</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: WELFARE REQUESTS */}
          {activeTab === 'welfare' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="font-bold text-lg text-civic-navy">Welfare Triage & AI Scheme Suggestions</h2>
                <p className="text-slate-400 text-xs mt-1">Review scholarship, food or medical aid applications verified against public schemes</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-500">
                  <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-xs">
                    <tr>
                      <th className="px-6 py-4">Applicant & Description</th>
                      <th className="px-6 py-4">Aid Category</th>
                      <th className="px-6 py-4">AI Welfare Matches</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Approve / Reject</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {welfareReqs.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-slate-400">No aid requests pending.</td>
                      </tr>
                    ) : (
                      welfareReqs.map(w => (
                        <tr key={w.id} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4 max-w-sm">
                            <p className="font-bold text-slate-800 text-sm">{w.user_name}</p>
                            <p className="text-slate-500 text-xs mt-1 leading-relaxed line-clamp-3">{w.narrative}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                              {w.request_type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-slate-600 text-xs font-semibold max-w-xs">{w.ai_scheme_suggestions || 'No scheme suggestions'}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                              w.status === 'approved' ? 'bg-green-50 text-green-700' :
                              w.status === 'rejected' ? 'bg-slate-100 text-slate-600' :
                              'bg-rose-50 text-rose-700'
                            }`}>
                              {w.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => handleWelfareStatus(w.id, 'approved')}
                              disabled={w.status === 'approved'}
                              className="px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 disabled:opacity-50 text-xs font-semibold rounded-lg transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleWelfareStatus(w.id, 'rejected')}
                              disabled={w.status === 'rejected'}
                              className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 disabled:opacity-50 text-xs font-semibold rounded-lg transition"
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: DONATIONS */}
          {activeTab === 'donations' && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="font-bold text-lg text-civic-navy">Public Donation Audits</h2>
                <p className="text-slate-400 text-xs mt-1">Review financial records fully synchronized with our immutable public audit trust ledger</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-500">
                  <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-xs">
                    <tr>
                      <th className="px-6 py-4">Transaction ID</th>
                      <th className="px-6 py-4">Donor</th>
                      <th className="px-6 py-4">Campaign</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Ledger Ref Code</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {donations.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-slate-400">No public donations found.</td>
                      </tr>
                    ) : (
                      donations.map(d => (
                        <tr key={d.id} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4 text-xs font-bold text-slate-400">#DON-{d.id}</td>
                          <td className="px-6 py-4 font-bold text-slate-700 text-sm">{d.donor_name}</td>
                          <td className="px-6 py-4 text-slate-600 text-xs font-semibold">{d.campaign_name}</td>
                          <td className="px-6 py-4 font-bold text-emerald-600">₹{d.amount.toLocaleString()}</td>
                          <td className="px-6 py-4 text-xs font-mono text-slate-400">{d.ledger_ref || 'GENERAL-LEDGER'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: VOLUNTEERS */}
          {activeTab === 'volunteers' && (
            <div className="space-y-8">
              {/* Part A: Charity Activities */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h2 className="font-bold text-lg text-civic-navy">Charitable Service Log Feed</h2>
                  <p className="text-slate-400 text-xs mt-1">Review hours worked and achievements reported by volunteers on our charity ledger</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-500">
                    <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-xs">
                      <tr>
                        <th className="px-6 py-4">Volunteer Name</th>
                        <th className="px-6 py-4">Activity Type</th>
                        <th className="px-6 py-4">Hours Served</th>
                        <th className="px-6 py-4">Service Notes</th>
                        <th className="px-6 py-4">Logged Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {volunteerData.charity_activities.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-12 text-center text-slate-400">No charity hours logged.</td>
                        </tr>
                      ) : (
                        volunteerData.charity_activities.map(a => (
                          <tr key={a.id} className="hover:bg-slate-50/50">
                            <td className="px-6 py-4 font-bold text-slate-800 text-sm">{a.volunteer_name}</td>
                            <td className="px-6 py-4 text-xs">
                              <span className="bg-teal-50 text-teal-700 px-2.5 py-0.5 rounded-full font-semibold uppercase">
                                {a.activity_type.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-bold text-slate-700 text-sm">⏱ {a.hours} hrs</td>
                            <td className="px-6 py-4 text-slate-500 text-xs italic">{a.notes || 'N/A'}</td>
                            <td className="px-6 py-4 text-[10px] text-slate-400 font-semibold">{new Date(a.created_at).toLocaleString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Part B: TVK tasks completion */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h2 className="font-bold text-lg text-civic-navy">TVK Singapadai Active Tasks</h2>
                  <p className="text-slate-400 text-xs mt-1">Grooming grassroots mobilization, voter campaigns, and event tracking</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-500">
                    <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-xs">
                      <tr>
                        <th className="px-6 py-4">Task Name & Details</th>
                        <th className="px-6 py-4">Assignee</th>
                        <th className="px-6 py-4">Task Status</th>
                        <th className="px-6 py-4">Standing Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {volunteerData.tvk_tasks.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="px-6 py-12 text-center text-slate-400">No tasks created yet.</td>
                        </tr>
                      ) : (
                        volunteerData.tvk_tasks.map(t => (
                          <tr key={t.id} className="hover:bg-slate-50/50">
                            <td className="px-6 py-4 max-w-sm">
                              <p className="font-bold text-slate-800 text-sm">{t.title}</p>
                              <p className="text-slate-500 text-xs mt-1 leading-relaxed">{t.description}</p>
                            </td>
                            <td className="px-6 py-4 font-semibold text-slate-600 text-xs">{t.assignee_name}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                t.status === 'done' ? 'bg-green-50 text-green-700' :
                                t.status === 'in_progress' ? 'bg-indigo-50 text-indigo-700' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                                {t.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-bold text-civic-gold text-xs">
                              +{t.status === 'done' ? '150 Points' : 'Pending completion'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
