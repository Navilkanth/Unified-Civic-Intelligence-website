import { Link } from 'react-router-dom';

export default function GovernanceHub() {
  return (
    <div>
      <h1 className="font-display text-3xl text-civic-navy mb-4">Governance Hub</h1>
      <p className="text-slate-600 mb-8">Access tools for public governance transparency and accountability.</p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/governance/funds" className="block p-6 bg-white rounded-xl border border-slate-200 hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-civic-navy">Fund Transparency</h3>
          <p className="text-sm text-slate-500 mt-2">Track government sanctioned amounts, expenses, and remaining balances.</p>
        </Link>
        <Link to="/governance/projects" className="block p-6 bg-white rounded-xl border border-slate-200 hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-civic-navy">Public Works</h3>
          <p className="text-sm text-slate-500 mt-2">View upcoming projects and development plans.</p>
        </Link>
        <Link to="/governance/complaints" className="block p-6 bg-white rounded-xl border border-slate-200 hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-civic-navy">Report Issues</h3>
          <p className="text-sm text-slate-500 mt-2">Submit complaints against councillors or public infrastructure issues.</p>
        </Link>
        <Link to="/governance/land" className="block p-6 bg-white rounded-xl border border-slate-200 hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-civic-navy">Land Protection</h3>
          <p className="text-sm text-slate-500 mt-2">Report illegal land occupation or view acquisition notices.</p>
        </Link>
        <Link to="/governance/emergency" className="block p-6 bg-white rounded-xl border border-slate-200 hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-civic-navy">Emergency Mode</h3>
          <p className="text-sm text-slate-500 mt-2">Access disaster relief tools and request rescue.</p>
        </Link>
        <Link to="/governance/wards/1" className="block p-6 bg-white rounded-xl border border-slate-200 hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-civic-navy">Ward Dashboards</h3>
          <p className="text-sm text-slate-500 mt-2">View hyperlocal governance scores and heatmaps.</p>
        </Link>
      </div>
    </div>
  );
}
