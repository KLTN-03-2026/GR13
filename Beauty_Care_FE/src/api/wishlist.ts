import apiFetch from './config';

export async function getWishlist() {
  return apiFetch('/wishlist', { method: 'GET' });
}

export async function toggleWishlist(productId: number) {
  return apiFetch('/wishlist/toggle', {
    method: 'POST',
    body: JSON.stringify({ productId }),
  });
}

export default { getWishlist, toggleWishlist };
