/**
 * Backend API base URL.
 * Uses REACT_APP_API_URL when set at build time; otherwise detects environment at runtime
 * so Netlify/production never falls back to localhost.
 */
const PRODUCTION_API_URL = 'https://voting-4sb6.onrender.com';
const LOCAL_API_URL = 'http://localhost:5000';

function resolveApiBase() {
  const fromEnv = process.env.REACT_APP_API_URL;
  if (fromEnv && String(fromEnv).trim()) {
    return String(fromEnv).replace(/\/$/, '');
  }

  if (typeof window !== 'undefined') {
    const { hostname } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return LOCAL_API_URL;
    }
    // Deployed frontend (Netlify or custom domain) → production API
    if (hostname.endsWith('.netlify.app') || hostname.includes('ivotepk')) {
      return PRODUCTION_API_URL;
    }
  }

  return process.env.NODE_ENV === 'production' ? PRODUCTION_API_URL : LOCAL_API_URL;
}

export const API_BASE = resolveApiBase();
