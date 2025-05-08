# Mikey.app 重构步骤

## 第一步：项目结构重构

### 1. 更新项目依赖

- 添加 Next.js 和 React 相关依赖
- 添加 TypeScript 相关依赖
- 添加 Tailwind CSS 相关依赖
- 添加 ESLint 和 Prettier 相关依赖

### 2. 配置文件设置

- 创建 `tsconfig.json` - TypeScript 配置
- 创建 `next.config.js` - Next.js 配置
- 创建 `tailwind.config.js` - Tailwind CSS 配置
- 创建 `postcss.config.js` - PostCSS 配置
- 创建 `.eslintrc.js` - ESLint 配置
- 创建 `.prettierrc` - Prettier 配置

### 3. 项目结构设置

- 创建 `src` 目录结构
  - `components/` - 组件目录
  - `pages/` - 页面目录
  - `styles/` - 样式目录
  - `utils/` - 工具函数目录
  - `hooks/` - 自定义 Hooks 目录
  - `types/` - TypeScript 类型定义目录
  - `constants/` - 常量定义目录
  - `services/` - 服务层目录

### 4. 基础文件创建

- 创建 `src/styles/globals.css` - 全局样式
- 创建 `src/pages/_app.tsx` - 应用入口
- 创建 `src/pages/index.tsx` - 首页

## 下一步计划

### 1. 实现基础布局组件

- 创建 Header 组件
- 创建 Footer 组件
- 创建 Layout 组件

### 2. 实现首页主要内容

- 创建 Hero 部分
- 创建特性介绍部分
- 创建使用示例部分

### 3. 实现图片生成功能

- 创建图片生成表单
- 实现图片生成 API 调用
- 添加图片展示组件

### 4. 实现用户系统

- 创建登录/注册页面
- 实现用户认证
- 添加用户个人中心

## 技术栈

- 前端框架：Next.js 14
- UI 框架：React 18
- 样式解决方案：Tailwind CSS
- 开发语言：TypeScript
- 代码规范：ESLint + Prettier
- 状态管理：React Context
- API 调用：Axios
- 数据库：MySQL
- 缓存：Redis
- AI 服务：Replicate + Hugging Face
