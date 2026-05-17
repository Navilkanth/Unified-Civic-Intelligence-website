import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function TVKEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tvk/events').then(r => { setEvents(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const statusColor = (s) => ({
    upcoming: 'bg-blue-50 text-blue-700 border-blue-100',
    ongoing: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    completed: 'bg-slate-50 text-slate-500 border-slate-200',
  }[s] || 'bg-amber-50 text-amber-700 border-amber-100');

  return (
    <div>
      <h1 className="font-display text-3xl text-civic-navy mb-2">Events & Rallies</h1>
      <p className="text-slate-600 mb-8">Campaign schedules, event reminders, and QR attendance tracking.</p>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-40 bg-slate-100 rounded-xl animate-pulse" />)}</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {events.map(ev => (
            <div key={ev.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <h2 className="font-semibold text-civic-navy">{ev.title}</h2>
                <span className={`px-2 py-0.5 text-xs border rounded-full ${statusColor(ev.status)}`}>{ev.status || 'upcoming'}</span>
              </div>
              <p className="text-sm text-slate-600">{ev.description}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
                {ev.location && <span>📍 {ev.location}</span>}
                {ev.event_date && <span>📅 {new Date(ev.event_date).toLocaleDateString()}</span>}
                {ev.district && <span>🏙 {ev.district}</span>}
              </div>
              <button className="mt-4 w-full py-2 text-sm bg-civic-navy text-white rounded-lg hover:bg-opacity-90 transition">
                Register / RSVP
              </button>
            </div>
          ))}
          {events.length === 0 && (
            <div className="col-span-2 py-16 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
              <p className="text-4xl mb-3">📅</p>
              <p>No upcoming events scheduled.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
