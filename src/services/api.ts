// Configuration API pour Symfony
// URL directe du backend
const API_BASE_URL = "http://127.0.0.1:8000/api";

// Token JWT storage
const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string): void => localStorage.setItem(TOKEN_KEY, token);
export const removeToken = (): void => localStorage.removeItem(TOKEN_KEY);
export const getUser = (): any | null => {
  const raw = localStorage.getItem(USER_KEY);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
export const setUser = (user: any): void => localStorage.setItem(USER_KEY, JSON.stringify(user));
export const removeUser = (): void => localStorage.removeItem(USER_KEY);

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  articleCount?: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

// API Client générique
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: `Erreur ${response.status}` }));
      throw new Error(error.message || `Erreur ${response.status}`);
    }

    return response.json();
  } catch (e: any) {
    throw new Error(e?.message || 'Erreur réseau: impossible de contacter le serveur');
  }
}

// ==================== AUTH SERVICE ====================
export const authService = {
  login: (email: string, password: string) =>
    apiRequest<{ token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (data: { name: string; email: string; password: string; userType?: string; adminCode?: string }) =>
    apiRequest<{ token: string; user: any }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: () => {
    removeToken();
    return Promise.resolve();
  },

  getProfile: () => apiRequest<any>("/auth/me"),

  checkEmail: (email: string) =>
    apiRequest<{ exists: boolean }>("/auth/check-email", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
};

// ==================== ARTICLES SERVICE ====================
export const articlesService = {
  // Get all published articles
  getAll: () => apiRequest<any[]>("/articles"),

  // Get article by slug
  getBySlug: (slug: string) => apiRequest<any>(`/articles/slug/${slug}`),

  // Get all categories
  getCategories: () => apiRequest<Category[]>("/categories"),

  // Get all tags
  getTags: () => apiRequest<Tag[]>("/tags"),

  // Get user's articles
  getMyArticles: () => apiRequest<any[]>("/articles/my-articles"),

  // Get article by ID
  getById: (id: number | string) => apiRequest<any>(`/articles/${id}`),

  // Create new article
  create: (data: { title: string; content: string; description?: string }) =>
    // Controller expects POST to /api/articles (prefix handled in apiRequest)
    apiRequest<any>("/articles", {
      method: "POST",
      headers: { "Content-Type": "application/ld+json" },
      body: JSON.stringify(data),
    }),

  // Update article
  update: (id: number | string, data: any) =>
    apiRequest<any>(`/articles/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Publish article
  publish: (id: number | string) =>
    apiRequest<any>(`/articles/${id}/publish`, {
      method: "POST",
    }),

  // Delete article
  delete: (id: number | string) =>
    apiRequest<void>(`/articles/${id}`, { method: "DELETE" }),
};

// ==================== USER SERVICE ====================
export const userService = {
  // Get user profile
  getProfile: () => apiRequest<any>("/user/profile"),

  // Update user profile
  updateProfile: (data: { name?: string; bio?: string; avatar?: string }) =>
    apiRequest<{ message: string; user: any }>("/user/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Change password
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiRequest<{ message: string }>("/user/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ==================== COMMENTS SERVICE ====================
export const commentsService = {
  // Get comments for article
  getByArticle: (articleId: number | string) =>
    apiRequest<any[]>(`/comments/article/${articleId}`),

  // Create comment (admin only)
  create: (data: { content: string; articleId: number | string }) =>
    apiRequest<any>("/comments", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Update comment
  update: (id: number | string, data: { content: string }) =>
    apiRequest<any>(`/comments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Delete comment
  delete: (id: number | string) =>
    apiRequest<void>(`/comments/${id}`, { method: "DELETE" }),
};

// ==================== ADMIN SERVICE ====================
export const adminService = {
  // Get all users
  getUsers: () => apiRequest<any[]>("/admin/users"),

  // Update user role
  updateUserRole: (userId: number | string, userType: "AUTHOR" | "ADMIN") =>
    apiRequest<any>(`/admin/users/${userId}/role`, {
      method: "PUT",
      body: JSON.stringify({ userType }),
    }),

  // Get dashboard data
  getDashboard: () => apiRequest<any>("/admin/dashboard"),
};

// ==================== GENERIC API CLIENT ====================
export const apiClient = {
  get: <T = any>(endpoint: string) => apiRequest<T>(endpoint),
  post: <T = any>(endpoint: string, data: any) =>
    apiRequest<T>(endpoint, { method: "POST", body: JSON.stringify(data) }),
  put: <T = any>(endpoint: string, data: any) =>
    apiRequest<T>(endpoint, { method: "PUT", body: JSON.stringify(data) }),
  delete: <T = any>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: "DELETE" }),
};
