const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
(async () => {
  const BASE = process.env.BASE_URL || 'http://localhost:8088';
  const testEmail = `e2e_${Date.now()}@example.com`;
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
  if (!res.ok || j1?.err !== 0) {
    console.error('Register failed'); process.exit(2);
  }

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

  // Get current
  res = await fetch(`${BASE}/api/v1/user/current`, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
  });
  const j3 = await res.json();
  console.log('Current user response', j3);
  if (!res.ok) { console.error('Get current failed'); process.exit(4); }
  console.log('E2E flow OK');
  process.exit(0);
})();
