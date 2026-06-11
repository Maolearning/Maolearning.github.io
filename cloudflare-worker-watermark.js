/**
 * Cloudflare Worker AI 去水印 Service
 * 
 * 1. 响应前端的 OPTIONS 预检请求并返回正确 CORS 头
 * 2. 接收包含局部原图 (image)、局部遮罩 (mask) 以及修复提示词 (prompt) 的 POST FormData 请求
 * 3. 接收 JSON 请求并响应 { ping: true } 心跳检测健康状态
 * 4. 调用 Workers AI 的 @cf/runwayml/stable-diffusion-v1-5-inpainting 托管大模型进行图像修复并返回二进制流
 */

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    const allowedOrigins = [
      "https://maolearning.github.io",
      "http://localhost:8000",
      "http://127.0.0.1:8000",
      "null" // 支持本地双击运行 file:// 协议请求
    ];

    // 来源域名安全检查
    if (origin && !allowedOrigins.includes(origin)) {
      return new Response("Forbidden: Request origin is not allowed.", {
        status: 403,
        headers: {
          "Access-Control-Allow-Origin": allowedOrigins[0],
          "Content-Type": "text/plain"
        }
      });
    }

    // 构造通用的 CORS 头部信息允许跨域请求
    const corsHeaders = {
      "Access-Control-Allow-Origin": origin || "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
      "Access-Control-Allow-Headers": "Content-Type, X-Requested-With",
      "Access-Control-Max-Age": "86400",
      "Vary": "Origin"
    };

    // 1. 处理 OPTIONS 预检请求
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    // 2. 限制仅支持 POST 请求
    if (request.method !== "POST") {
      return new Response("Method Not Allowed. Please send POST request.", {
        status: 405,
        headers: {
          ...corsHeaders,
          "Content-Type": "text/plain"
        }
      });
    }

    try {
      const contentType = request.headers.get("Content-Type") || "";

      // 3. 处理 Ping 心跳测试连接请求 (JSON)
      if (contentType.includes("application/json")) {
        let body;
        try {
          body = await request.json();
        } catch (e) {
          return new Response(JSON.stringify({ error: "Invalid JSON format" }), {
            status: 400,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json"
            }
          });
        }

        if (body && body.ping) {
          return new Response(JSON.stringify({ status: "ok", message: "Watermark Remover Worker is ready!" }), {
            status: 200,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json"
            }
          });
        }
      }

      // 4. 处理 FormData 数据（包含去水印区域的局部图片与局部遮罩）
      if (!contentType.includes("multipart/form-data")) {
        return new Response("Unsupported Content-Type. Please use multipart/form-data.", {
          status: 415,
          headers: {
            ...corsHeaders,
            "Content-Type": "text/plain"
          }
        });
      }

      const formData = await request.formData();
      const imageFile = formData.get("image");
      const maskFile = formData.get("mask");
      const prompt = formData.get("prompt") || "clean background, remove watermark, seamless, high quality";

      if (!imageFile || !maskFile) {
        return new Response("Missing 'image' or 'mask' in Form Data.", {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "text/plain"
          }
        });
      }

      // 获取二进制 Buffer
      const imageBuffer = await imageFile.arrayBuffer();
      const maskBuffer = await maskFile.arrayBuffer();

      // 确保绑定的 Workers AI 模块已就绪
      if (!env.AI) {
        return new Response(JSON.stringify({ 
          error: "Cloudflare Workers AI binding is missing in wrangler.toml. Check '[ai]' configurations." 
        }), {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        });
      }

      // 5. 调用 Cloudflare Workers AI 进行局部重绘修复
      // 该模型输入需满足：
      // - image: 原图 Uint8 数组
      // - mask: 遮罩 Uint8 数组（白为需要重绘，黑为需要保留）
      // - prompt: 用于指引重新绘制的内容说明
      const inpaintingResult = await env.AI.run(
        "@cf/runwayml/stable-diffusion-v1-5-inpainting",
        {
          prompt: prompt,
          image: [...new Uint8Array(imageBuffer)],
          mask: [...new Uint8Array(maskBuffer)]
        }
      );

      // 6. 将生成的 PNG 图片流直接流式传回客户端
      return new Response(inpaintingResult, {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "image/png"
        }
      });

    } catch (err) {
      console.error(err);
      return new Response(JSON.stringify({ 
        error: "Worker Internal Server Error", 
        details: err.message || err.toString() 
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }
  }
};
