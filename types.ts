export interface User {
  id: string;
  name: string;
  email: string;
  status: "Active" | "Pending" | "Banned";
  joinedDate: string;
  avatar?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  itemsCount: number;
  createdDate: string;
  icon?: string;
}

export interface Post {
  id: number;
  title: string;
  meta: string;
  author: string;
  authorAvatar?: string;
  status: "PUBLISHED" | "DRAFT" | "SCHEDULED";
  engagement: string;
  mediaUrl: string;
  date: string;
  category: string;
}

export interface RechargeRequest {
  id: number;
  user: string;
  email: string;
  date: string;
  time: string;
  amount: number;
  method: "PayPal" | "Credit Card" | "Apple Pay" | "Bank Transfer";
  status: "Pending" | "Accepted" | "Ignored";
  avatar?: string;
}

export interface Report {
  id: number;
  reportedUser: string;
  userId: string;
  category: string;
  reason: string;
  date: string;
  status: "Pending" | "Resolved";
  avatar?: string;
}

export interface DashboardStats {
  totalRevenue: string;
  revenueGrowth: string;
  activeUsers: string;
  usersGrowth: string;
  conversionRate: string;
  conversionGrowth: string;
  pendingOrders: string;
  ordersStatus: string;
}
