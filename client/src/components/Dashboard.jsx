import React, { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(()=>{
    async function load() {
      try {
        const res = await API.get('/auth/me');
        setUser(res.data.user);
      } catch (err) {
        navigate('/');
      }
    }
    load();
  }, [navigate]);

  async function logout() {
    try {
      await API.post('/auth/logout');
    } catch (err) {
      // ignore
    } finally {
      navigate('/');
    }
  }

  return (
    <div className="container">
      <div className="card welcome">
        <h1>Assignment completed</h1>
        <p>Welcome, {user ? user.name : 'User'} 🎉</p>
        <button className="btn" onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
