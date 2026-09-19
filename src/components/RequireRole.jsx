import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function RequireCustomer({ children }) {
  const { ready, isAuthed, isStaff } = useAuth();
  if (!ready) return null;
  if (!isAuthed) return <Navigate to="/login" replace />;
  if (isStaff) return <Navigate to="/admin" replace />;
  return children;
}

export function RequireStaff({ children }) {
  const { ready, isAuthed, isStaff } = useAuth();
  if (!ready) return null;
  if (!isAuthed) return <Navigate to="/login" replace />;
  if (!isStaff) return <Navigate to="/account" replace />;
  return children;
}

export function BlockStaff({ children }) {
  const { ready, isStaff } = useAuth();
  if (!ready) return null;
  if (isStaff) return <Navigate to="/admin" replace />;
  return children;
}
