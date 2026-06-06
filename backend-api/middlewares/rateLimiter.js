const rateLimit = require('express-rate-limit');

// 1. Strict limiter for Authentication Write Operations (Signup)
// Excludes /me which is a read operation
const authWriteLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 attempts per hour
  message: {
    error: 'Too many registration attempts, please try again after an hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 2. Module-Specific Limiter (Weather, Market, Disease Detection)
// Configurable per hour per user (IP-based)
const moduleLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 requests per hour per module
  message: {
    error: 'Module request limit exceeded. Please try again after an hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 3. Prediction Specific Limiter (Disease/Weather ML models)
// These are computationally expensive, so we set a lower limit
const predictionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 15, // 15 predictions per hour
  message: {
    error: 'Daily prediction limit reached for this hour. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { 
  authWriteLimiter, 
  moduleLimiter, 
  predictionLimiter 
};
