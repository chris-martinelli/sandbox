// src/index.js
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/') {
      return new Response('2025-08-25', {
        headers: { 'Content-Type': 'text/plain' },
      });
    }
    return new Response('Not Found', { status: 404 });
  },
};
