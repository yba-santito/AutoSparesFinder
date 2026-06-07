import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Pages.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '';

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    // Update the fetch URL to use the base URL
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

      const data = await response.json();

      if (data.success && data.token) {
        // Store JWT token and user info in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/admin-portal');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h1 className="page-title">Business Portal Login</h1>
      <p className="page-subtitle">Enter your credentials to access the admin panel</p>

      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '30px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        marginTop: '30px'
      }}>
        {error && (
          <div style={{
            backgroundColor: '#ffebee',
            color: '#c62828',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '15px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: 'bold',
              color: '#333'
            }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              placeholder="Enter username"
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: 'bold',
              color: '#333'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: isLoading ? '#ccc' : '#E35205',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#e3f2fd',
          borderRadius: '4px',
          fontSize: '0.9rem'
        }}>
          <p style={{ marginTop: 0 }}><strong>Test Credentials:</strong></p>
          <p style={{ margin: '5px 0' }}>Admin: admin / admin123</p>
          <p style={{ margin: '5px 0' }}>Manager: manager / manager123</p>
          <p style={{ margin: '5px 0' }}>Staff: staff / staff123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
