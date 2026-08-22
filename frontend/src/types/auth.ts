export type UserRole = 'CUSTOMER' | 'STAFF' | 'ADMIN';

export interface UserNotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  is_active?: boolean;
  phone_number?: string;
  avatar?: string;
  notification_preferences?: UserNotificationPreferences;
  created_at?: string;
  updated_at?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

