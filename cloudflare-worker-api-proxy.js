const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

const qweatherAllowedPaths = new Set([
  '/geo/v2/city/lookup',
  '/v7/weather/now',
  '/v7/weather/7d'
]);

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}

async function proxyJson(url) {
  const upstream = await fetch(url, { method: 'GET' });
  const body = await upstream.text();
  return new Response(body, {
    status: upstream.status,
    headers: {
      ...corsHeaders,
      'Content-Type': upstream.headers.get('Content-Type') || 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}

async function handleExchange(request, env) {
  if (!env.EXCHANGE_API_KEY) {
    return jsonResponse({ error: 'Missing EXCHANGE_API_KEY secret' }, 500);
  }

  const url = new URL(request.url);
  const base = (url.searchParams.get('base') || 'USD').toUpperCase();
  const target = (url.searchParams.get('target') || 'CNY').toUpperCase();

  if (!/^[A-Z]{3}$/.test(base) || !/^[A-Z]{3}$/.test(target)) {
    return jsonResponse({ error: 'Invalid currency code' }, 400);
  }

  const upstreamUrl = `https://v6.exchangerate-api.com/v6/${env.EXCHANGE_API_KEY}/latest/${base}`;
  const upstream = await fetch(upstreamUrl, { method: 'GET' });
  const data = await upstream.json();
  const rate = data && data.conversion_rates && data.conversion_rates[target];

  if (!upstream.ok || typeof rate !== 'number') {
    return jsonResponse({
      error: 'Exchange rate lookup failed',
      upstreamStatus: upstream.status,
      upstreamResult: data && data.result
    }, upstream.ok ? 502 : upstream.status);
  }

  return jsonResponse({
    result: 'success',
    base_code: base,
    target_code: target,
    conversion_rate: rate,
    conversion_rates: {
      [target]: rate
    },
    time_last_update_utc: data.time_last_update_utc,
    time_next_update_utc: data.time_next_update_utc
  });
}

async function handleWeather(request, env, path) {
  if (!env.WEATHER_API_KEY) {
    return jsonResponse({ error: 'Missing WEATHER_API_KEY secret' }, 500);
  }

  if (!qweatherAllowedPaths.has(path)) {
    return jsonResponse({ error: 'Weather path is not allowed' }, 404);
  }

  const requestUrl = new URL(request.url);
  const upstreamUrl = new URL(`https://${env.WEATHER_API_HOST || 'ku62b6xbgd.re.qweatherapi.com'}${path}`);

  requestUrl.searchParams.forEach((value, key) => {
    if (key.toLowerCase() !== 'key') upstreamUrl.searchParams.set(key, value);
  });
  upstreamUrl.searchParams.set('key', env.WEATHER_API_KEY);

  return proxyJson(upstreamUrl);
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== 'GET') {
      return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    const url = new URL(request.url);

    try {
      if (url.pathname === '/exchange') {
        return await handleExchange(request, env);
      }

      if (url.pathname.startsWith('/weather/')) {
        const weatherPath = `/${url.pathname.slice('/weather/'.length)}`;
        return await handleWeather(request, env, weatherPath);
      }

      return jsonResponse({ error: 'Not found' }, 404);
    } catch (error) {
      return jsonResponse({ error: 'Proxy request failed', detail: String(error && error.message || error) }, 502);
    }
  }
};
