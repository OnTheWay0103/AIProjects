export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface UserWithToken extends User {
  token: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
} 