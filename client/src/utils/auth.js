// Role-based routing helpers — kept in a separate file so AuthContext.jsx
// can be a pure React component module (required for Vite Fast Refresh / HMR).

export const getRoleHome = (role) => {
  if (role === 'admin') return '/admin';
  if (role === 'gym_owner') return '/owner';
  return '/dashboard';
};
