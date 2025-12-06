import axios from 'axios';
const api = axios.create({ baseURL: process.env.REACT_APP_API_BASE || '' });

export const getAccounts = () => api.get('/query/account/summary'); // returns list
export const getAccount = (id) => api.get(`/query/account/${id}`); // account detail + read model
export const getTransactionsByAccount = (accountId) =>
  api.get(`/query/transactions/by-account/${accountId}`);

export default { getAccounts, getAccount, getTransactionsByAccount };
