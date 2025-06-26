# VPN 客户端

这是一个支持自动设置系统代理的 VPN 客户端。

## 功能特性

- 自动设置系统代理（Windows/macOS）
- 启动时自动配置代理设置
- 关闭时自动恢复原始代理设置
- 支持白名单域名过滤
- TLS 加密通信

## 安装依赖

```bash
npm install
```

## 使用方法

### 启动客户端

```bash
npm start
# 或者
node client.js
```

启动后，客户端会：
1. 自动设置系统代理为 `127.0.0.1:8080`（可在 `env/config.js` 中修改）
2. 启动本地代理服务器
3. 显示连接状态信息

### 关闭客户端

按 `Ctrl+C` 或关闭终端窗口，客户端会：
1. 自动恢复原始系统代理设置
2. 清理资源并退出

## 配置

### 代理服务器配置

编辑 `env/config.js` 文件：

```javascript
module.exports = {
    // 远程服务器配置
    remote: {
        host: 'your-server-ip',
        port: 443
    },
    
    // 本地代理配置
    local: {
        port: 8080  // 本地代理端口
    },
    
    // TLS证书配置
    tls: {
        key: './env/client-key.pem',
        cert: './env/client-cert.pem',
        ca: './env/server-cert.pem'
    }
}
```

### 白名单配置

编辑 `whitelist.js` 文件，添加需要代理的域名：

```javascript
module.exports = {
    domains: [
        'example.com',
        '*.example.org',
        'api.example.net'
    ]
}
```

## 系统要求

- Node.js 12.0 或更高版本
- Windows 10/11 或 macOS
- 管理员权限（用于修改系统代理设置）

## 注意事项

1. 首次运行可能需要管理员权限来修改系统代理设置
2. 确保 TLS 证书文件存在于 `env/` 目录中
3. 关闭客户端时请使用 `Ctrl+C`，确保代理设置能正确恢复

## 故障排除

### 代理设置失败

- 确保以管理员权限运行
- 检查防火墙设置
- 验证 `regedit.vbs` 文件存在

### 连接失败

- 检查远程服务器配置
- 验证 TLS 证书文件
- 确认网络连接正常

## 许可证

MIT License 