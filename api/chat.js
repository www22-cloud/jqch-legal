module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "authorization,content-type");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "只支持 POST" });
  const apiKey = process.env.DEEPSEEK_API_KEY || (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!apiKey) return res.status(503).json({ error: "未配置 DEEPSEEK_API_KEY" });
  let payload = req.body;
  if (typeof payload === "string") { try { payload = JSON.parse(payload); } catch { return res.status(400).json({ error: "请求体不是有效 JSON" }); } }
  payload = payload || {};
  try {
    const upstream = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: payload.model || "deepseek-chat",
        messages: payload.messages || [],
        temperature: payload.temperature ?? 0.3,
        max_tokens: payload.max_tokens ?? 1000,
        stream: false
      })
    });
    const text = await upstream.text();
    res.status(upstream.status);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.end(text);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
