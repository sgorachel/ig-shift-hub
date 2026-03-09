import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Header from './shared/Header';
import Footer from './shared/Footer';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AiAssessment from './assessments/ai/AiAssessment';
import ChangeAssessment from './assessments/change/ChangeAssessment';
import EquityAssessment from './assessments/equity/EquityAssessment';

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-ig-bg flex items-center justify-center">
      <span className="w-10 h-10 border-2 border-ig-berry/30 border-t-ig-berry rounded-full animate-spin" />
    </div>
  );
}

/** Wraps protected routes — redirects to /login if not authenticated */
function ProtectedRoute({ user, children }) {
  if (user === null) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-ig-bg flex flex-col">
      {/* Only show header on protected routes */}
      {user && <Header user={user} />}

      <div className="flex-1">
      <Routes>
        {/* Public */}
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <DashboardPage user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai"
          element={
            <ProtectedRoute user={user}>
              <AiAssessment user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/change"
          element={
            <ProtectedRoute user={user}>
              <ChangeAssessment user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/equity"
          element={
            <ProtectedRoute user={user}>
              <EquityAssessment user={user} />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
      </Routes>
      </div>
      <Footer />
    </div>
  );
}
