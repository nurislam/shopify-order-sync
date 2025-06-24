# Shopify Orders Sync Backend

This backend service connects to a Shopify store via GraphQL, syncs orders into a MySQL database, and emits real-time updates to connected frontends using WebSockets.

---

## Features

- Sync Shopify orders via GraphQL using `shopify-api-node`
- Store orders, line items, and customers in MySQL
- Webhook support (`orders/create`) for real-time updates
- API to retrieve orders from MySQL
- Emits `new-order` events via Socket.IO to frontend clients

---

## Architecture Overview

- Node.js (Express): API & Webhook handler
- MySQL: Stores customers, orders, line items
- Socket.IO: Sends real-time updates to frontend
- Shopify GraphQL API: Data source

---
## Requirements

- Node.js 22+   


## Install dependencies

By default, dependencies were installed when this application was generated.
Whenever dependencies in `package.json` are changed, run the following command:

```sh
npm init -y
```

To only install resolved dependencies in `package-lock.json`:

```sh
npm install shopify-api-node dotenv mysql2 axios express body-parser crypto
npm install -D nodemon
```

## Setup MySQL

```sh
CREATE DATABASE shopify_orders;
 
USE shopify_orders;
 
CREATE TABLE customers (
  id BIGINT PRIMARY KEY,
  email VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255)
);

CREATE TABLE orders (
  id BIGINT PRIMARY KEY,
  customer_id BIGINT,
  total_price DECIMAL(10,2),
  created_at DATETIME,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE line_items (
  id BIGINT PRIMARY KEY,
  order_id BIGINT,
  title VARCHAR(255),
  quantity INT,
  price DECIMAL(10,2),
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

```
## Configure Database  

The file directory - config\db.js
```sh
  host: 'localhost',
  user: 'root',
  password: '123',
  database: 'shopify_orders'
  ```

## Run Sync Script 
```sh
node sync/fetchOrders.js
```

## Start the Server

```sh
node server.js
```
## Test it
Go to http://localhost:3001/orders — it should return JSON with orders

## Use Postman or cURL
```sh
curl http://localhost:3001/orders
```

### Development Tips
```sh
npx nodemon server.js
```

### Run with Docker
```sh
docker-compose up --build
```