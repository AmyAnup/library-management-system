import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function Borrows() {
  const [borrows, setBorrows] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ userId:'', bookId:'' });

  const fetchAll = async () => {
    const [b, bk, m] = await Promise.all([api.get('/borrows/all'), api.get('/books'), api.get('/members')]);
    setBorrows(b.data); setBooks(bk.data); setMembers(m.data);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleIssue = async (e) => {
    e.preventDefault();
    try { await api.post('/borrows/issue', form); fetchAll(); }
    catch (err) { alert(err.response?.data?.message); }
  };

  const handleReturn = async (id) => {
    const res = await api.put(`/borrows/return/${id}`);
    alert(`Returned! Days overdue: ${res.data.daysOverdue}`);
    fetchAll();
  };

  return (
    <div style={styles.container}>
      <h2 style={{marginBottom:16}}>Issue Book</h2>
      <form onSubmit={handleIssue} style={styles.form}>
        <select style={styles.input} value={form.userId} onChange={e => setForm({...form, userId: e.target.value})} required>
          <option value="">Select Member</option>
          {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
        </select>
        <select style={styles.input} value={form.bookId} onChange={e => setForm({...form, bookId: e.target.value})} required>
          <option value="">Select Book</option>
          {books.filter(b => b.available > 0).map(b => <option key={b._id} value={b._id}>{b.title}</option>)}
        </select>
        <button style={styles.btn} type="submit">Issue Book</button>
      </form>

      <h3 style={{marginBottom:12}}>All Borrows</h3>
      <table style={styles.table}>
        <thead><tr>{['Member','Book','Issue Date','Due Date','Status','Action'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
        <tbody>
          {borrows.map(b => (
            <tr key={b._id}>
              <td style={styles.td}>{b.user?.name}</td>
              <td style={styles.td}>{b.book?.title}</td>
              <td style={styles.td}>{new Date(b.issueDate).toLocaleDateString()}</td>
              <td style={styles.td}>{new Date(b.dueDate).toLocaleDateString()}</td>
              <td style={styles.td}><span style={{color: b.status==='borrowed'?'#1a73e8': b.status==='overdue'?'red':'green'}}>{b.status}</span></td>
              <td style={styles.td}>{b.status === 'borrowed' && <button style={styles.btnSmall} onClick={() => handleReturn(b._id)}>Return</button>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: { padding:24, maxWidth:1100, margin:'0 auto' },
  form: { background:'#fff', padding:20, borderRadius:12, marginBottom:24, display:'flex', gap:12 },
  input: { padding:9, borderRadius:6, border:'1px solid #ddd', fontSize:14, flex:1 },
  table: { width:'100%', borderCollapse:'collapse', background:'#fff', borderRadius:12, overflow:'hidden' },
  th: { background:'#1a73e8', color:'#fff', padding:12, textAlign:'left' },
  td: { padding:12, borderBottom:'1px solid #eee' },
  btn: { background:'#1a73e8', color:'#fff', border:'none', padding:'9px 18px', borderRadius:6, cursor:'pointer', fontWeight:'bold' },
  btnSmall: { background:'#43a047', color:'#fff', border:'none', padding:'5px 10px', borderRadius:6, cursor:'pointer', fontSize:12 }
};