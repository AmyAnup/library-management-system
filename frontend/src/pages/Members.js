import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');

  const fetchMembers = async () => {
    const res = await api.get('/members', { params: { search } });
    setMembers(res.data);
  };

  useEffect(() => { fetchMembers(); }, [search]);

  const toggleStatus = async (id) => {
    await api.put(`/members/${id}/toggle`);
    fetchMembers();
  };

  return (
    <div style={styles.container}>
      <h2 style={{marginBottom:16}}>Members</h2>
      <input style={styles.input} placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
      <table style={styles.table}>
        <thead><tr>{['Name','Email','Phone','Status','Action'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
        <tbody>
          {members.map(m => (
            <tr key={m._id}>
              <td style={styles.td}>{m.name}</td>
              <td style={styles.td}>{m.email}</td>
              <td style={styles.td}>{m.phone || '-'}</td>
              <td style={styles.td}><span style={{color: m.isActive ? 'green' : 'red'}}>{m.isActive ? 'Active' : 'Inactive'}</span></td>
              <td style={styles.td}><button style={styles.btn} onClick={() => toggleStatus(m._id)}>{m.isActive ? 'Deactivate' : 'Activate'}</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: { padding:24, maxWidth:1100, margin:'0 auto' },
  input: { padding:9, borderRadius:6, border:'1px solid #ddd', fontSize:14, width:300, marginBottom:16 },
  table: { width:'100%', borderCollapse:'collapse', background:'#fff', borderRadius:12, overflow:'hidden' },
  th: { background:'#1a73e8', color:'#fff', padding:12, textAlign:'left' },
  td: { padding:12, borderBottom:'1px solid #eee' },
  btn: { background:'#1a73e8', color:'#fff', border:'none', padding:'5px 10px', borderRadius:6, cursor:'pointer', fontSize:12 }
};