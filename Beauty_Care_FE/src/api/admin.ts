import apiFetch from './config';

export async function getAdminAnalytics() {
  return apiFetch('/api/v1/admin/analytics', { method: 'GET' });
}

export async function getAdminDashboard() {
  return apiFetch('/api/v1/admin/dashboard', { method: 'GET' });
}

export default { getAdminAnalytics, getAdminDashboard };
