import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = Cookies.get("refresh_token");
      if (refresh) {
        try {
          const { data } = await axios.post("/api/auth/refresh", { refresh_token: refresh });
          Cookies.set("access_token", data.access_token, { expires: 1 });
          original.headers.Authorization = `Bearer ${data.access_token}`;
          return api(original);
        } catch {
          Cookies.remove("access_token");
          Cookies.remove("refresh_token");
          window.location.href = "/auth/login";
        }
      }
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  signup: (data: { email: string; password: string; name: string }) =>
    api.post("/auth/signup", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  verifyEmail: (token: string) =>
    api.post("/auth/verify-email", { token }),
  resendVerification: (email: string) =>
    api.post("/auth/resend-verification", { email }),
  me: () => api.get("/auth/me"),
};

export const usersApi = {
  getProfile: (id: string) => api.get(`/users/${id}`),
  updateProfile: (data: Partial<{ name: string; bio: string; location: string; phone: string }>) =>
    api.put("/users/me", data),
};

export const marketplaceApi = {
  getListings: (params?: { category?: string; search?: string; page?: number }) =>
    api.get("/marketplace/listings", { params }),
  getListing: (id: string) => api.get(`/marketplace/listings/${id}`),
  createListing: (data: FormData) =>
    api.post("/marketplace/listings", data, { headers: { "Content-Type": "multipart/form-data" } }),
  updateListing: (id: string, data: Partial<{ title: string; description: string; price: number; status: string }>) =>
    api.put(`/marketplace/listings/${id}`, data),
  deleteListing: (id: string) => api.delete(`/marketplace/listings/${id}`),
  createOrder: (listing_id: string) =>
    api.post("/marketplace/orders", { listing_id }),
};

export const notificationsApi = {
  getAll: () => api.get("/notifications"),
  markRead: (id: string) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch("/notifications/read-all"),
};

export default api;
