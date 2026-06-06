const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../logs/auth.log');

// Ensure logs directory exists
if (!fs.existsSync(path.dirname(logFilePath))) {
  fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
}

const logger = {
  info: (message, details = {}) => {
    const logEntry = `[${new Date().toISOString()}] INFO: ${message} | Details: ${JSON.stringify(details)}\n`;
    fs.appendFileSync(logFilePath, logEntry);
    console.log(logEntry.trim());
  },
  error: (message, error = {}) => {
    const logEntry = `[${new Date().toISOString()}] ERROR: ${message} | Error: ${error.message || error} | Stack: ${error.stack || 'N/A'}\n`;
    fs.appendFileSync(logFilePath, logEntry);
    console.error(logEntry.trim());
  },
  warn: (message, details = {}) => {
    const logEntry = `[${new Date().toISOString()}] WARN: ${message} | Details: ${JSON.stringify(details)}\n`;
    fs.appendFileSync(logFilePath, logEntry);
    console.warn(logEntry.trim());
  }
};

module.exports = logger;
