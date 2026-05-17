import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function TVKTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tvk/tasks').then(r => { setTasks(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const statusStyle = (s) => s === 'completed' ? 'text-emerald-600 bg-emerald-50' : s === 'in_progress' ? 'text-blue-600 bg-blue-50' : 'text-amber-600 bg-amber-50';

  return (
    <div>
      <h1 className="font-display text-3xl text-civic-navy mb-2">Task Assignments</h1>
      <p className="text-slate-600 mb-8">Social campaigns, booth activities, disaster support, and awareness drives assigned to volunteers.</p>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />)}</div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-sm">
          {tasks.map(task => (
            <div key={task.id} className="p-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-civic-navy">{task.title}</p>
                <p className="text-sm text-slate-500 mt-1">{task.description}</p>
                {task.due_date && <p className="text-xs text-slate-400 mt-1">Due: {new Date(task.due_date).toLocaleDateString()}</p>}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle(task.status)}`}>
                  {task.status || 'pending'}
                </span>
                <button className="px-3 py-1.5 text-xs bg-civic-teal text-white rounded-lg hover:bg-opacity-90 transition">
                  Mark Done
                </button>
              </div>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="py-16 text-center text-slate-400">
              <p className="text-4xl mb-3">✅</p>
              <p>No tasks assigned yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
