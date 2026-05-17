import { useState } from 'react';
import api from '../../utils/api';

const WELFARE_TYPES = ['Medical Help', 'Scholarship Support', 'Food Assistance', 'Disaster Relief', 'Other'];

export default function WelfareRequest() {
  const [form, setForm] = useState({ request_type: '', description: '', full_name: '', phone: '', address: '' });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg(null);
    try {
      await api.post('/charity/welfare', form);
      setMsg({ type: 'success', text: '✅ Welfare request submitted. Our AI triage system will prioritize and connect you with the right support.' });
      setForm({ request_type: '', description: '', full_name: '', phone: '', address: '' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Submission failed.' });
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl text-civic-navy mb-2">Request Welfare Support</h1>
      <p className="text-slate-600 mb-8">Submit a welfare request for medical help, scholarships, food assistance, or disaster relief. AI triage ensures priority routing.</p>

      {msg && (
        <div className={`mb-6 p-4 rounded-lg text-sm border ${msg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
            <input required value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-civic-teal"
              placeholder="Applicant's full name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
            <input required value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-civic-teal"
              placeholder="+91 98765 43210" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Type of Support Needed *</label>
          <select required value={form.request_type} onChange={e => setForm(p => ({ ...p, request_type: e.target.value }))}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-civic-teal">
            <option value="">Select support type…</option>
            {WELFARE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
          <input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-civic-teal"
            placeholder="Village / town, ward, district" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description of Need *</label>
          <textarea required rows={5} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-civic-teal"
            placeholder="Explain your situation, urgency, and what support is required. AI will suggest matching welfare schemes." />
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-civic-teal text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-opacity-90 transition disabled:opacity-60">
          {loading ? 'Submitting…' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
}
