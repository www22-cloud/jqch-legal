const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT || 8080);
const deepseekEndpoint = "https://api.deepseek.com/chat/completions";
const mime = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".pdf": "application/pdf",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".txt": "text/plain; charset=utf-8"
};
function sendJson(res, status, data) { const body = JSON.stringify(data); res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Content-Length": Buffer.byteLength(body) }); res.end(body); }
async function proxyChat(req, res) {
  let body = ""; for await (const chunk of req) body += chunk;
  let payload; try { payload = JSON.parse(body || "{}"); } catch { return sendJson(res, 400, { error: "请求体不是有效 JSON" }); }
  const auth = req.headers.authorization || "";
  const apiKey = process.env.DEEPSEEK_API_KEY || (auth.startsWith("Bearer ") ? auth.slice(7) : "");
  if (!apiKey) return sendJson(res, 503, { error: "未配置 DEEPSEEK_API_KEY。请设置环境变量或在网页设置中填写 API Key。" });
  const upstream = await fetch(deepseekEndpoint, { method: "POST", headers: { "Content-Type": "application/json", "Authorization": "Bearer " + apiKey }, body: JSON.stringify({ model: payload.model || "deepseek-chat", messages: payload.messages || [], temperature: payload.temperature ?? 0.3, max_tokens: payload.max_tokens ?? 1000, stream: false }) });
  const text = await upstream.text(); res.writeHead(upstream.status, { "Content-Type": "application/json; charset=utf-8" }); res.end(text);
}
const server = http.createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url, "http://localhost");
    if (requestUrl.pathname === "/api/chat") { if (req.method !== "POST") return sendJson(res, 405, { error: "只支持 POST" }); return await proxyChat(req, res); }
    if (req.method !== "GET" && req.method !== "HEAD") return sendJson(res, 405, { error: "Method not allowed" });
    let pathname = decodeURIComponent(requestUrl.pathname); if (pathname === "/") pathname = "/index.html";
    const filePath = path.resolve(root, "." + pathname); const relative = path.relative(root, filePath);
    if (relative.startsWith("..") || path.isAbsolute(relative)) return sendJson(res, 403, { error: "Forbidden" });
    fs.stat(filePath, (err, stat) => {
      if (err || !stat.isFile()) { res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }); return res.end("404 Not Found"); }
      const ext = path.extname(filePath).toLowerCase(); const headers = { "Content-Type": mime[ext] || "application/octet-stream", "Cache-Control": "no-store" }; const range = req.headers.range;
      if (range) { const [startText, endText] = range.replace(/bytes=/, "").split("-"); const start = parseInt(startText, 10); const end = endText ? parseInt(endText, 10) : stat.size - 1; res.writeHead(206, { ...headers, "Content-Range": `bytes ${start}-${end}/${stat.size}`, "Accept-Ranges": "bytes", "Content-Length": end - start + 1 }); fs.createReadStream(filePath, { start, end }).pipe(res); }
      else { res.writeHead(200, { ...headers, "Content-Length": stat.size, "Accept-Ranges": "bytes" }); if (req.method === "HEAD") res.end(); else fs.createReadStream(filePath).pipe(res); }
    });
  } catch (error) { sendJson(res, 500, { error: error.message }); }
});
server.listen(port, "127.0.0.1", () => { console.log(`冀企出海已启动：http://localhost:${port}/`); console.log(process.env.DEEPSEEK_API_KEY ? "DeepSeek 后端密钥已配置。" : "未检测到 DEEPSEEK_API_KEY，可在网页 AI 设置中临时填写。"); });
