import apiFetch from './config';

export type AuthResponse = {
  err: number;
  mess: string;
  accessToken?: string;
  user?: any;
};

export async function register(payload: { firstName: string; lastName: string; email: string; password: string }) {
  return apiFetch('/api/v1/auth/register', { method: 'POST', body: JSON.stringify(payload), auth: false });
}

export async function login(payload: { account: string; password: string }) {
  return apiFetch('/api/v1/auth/login', { method: 'POST', body: JSON.stringify(payload), auth: false });
}

export async function loginUser(payload: { account: string; password: string }) {
  return apiFetch('/api/v1/auth/login-user', { method: 'POST', body: JSON.stringify(payload), auth: false });
}

export async function loginGoogle(token: string) {
  return apiFetch('/api/v1/auth/login-google', { method: 'POST', body: JSON.stringify({ token }), auth: false });
}

export async function forgotPassword(payload: { email: string }) {
  return apiFetch('/api/v1/auth/forgot-password', { method: 'POST', body: JSON.stringify(payload), auth: false });
}

export default { register, login, loginUser, loginGoogle, forgotPassword };
