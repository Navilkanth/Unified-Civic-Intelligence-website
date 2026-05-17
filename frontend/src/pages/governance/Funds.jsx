import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function Funds() {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/governance/funds')
      .then(res => {
        setFunds(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl text-civic-navy mb-4">Government Funds</h1>
      <p className="text-slate-600 mb-8">Transparent view of sanctioned funds and expenditures.</p>
      
      {loading ? <p>Loading...</p> : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3">Project ID</th>
                <th className="px-4 py-3">Sanctioned</th>
                <th className="px-4 py-3">Spent</th>
                <th className="px-4 py-3">Remaining</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {funds.map(f => (
                <tr key={f.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-civic-navy">#{f.project_id}</td>
                  <td className="px-4 py-3 text-emerald-600">₹{f.sanctioned_amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-red-600">₹{f.spent_amount.toLocaleString()}</td>
                  <td className="px-4 py-3 font-semibold">₹{f.remaining.toLocaleString()}</td>
                </tr>
              ))}
              {funds.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-slate-500">No funds tracked yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
