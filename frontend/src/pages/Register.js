import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'member', phone:'', address:'' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>📚 Library MS</h2>
        <h3 style={styles.subtitle}>Register</h3>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          <input style={styles.input} type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          <input style={styles.input} type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          <input style={styles.input} placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          <input style={styles.input} placeholder="Address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
          <select style={styles.input} value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
          <button style={styles.button} type="submit">Register</button>
        </form>
        <p style={{marginTop:12}}>Already have account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh', background:'#f0f2f5' },
  card: { background:'#fff', padding:40, borderRadius:12, boxShadow:'0 2px 16px rgba(0,0,0,0.1)', width:360 },
  title: { textAlign:'center', marginBottom:4, color:'#1a73e8' },
  subtitle: { textAlign:'center', marginBottom:20, color:'#555' },
  input: { width:'100%', padding:10, marginBottom:12, borderRadius:6, border:'1px solid #ddd', fontSize:14 },
  button: { width:'100%', padding:10, background:'#1a73e8', color:'#fff', border:'none', borderRadius:6, fontSize:15, cursor:'pointer' },
  error: { color:'red', marginBottom:12, textAlign:'center' }
};