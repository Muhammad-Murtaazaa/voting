/**
 * Backend base URL for fetch calls.
 * Production: set REACT_APP_API_URL on Netlify (or uses fallback below).
 */
const PRODUCTION_API_URL = 'https://voting-4sb6.onrender.com';

export const API_BASE =
  (typeof process !== 'undefined' && process.env.REACT_APP_API_URL) ||
  (typeof process !== 'undefined' && process.env.NODE_ENV === 'production'
    ? PRODUCTION_API_URL
    : 'http://localhost:5000');
