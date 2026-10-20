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

- `local-server.cjs`：本地静态服务器与 DeepSeek 代理
- `api/chat.js`：Vercel Serverless DeepSeek 代理
- `start-server.cmd` / `start-server.ps1`：本地启动脚本
- `assets/deepseek-config.js`：前端模型和接口配置
- `.env.example`：环境变量示例
## 方式三：腾讯云 / 阿里云长期部署（推荐国内访问）

Vercel 的 `*.vercel.app` 域名在中国大陆网络可能超时。需要长期稳定访问时，建议使用腾讯云轻量应用服务器或阿里云 ECS：

1. 系统选择 Ubuntu 22.04
2. 安全组开放 `22`、`80`、`443` 端口
3. 登录服务器终端，运行：

```bash
curl -fsSL https://raw.githubusercontent.com/www22-cloud/jqch-legal/main/deploy/tencent-cloud-install.sh -o /tmp/jqch-install.sh
sudo bash /tmp/jqch-install.sh
```

脚本会安装 Node.js 和 Nginx、配置开机自启，并提示输入 `DEEPSEEK_API_KEY`。完成后访问：

```text
http://服务器公网IP/
```

后续绑定域名后，可使用 Certbot 配置 HTTPS。
