import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const credentials = {
      email: formData.get('email'),
      password: formData.get('password'),
    };

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      // Assuming the response contains { token, user }
      login(data.token, data.user);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      // Set error state in component to show to user
      // For simplicity, we're just logging; you might want to set state
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};