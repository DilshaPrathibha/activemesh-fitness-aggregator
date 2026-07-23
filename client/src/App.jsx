import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

// Layouts
import MainLayout from './components/layout/MainLayout';

// Public pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Gym pages
import GymSearchPage from './pages/gyms/GymSearchPage';
import GymDetailPage from './pages/gyms/GymDetailPage';

// User pages
import UserDashboardPage from './pages/dashboard/UserDashboardPage';
import MembershipPlansPage from './pages/memberships/MembershipPlansPage';
import MyBookingsPage from './pages/bookings/MyBookingsPage';
import ProfilePage from './pages/profile/ProfilePage';

// Owner pages
import OwnerDashboardPage from './pages/owner/OwnerDashboardPage';
import QRScannerPage from './pages/gyms/QRScannerPage';

// Admin pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

// Error
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          {/* Public auth routes */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          </Route>

          {/* Main layout (public + protected) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/gyms" element={<GymSearchPage />} />
            <Route path="/gyms/:id" element={<GymDetailPage />} />

            {/* Protected user-only routes — members only */}
            <Route element={<ProtectedRoute allowedRoles={['user']} />}>
              <Route path="/dashboard" element={<UserDashboardPage />} />
              <Route path="/memberships" element={<MembershipPlansPage />} />
              <Route path="/bookings" element={<MyBookingsPage />} />
            </Route>

            {/* Profile — accessible to any authenticated user */}
            <Route element={<ProtectedRoute allowedRoles={['user', 'gym_owner', 'admin']} />}>
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Protected owner routes */}
            <Route element={<ProtectedRoute allowedRoles={['gym_owner', 'admin']} />}>
              <Route path="/owner" element={<OwnerDashboardPage />} />
              <Route path="/scan" element={<QRScannerPage />} />
            </Route>

            {/* Protected admin routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}
