import React, { useState, useEffect } from 'react';
import commandApi from '../services/commandApi';
import queryApi from '../services/queryApi';

export default function CustomerPage(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [customers, setCustomers] = useState([]);

  useEffect(()=> load(), []);

  const load = async () => {
    try {
      const res = await queryApi.getAccounts(); // assuming account summary returns customerName and id
      // If you have a dedicated customer query endpoint, use that
      setCustomers((res.data || []).map(a => ({ name: a.customerName, id: a.customerId })));
    } catch(e) {
      console.error(e);
    }
  };

  const onCreate = async () => {
    if(!name || !email) return alert('name & email');
    try {
      await commandApi.createCustomer({ firstName: name, lastName:'', email, phone:'' });
      alert('Customer created (command submitted)');
      setName(''); setEmail('');
      load();
    } catch(e){ console.error(e); alert('Create failed'); }
  };

  return (
    <div>
      <h2>Customers</h2>
      <div className="card">
        <h3>Create Customer</h3>
        <input className="input" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <button className="button" onClick={onCreate}>Create</button>
      </div>

      <div className="card">
        <h3>Customers (from accounts read model)</h3>
        {customers.length === 0 && <div className="small">No customers</div>}
        {customers.map(c => <div key={c.id}>{c.name}</div>)}
      </div>
    </div>
  );
}
