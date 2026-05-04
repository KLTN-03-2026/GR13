const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
(async () => {
  const BASE = process.env.BASE_URL || 'http://localhost:8088';
  const testEmail = `e2e_cart_${Date.now()}@example.com`;
  const password = 'P@ssw0rd123';
  console.log('Using base', BASE);

  // Register
  console.log('Registering', testEmail);
  let res = await fetch(`${BASE}/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password, firstName: 'E2E', lastName: 'Tester' })
  });
  const j1 = await res.json();
  console.log('Register response', j1);
  if (!res.ok || j1?.err !== 0) { console.error('Register failed'); process.exit(2); }

  // Login
  res = await fetch(`${BASE}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ account: testEmail, password })
  });
  const j2 = await res.json();
  console.log('Login response', j2);
  if (!res.ok || j2?.err !== 0) { console.error('Login failed'); process.exit(3); }
  const token = j2.accessToken;

  // Get products
  res = await fetch(`${BASE}/api/v1/product`, { headers: { 'Content-Type': 'application/json' } });
  const p = await res.json();
  console.log('Products', Array.isArray(p) ? p.length : p);
  if (!res.ok) { console.error('Get products failed'); process.exit(4); }
  const firstProductId = Array.isArray(p) && p.length ? p[0].id : null;
  if (!firstProductId) { console.error('No product to add'); process.exit(5); }

  // Add to cart
  res = await fetch(`${BASE}/api/v1/cart/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ productId: firstProductId, quantity: 1 })
  });
  const j3 = await res.json();
  console.log('Add cart response', j3);
  if (!res.ok || j3?.err !== 0) { console.error('Add to cart failed'); process.exit(6); }

  // Checkout
  res = await fetch(`${BASE}/api/v1/order/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ shippingAddress: '123 Test St', phone: '+84912345678', paymentMethod: 'COD' })
  });
  const j4 = await res.json();
  console.log('Checkout response', j4);
  if (!res.ok || j4?.err !== 0) { console.error('Checkout failed'); process.exit(7); }

  console.log('E2E cart->checkout OK');
  process.exit(0);
})();
