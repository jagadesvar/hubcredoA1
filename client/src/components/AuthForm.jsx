import React, { useState } from 'react';
import API from '../api';

export default function AuthForm({ mode, onSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const payload = mode === 'signup' ? { name, email, password } : { email, password };
      const url = mode === 'signup' ? '/auth/signup' : '/auth/login';
      const res = await API.post(url, payload);
      onSuccess(res.data.user || {});
    } catch (err) {
      setError(err?.response?.data?.error || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-card">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {mode === 'signup' && (
          <label className="field">
            <div className="label">Full Name</div>
            <input
              className="input"
              placeholder="Ex: Jagades"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </label>
        )}

        <label className="field">
          <div className="label">Email</div>
          <input
            className="input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="field">
          <div className="label">Password</div>
          <input
            className="input"
            type="password"
            placeholder="Minimum 6 characters"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </label>

        {error && <div className="auth-error">{error}</div>}

        <button className="auth-cta" type="submit" disabled={busy}>
          {busy ? (mode === 'signup' ? 'Creating...' : 'Signing in...') : (mode === 'signup' ? 'Create Account' : 'Sign In')}
        </button>
      </form>
    </div>
  );
}
