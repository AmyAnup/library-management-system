import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.user, res.data.token);
      navigate(res.data.user.role === 'admin' ? '/' : '/books');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>📚 Library MS</h2>
        <h3 style={styles.subtitle}>Login</h3>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} type="email" placeholder="Email"
            value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          <input style={styles.input} type="password" placeholder="Password"
            value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          <button style={styles.button} type="submit">Login</button>
        </form>
        <p style={{marginTop:12}}>No account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'#f0f2f5' },
  card: { background:'#fff', padding:40, borderRadius:12, boxShadow:'0 2px 16px rgba(0,0,0,0.1)', width:360 },
  title: { textAlign:'center', marginBottom:4, color:'#1a73e8' },
  subtitle: { textAlign:'center', marginBottom:20, color:'#555' },
  input: { width:'100%', padding:10, marginBottom:12, borderRadius:6, border:'1px solid #ddd', fontSize:14 },
  button: { width:'100%', padding:10, background:'#1a73e8', color:'#fff', border:'none', borderRadius:6, fontSize:15, cursor:'pointer' },
  error: { color:'red', marginBottom:12, textAlign:'center' }
};