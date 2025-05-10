# 项目目录结构规范

## 目录结构

```
mikey-app/
├── .github/                    # GitHub 相关配置
│   ├── workflows/             # GitHub Actions 工作流
│   └── ISSUE_TEMPLATE/        # Issue 模板
│
├── .husky/                    # Git hooks 配置
│   └── pre-commit            # 提交前检查
│
├── .vscode/                   # VS Code 配置
│   ├── extensions.json        # 推荐扩展
│   └── settings.json          # 编辑器设置
│
├── public/                    # 静态资源
│   ├── images/               # 图片资源
│   ├── fonts/                # 字体文件
│   └── favicon.ico           # 网站图标
│
├── src/                      # 源代码
│   ├── pages/               # Next.js Pages Router
│   │   ├── api/            # API 路由
│   │   ├── _app.tsx        # 应用入口
│   │   ├── _document.tsx   # 文档配置
│   │   └── index.tsx       # 首页
│   │
│   ├── components/          # React 组件
│   │   ├── common/          # 通用组件
│   │   ├── features/        # 功能组件
│   │   ├── layouts/         # 布局组件
│   │   └── ui/              # UI 组件
│   │
│   ├── hooks/               # 自定义 Hooks
│   │   ├── api/            # API 相关 Hooks
│   │   └── common/         # 通用 Hooks
│   │
│   ├── lib/                 # 工具库
│   │   ├── api/            # API 客户端
│   │   ├── utils/          # 工具函数
│   │   └── constants/      # 常量定义
│   │
│   ├── services/           # 服务层
│   │   ├── api/           # API 服务
│   │   └── auth/          # 认证服务
│   │
│   ├── store/              # 状态管理
│   │   ├── contexts/       # React Context
│   │   └── reducers/       # Redux Reducers
│   │
│   ├── styles/             # 样式文件
│   │   ├── globals.css     # 全局样式
│   │   └── themes/         # 主题配置
│   │
│   ├── types/              # TypeScript 类型
│   │   ├── api/           # API 类型
│   │   └── common/        # 通用类型
│   │
│   └── assets/             # 项目资源
│       ├── images/         # 图片资源
│       └── icons/          # 图标资源
│
├── tests/                  # 测试文件
│   ├── unit/              # 单元测试
│   │   ├── components/    # 组件测试
│   │   ├── hooks/         # Hooks 测试
│   │   └── utils/         # 工具函数测试
│   │
│   └── integration/       # 集成测试
│
├── docs/                   # 项目文档
│   ├── api/               # API 文档
│   ├── guides/            # 使用指南
│   └── architecture/      # 架构文档
│
├── scripts/                # 脚本文件
│   ├── build/             # 构建脚本
│   └── deploy/            # 部署脚本
│
├── .env.example           # 环境变量示例
├── .eslintrc.js          # ESLint 配置
├── .prettierrc           # Prettier 配置
├── .gitignore            # Git 忽略文件
├── next.config.js        # Next.js 配置
├── package.json          # 项目依赖
├── tsconfig.json         # TypeScript 配置
├── README.md             # 项目说明
└── CHANGELOG.md          # 更新日志
```

## 目录说明

### 1. 配置文件目录

- `.github/`: GitHub 相关配置，包括工作流和 Issue 模板
- `.husky/`: Git hooks 配置，用于代码提交前的检查
- `.vscode/`: VS Code 编辑器配置，确保团队开发环境一致

### 2. 静态资源目录

- `public/`: 存放静态资源文件
  - `images/`: 图片资源
  - `fonts/`: 字体文件
  - `favicon.ico`: 网站图标

### 3. 源代码目录

- `src/pages/`: Next.js Pages Router 页面

  - `api/`: API 路由
  - `_app.tsx`: 应用入口
  - `_document.tsx`: 文档配置
  - `index.tsx`: 首页

- `src/components/`: React 组件

  - `common/`: 通用组件
  - `features/`: 功能组件
  - `layouts/`: 布局组件
  - `ui/`: UI 组件

- `src/hooks/`: 自定义 Hooks

  - `api/`: API 相关 Hooks
  - `common/`: 通用 Hooks

- `src/lib/`: 工具库

  - `api/`: API 客户端
  - `utils/`: 工具函数
  - `constants/`: 常量定义

- `src/services/`: 服务层

  - `api/`: API 服务
  - `auth/`: 认证服务

- `src/store/`: 状态管理

  - `contexts/`: React Context
  - `reducers/`: Redux Reducers

- `src/styles/`: 样式文件

  - `globals.css`: 全局样式
  - `themes/`: 主题配置

- `src/types/`: TypeScript 类型

  - `api/`: API 类型
  - `common/`: 通用类型

- `src/assets/`: 项目资源
  - `images/`: 图片资源
  - `icons/`: 图标资源

### 4. 测试目录

- `tests/`: 测试文件
  - `unit/`: 单元测试
    - `components/`: 组件测试
    - `hooks/`: Hooks 测试
    - `utils/`: 工具函数测试
  - `integration/`: 集成测试

### 5. 文档目录

- `docs/`: 项目文档
  - `api/`: API 文档
  - `guides/`: 使用指南
  - `architecture/`: 架构文档

### 6. 脚本目录

- `scripts/`: 脚本文件
  - `build/`: 构建脚本
  - `deploy/`: 部署脚本

## 最佳实践

1. **模块化组织**

   - 按功能模块组织代码
   - 保持目录结构清晰
   - 避免过深的目录嵌套

2. **命名规范**

   - 使用小写字母
   - 使用连字符分隔
   - 保持命名一致性

3. **文件组织**

   - 相关文件放在一起
   - 使用 index 文件导出
   - 保持文件结构扁平

4. **代码分割**

   - 按路由分割代码
   - 按功能分割组件
   - 优化加载性能

5. **测试覆盖**

   - 单元测试
   - 集成测试

6. **文档维护**

   - 及时更新文档
   - 保持文档同步
   - 添加必要注释

7. **安全性**

   - 敏感配置隔离
   - 环境变量管理
   - 错误处理规范

8. **性能优化**

   - 代码分割
   - 懒加载
   - 缓存策略

9. **代码质量**

   - ESLint 规范
   - Prettier 格式化
   - TypeScript 类型检查

10. **开发流程**
    - Git 工作流
    - 代码审查
    - 持续集成
