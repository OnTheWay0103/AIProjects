# Mikey.app

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-blue?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<div align="center">
  <img src="public/preview.png" alt="Mikey.app Preview" width="800"/>
</div>

Mikey.app 是世界上第一个完全免费的 AI 图像生成器，由 FLUX.1-Dev 模型驱动。本项目是 [Raphael.app](https://raphael.app/) 的完整克隆版本。

## ✨ 功能特点

- 🎨 无限免费的 AI 图像生成
- 🔒 零数据保留策略
- 🚀 闪电般的生成速度
- 🎯 卓越的文本理解能力
- 🎭 多风格支持
- 📱 响应式设计

## 🛠️ 技术栈

- **前端框架**: [Next.js 14](https://nextjs.org/)
- **UI 框架**: [React 18](https://reactjs.org/)
- **样式解决方案**: [Tailwind CSS](https://tailwindcss.com/)
- **开发语言**: [TypeScript](https://www.typescriptlang.org/)
- **代码规范**: ESLint + Prettier
- **状态管理**: React Context
- **API 调用**: Fetch API
- **AI 服务**: FLUX.1-Dev

## 📋 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0
- 现代浏览器支持

## 🚀 快速开始

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

## 🏗️ 项目结构

```
src/
  ├── components/     # React 组件
  ├── contexts/      # React Context
  ├── pages/         # Next.js 页面
  ├── styles/        # 全局样式
  ├── types/         # TypeScript 类型定义
  └── utils/         # 工具函数
```

## 🔌 API 路由

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/generate` - 生成图片

## 🧪 测试

运行单元测试：

```bash
npm test
```

运行端到端测试：

```bash
npm run test:e2e
```

## 🚢 部署

1. 构建项目

```bash
npm run build
```

2. 启动生产服务器

```bash
npm start
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📝 更新日志

查看 [CHANGELOG.md](CHANGELOG.md) 了解项目更新历史。

## ❓ 常见问题

查看 [FAQ.md](docs/FAQ.md) 了解常见问题解答。

## 👥 项目维护者

- [@yourusername](https://github.com/yourusername) - 项目维护者

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- 感谢 [Raphael.app](https://raphael.app/) 提供的灵感
- 感谢所有贡献者的付出
