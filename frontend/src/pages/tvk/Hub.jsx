import { Link } from 'react-router-dom';

export default function TVKHub() {
  return (
    <div>
      <h1 className="font-display text-3xl text-civic-navy mb-4">TVK Singapadai Hub</h1>
      <p className="text-slate-600 mb-8">Volunteer management and political workforce coordination.</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/tvk/news" className="block p-6 bg-white rounded-xl border border-slate-200 hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-civic-navy">Live Updates</h3>
          <p className="text-sm text-slate-500 mt-2">View real-time news, announcements, and policy changes.</p>
        </Link>
        <Link to="/tvk/events" className="block p-6 bg-white rounded-xl border border-slate-200 hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-civic-navy">Events & Rallies</h3>
          <p className="text-sm text-slate-500 mt-2">Manage event schedules and track volunteer participation.</p>
        </Link>
        <Link to="/tvk/tasks" className="block p-6 bg-white rounded-xl border border-slate-200 hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-civic-navy">Tasks</h3>
          <p className="text-sm text-slate-500 mt-2">View assigned campaigns, drives, and tasks.</p>
        </Link>
        <Link to="/tvk/volunteer" className="block p-6 bg-white rounded-xl border border-slate-200 hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-civic-navy">Registration</h3>
          <p className="text-sm text-slate-500 mt-2">Register as a volunteer and get your digital ID.</p>
        </Link>
        <Link to="/tvk/gamification" className="block p-6 bg-white rounded-xl border border-slate-200 hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-civic-navy">Gamification</h3>
          <p className="text-sm text-slate-500 mt-2">View leaderboards, badges, and volunteer rankings.</p>
        </Link>
      </div>
    </div>
  );
}
