import { useState } from 'react';
import './Signup.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Signup attempt:', { name, email, password });
  };

  const handleGithubOAuth = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`;
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1 className="signup-title">Create Account</h1>
        <button onClick={handleGithubOAuth} className='github-signup'>
            Sign Up With GitHub
          </button>

   
        <p className="signup-footer">
          Already have an account?{" "}
          <a href="/login" className="signup-link">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
