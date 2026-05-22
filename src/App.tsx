import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ErrorFallback } from './components/ErrorFallback';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
// Add other components as needed

const App = () => {
  const { token, loading: authLoading } = useAuth();

  // If auth is still checking, show loading
  if (authLoading) {
    return <div>Loading...</div>;
  }

  // If no token, redirect to login (or show login page)
  if (!token) {
    return (
      <BrowserRouter>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Routes>
            <Route path="/login" element={<Login />} />
            {/* Redirect to login for any other path when not authenticated */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    );
  }

  // User is authenticated
  return (
    <BrowserRouter>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Add other protected routes */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<div>404 - Not Found</div> />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;