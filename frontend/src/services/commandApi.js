import axios from 'axios';
const api = axios.create({ baseURL: process.env.REACT_APP_API_BASE || '' });

export const createCustomer = (payload) => api.post('/command/customer/create', payload);
export const updateCustomer = (id, payload) => api.put(`/command/customer/update/${id}`, payload);

export const openAccount = (payload) => api.post('/command/account/open', payload);
export const deposit = (payload) => api.post('/command/account/deposit', payload);
export const withdraw = (payload) => api.post('/command/account/withdraw', payload);

// Starts a transfer saga; returns sagaId or transferId depending on backend
export const startTransfer = (payload) => api.post('/command/account/transfer', payload);

// Optional: endpoint to check saga status (if you implement it)
// e.g. GET /command/saga/{sagaId}
export const getSagaStatus = (sagaId) => api.get(`/command/saga/${sagaId}`);

export default {
  createCustomer, updateCustomer, openAccount, deposit, withdraw, startTransfer, getSagaStatus
};
