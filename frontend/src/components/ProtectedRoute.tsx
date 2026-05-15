import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useSelector((state: RootState) => state.auth);

  if (loading) return null; // Or a loading spinner

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
