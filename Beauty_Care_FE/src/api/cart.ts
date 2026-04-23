import apiFetch from './config';

export async function getCart() {
  return apiFetch('/api/v1/cart', { method: 'GET' });
}

export async function addToCart(productId: number, quantity = 1) {
  return apiFetch('/api/v1/cart/add', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  });
}

export async function updateCartItem(productId: number, quantity: number) {
  return apiFetch('/api/v1/cart/update', {
    method: 'PUT',
    body: JSON.stringify({ productId, quantity }),
  });
}

export async function removeFromCart(productId: number) {
  return apiFetch(`/api/v1/cart/remove?productId=${productId}`, {
    method: 'DELETE',
  });
}

export default { getCart, addToCart, updateCartItem, removeFromCart };
