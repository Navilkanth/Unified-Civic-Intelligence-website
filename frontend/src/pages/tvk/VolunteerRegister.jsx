import { useState } from 'react';
import api from '../../utils/api';

const SKILLS = ['Public Speaking', 'Data Entry', 'Booth Management', 'Social Media', 'Medical Support', 'Logistics', 'Event Coordination'];

export default function VolunteerRegister() {
  const [form, setForm] = useState({ district: '', ward: '', booth: '', skills: [], availability: '' });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleSkill = (s) => setForm(p => ({
    ...p, skills: p.skills.includes(s) ? p.skills.filter(x => x !== s) : [...p.skills, s]
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg(null);
    try {
      await api.post('/tvk/volunteer/register', { ...form, skills: form.skills.join(',') });
      setMsg({ type: 'success', text: '🎉 Registration complete! Your membership ID and digital badge will be sent to your registered email.' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Registration failed.' });
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl text-civic-navy mb-2">Volunteer Registration</h1>
      <p className="text-slate-600 mb-8">Join the TVK Singapadai network and receive your digital membership card with QR verification.</p>

      {msg && (
        <div className={`mb-6 p-4 rounded-lg text-sm border ${msg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">District *</label>
            <input required value={form.district} onChange={e => setForm(p => ({ ...p, district: e.target.value }))}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-civic-teal"
              placeholder="Your district" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Ward</label>
            <input value={form.ward} onChange={e => setForm(p => ({ ...p, ward: e.target.value }))}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-civic-teal"
              placeholder="Ward number/name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Booth</label>
            <input value={form.booth} onChange={e => setForm(p => ({ ...p, booth: e.target.value }))}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-civic-teal"
              placeholder="Booth number" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Skills (select all that apply)</label>
          <div className="flex flex-wrap gap-2">
            {SKILLS.map(s => (
              <button type="button" key={s} onClick={() => toggleSkill(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${form.skills.includes(s) ? 'bg-civic-teal text-white border-civic-teal' : 'bg-white text-slate-600 border-slate-300 hover:border-civic-teal'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Availability</label>
          <select value={form.availability} onChange={e => setForm(p => ({ ...p, availability: e.target.value }))}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-civic-teal">
            <option value="">Select availability…</option>
            <option>Weekdays only</option>
            <option>Weekends only</option>
            <option>Full-time</option>
            <option>Event-based</option>
          </select>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-civic-teal text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-opacity-90 transition disabled:opacity-60">
          {loading ? 'Registering…' : 'Register as Volunteer'}
        </button>
      </form>
    </div>
  );
}
