# 盛财有数文章爬虫

这个项目是一个爬虫程序，用于获取盛财有数网站的文章内容，并将其存储到本地 SQLite 数据库中。支持将爬取的文章导出到飞书文档。

## 功能

- 登录盛财有数网站并获取文章
- 提取文章内容、AI 汇总、创建时间和作者信息
- 将数据存储到本地 SQLite 数据库中
- 支持批量爬取（默认 100 篇文章）
- 支持将文章导出到飞书云文档

## 安装依赖

```bash
pip install -r requirements.txt
```

## 配置环境变量

将`.env-example`文件复制为`.env`，并根据实际情况修改其中的配置：

```bash
cp .env-example .env
vim .env  # 或使用其他编辑器编辑
```

### 飞书 API 配置

如需使用飞书导出功能，请在飞书开发者平台创建应用并获取相关凭证，填入`.env`文件：

- `FEISHU_APP_ID`: 飞书应用 ID
- `FEISHU_APP_SECRET`: 飞书应用密钥
- `FEISHU_FOLDER_TOKEN`: 飞书文档目录 Token

## 使用方法

### 爬取文章

```bash
python scys_crawler.py
```

### 导出到飞书

```bash
python export_to_feishu.py
```

默认导出最新的 10 篇文章。如需修改数量，可以编辑代码最后一行。

## 数据库结构

爬取的数据存储在`scys_articles.db`文件中，包含以下字段：

- `id`: 数据库自增主键
- `article_id`: 文章 ID
- `article_content`: 文章内容
- `ai_summary_content`: AI 汇总内容
- `gmt_create`: 文章创建时间
- `author_name`: 作者名称
- `created_at`: 数据入库时间

## 注意事项

- 程序使用 Cookie 进行身份验证，确保 Cookie 有效
- 为避免请求过于频繁，程序在每页爬取后会进行短暂休眠
- 默认爬取 100 篇文章，可以通过修改代码中的`total_articles`变量调整
- 可以通过修改`.env`文件中的`TOTAL_ARTICLES`变量调整爬取的文章数量
