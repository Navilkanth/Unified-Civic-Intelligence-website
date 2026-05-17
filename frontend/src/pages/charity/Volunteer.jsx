import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function VolunteerActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activityType, setActivityType] = useState('food_distribution');
  const [hours, setHours] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await api.get('/charity/activities');
      setActivities(response.data);
    } catch (err) {
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);

    try {
      const response = await api.post('/charity/activities', {
        activity_type: activityType,
        hours: parseFloat(hours),
        notes: notes
      });
      setMessage(response.data.message);
      setHours('');
      setNotes('');
      fetchActivities();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit volunteer activity.');
    } finally {
      setSubmitting(false);
    }
  };

  const getFriendlyType = (type) => {
    switch (type) {
      case 'food_distribution': return '🍱 Food Distribution Camp';
      case 'blood_donation': return '🩸 Blood Donation Drive';
      case 'disaster_relief': return '🌪 Emergency Disaster Relief';
      case 'education_tutoring': return '📚 Free Educational Tutoring';
      default: return '🤝 General Welfare Activity';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-civic-teal to-civic-navy text-white p-8 rounded-2xl shadow-lg mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 transform translate-x-12 -translate-y-12">
          <svg className="w-80 h-80" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        <div className="relative z-10">
          <span className="bg-civic-gold text-civic-navy font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider">
            Trust & Service
          </span>
          <h1 className="font-display text-4xl mt-3 font-bold">Charitable Volunteer Ledger</h1>
          <p className="mt-2 text-slate-200 max-w-xl">
            Log your charity services directly onto our transparent trust ledger. Earn Singapadai leadership points while serving the community.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Activity Submission Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
          <h2 className="text-xl font-bold text-civic-navy mb-4 flex items-center gap-2">
            <span>📝</span> Log Your Service
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Activity Type
              </label>
              <select
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-civic-teal"
              >
                <option value="food_distribution">🍱 Food Distribution Camp</option>
                <option value="blood_donation">🩸 Blood Donation Drive</option>
                <option value="disaster_relief">🌪 Emergency Disaster Relief</option>
                <option value="education_tutoring">📚 Free Educational Tutoring</option>
                <option value="general_welfare">🤝 General Welfare Activity</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Hours Contributed
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                placeholder="e.g. 3.5"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-civic-teal"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Service Notes & Details
              </label>
              <textarea
                rows="4"
                placeholder="Describe your activities, location, and achievements..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-civic-teal text-sm"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-semibold">
                ⚠️ {error}
              </div>
            )}

            {message && (
              <div className="bg-green-50 text-green-600 p-3 rounded-lg text-xs font-semibold">
                🎉 {message}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-civic-teal hover:bg-opacity-90 text-white rounded-lg font-semibold transition text-sm flex items-center justify-center gap-2"
            >
              {submitting ? 'Verifying...' : 'Log on Trust Ledger'}
            </button>
          </form>
        </div>

        {/* Live Service Feed */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-civic-navy mb-4 flex items-center gap-2">
              <span>🔗</span> Ledger Service Records
            </h2>

            {loading ? (
              <div className="py-12 text-center text-slate-400">Loading verified activities...</div>
            ) : activities.length === 0 ? (
              <div className="py-12 text-center text-slate-400">No services logged yet. Be the first!</div>
            ) : (
              <div className="space-y-4">
                {activities.map((act) => (
                  <div key={act.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:border-civic-teal transition">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-civic-navy text-sm sm:text-base">
                          {act.volunteer_name}
                        </span>
                        <span className="bg-civic-mist text-civic-teal px-2.5 py-0.5 rounded-full text-xs font-medium">
                          {getFriendlyType(act.activity_type)}
                        </span>
                      </div>
                      <p className="text-slate-600 text-xs sm:text-sm mt-1">{act.notes || 'No notes provided.'}</p>
                      <span className="text-[10px] text-slate-400 mt-2 block">
                        Verified at: {new Date(act.created_at).toLocaleString()}
                      </span>
                    </div>

                    <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-0 pt-2 sm:pt-0 border-slate-100">
                      <span className="text-sm font-bold text-civic-navy flex items-center gap-1">
                        ⏱ {act.hours} hrs
                      </span>
                      <span className="text-xs text-civic-gold font-bold sm:mt-1">
                        +{act.hours * 10} Points
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
