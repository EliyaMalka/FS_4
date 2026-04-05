import { useState } from 'react';
import './LoginScreen.css';

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmed = username.trim();
    if (!trimmed) {
      setError('Please enter a username');
      return;
    }
    if (trimmed.length < 2) {
      setError('Username must be at least 2 characters');
      return;
    }
    if (trimmed.length > 20) {
      setError('Username must be 20 characters or less');
      return;
    }

    const success = onLogin(trimmed);
    if (!success) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">✦</div>
          <h1>Visual Text Editor</h1>
          <p>Create beautifully styled documents</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-input-group">
            <label htmlFor="username-input">Username</label>
            <input
              id="username-input"
              className="login-input"
              type="text"
              placeholder="Enter your username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              autoComplete="off"
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button
            id="login-btn"
            type="submit"
            className="login-btn"
            disabled={!username.trim()}
          >
            Enter Editor →
          </button>
        </form>

        <p className="login-hint">
          New users are automatically registered
        </p>
      </div>
    </div>
  );
}
