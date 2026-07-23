import { Link, NavLink } from 'react-router-dom';
import { Dumbbell, Moon, Sun, Menu, X, LogOut, User, LayoutDashboard, Calendar, ShieldCheck, ScanLine, Store } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getRoleHome } from '../../utils/auth';
import { useTheme } from '../../context/ThemeContext';

// Nav links visible to public (no login required)
const PUBLIC_NAV = [
  { to: '/gyms', label: 'Find Gyms' },
];

// Extra nav links per role (appended after public links)
const ROLE_NAV = {
  user:      [{ to: '/memberships', label: 'Memberships' }, { to: '/bookings', label: 'My Bookings' }],
  gym_owner: [{ to: '/owner', label: 'My Gyms' }, { to: '/scan', label: 'QR Scanner' }],
  admin:     [{ to: '/admin', label: 'Admin Panel' }],
};

// Profile dropdown links per role
const ROLE_PROFILE_LINKS = {
  user: [
    { to: '/dashboard', label: 'Dashboard',   icon: LayoutDashboard },
    { to: '/bookings',  label: 'My Bookings', icon: Calendar },
    { to: '/profile',   label: 'Profile',     icon: User },
  ],
  gym_owner: [
    { to: '/owner',   label: 'Owner Dashboard', icon: Store },
    { to: '/scan',    label: 'QR Scanner',      icon: ScanLine },
    { to: '/profile', label: 'Profile',         icon: User },
  ],
  admin: [
    { to: '/admin',   label: 'Admin Dashboard', icon: ShieldCheck },
    { to: '/owner',   label: 'Owner Panel',     icon: Store },
    { to: '/profile', label: 'Profile',         icon: User },
  ],
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
    setMenuOpen(false);
  };

  const roleNav = user ? (ROLE_NAV[user.role] ?? []) : [];
  const profileLinks = user ? (ROLE_PROFILE_LINKS[user.role] ?? []) : [];
  const desktopNav = [...PUBLIC_NAV, ...roleNav];

  // Role badge colours
  const ROLE_BADGE = {
    admin:     'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    gym_owner: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    user:      'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  };

  return (
    <nav className="sticky top-0 z-50 bg-[rgb(var(--color-surface))]/80 backdrop-blur-md border-b border-[rgb(var(--color-border))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user ? getRoleHome(user.role) : '/'} className="flex items-center gap-2 font-bold text-xl text-violet-600">
            <Dumbbell className="w-6 h-6" />
            ActiveMesh
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {desktopNav.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-violet-600'
                      : 'text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((p) => !p)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                    <span className="text-xs font-bold text-violet-600">
                      {user.name?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{user.name}</span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-52 card shadow-lg py-1 z-50">
                    {/* Role badge header */}
                    <div className="px-4 py-2 border-b border-[rgb(var(--color-border))]">
                      <p className="text-xs text-[rgb(var(--color-muted))] truncate">{user.email}</p>
                      <span className={`inline-block mt-1 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${ROLE_BADGE[user.role]}`}>
                        {user.role === 'gym_owner' ? 'Gym Owner' : user.role}
                      </span>
                    </div>

                    {profileLinks.map(({ to, label, icon: Icon }) => (
                      <Link
                        key={to}
                        to={to}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <Icon className="w-4 h-4" /> {label}
                      </Link>
                    ))}

                    <hr className="my-1 border-[rgb(var(--color-border))]" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-xs px-3 py-1.5">Sign in</Link>
                <Link to="/register" className="btn-primary text-xs px-3 py-1.5">Get started</Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              onClick={() => setMenuOpen((m) => !m)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        {menuOpen && (
          <div className="md:hidden py-3 border-t border-[rgb(var(--color-border))]">
            {desktopNav.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className="block px-2 py-2 text-sm font-medium text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </NavLink>
            ))}

            {user && (
              <>
                <hr className="my-2 border-[rgb(var(--color-border))]" />
                {profileLinks.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className="flex items-center gap-2 px-2 py-2 text-sm font-medium text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4" /> {label}
                  </NavLink>
                ))}
                <hr className="my-2 border-[rgb(var(--color-border))]" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-2 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
