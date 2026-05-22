import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ApiService } from '../services/api';

interface DashboardData {
  id: number;
  title: string;
  // Add other properties as needed
}

export const Dashboard = () => {
  const { token, loading: authLoading } = useAuth();
  const [data, setData] = useState<DashboardData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data when token becomes available
  useEffect(() => {
    // Skip if auth is still checking or no token
    if (authLoading || !token) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await ApiService.get<DashboardData[]>('/dashboard');
        if (response.success && response.data) {
          setData(response.data);
        } else {
          throw new Error(response.error || 'Failed to fetch dashboard data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, authLoading]);

  // Handle case where auth is still checking
  if (authLoading) {
    return <div>Checking authentication...</div>;
  }

  // Redirect to login if no token (should be handled by routing, but just in case)
  if (!token) {
    return <div>Please log in to access the dashboard.</div>;
  }

  // Render loading state
  if (loading && data === null) {
    return <div>Loading dashboard...</div>;
  }

  // Render error state
  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  // Render data
  return (
    <div>
      <h1>Dashboard</h1>
      {data && data.length > 0 ? (
        <ul>
          {data.map(item => (
            <li key={item.id}>{item.title}</li>
          ))}
        </ul>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};