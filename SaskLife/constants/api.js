/**
 * API configuration for the SaskLife Expo app.
 *
 * Development: set EXPO_PUBLIC_API_URL to your machine's LAN IP address
 *   (e.g. http://192.168.1.42:5000) — do NOT use "localhost" because the
 *   Android/iOS device/emulator cannot reach the host machine via localhost.
 *
 * Production: set EXPO_PUBLIC_API_URL to your Railway (or other cloud) URL,
 *   e.g. https://sasklifehub-backend.up.railway.app
 *
 * The variable is read from the environment at build time via Expo's
 * EXPO_PUBLIC_ convention (requires SDK 49+).
 */

// Replace YOUR_LOCAL_IP with your machine's LAN IP address for local dev.
const API_BASE =
  process.env.EXPO_PUBLIC_API_URL || 'http://YOUR_LOCAL_IP:5000';

// ── Auth endpoints ────────────────────────────────────────────────────────────
export const AUTH_SIGNUP = `${API_BASE}/auth/signup`;
export const AUTH_LOGIN = `${API_BASE}/auth/login`;
export const AUTH_LOGOUT = `${API_BASE}/auth/logout`;
export const AUTH_REFRESH = `${API_BASE}/auth/refresh`;
export const AUTH_ME = `${API_BASE}/auth/me`;
export const AUTH_VERIFY_EMAIL = `${API_BASE}/auth/verify-email`;
export const AUTH_RESEND_VERIFICATION = `${API_BASE}/auth/resend-verification`;

// ── User endpoints ────────────────────────────────────────────────────────────
// GET  /users/:id   — public profile
// PUT  /users/me    — update own profile (JWT required)
export const USERS_ME = `${API_BASE}/users/me`;
export const usersProfile = (userId) => `${API_BASE}/users/${userId}`;

// ── Marketplace endpoints ─────────────────────────────────────────────────────
export const MARKETPLACE_LISTINGS = `${API_BASE}/marketplace/listings`;
export const marketplaceListing = (id) =>
  `${API_BASE}/marketplace/listings/${id}`;
export const marketplaceListingImages = (id) =>
  `${API_BASE}/marketplace/listings/${id}/images`;
export const marketplaceListingImage = (id, index) =>
  `${API_BASE}/marketplace/listings/${id}/images/${index}`;
export const MARKETPLACE_ORDERS = `${API_BASE}/marketplace/orders`;

export default API_BASE;
