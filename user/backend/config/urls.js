/**
 * Production deployment URLs — used as fallbacks when env vars are not set.
 * Prefer setting env vars on Render / Netlify (see .env.example files).
 */
const PRODUCTION = {
  FRONTEND_URL: 'https://ivotepk.netlify.app',
  BACKEND_URL: 'https://voting-4sb6.onrender.com',
  FRAUD_API_URL: 'https://voting-1-k5b9.onrender.com',
  RP_ID: 'ivotepk.netlify.app',
};

const LOCAL = {
  FRONTEND_URL: 'http://localhost:3000',
  BACKEND_URL: 'http://localhost:5000',
  FRAUD_API_URL: 'http://localhost:5001',
  RP_ID: 'localhost',
};

const isProduction = process.env.NODE_ENV === 'production';

const getClientUrl = () => {
  const url = process.env.CLIENT_URL || (isProduction ? PRODUCTION.FRONTEND_URL : LOCAL.FRONTEND_URL);
  return url.replace(/\/$/, '');
};

const getAllowedOrigins = () => {
  const origins = new Set([
    getClientUrl(),
    LOCAL.FRONTEND_URL,
    'http://127.0.0.1:3000',
    PRODUCTION.FRONTEND_URL,
  ]);
  return [...origins].filter(Boolean);
};

const getFraudApiUrl = () => {
  const url = process.env.AI_FRAUD_API || (isProduction ? PRODUCTION.FRAUD_API_URL : LOCAL.FRAUD_API_URL);
  return url.replace(/\/$/, '');
};

const getRpId = () => {
  return process.env.RP_ID || (isProduction ? PRODUCTION.RP_ID : LOCAL.RP_ID);
};

module.exports = {
  PRODUCTION,
  LOCAL,
  getClientUrl,
  getAllowedOrigins,
  getFraudApiUrl,
  getRpId,
};
