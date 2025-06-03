// auth-service/config/redis.js
const { createClient } = require('redis');
require('dotenv').config(); // Ensure .env variables are loaded

const redisClient = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10),
    connectTimeout: 10000, // 10 seconds timeout for connection
  },
});

redisClient.on('connect', () => {
  console.log('✅ Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis Client Error:', err);
  // Depending on the error, you might want to implement a graceful shutdown
  // or prevent the app from starting if Redis is critical.
});

// Asynchronously connect the client.
// This IIFE handles the async connection.
(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error('❌ Failed to connect to Redis during initial setup:', err);
    // Optionally, re-throw or process.exit(1) if Redis is absolutely critical at startup.
  }
})();

module.exports = redisClient;