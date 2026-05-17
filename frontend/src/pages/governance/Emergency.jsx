import { useState } from 'react';
import api from '../../utils/api';

export default function Emergency() {
  const [form, setForm] = useState({ citizen_name: '', contact_number: '', location: '', description: '' });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg(null);
    try {
      await api.post('/governance/emergency', form);
      setMsg({ type: 'success', text: '🚨 Rescue request dispatched! Keep this page open and stay safe.' });
      setForm({ citizen_name: '', contact_number: '', location: '', description: '' });
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to send rescue request. Please call emergency services directly.' });
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl">
      {/* Emergency Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-red-600 to-red-800 text-white p-6 mb-8 shadow-xl">
        <h1 className="font-display text-3xl mb-2">🚨 Disaster Emergency Mode</h1>
        <p className="text-red-100 text-sm">For floods, cyclones, or any disaster requiring rescue. Your request will be dispatched to councillors and relief volunteers immediately.</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <span className="bg-white/20 px-3 py-1 rounded-full">Police: 100</span>
          <span className="bg-white/20 px-3 py-1 rounded-full">Ambulance: 108</span>
          <span className="bg-white/20 px-3 py-1 rounded-full">Fire: 101</span>
          <span className="bg-white/20 px-3 py-1 rounded-full">Disaster Helpline: 1077</span>
        </div>
      </div>

      {msg && (
        <div className={`mb-6 p-4 rounded-lg text-sm border ${msg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
        <h2 className="font-display text-xl text-civic-navy">Request Rescue / Relief</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Your Name *</label>
            <input required value={form.citizen_name} onChange={e => setForm(p => ({ ...p, citizen_name: e.target.value }))}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Full name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number *</label>
            <input required value={form.contact_number} onChange={e => setForm(p => ({ ...p, contact_number: e.target.value }))}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="+91 98765 43210" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Current Location *</label>
          <input required value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            placeholder="Street, landmark, area, ward…" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Situation Description *</label>
          <textarea required rows={4} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            placeholder="Describe the emergency — number of people, water level, injuries, etc." />
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-bold text-sm hover:bg-red-700 transition disabled:opacity-60">
          {loading ? 'Dispatching…' : '🚨 Send Rescue Request Now'}
        </button>
      </form>
    </div>
  );
}
