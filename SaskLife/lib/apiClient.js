/**
 * apiClient.js — centralised HTTP client for the SaskLife app.
 *
 * Uses the native `fetch` API (no third-party dependency required).
 * JWT tokens are persisted in AsyncStorage under the keys:
 *   auth_token         — access token
 *   auth_refresh_token — refresh token
 *   auth_user          — JSON-stringified user object
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AUTH_LOGIN,
  AUTH_SIGNUP,
  AUTH_LOGOUT,
  AUTH_REFRESH,
  AUTH_ME,
  AUTH_VERIFY_EMAIL,
  AUTH_RESEND_VERIFICATION,
  MARKETPLACE_LISTINGS,
  MARKETPLACE_ORDERS,
  USERS_ME,
  marketplaceListing,
  marketplaceListingImages,
  marketplaceListingImage,
  usersProfile,
} from '../constants/api';

// ── Token helpers ─────────────────────────────────────────────────────────────

export const TOKEN_KEY = 'auth_token';
export const REFRESH_TOKEN_KEY = 'auth_refresh_token';
export const USER_KEY = 'auth_user';

export async function getAccessToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function getRefreshToken() {
  return AsyncStorage.getItem(REFRESH_TOKEN_KEY);
}

export async function getStoredUser() {
  const raw = await AsyncStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

async function storeTokens(accessToken, refreshToken, user) {
  const writes = [
    AsyncStorage.setItem(TOKEN_KEY, accessToken),
    AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken),
  ];
  if (user) {
    writes.push(AsyncStorage.setItem(USER_KEY, JSON.stringify(user)));
  }
  await Promise.all(writes);
}

/**
 * Clears all stored auth credentials.
 * Call this on logout or when a 401 response indicates an expired/invalid token.
 */
export async function clearAuth() {
  await Promise.all([
    AsyncStorage.removeItem(TOKEN_KEY),
    AsyncStorage.removeItem(REFRESH_TOKEN_KEY),
    AsyncStorage.removeItem(USER_KEY),
  ]);
}

// ── Core request helper ───────────────────────────────────────────────────────

/**
 * Makes an authenticated (or unauthenticated) HTTP request.
 *
 * @param {string} url
 * @param {object} options  — standard fetch options; pass `body` as a plain
 *                            object (it will be JSON-stringified unless the
 *                            body is already a FormData instance).
 * @param {boolean} withAuth — attach Bearer token when true (default: true)
 * @returns {Promise<any>}   — parsed JSON response body
 * @throws  {Error}          — enriched with `.status` and `.data` fields
 */
async function request(url, options = {}, withAuth = true) {
  const headers = { ...(options.headers || {}) };

  // Attach auth header
  if (withAuth) {
    const token = await getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Serialise plain-object bodies to JSON
  let body = options.body;
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }

  const response = await fetch(url, { ...options, headers, body });

  let data;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    if (response.status === 401) {
      // Token is no longer valid — clear stored credentials so the next
      // render of SettingsScreen will show the login form.
      await clearAuth();
    }
    const err = new Error(
      (data && data.error) || `Request failed (${response.status})`
    );
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

// ── Auth API ──────────────────────────────────────────────────────────────────

/**
 * POST /auth/login
 * Stores access_token, refresh_token, and user in AsyncStorage.
 * Returns the full response: { access_token, refresh_token, user }
 */
export async function login(email, password) {
  const data = await request(
    AUTH_LOGIN,
    { method: 'POST', body: { email, password } },
    false
  );
  await storeTokens(data.access_token, data.refresh_token, data.user);
  return data;
}

/**
 * POST /auth/signup
 * Body: { name, email, password }
 * Returns: { access_token, refresh_token, user, message }
 */
export async function signup(name, email, password) {
  const data = await request(
    AUTH_SIGNUP,
    { method: 'POST', body: { name, email, password } },
    false
  );
  await storeTokens(data.access_token, data.refresh_token, data.user);
  return data;
}

/**
 * POST /auth/logout
 * Clears local credentials regardless of server response.
 */
export async function logout() {
  try {
    await request(AUTH_LOGOUT, { method: 'POST' });
  } finally {
    await clearAuth();
  }
}

/**
 * POST /auth/refresh
 * Uses the stored refresh token to obtain a new access token.
 */
export async function refreshAccessToken() {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token stored');
  const response = await fetch(AUTH_REFRESH, {
    method: 'POST',
    headers: { Authorization: `Bearer ${refreshToken}` },
  });
  const data = await response.json();
  if (!response.ok) {
    await clearAuth();
    throw new Error(data.error || 'Token refresh failed');
  }
  await AsyncStorage.setItem(TOKEN_KEY, data.access_token);
  return data.access_token;
}

/**
 * GET /auth/me
 * Returns the current authenticated user object.
 */
export async function getMe() {
  const data = await request(AUTH_ME, { method: 'GET' });
  return data.user;
}

/**
 * POST /auth/verify-email
 * Body: { token }
 */
export async function verifyEmail(token) {
  return request(AUTH_VERIFY_EMAIL, { method: 'POST', body: { token } }, false);
}

/**
 * POST /auth/resend-verification
 * Body: { email }
 */
export async function resendVerification(email) {
  return request(
    AUTH_RESEND_VERIFICATION,
    { method: 'POST', body: { email } },
    false
  );
}

// ── Marketplace API ───────────────────────────────────────────────────────────

/**
 * GET /marketplace/listings
 * @param {object} params  — { category, search, page, per_page }
 */
export async function getListings(params = {}) {
  const qs = new URLSearchParams();
  if (params.category) qs.set('category', params.category);
  if (params.search) qs.set('search', params.search);
  if (params.page) qs.set('page', String(params.page));
  if (params.per_page) qs.set('per_page', String(params.per_page));
  const url = qs.toString()
    ? `${MARKETPLACE_LISTINGS}?${qs}`
    : MARKETPLACE_LISTINGS;
  return request(url, { method: 'GET' }, false);
}

/**
 * GET /marketplace/listings/:id
 */
export async function getListing(id) {
  return request(marketplaceListing(id), { method: 'GET' }, false);
}

/**
 * POST /marketplace/listings
 * Supports both JSON and multipart (FormData) bodies.
 * For image uploads pass a FormData instance as `formData`.
 */
export async function createListing(formData) {
  return request(MARKETPLACE_LISTINGS, { method: 'POST', body: formData });
}

/**
 * PUT /marketplace/listings/:id
 */
export async function updateListing(id, data) {
  return request(marketplaceListing(id), { method: 'PUT', body: data });
}

/**
 * DELETE /marketplace/listings/:id
 */
export async function deleteListing(id) {
  return request(marketplaceListing(id), { method: 'DELETE' });
}

/**
 * POST /marketplace/listings/:id/images
 * @param {string}   listingId
 * @param {FormData} formData   — must include files under key "images"
 */
export async function uploadImages(listingId, formData) {
  return request(marketplaceListingImages(listingId), {
    method: 'POST',
    body: formData,
  });
}

/**
 * DELETE /marketplace/listings/:id/images/:index
 */
export async function deleteListingImage(listingId, index) {
  return request(marketplaceListingImage(listingId, index), {
    method: 'DELETE',
  });
}

/**
 * POST /marketplace/orders
 * Body: { listing_id }
 */
export async function createOrder(listingId) {
  return request(MARKETPLACE_ORDERS, {
    method: 'POST',
    body: { listing_id: listingId },
  });
}

/**
 * GET /marketplace/orders
 * @param {'buyer'|'seller'} role
 */
export async function getOrders(role = 'buyer') {
  return request(`${MARKETPLACE_ORDERS}?role=${role}`, { method: 'GET' });
}

// ── Users API ─────────────────────────────────────────────────────────────────

/**
 * GET /users/:userId  — public profile
 */
export async function getProfile(userId) {
  return request(usersProfile(userId), { method: 'GET' }, false);
}

/**
 * PUT /users/me  — update own profile (JWT required)
 * @param {object} data  — { name, bio, location, phone }
 */
export async function updateProfile(data) {
  return request(USERS_ME, { method: 'PUT', body: data });
}
