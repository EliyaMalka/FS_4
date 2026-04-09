import { useState } from 'react';
import './LoginScreen.css';

export default function LoginScreen({ onLogin, onRegister }) {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'login') {
      const result = onLogin(username.trim(), password);
      if (!result.success) {
        setError(result.error);
      }
    } else {
      const result = onRegister(username.trim(), password, confirmPassword);
      if (!result.success) {
        setError(result.error);
      }
    }
  };

  const switchMode = () => {
    setMode(prev => prev === 'login' ? 'signup' : 'login');
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  const isLogin = mode === 'login';

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">✦</div>
          <h1>Visual Text Editor</h1>
          <p>Create beautifully styled documents</p>
        </div>

        {/* Mode Tabs */}
        <div className="login-tabs">
          <button
            className={`login-tab ${isLogin ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError(''); }}
            type="button"
          >
            Login
          </button>
          <button
            className={`login-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => { setMode('signup'); setError(''); }}
            type="button"
          >
            Sign Up
          </button>
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

          <div className="login-input-group">
            <label htmlFor="password-input">Password</label>
            <input
              id="password-input"
              className="login-input"
              type="password"
              placeholder={isLogin ? "Enter your password..." : "Choose a password (4+ chars)..."}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
            />
          </div>

          {!isLogin && (
            <div className="login-input-group">
              <label htmlFor="confirm-password-input">Confirm Password</label>
              <input
                id="confirm-password-input"
                className="login-input"
                type="password"
                placeholder="Confirm your password..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="off"
              />
            </div>
          )}

          {error && <div className="login-error">{error}</div>}

          <button
            id="login-btn"
            type="submit"
            className="login-btn"
            disabled={!username.trim() || !password}
          >
            {isLogin ? 'Login →' : 'Create Account →'}
          </button>
        </form>

        <p className="login-hint">
          {isLogin ? (
            <>Don't have an account? <button type="button" className="login-link" onClick={switchMode}>Sign Up</button></>
          ) : (
            <>Already have an account? <button type="button" className="login-link" onClick={switchMode}>Login</button></>
          )}
        </p>
      </div>
    </div>
  );
}
