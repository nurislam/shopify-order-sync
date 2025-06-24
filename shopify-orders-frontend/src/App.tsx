import { Container } from '@mui/material';
import OrderTable from './components/OrderTable';

function App() {
  return (
    <Container>
      <div style={{ padding: 20,margin: 'auto', maxWidth: 1200 }}>
      <h1>Shopify Orders</h1>
      <OrderTable />
    </div>
    </Container>
  );
}

export default App;
