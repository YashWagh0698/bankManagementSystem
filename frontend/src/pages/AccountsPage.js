import React, { useEffect, useState } from 'react';
import queryApi from '../services/queryApi';
import commandApi from '../services/commandApi';

export default function AccountsPage(){
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await queryApi.getAccounts();
      setAccounts(res.data || []);
    } catch (e) {
      console.error(e);
      alert('Failed to load accounts');
    } finally { setLoading(false); }
  };

  const onSelect = async (acc) => {
    setSelected(null);
    try {
      const res = await queryApi.getAccount(acc.accountId);
      setSelected(res.data);
    } catch (e) {
      console.error(e);
      alert('Failed to load account detail');
    }
  };

  const depositHandler = async () => {
    if (!selected || !amount) return alert('Choose account and amount');
    try {
      await commandApi.deposit({ accountId: selected.accountId, amount: Number(amount) });
      alert('Deposit command submitted');
      setAmount('');
      load();
      onSelect(selected);
    } catch(e) { console.error(e); alert('Deposit failed'); }
  };

  const withdrawHandler = async () => {
    if (!selected || !amount) return alert('Choose account and amount');
    try {
      await commandApi.withdraw({ accountId: selected.accountId, amount: Number(amount) });
      alert('Withdraw command submitted');
      setAmount('');
      load();
      onSelect(selected);
    } catch(e){ console.error(e); alert('Withdraw failed'); }
  };

  return (
    <div>
      <h2>Accounts</h2>
      <div className="row">
        <div className="col card">
          <h3>Account List {loading ? '(loading...)' : ''}</h3>
          {accounts.length === 0 && <div className="small">No accounts</div>}
          {accounts.map(a => (
            <div key={a.accountId} style={{padding:'8px 0', borderBottom:'1px solid #f0f0f0'}}>
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <div>
                  <strong>{a.customerName}</strong> • {a.accountType}
                </div>
                <div>
                  <button className="button" onClick={() => onSelect(a)}>View</button>
                </div>
              </div>
              <div className="small">Balance: ₹{a.balance}</div>
            </div>
          ))}
        </div>

        <div className="col card">
          <h3>Account Details</h3>
          {!selected && <div className="small">Select an account</div>}
          {selected && (
            <>
              <div><strong>{selected.customerName}</strong></div>
              <div className="small">Account: {selected.accountType} • Balance: ₹{selected.balance}</div>

              <div style={{marginTop:12}}>
                <input className="input" placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} />
                <div style={{display:'flex', gap:8}}>
                  <button className="button" onClick={depositHandler}>Deposit</button>
                  <button className="button" onClick={withdrawHandler}>Withdraw</button>
                </div>
              </div>

              <div style={{marginTop:12}}>
                <h4>Recent Transactions</h4>
                <TransactionList accountId={selected.accountId} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function TransactionList({ accountId }){
  const [txs, setTxs] = React.useState([]);
  useEffect(() => {
    if(!accountId) return;
    (async () => {
      try {
        const res = await queryApi.getTransactionsByAccount(accountId);
        setTxs(res.data || []);
      } catch(e){ console.error(e); }
    })();
  }, [accountId]);

  if(!accountId) return null;
  return (
    <div>
      {txs.map(t => (
        <div key={t.transactionId} style={{borderBottom:'1px dashed #eee', padding:'6px 0'}}>
          <div><strong>{t.type}</strong> ₹{t.amount} <span className="small">• {t.status}</span></div>
          <div className="small">{new Date(t.createdAt).toLocaleString()}</div>
        </div>
      ))}
      {txs.length === 0 && <div className="small">No transactions</div>}
    </div>
  );
}
