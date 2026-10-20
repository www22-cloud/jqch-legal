$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$node = $env:CODEX_MCP_NODE_PATH
if (-not $node -or -not (Test-Path -LiteralPath $node)) {
  $runtimeRoot = Join-Path $env:LOCALAPPDATA 'OpenAI\Codex\runtimes\cua_node'
  if (Test-Path -LiteralPath $runtimeRoot) {
    $found = Get-ChildItem -LiteralPath $runtimeRoot -Recurse -File -Filter 'node.exe' | Select-Object -First 1
    if ($found) { $node = $found.FullName }
  }
}
if (-not $node) {
  $cmd = Get-Command node -ErrorAction SilentlyContinue
  if ($cmd) { $node = $cmd.Source }
}
if (-not $node) {
  Write-Host '未找到 Node.js。请先安装 Node.js，或在 Codex 环境中运行本脚本。' -ForegroundColor Red
  Read-Host '按 Enter 退出'
  exit 1
}
if (-not $env:DEEPSEEK_API_KEY) {
  Write-Host '提示：未设置 DEEPSEEK_API_KEY。网站仍可打开，也可以在前端 AI 设置中临时填写密钥。' -ForegroundColor Yellow
}
Set-Location -LiteralPath $root
Write-Host "使用 Node: $node"
Write-Host '启动后访问：http://localhost:8080/'
& $node (Join-Path $root 'server.js')
