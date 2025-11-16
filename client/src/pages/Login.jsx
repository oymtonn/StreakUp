import { useState } from 'react';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
  };

  const handleGithubOAuth = () => {
    window.location.href = 'http://localhost:3001/auth/github';
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Welcome Back</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label htmlFor="email" className="login-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="login-input"
            />
          </div>

          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>
        <div className='separator' style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
  <span style={{ flex: 1, height: '1px', backgroundColor: '#d1d5db' }}></span>
  <span style={{ padding: '0 10px', color: '#6b7280', fontSize: '0.85rem' }}>OR</span>
  <span style={{ flex: 1, height: '1px', backgroundColor: '#d1d5db' }}></span>
</div>

        <button onClick={handleGithubOAuth} className='github-login' >
            Sign In With GitHub
          </button>

        <p className="login-footer">
          Don't have an account?{" "}
          <a href={'/signup'} className="login-link">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
