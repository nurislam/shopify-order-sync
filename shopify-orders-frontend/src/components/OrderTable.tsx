import { useEffect, useState } from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer,
  TextField, TableSortLabel
} from '@mui/material';
import { fetchOrders } from '../services/api';
import { io } from 'socket.io-client';

type Order = {
  id: number;
  total_price: string;
  created_at: string;
  customer_email: string;
};

// Connect to WebSocket
const socket = io('http://localhost:3001');

export default function OrderTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [sortAsc, setSortAsc] = useState(true);

  
  const getOrders = async () => {
    const response = await fetchOrders();
    setOrders(response.data);
  };

  useEffect(() => {
    getOrders();

    
    socket.on('new-order', (order: Order) => {
      alert('New Order Received: ' + order.id);
      getOrders(); 
    });

    return () => {
      socket.off('new-order'); 
    };
  }, []);

  const filtered = orders.filter(order =>
    order.customer_email?.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) =>
    sortAsc
      ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <>
      <TextField
        label="Search by Email"
        variant="outlined"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ my: 2 }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>
                <TableSortLabel
                  active
                  direction={sortAsc ? 'asc' : 'desc'}
                  onClick={() => setSortAsc(!sortAsc)}
                >
                  Created At
                </TableSortLabel>
              </TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Total Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sorted.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                <TableCell>{order.customer_email}</TableCell>
                <TableCell>${order.total_price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
