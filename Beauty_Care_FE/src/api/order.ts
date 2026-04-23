import apiFetch from './config';

export async function createOrder(payload: { shippingAddress: string; phone: string; paymentMethod?: string }) {
  return apiFetch('/api/v1/order/checkout', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getOrders() {
  return apiFetch('/api/v1/order', { method: 'GET' });
}

export async function getAllOrdersAdmin() {
  return apiFetch('/api/v1/order/admin/list', { method: 'GET' });
}

export async function updateOrderStatusAdmin(orderId: number, status: string) {
  return apiFetch('/api/v1/order/admin/update-status', {
    method: 'POST',
    body: JSON.stringify({ orderId, status }),
  });
}

export async function getOrderDetail(orderId: number) {
  return apiFetch(`/api/v1/order/${orderId}`, { method: 'GET' });
}

export async function cancelOrder(orderId: number) {
  return apiFetch('/api/v1/order/cancel', {
    method: 'POST',
    body: JSON.stringify({ orderId }),
  });
}

export default { createOrder, getOrders, getOrderDetail, cancelOrder };
