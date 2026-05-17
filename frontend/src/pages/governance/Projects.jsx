import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/governance/projects')
      .then(res => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl text-civic-navy mb-4">Public Works Projects</h1>
      <p className="text-slate-600 mb-8">Track ongoing and planned public development in your ward.</p>
      
      {loading ? <p>Loading...</p> : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(p => (
            <div key={p.id} className="bg-white p-5 rounded-xl border border-slate-200">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-civic-navy">{p.title}</h3>
                <span className={`px-2 py-1 text-xs rounded-md ${
                  p.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                  p.status === 'active' ? 'bg-blue-100 text-blue-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {p.status.toUpperCase()}
                </span>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Progress</span>
                  <span>{p.completion_percent}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-civic-teal h-2 rounded-full" style={{ width: `${p.completion_percent}%` }}></div>
                </div>
              </div>
              <div className="mt-4 text-xs text-slate-500">
                Ward ID: {p.ward_id}
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <div className="col-span-full py-8 text-center text-slate-500 border border-dashed border-slate-300 rounded-xl">
              No projects found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
