# 部署说明

## 方式一：本地一键部署

1. 双击 `start-server.cmd`。
2. 浏览器访问 <http://localhost:8080/>。

如果希望 DeepSeek 密钥只放在服务器端，可在启动前设置环境变量：

```powershell
$env:DEEPSEEK_API_KEY="你的 DeepSeek API Key"
$env:PORT="8080"
.\start-server.ps1
```

也可以不设置环境变量，在网页右下角“AI 对话 → ⚙”中临时填写密钥。

## 方式二：Vercel 部署

1. 将整个交付目录上传到 Git 仓库。
2. 在 Vercel 导入仓库。
3. 在 Vercel 项目的 Environment Variables 中添加：
   - `DEEPSEEK_API_KEY` = 你的 DeepSeek API Key
4. 重新部署。

前端会自动在 HTTP/HTTPS 环境调用 `/api/chat`，密钥不会写入前端代码或交付包。

## 文件说明

- `server.js`：本地静态服务器与 DeepSeek 代理
- `api/chat.js`：Vercel Serverless DeepSeek 代理
- `start-server.cmd` / `start-server.ps1`：本地启动脚本
- `assets/deepseek-config.js`：前端模型和接口配置
- `.env.example`：环境变量示例
