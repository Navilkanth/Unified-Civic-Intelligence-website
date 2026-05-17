import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function ComplaintForm() {
  const { user } = useAuth();
  const [wards, setWards] = useState([]);
  const [form, setForm] = useState({ title: '', body: '', ward_id: '', anonymous: false, category: '' });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/governance/wards').then(r => setWards(r.data)).catch(console.error);
  }, []);

  const CATEGORIES = ['Road', 'Drainage', 'Water Supply', 'Corruption', 'Negligence', 'Misbehavior', 'Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg(null);
    try {
      await api.post('/governance/complaints', { ...form, ward_id: Number(form.ward_id) });
      setMsg({ type: 'success', text: 'Complaint submitted successfully. Reference ID will appear in admin queue.' });
      setForm({ title: '', body: '', ward_id: '', anonymous: false, category: '' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Failed to submit complaint.' });
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl text-civic-navy mb-2">Submit a Complaint</h1>
      <p className="text-slate-600 mb-8">Report negligence, corruption, delayed work, or misbehavior to the admin review queue.</p>

      {msg && (
        <div className={`mb-6 p-4 rounded-lg text-sm border ${msg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Complaint Title *</label>
          <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-civic-teal"
            placeholder="Brief title of your complaint" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Ward *</label>
            <select required value={form.ward_id} onChange={e => setForm(p => ({ ...p, ward_id: e.target.value }))}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-civic-teal">
              <option value="">Select ward…</option>
              {wards.map(w => <option key={w.id} value={w.id}>{w.code} — {w.name_en}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-civic-teal">
              <option value="">Auto-detect via AI</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
          <textarea required rows={5} value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-civic-teal"
            placeholder="Describe the issue in detail. AI will analyze sentiment and auto-classify." />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
          <input type="checkbox" checked={form.anonymous} onChange={e => setForm(p => ({ ...p, anonymous: e.target.checked }))}
            className="h-4 w-4 rounded text-civic-teal" />
          Submit anonymously
        </label>
        <button type="submit" disabled={loading}
          className="w-full bg-civic-teal text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-opacity-90 transition disabled:opacity-60">
          {loading ? 'Submitting…' : 'Submit Complaint'}
        </button>
      </form>
    </div>
  );
}
