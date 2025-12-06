import React, { useState } from 'react';
import AuthForm from './AuthForm';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const [mode, setMode] = useState('signup'); // or 'login'
  const navigate = useNavigate();

  const onSuccess = (user) => {
    navigate('/dashboard');
  };

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <div className="brand">Assignment Auth</div>
          <div className="muted">Smooth UI — MERN + JWT</div>
        </div>

        <div style={{marginTop:18}}>
          <h2>{mode === 'signup' ? 'Create an account' : 'Welcome back'}</h2>
          <p className="muted">{mode === 'signup' ? 'Sign up to finish the assignment' : 'Sign in to view dashboard'}</p>
        </div>

        <AuthForm mode={mode} onSuccess={onSuccess} />

        <div className="toggle">
          <button className="link-btn" onClick={()=>setMode(mode === 'signup' ? 'login' : 'signup')}>
            {mode === 'signup' ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
          </button>
        </div>
      </div>
    </div>
  );
}
