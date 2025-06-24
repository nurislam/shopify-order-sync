const Shopify = require('shopify-api-node');
require('dotenv').config();

const shopify = new Shopify({
  shopName: process.env.SHOPIFY_SHOP,
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
  apiVersion: '2025-04',
});

module.exports = shopify;
