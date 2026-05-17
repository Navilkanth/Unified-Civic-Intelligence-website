import { Link } from 'react-router-dom';

export default function CharityHub() {
  return (
    <div>
      <h1 className="font-display text-3xl text-civic-navy mb-4">Charity & Welfare Hub</h1>
      <p className="text-slate-600 mb-8">Transparent welfare and donation ecosystem.</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/charity/welfare-request" className="block p-6 bg-white rounded-xl border border-slate-200 hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-civic-navy">Request Help</h3>
          <p className="text-sm text-slate-500 mt-2">Submit a request for medical, scholarship, or food assistance.</p>
        </Link>
        <Link to="/charity/transparency" className="block p-6 bg-white rounded-xl border border-slate-200 hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-civic-navy">Donation Dashboard</h3>
          <p className="text-sm text-slate-500 mt-2">View overall transparent logs of donations and distribution.</p>
        </Link>
        <Link to="/charity/sponsors" className="block p-6 bg-white rounded-xl border border-slate-200 hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-civic-navy">Our Sponsors</h3>
          <p className="text-sm text-slate-500 mt-2">Recognizing our major donors and organizational partners.</p>
        </Link>
        <Link to="/charity/volunteer" className="block p-6 bg-white rounded-xl border border-slate-200 hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-civic-navy">Volunteer Activities</h3>
          <p className="text-sm text-slate-500 mt-2">Join blood donation drives, food camps, and disaster relief.</p>
        </Link>
        <Link to="/charity/ledger" className="block p-6 bg-white rounded-xl border border-slate-200 hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-civic-navy">Trust Ledger</h3>
          <p className="text-sm text-slate-500 mt-2">Immutable records of donations, beneficiaries, and invoices.</p>
        </Link>
      </div>
    </div>
  );
}
