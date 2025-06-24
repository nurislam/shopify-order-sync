require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/db');
const webhookHandler = require('./webhooks/handler');
const http = require('http');
const { Server } = require('socket.io');

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.raw({ type: 'application/json' }));



const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});


io.on('connection', (socket) => {
  console.log('🔌 WebSocket client connected');
});


function notifyClients(order) {
  io.emit('new-order', order);
}



app.get('/orders', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT orders.*, customers.email AS customer_email
      FROM orders
      LEFT JOIN customers ON customers.id = orders.customer_id
      ORDER BY created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).send('Database error');
  }
});

// Webhook endpoint
app.post('/webhooks/orders/create', async (req, res) => {
  const rawBody = req.body;
  const signature = req.headers['X-Shopify-Access-Token'];
  const crypto = require('crypto');
  const secret = process.env.SHOPIFY_SECRET;

  const hash = crypto
    .createHmac('sha256', secret)
    .update(rawBody, 'utf8')
    .digest('base64');

  if (hash !== signature) {
    return res.status(401).send('Unauthorized');
  }

  const order = JSON.parse(rawBody);

  
  try {
    const orderId = order.id;
    const customer = order.customer;
    if (customer) {
      await db.query(
        'INSERT IGNORE INTO customers (id, email, first_name, last_name) VALUES (?, ?, ?, ?)',
        [customer.id, customer.email, customer.first_name, customer.last_name]
      );
    }

    await db.query(
      'INSERT IGNORE INTO orders (id, customer_id, total_price, created_at) VALUES (?, ?, ?, ?)',
      [orderId, customer?.id || null, order.total_price, order.created_at]
    );

    for (const item of order.line_items) {
      await db.query(
        'INSERT IGNORE INTO line_items (id, order_id, title, quantity, price) VALUES (?, ?, ?, ?, ?)',
        [item.id, orderId, item.title, item.quantity, item.price]
      );
    }

    notifyClients({ id: order.id, customer_email: customer?.email || '', total_price: order.total_price, created_at: order.created_at });

    res.status(200).send('OK');
  } catch (err) {
    console.error('Webhook DB error:', err);
    res.status(500).send('Error processing order');
  }
});

// Start server
server.listen(3001, () => {
  console.log('Backend API running at http://localhost:3001');
});
