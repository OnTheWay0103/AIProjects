# Mikey.app

Mikey.app 是一个基于 AI 的图像生成服务，使用 Next.js 和 Replicate API 构建。

## 功能特点

- 🎨 AI 图像生成
- 👤 用户认证系统
- 🖼️ 图片展示
- 📱 响应式设计

## 技术栈

- **前端框架**: Next.js 14
- **UI 框架**: React 18
- **样式解决方案**: Tailwind CSS
- **开发语言**: TypeScript
- **代码规范**: ESLint + Prettier
- **状态管理**: React Context
- **API 调用**: Fetch API
- **AI 服务**: Replicate API

## 开始使用

1. 克隆仓库

```bash
git clone https://github.com/yourusername/mikey-app.git
cd mikey-app
```

2. 安装依赖

```bash
npm install
```

3. 配置环境变量

创建 `.env.local` 文件并添加以下内容：

```env
REPLICATE_API_TOKEN=your_replicate_api_token_here
JWT_SECRET=your_jwt_secret_here
```

4. 启动开发服务器

```bash
npm run dev
```

5. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
src/
  ├── components/     # React 组件
  ├── contexts/      # React Context
  ├── pages/         # Next.js 页面
  ├── styles/        # 全局样式
  ├── types/         # TypeScript 类型定义
  └── utils/         # 工具函数
```

## API 路由

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/generate` - 生成图片

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

[MIT](LICENSE) 