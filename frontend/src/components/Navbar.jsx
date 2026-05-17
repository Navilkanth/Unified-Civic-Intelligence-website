import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <header className="bg-civic-navy text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="h-10 w-10 rounded-lg bg-civic-teal flex items-center justify-center font-display font-bold text-lg ring-2 ring-civic-gold/40">UCI</span>
          <div>
            <p className="font-display text-base leading-tight group-hover:text-civic-gold transition">Unified Civic Intelligence</p>
            <p className="text-xs text-slate-400">ஒருங்கிணைந்த குடிமை நுண்ணறிவு தளம்</p>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center gap-1 text-sm">
          <Link className="px-3 py-1.5 rounded-md hover:bg-white/10 transition" to="/governance">Governance</Link>
          <Link className="px-3 py-1.5 rounded-md hover:bg-white/10 transition" to="/tvk">Singapadai</Link>
          <Link className="px-3 py-1.5 rounded-md hover:bg-white/10 transition" to="/charity">Charity</Link>
          <Link className="px-3 py-1.5 rounded-md hover:bg-white/10 transition" to="/chatbot">🤖 AI</Link>

          {user?.role === 'admin' && (
            <Link className="px-3 py-1.5 rounded-md bg-civic-gold/20 text-civic-gold font-semibold" to="/admin">Admin</Link>
          )}

          {user ? (
            <>
              <span className="text-slate-400 hidden sm:inline mx-1">|</span>
              <span className="text-slate-300 max-w-[8rem] truncate text-xs hidden sm:inline">{user.full_name}</span>
              <button onClick={handleLogout}
                className="px-3 py-1.5 rounded-md border border-white/30 hover:bg-white/10 transition text-sm ml-1">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="px-3 py-1.5 rounded-md border border-white/30 hover:bg-white/10 transition" to="/login">Login</Link>
              <Link className="px-3 py-1.5 rounded-md bg-civic-teal text-white font-semibold hover:bg-opacity-90 transition" to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
