import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <section className="grid lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-civic-navy via-slate-900 to-civic-teal text-white p-8 shadow-xl">
          <p className="text-civic-gold text-sm font-semibold tracking-wide uppercase">Vision</p>
          <h1 className="font-display text-3xl sm:text-4xl mt-2 mb-4">One platform for transparent governance, volunteer coordination, and welfare accountability.</h1>
          <p className="text-slate-200 max-w-2xl leading-relaxed">ஒரே தளத்தில் வெளிப்படையான ஆட்சி, தன்னார்வ ஒருங்கிணைப்பு, நலத்தொகை பொறுப்புணர்வு.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/governance" className="inline-flex items-center px-4 py-2 rounded-lg bg-white text-civic-navy font-semibold text-sm hover:bg-civic-mist">Enter Governance</Link>
            <Link to="/chatbot" className="inline-flex items-center px-4 py-2 rounded-lg border border-white/40 text-sm hover:bg-white/10">AI Assistant</Link>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-center">
          <h2 className="font-display text-xl text-civic-navy mb-2">Security posture</h2>
          <ul className="text-sm text-slate-600 space-y-2">
            <li>• JWT sessions + role gates</li>
            <li>• Audit logging on sensitive actions</li>
            <li>• Ready for PostgreSQL + Redis queues</li>
          </ul>
        </div>
      </section>

      <div className="grid md:grid-cols-3 gap-6">
        <Link to="/governance" className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-civic-teal/40 transition">
          <h3 className="font-display text-xl text-civic-navy group-hover:text-civic-teal">Councillor Governance</h3>
          <p className="text-slate-600 text-sm mt-2">Funds, projects, complaints, land protection, ward dashboards, emergency mode.</p>
        </Link>
        <Link to="/tvk" className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-civic-teal/40 transition">
          <h3 className="font-display text-xl text-civic-navy group-hover:text-civic-teal">TVK Singapadai</h3>
          <p className="text-slate-600 text-sm mt-2">News, events, tasks, membership QR, gamification, election war room.</p>
        </Link>
        <Link to="/charity" className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-civic-teal/40 transition">
          <h3 className="font-display text-xl text-civic-navy group-hover:text-civic-teal">Charity & Welfare</h3>
          <p className="text-slate-600 text-sm mt-2">Welfare requests, donor transparency, sponsors, trust ledger, AI triage hints.</p>
        </Link>
      </div>
    </>
  );
}
