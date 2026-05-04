import apiFetch from './config';

export type UserProfileDTO = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  birthday?: string;
};

export async function getProfile() {
  const res = await apiFetch('/api/v1/user/current', { method: 'GET' });
  // backend responds with { EM, EC, DT }
  return res?.DT ?? null;
}

export async function updateProfile(payload: Partial<UserProfileDTO>) {
  const res = await apiFetch('/api/v1/user/update', { method: 'PUT', body: JSON.stringify(payload) });
  return res;
}

export async function getOrders() {
  const res = await apiFetch('/api/v1/order', { method: 'GET' });
  return res?.DT ?? res;
}

export default { getProfile, updateProfile, getOrders };
