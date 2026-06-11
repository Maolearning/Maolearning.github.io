const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
};

const qweatherAllowedPaths = new Set([
  '/geo/v2/city/lookup',
  '/v7/weather/now',
  '/v7/weather/7d'
]);

function jsonResponse(data, status = 200, cors = corsHeaders) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...cors,
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}

async function proxyJson(url, init = {}, cors = corsHeaders) {
  const upstream = await fetch(url, { method: 'GET', ...init });
  const body = await upstream.text();
  return new Response(body, {
    status: upstream.status,
    headers: {
      ...cors,
      'Content-Type': upstream.headers.get('Content-Type') || 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}

async function handleExchange(request, env, cors = corsHeaders) {
  if (!env.EXCHANGE_API_KEY) {
    return jsonResponse({ error: 'Missing EXCHANGE_API_KEY secret' }, 500, cors);
  }

  const url = new URL(request.url);
  const base = (url.searchParams.get('base') || 'USD').toUpperCase();
  const target = (url.searchParams.get('target') || 'CNY').toUpperCase();

  if (!/^[A-Z]{3}$/.test(base) || !/^[A-Z]{3}$/.test(target)) {
    return jsonResponse({ error: 'Invalid currency code' }, 400, cors);
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
    }, upstream.ok ? 502 : upstream.status, cors);
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
  }, 200, cors);
}

async function handleWeather(request, env, path, cors = corsHeaders) {
  if (!env.WEATHER_API_KEY) {
    return jsonResponse({ error: 'Missing WEATHER_API_KEY secret' }, 500, cors);
  }

  if (!qweatherAllowedPaths.has(path)) {
    return jsonResponse({ error: 'Weather path is not allowed' }, 404, cors);
  }

  const requestUrl = new URL(request.url);
  const upstreamUrl = new URL(`https://${env.WEATHER_API_HOST || 'ku62b6xbgd.re.qweatherapi.com'}${path}`);

  requestUrl.searchParams.forEach((value, key) => {
    if (key.toLowerCase() !== 'key') upstreamUrl.searchParams.set(key, value);
  });

  return proxyJson(upstreamUrl, {
    headers: {
      'X-QW-Api-Key': env.WEATHER_API_KEY
    }
  }, cors);
}

async function handleVolcengineSeedream(request, env, cors = corsHeaders) {
  if (!env.ARK_API_KEY) {
    return jsonResponse({ error: 'Missing ARK_API_KEY secret in Cloudflare Worker environment.' }, 500, cors);
  }

  let body;
  try {
    body = await request.json();
  } catch (err) {
    return jsonResponse({ error: 'Invalid JSON request body.' }, 400, cors);
  }

  const upstreamUrl = 'https://ark.cn-beijing.volces.com/api/v3/images/generations';

  const upstreamResponse = await fetch(upstreamUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.ARK_API_KEY}`
    },
    body: JSON.stringify(body)
  });

  const responseData = await upstreamResponse.text();
  
  return new Response(responseData, {
    status: upstreamResponse.status,
    headers: {
      ...cors,
      'Content-Type': upstreamResponse.headers.get('Content-Type') || 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    const allowedOrigins = [
      "https://maolearning.github.io",
      "http://localhost:8000",
      "http://127.0.0.1:8000",
      "null" // 支持本地双击运行 file:// 协议请求
    ];

    // 来源域名安全限制检查
    if (origin && !allowedOrigins.includes(origin)) {
      return new Response(JSON.stringify({ error: "Forbidden: Request origin is not allowed." }), {
        status: 403,
        headers: {
          "Access-Control-Allow-Origin": allowedOrigins[0],
          "Content-Type": "application/json"
        }
      });
    }

    const currentCorsHeaders = {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: currentCorsHeaders });
    }

    const url = new URL(request.url);

    // Allow POST requests specifically for volcengine-seedream
    if (request.method !== 'GET' && !(request.method === 'POST' && url.pathname === '/volcengine-seedream')) {
      return jsonResponse({ error: 'Method not allowed' }, 405, currentCorsHeaders);
    }

    try {
      if (url.pathname === '/volcengine-seedream') {
        return await handleVolcengineSeedream(request, env, currentCorsHeaders);
      }

      if (url.pathname === '/exchange') {
        return await handleExchange(request, env, currentCorsHeaders);
      }

      if (url.pathname.startsWith('/weather/')) {
        const weatherPath = `/${url.pathname.slice('/weather/'.length)}`;
        return await handleWeather(request, env, weatherPath, currentCorsHeaders);
      }

      return jsonResponse({ error: 'Not found' }, 404, currentCorsHeaders);
    } catch (error) {
      return jsonResponse({ error: 'Proxy request failed', detail: String(error && error.message || error) }, 502, currentCorsHeaders);
    }
  }
};
