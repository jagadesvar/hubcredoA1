import React, { useState } from 'react';
import AuthForm from './AuthForm';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const [mode, setMode] = useState('signup');
  const navigate = useNavigate();

  const onSuccess = (user) => {
    navigate('/dashboard');
  };

  return (
    <div className="auth-root">
      <div className="auth-wrapper">
        <div className="auth-icon">🧑‍💻</div>
        <h1 className="auth-heading">{mode === 'signup' ? 'Create an Account' : 'Welcome Back'}</h1>
        <p className="auth-sub">
          {mode === 'signup'
            ? 'Made by Jagadesvar'
            : 'Made by Jagadesvar'}
        </p>

        <AuthForm mode={mode} onSuccess={onSuccess} />

        <div className="auth-switch">
          <button className="link-btn" onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}>
            {mode === 'signup'
              ? 'Already have an account? Sign in'
              : "Don't have an account? Create one"}
          </button>
        </div>
      </div>
    </div>
  );
}
