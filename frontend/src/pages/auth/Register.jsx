import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ROLES = [
  { value: 'citizen', label: 'Citizen — குடிமகன்' },
  { value: 'volunteer', label: 'TVK Volunteer — தன்னார்வலர்' },
  { value: 'donor', label: 'Donor / Sponsor — நன்கொடையாளர்' },
  { value: 'councillor', label: 'Councillor — மாவட்ட உறுப்பினர்' },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', email: '', password: '', phone: '', role: 'citizen' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const field = (key, label, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input
        type={type}
        required={key !== 'phone'}
        value={form[key]}
        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-civic-teal"
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-10">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
          <div className="text-center mb-8">
            <span className="inline-flex h-14 w-14 rounded-xl bg-civic-navy items-center justify-center font-display font-bold text-2xl text-white mb-4">UCI</span>
            <h1 className="font-display text-2xl text-civic-navy">Create Account</h1>
            <p className="text-sm text-slate-500 mt-1">Join the Unified Civic Intelligence platform</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {field('full_name', 'Full Name', 'text', 'Your full name')}
            {field('email', 'Email', 'email', 'you@example.com')}
            {field('password', 'Password', 'password', '••••••••')}
            {field('phone', 'Phone (optional)', 'tel', '+91 98765 43210')}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
              <select
                value={form.role}
                onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-civic-teal"
              >
                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-civic-navy text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-opacity-90 transition disabled:opacity-60"
            >
              {loading ? 'Creating account…' : 'Register'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-civic-teal font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
