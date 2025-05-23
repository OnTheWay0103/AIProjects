# Mikey.app 网站规划文档 V4

## 一、当前项目状态分析

### 1. 技术框架

- 已使用 Next.js 14、React 18、TypeScript 和 Tailwind CSS 搭建基础框架
- 目录结构符合 project-structure.md 中的规范要求
- 基本组件架构已建立(layouts, features, ui 等)

### 2. 页面实现情况

- 首页(index.tsx)：有基础结构但需要与 Raphael.app 对齐
- 生成页(generate.tsx)：基础版本已实现
- 用户相关页面：已有登录/注册页面框架
- 探索页(explore.tsx)：基础版本已实现
- public 目录中有多个 HTML 模板文件

### 3. 组件实现情况

- 布局组件：已有 Navbar 和 Layout
- 功能组件：已有 GenerateForm、GenerateHistory 等
- 图片相关组件：已有 ImageCard、ImageGrid、ImageList 等
- 设置表单：已有 SettingsForm

### 4. 对照清单状态

- 大多数 UI 元素标记为"🚧"(进行中)
- 视觉风格部分(配色、字体、间距、圆角、阴影)已标记为"✅"(已完成)
- 用户系统和高级功能标记为"⏳"(计划中)

## 二、开发路线图

### 1. 首页完善 (优先级: 高)

#### 1.1 顶部导航栏

- 参照 Raphael.app 实现完全一致的导航布局
- 添加导航链接(Features, FAQs, Pricing 等)
- 实现语言切换按钮
- 优化登录按钮样式

#### 1.2 主标题区域

- 更新标题文案为"Mikey AI"
- 添加副标题"Create stunning AI-generated images in seconds"
- 添加宣传语"World's First Unlimited Free AI Image Generator"
- 实现特性标签(100% Free, Powered by Flux.1-Dev, No Login Required, Unlimited Generations)

#### 1.3 图片生成区域

- 优化输入框样式和位置
- 实现参数设置面板：
  - 宽高比选择(1:1, 3:4, 4:3, 9:16, 16:9)
  - 风格选择
  - 颜色选择
  - 光照选择
  - 构图选择
- 添加负面提示词输入框
- 优化生成按钮样式

#### 1.4 示例展示区

- 实现网格布局
- 完善图片卡片样式
- 添加图片悬停效果
- 加载示例图片

#### 1.5 特性展示区

- 添加标题"Key Features of Mikey"
- 实现特性卡片:
  - Zero-Cost Creation
  - State-of-the-Art Quality
  - Advanced Text Understanding
  - Lightning-Fast Generation
  - Enhanced Privacy Protection
  - Multi-Style Support

#### 1.6 数据统计区

- 添加标题"Trusted by Millions"
- 实现统计数据展示:
  - Active Users: 3M+
  - Images Created: 1,530/分钟
  - User Rating: 4.9

#### 1.7 用户评价区

- 添加标题"What Users Say About Mikey AI"
- 实现评价卡片样式
- 添加用户头像和名称
- 填充评价内容

#### 1.8 FAQ 区域

- 添加标题"Frequently Asked Questions"
- 实现问题列表样式
- 添加展开/收起动画

#### 1.9 页脚

- 添加版权信息
- 实现链接列表
- 添加社交媒体图标

### 2. 生成器功能完善 (优先级: 高)

#### 2.1 提示词输入优化

- 优化输入框样式
- 添加输入提示文字
- 添加语言提示(请用英文输入提示词以获得最佳效果)

#### 2.2 参数设置面板

- 实现比例选择组件
- 实现风格选择组件(带预览)
- 实现色彩选择组件
- 实现光照选择组件
- 实现构图选择组件

#### 2.3 负面提示词

- 实现负面提示词输入框
- 添加常用负面提示词建议

#### 2.4 生成体验优化

- 实现清除按钮
- 实现随机生成按钮
- 优化生成按钮
- 添加生成进度显示
- 实现结果展示区域

### 3. 图片展示区优化 (优先级: 中)

#### 3.1 瀑布流布局

- 实现响应式网格
- 优化图片加载
- 添加懒加载功能

#### 3.2 图片交互

- 完善图片卡片样式
- 添加悬停效果(放大、信息显示)
- 实现点击查看大图
- 添加下载按钮

#### 3.3 图片浏览

- 实现图片详情模态框
- 添加图片分享功能
- 实现图片编辑入口

### 4. 交互细节优化 (优先级: 中)

#### 4.1 导航交互

- 添加链接悬停效果
- 实现语言切换下拉菜单
- 优化登录按钮悬停效果

#### 4.2 表单交互

- 添加输入框焦点效果
- 实现参数选择按钮状态变化
- 添加生成按钮加载动画

#### 4.3 动画效果

- 添加页面滚动渐入效果
- 实现卡片悬停动画
- 优化按钮点击反馈
- 添加加载状态动画

### 5. 响应式优化 (优先级: 中)

#### 5.1 移动端适配

- 优化导航栏折叠
- 调整内容区域布局
- 适配图片网格

#### 5.2 平板端适配

- 优化内容排版
- 调整组件间距
- 确保交互友好

#### 5.3 桌面端优化

- 确保宽屏下的美观布局
- 优化高分辨率支持

### 6. 用户系统集成 (优先级: 低)

#### 6.1 登录/注册

- 完善登录表单
- 优化注册流程
- 添加第三方登录

#### 6.2 用户中心

- 实现个人信息页
- 添加作品管理
- 实现收藏功能

## 三、技术实现注意事项

### 1. 代码一致性

- 统一使用 Next.js 框架实现所有页面
- 确保组件风格一致
- 遵循项目目录结构规范

### 2. 性能优化

- 实现图片懒加载
- 优化组件渲染性能
- 添加适当的缓存策略

### 3. 用户体验

- 确保加载状态清晰可见
- 添加适当的错误处理
- 优化表单验证反馈

### 4. 测试策略

- 为关键组件编写单元测试
- 实现端到端测试确保功能正常
- 进行跨浏览器兼容性测试

## 四、阶段划分

### 阶段一：基础 UI 复制 (当前阶段)

- 完成首页所有区块的 UI 实现
- 实现图片生成区域基本功能
- 确保与 Raphael.app 视觉一致性

### 阶段二：功能完善

- 优化图片生成体验
- 完善参数设置功能
- 实现图片浏览和交互功能

### 阶段三：高级功能

- 集成用户系统
- 添加社区功能
- 实现高级编辑功能

> 本文档将作为项目开发的主要指导文件，随着开发进度的推进可能会有所调整。
