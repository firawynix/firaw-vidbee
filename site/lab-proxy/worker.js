// Hostname publico para a pagina estatica protegida pelo lab.
// A origem e fixa; nenhum caminho do visitante escolhe outro servidor.
const LAB_ORIGIN = 'https://lab.firawynix.com.br';
const LAB_PREFIX = '/vidbee';

export default {
  async fetch(request) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method Not Allowed', {
        status: 405,
        headers: { Allow: 'GET, HEAD' },
      });
    }

    const incoming = new URL(request.url);
    const upstream = new URL(LAB_ORIGIN);
    upstream.pathname = LAB_PREFIX + incoming.pathname;
    upstream.search = incoming.search;

    const headers = new Headers();
    for (const name of ['accept', 'authorization', 'if-none-match', 'if-modified-since', 'range']) {
      const value = request.headers.get(name);
      if (value) headers.set(name, value);
    }

    const response = await fetch(upstream, {
      method: request.method,
      headers,
      redirect: 'manual',
    });
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('Cache-Control', 'private, no-store');
    responseHeaders.set('X-Robots-Tag', 'noindex, nofollow');

    const location = responseHeaders.get('Location');
    if (location) {
      const redirect = new URL(location, upstream);
      if (redirect.origin === LAB_ORIGIN && redirect.pathname.startsWith(LAB_PREFIX + '/')) {
        redirect.host = incoming.host;
        redirect.pathname = redirect.pathname.slice(LAB_PREFIX.length);
        responseHeaders.set('Location', redirect.toString());
      }
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  },
};
