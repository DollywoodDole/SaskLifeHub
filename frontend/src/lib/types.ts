export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  phone?: string;
  is_verified: boolean;
  created_at: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  price_unit?: string;
  category: ListingCategory;
  location: string;
  images: string[];
  seller_id: string;
  seller_name: string;
  status: "active" | "sold" | "inactive";
  created_at: string;
}

export type ListingCategory =
  | "Local Goods"
  | "Agricultural Equipment"
  | "Construction Services"
  | "Homemade Food"
  | "Second-Hand Goods"
  | "Local Services"
  | "Manufacturing Machinery"
  | "Event Planning";

export interface Notification {
  id: string;
  user_id: string;
  type: "message" | "order" | "system" | "listing";
  title: string;
  body: string;
  read: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  amount: number;
  created_at: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  user: User;
}
