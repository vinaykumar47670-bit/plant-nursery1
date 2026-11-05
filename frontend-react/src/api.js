
const API_URL = 'https://plant-nursery1-production.up.railway.app';

async function request(url, options = {}) {
  const res = await fetch(`${API_URL}${url}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong. Try again.');
  }

  return data;
}

export const api = {
  get: (url) => request(url),
  post: (url, body) => request(url, {
    method: 'POST',
    body: JSON.stringify(body),
  }),
};

export const money = (n) =>
  '₹' + Number(n).toLocaleString('en-IN');

export const NODE_URL = 'https://YOUR-NODE-SERVICE-DOMAIN';
