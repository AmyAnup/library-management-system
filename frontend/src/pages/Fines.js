import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Fines() {
  const { user } = useAuth();
  const [fines, setFines] = useState([]);

  const fetchFines = async () => {
    const res = await api.get(user?.role === 'admin' ? '/fines' : '/fines/my');
    setFines(res.data);
  };

  useEffect(() => { fetchFines(); }, []);

  const handlePay = async (id) => { await api.put(`/fines/pay/${id}`); fetchFines(); };
  const handleWaive = async (id) => {
    const reason = prompt('Waiver reason:');
    if (reason) { await api.put(`/fines/waive/${id}`, { reason }); fetchFines(); }
  };

  return (
    <div style={styles.container}>
      <h2 style={{marginBottom:16}}>Fines</h2>
      <table style={styles.table}>
        <thead><tr>{['Member','Amount','Days Overdue','Status','Actions'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
        <tbody>
          {fines.map(f => (
            <tr key={f._id}>
              <td style={styles.td}>{f.user?.name || 'You'}</td>
              <td style={styles.td}>₹{f.amount}</td>
              <td style={styles.td}>{f.daysOverdue} days</td>
              <td style={styles.td}><span style={{color: f.status==='paid'?'green': f.status==='waived'?'#1a73e8':'red'}}>{f.status}</span></td>
              <td style={styles.td}>
                {f.status === 'pending' && user?.role === 'admin' && <>
                  <button style={styles.btnPay} onClick={() => handlePay(f._id)}>Mark Paid</button>
                  <button style={styles.btnWaive} onClick={() => handleWaive(f._id)}>Waive</button>
                </>}
                {f.waiverReason && <span style={{fontSize:12, color:'#666'}}> Reason: {f.waiverReason}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: { padding:24, maxWidth:1100, margin:'0 auto' },
  table: { width:'100%', borderCollapse:'collapse', background:'#fff', borderRadius:12, overflow:'hidden' },
  th: { background:'#1a73e8', color:'#fff', padding:12, textAlign:'left' },
  td: { padding:12, borderBottom:'1px solid #eee' },
  btnPay: { background:'#43a047', color:'#fff', border:'none', padding:'5px 10px', borderRadius:6, cursor:'pointer', fontSize:12, marginRight:6 },
  btnWaive: { background:'#fb8c00', color:'#fff', border:'none', padding:'5px 10px', borderRadius:6, cursor:'pointer', fontSize:12 }
};