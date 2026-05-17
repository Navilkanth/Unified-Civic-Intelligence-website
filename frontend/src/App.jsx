import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute, { AdminRoute } from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Chatbot from './pages/Chatbot';

// Governance
import GovernanceHub from './pages/governance/Hub';
import Funds from './pages/governance/Funds';
import Projects from './pages/governance/Projects';
import WardDashboard from './pages/governance/WardDashboard';
import ComplaintForm from './pages/governance/ComplaintForm';
import LandReport from './pages/governance/LandReport';
import Emergency from './pages/governance/Emergency';

// TVK Singapadai
import TVKHub from './pages/tvk/Hub';
import TVKNews from './pages/tvk/News';
import TVKEvents from './pages/tvk/Events';
import TVKTasks from './pages/tvk/Tasks';
import VolunteerRegister from './pages/tvk/VolunteerRegister';
import Gamification from './pages/tvk/Gamification';

// Charity
import CharityHub from './pages/charity/Hub';
import WelfareRequest from './pages/charity/WelfareRequest';
import Transparency from './pages/charity/Transparency';
import Sponsors from './pages/charity/Sponsors';
import TrustLedger from './pages/charity/TrustLedger';
import VolunteerActivities from './pages/charity/Volunteer';

// Admin
import AdminDashboard from './pages/admin/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public Core */}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            {/* Protected General Routes */}
            <Route element={<ProtectedRoute />}>
              <Route index element={<Home />} />
              <Route path="chatbot" element={<Chatbot />} />

              {/* Governance */}
              <Route path="governance" element={<GovernanceHub />} />
              <Route path="governance/funds" element={<Funds />} />
              <Route path="governance/projects" element={<Projects />} />
              <Route path="governance/wards/:wardId" element={<WardDashboard />} />
              <Route path="governance/complaints" element={<ComplaintForm />} />
              <Route path="governance/land" element={<LandReport />} />
              <Route path="governance/emergency" element={<Emergency />} />

              {/* TVK */}
              <Route path="tvk" element={<TVKHub />} />
              <Route path="tvk/news" element={<TVKNews />} />
              <Route path="tvk/events" element={<TVKEvents />} />
              <Route path="tvk/tasks" element={<TVKTasks />} />
              <Route path="tvk/volunteer" element={<VolunteerRegister />} />
              <Route path="tvk/gamification" element={<Gamification />} />

              {/* Charity */}
              <Route path="charity" element={<CharityHub />} />
              <Route path="charity/welfare-request" element={<WelfareRequest />} />
              <Route path="charity/transparency" element={<Transparency />} />
              <Route path="charity/sponsors" element={<Sponsors />} />
              <Route path="charity/ledger" element={<TrustLedger />} />
              <Route path="charity/volunteer" element={<VolunteerActivities />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="admin" element={<AdminDashboard />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
