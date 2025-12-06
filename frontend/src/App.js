import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AccountsPage from './pages/AccountsPage';
import CustomerPage from './pages/CustomerPage';
import TransferPage from './pages/TransferPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="topnav">
          <Link to="/">Accounts</Link>
          <Link to="/customers">Customers</Link>
          <Link to="/transfer">Transfer</Link>
        </nav>
        <main className="main">
          <Routes>
            <Route path="/" element={<AccountsPage />} />
            <Route path="/customers" element={<CustomerPage />} />
            <Route path="/transfer" element={<TransferPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
