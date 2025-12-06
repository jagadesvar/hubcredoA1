import React, { useState } from 'react';
import API from '../api';

export default function AuthForm({ mode, onSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const payload = mode === 'signup' ? { name, email, password } : { email, password };
      const url = mode === 'signup' ? '/auth/signup' : '/auth/login';
      const res = await API.post(url, payload);
      onSuccess(res.data.user || {});
    } catch (err) {
      setError(err?.response?.data?.error || 'Something went wrong');
    }
  }

  return (
    <form className="form card" onSubmit={handleSubmit}>
      {mode === 'signup' && (
        <input className="input" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required />
      )}
      <input className="input" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
      <input className="input" type="password" placeholder="Password (6+ chars)" value={password} onChange={e=>setPassword(e.target.value)} required />
      {error && <div className="error">{error}</div>}
      <button className="btn" type="submit">{mode === 'signup' ? 'Create account' : 'Sign in'}</button>
    </form>
  );
}
