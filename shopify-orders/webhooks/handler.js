const crypto = require('crypto');
const db = require('../config/db');

const SHOPIFY_SECRET = process.env.SHOPIFY_SECRET;

function verifyHMAC(req) {
  const hmacHeader = req.headers['X-Shopify-Access-Token'];
  const body = req.body;
  const hash = crypto
    .createHmac('sha256', SHOPIFY_SECRET)
    .update(body, 'utf8')
    .digest('base64');

  return hash === hmacHeader;
}

module.exports = async (req, res) => {
  if (!verifyHMAC(req)) return res.status(401).send("Unauthorized");

  const order = JSON.parse(req.body);
  const orderId = order.id;
 

  res.status(200).send('Received');
};
