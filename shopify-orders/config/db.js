const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123',
  database: 'shopify_orders'
});

module.exports = db;
