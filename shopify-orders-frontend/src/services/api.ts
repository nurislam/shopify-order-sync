import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001', 
});

export const fetchOrders = () => api.get('/orders');
export const fetchOrderById = (id: number) => api.get(`/orders/${id}`);
