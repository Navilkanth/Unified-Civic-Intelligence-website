import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  const quickRoles = [
    { id: 'admin', label: '👑 Admin', email: 'admin@civic.local', pass: 'Admin#12345', color: 'border-civic-gold text-civic-gold bg-civic-gold/10' },
    { id: 'citizen', label: '👥 Citizen', email: 'citizen@civic.local', pass: 'Citizen#123', color: 'border-civic-teal text-civic-teal bg-civic-teal/10' },
    { id: 'volunteer', label: '🙋 Volunteer', email: 'volunteer@civic.local', pass: 'Volunteer#123', color: 'border-indigo-500 text-indigo-600 bg-indigo-50' },
    { id: 'councillor', label: '🏛 Councillor', email: 'councillor@civic.local', pass: 'Councillor#123', color: 'border-emerald-500 text-emerald-600 bg-emerald-50' },
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role.id);
    setForm({ email: role.email, password: role.pass });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user?.role === 'admin') navigate('/admin');
      else if (user?.role === 'volunteer') navigate('/tvk');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 relative overflow-hidden">
          {/* Header Banner */}
          <div className="text-center mb-6">
            <span className="inline-flex h-14 w-14 rounded-xl bg-civic-teal items-center justify-center font-display font-bold text-2xl text-white mb-4 shadow-md ring-2 ring-civic-gold/25">UCI</span>
            <h1 className="font-display text-3xl font-bold text-civic-navy tracking-tight">Welcome Back</h1>
            <p className="text-sm text-slate-500 mt-1">Sign in to experience the Unified Civic Intelligence network</p>
          </div>

          {/* Premium Role Selector Grid */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-3">
              Select Role for Instant Quick-Login
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {quickRoles.map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleRoleSelect(r)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition flex flex-col items-center justify-center gap-1.5 ${
                    selectedRole === r.id
                      ? r.color + ' shadow-sm scale-[1.03]'
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-sm">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => {
                  setForm(p => ({ ...p, email: e.target.value }));
                  setSelectedRole(''); // Reset role selection if manually typed
                }}
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-civic-teal focus:border-transparent transition bg-slate-50/50"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={e => {
                  setForm(p => ({ ...p, password: e.target.value }));
                  setSelectedRole('');
                }}
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-civic-teal focus:border-transparent transition bg-slate-50/50"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-civic-teal hover:bg-opacity-95 text-white py-3 rounded-lg font-semibold text-sm transition shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-civic-teal font-semibold hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
