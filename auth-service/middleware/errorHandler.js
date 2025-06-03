// server/middleware/errorHandler.js
const logger = require('./logger');

function errorHandler(err, req, res, next) {
  logger.error(err.stack);
  res.status(err.status || 500).json({ message: err.message });
}

module.exports = errorHandler;
