import { useState } from 'react';
import api from '../../utils/api';

const REPORT_TYPES = [
  'Illegal land occupation', 'Temple land encroachment',
  'Government land misuse', 'Public land occupation', 'Other'
];

export default function LandReport() {
  const [form, setForm] = useState({ survey_number: '', report_type: '', description: '', lat: '', lng: '' });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg(null);
    try {
      await api.post('/governance/land', form);
      setMsg({ type: 'success', text: 'Land protection report submitted. Officials will review within 5 business days.' });
      setForm({ survey_number: '', report_type: '', description: '', lat: '', lng: '' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Submission failed. Please try again.' });
    } finally { setLoading(false); }
  };

  const getLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(pos => {
      setForm(p => ({ ...p, lat: pos.coords.latitude.toFixed(6), lng: pos.coords.longitude.toFixed(6) }));
    });
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl text-civic-navy mb-2">Land & Patta Protection Report</h1>
      <p className="text-slate-600 mb-8">Report illegal land occupation, encroachments, or government land misuse with evidence.</p>

      {msg && (
        <div className={`mb-6 p-4 rounded-lg text-sm border ${msg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Survey / Patta Number</label>
            <input value={form.survey_number} onChange={e => setForm(p => ({ ...p, survey_number: e.target.value }))}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-civic-teal"
              placeholder="e.g. 123/4A" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Report Type *</label>
            <select required value={form.report_type} onChange={e => setForm(p => ({ ...p, report_type: e.target.value }))}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-civic-teal">
              <option value="">Select type…</option>
              {REPORT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
          <textarea required rows={5} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-civic-teal"
            placeholder="Describe the encroachment or misuse in detail…" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Geo-location</label>
          <div className="flex gap-3">
            <input value={form.lat} onChange={e => setForm(p => ({ ...p, lat: e.target.value }))}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-civic-teal"
              placeholder="Latitude" />
            <input value={form.lng} onChange={e => setForm(p => ({ ...p, lng: e.target.value }))}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-civic-teal"
              placeholder="Longitude" />
            <button type="button" onClick={getLocation}
              className="shrink-0 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200 transition whitespace-nowrap">
              📍 Auto-detect
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-civic-navy text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-opacity-90 transition disabled:opacity-60">
          {loading ? 'Submitting…' : 'Submit Land Report'}
        </button>
      </form>
    </div>
  );
}
