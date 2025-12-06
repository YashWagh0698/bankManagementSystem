import React, { useState } from 'react';
import commandApi from '../services/commandApi';
import queryApi from '../services/queryApi';

export default function TransferPage(){
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [status, setStatus] = useState(null);
  const [sagaId, setSagaId] = useState(null);

  React.useEffect(() => {
    (async ()=> {
      try {
        const res = await queryApi.getAccounts();
        setAccounts(res.data || []);
      } catch(e){ console.error(e); }
    })();
  }, []);

  const start = async () => {
    if(!fromAccount || !toAccount || !amount) return alert('fill fields');
    setStatus('Starting transfer...');
    try {
      const res = await commandApi.startTransfer({
        fromAccountId: fromAccount,
        toAccountId: toAccount,
        amount: Number(amount)
      });
      // Expect backend to return something like { sagaId: '...' } or { transferId: '...' }
      const returned = res.data;
      const id = returned.sagaId || returned.transferId;
      setSagaId(id);
      pollSaga(id);
    } catch(e){ console.error(e); alert('Transfer failed to start'); setStatus(null); }
  };

  const pollSaga = async (id) => {
    setStatus('Waiting for saga result...');
    // poll every 1.5s, stop after 20 tries
    let tries = 0;
    const interval = setInterval(async () => {
      tries++;
      try {
        const res = await commandApi.getSagaStatus(id);
        const s = res.data;
        if (s && s.status) {
          setStatus(`Saga status: ${s.status}`);
          if (s.status === 'SUCCESS' || s.status === 'FAILED') {
            clearInterval(interval);
          }
        }
      } catch(e) {
        // if backend doesn't expose saga status, you could alternatively query account read models:
        try {
          const fa = await queryApi.getAccount(fromAccount);
          const ta = await queryApi.getAccount(toAccount);
          setStatus('Checking read model… from balance: ' + fa.data.balance + ' to: ' + ta.data.balance);
          clearInterval(interval);
        } catch(err){ /* ignore */ }
      }
      if(tries > 20) { clearInterval(interval); setStatus('Timed out waiting for saga'); }
    }, 1500);
  };

  return (
    <div>
      <h2>Transfer Money</h2>
      <div className="card">
        <div className="row">
          <select className="input" value={fromAccount} onChange={e=>setFromAccount(e.target.value)}>
            <option value="">-- From account --</option>
            {accounts.map(a => <option key={a.accountId} value={a.accountId}>{a.customerName} • {a.accountType} • ₹{a.balance}</option>)}
          </select>

          <select className="input" value={toAccount} onChange={e=>setToAccount(e.target.value)}>
            <option value="">-- To account --</option>
            {accounts.map(a => <option key={a.accountId} value={a.accountId}>{a.customerName} • {a.accountType} • ₹{a.balance}</option>)}
          </select>
        </div>

        <input className="input" placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} />
        <div style={{display:'flex', gap:8}}>
          <button className="button" onClick={start}>Start Transfer</button>
        </div>

        {status && <div style={{marginTop:12}} className="small">Status: {status}</div>}
        {sagaId && <div className="small">SagaId: {sagaId}</div>}
      </div>
    </div>
  );
}
