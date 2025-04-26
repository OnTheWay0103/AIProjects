import requests
import json
import sqlite3
import time
import os
import datetime
from tqdm import tqdm
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

# 配置信息
BASE_URL = "https://scys.com/shengcai-web/client/homePage/searchTopic"

# 从环境变量或默认值获取Cookie
COOKIES = {
    "Hm_lvt_5daced94f782d31a20a30089305b8f04": os.getenv("COOKIE_HM_LVT", "1744265075"),
    "HMACCOUNT": os.getenv("COOKIE_HMACCOUNT", "264FADC56BEE1F72"),
    "_ga": os.getenv("COOKIE_GA", "GA1.1.1536569546.1744265075"),
    "Hm_lpvt_5daced94f782d31a20a30089305b8f04": os.getenv("COOKIE_HM_LPVT", "1744642270"),
    "__user_token.v3": os.getenv("COOKIE_USER_TOKEN", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyMzMxNzEsIm5hbWUiOiLotbXlvLoiLCJ4cV9pZCI6MzY3OCwibnVtYmVyIjoxMjY3MiwieHFfZ210X2V4cGlyZSI6MTc0NDkwNTYwMCwieHFfZ210X3VwZGF0ZSI6MTc0NDg2Njc1MCwidG9rZW5fZXhwaXJlIjoxNzQ2MDc2MzUwfQ.ytdpc8uqZhCMRT4I6fn7inZx0mYPEM2LLzOY9Zrik-s"),
    "_ga_5WKHQQ4SFM": os.getenv("COOKIE_GA_5WKHQQ4SFM", "GS1.1.1745220670.9.1.1745221312.0.0.0")
}

HEADERS = {
    "Host": "scys.com",
    "Content-Length": "115",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Content-Type": "application/json",
    "Accept": "application/json, text/plain, */*",
    "X-Token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyMzMxNzEsIm5hbWUiOiLotbXlvLoiLCJ4cV9pZCI6MzY3OCwibnVtYmVyIjoxMjY3MiwieHFfZ210X2V4cGlyZSI6MTc0NDkwNTYwMCwieHFfZ210X3VwZGF0ZSI6MTc0NDg2Njc1MCwidG9rZW5fZXhwaXJlIjoxNzQ2MDc2MzUwfQ.ytdpc8uqZhCMRT4I6fn7inZx0mYPEM2LLzOY9Zrik-s"
}

# 数据库设置
DB_FILE = "scys_articles.db"
# 爬虫配置
TOTAL_ARTICLES = int(os.getenv("TOTAL_ARTICLES", "100"))
ARTICLES_PER_PAGE = int(os.getenv("ARTICLES_PER_PAGE", "20"))
REQUEST_TIMEOUT = int(os.getenv("REQUEST_TIMEOUT", "30"))
# 保存原始数据的目录
RAW_DATA_DIR = "raw_api_responses"

def init_database():
    """初始化SQLite数据库"""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # 创建表格
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY,
        article_id TEXT,
        article_content TEXT,
        ai_summary_content TEXT,
        gmt_create TEXT,
        author_name TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    conn.commit()
    conn.close()
    print("数据库初始化完成")

def fetch_articles(page=1, page_size=20):
    """获取文章列表"""
    payload = {
        "isDigested": True,
        "isSimpleModel": False,
        "orderBy": "gmt_create",
        "pageScene": "homePage", 
        "pageIndex": page,
        "pageSize": page_size,
        "topicTypeId": ""  # 可根据需要修改参数
    }
    
    try:
        response = requests.post(
            BASE_URL, 
            headers=HEADERS, 
            cookies=COOKIES, 
            json=payload,
            timeout=REQUEST_TIMEOUT
        )
        
        if response.status_code == 200:
            data = response.json()
            
            # 保存原始响应到文件
            saved_file = save_raw_response(data, page)
            print(f"已保存第 {page} 页原始响应到: {saved_file}")
            
            if data.get("success"):
                # 根据新的JSON结构，文章列表在data.items中
                return data.get("data", {}).get("items", [])
            else:
                print(f"请求失败: {data.get('message')}")
                return []
        else:
            print(f"HTTP错误: {response.status_code}")
            print(f"响应内容: {response.text[:200]}...")  # 打印部分响应内容
            return []
    except Exception as e:
        print(f"请求异常: {str(e)}")
        return []

def save_article(article_item):
    """保存文章到数据库"""
    if not article_item:
        return False
        
    # 从新的JSON结构中提取数据
    topic_dto = article_item.get("topicDTO", {})
    topic_user_dto = article_item.get("topicUserDTO", {})
    
    if not topic_dto:
        print("文章数据结构不完整，跳过")
        return False
        
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # 提取需要的字段
    article_id = topic_dto.get("entityId") or topic_dto.get("topicId") or topic_dto.get("articleId") or "未知ID"
    article_content = topic_dto.get("articleContent", "")
    ai_summary_content = topic_dto.get("aiSummaryContent", "")
    
    # 处理时间戳转换为可读时间
    gmt_create_timestamp = topic_dto.get("gmtCreate")
    if gmt_create_timestamp and isinstance(gmt_create_timestamp, int):
        # 判断时间戳是秒还是毫秒
        if len(str(gmt_create_timestamp)) > 10:
            gmt_create_timestamp = gmt_create_timestamp / 1000  # 转换为秒
        gmt_create = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(gmt_create_timestamp))
    else:
        gmt_create = str(gmt_create_timestamp) if gmt_create_timestamp else ""
    
    # 获取作者信息
    author_name = topic_user_dto.get("name", "")
    
    # 检查是否有文章ID，没有则跳过
    if not article_id:
        print("无法获取文章ID，跳过")
        return False
        
    # 检查文章是否已存在
    cursor.execute("SELECT id FROM articles WHERE article_id = ?", (str(article_id),))
    if cursor.fetchone() is None:
        cursor.execute('''
        INSERT INTO articles (article_id, article_content, ai_summary_content, gmt_create, author_name)
        VALUES (?, ?, ?, ?, ?)
        ''', (str(article_id), article_content, ai_summary_content, gmt_create, author_name))
        
        conn.commit()
        result = True
    else:
        result = False
    
    conn.close()
    return result

def show_stats():
    """显示数据库统计信息"""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # 获取文章总数
    cursor.execute("SELECT COUNT(*) FROM articles")
    total_count = cursor.fetchone()[0]
    
    # 获取最新的5篇文章
    cursor.execute('''
    SELECT article_id, author_name, gmt_create, substr(article_content, 1, 30) as preview
    FROM articles
    ORDER BY id DESC
    LIMIT 5
    ''')
    latest_articles = cursor.fetchall()
    
    conn.close()
    
    print(f"\n数据库统计信息:")
    print(f"总文章数: {total_count}")
    
    if latest_articles:
        print("\n最新爬取的5篇文章:")
        for article in latest_articles:
            article_id, author, date, preview = article
            print(f"ID: {article_id} | 作者: {author} | 日期: {date} | 预览: {preview}...")
    
    print("\n爬取完成！")

def ensure_raw_data_dir():
    """确保原始数据目录存在"""
    if not os.path.exists(RAW_DATA_DIR):
        os.makedirs(RAW_DATA_DIR)
        print(f"创建原始数据保存目录: {RAW_DATA_DIR}")

def save_raw_response(response_data, page):
    """保存原始API响应到文件"""
    ensure_raw_data_dir()
    
    # 生成带有时间戳的文件名，格式为 YYYYMMDD_HHMMSS_page_X.json
    date_str = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f"{date_str}_page_{page}.json"
    file_path = os.path.join(RAW_DATA_DIR, filename)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(response_data, f, ensure_ascii=False, indent=2)
    
    print(f"原始API响应已保存至: {file_path}")
    return file_path

def main():
    """主函数"""
    print("盛财有数文章爬虫启动...")
    print(f"配置信息: 目标爬取 {TOTAL_ARTICLES} 篇文章，每页 {ARTICLES_PER_PAGE} 篇")
    
    print("初始化数据库...")
    init_database()
    
    # 确保原始数据目录存在
    ensure_raw_data_dir()
    
    print("开始爬取文章...")
    total_articles = TOTAL_ARTICLES
    articles_per_page = ARTICLES_PER_PAGE
    pages_needed = (total_articles + articles_per_page - 1) // articles_per_page
    
    saved_count = 0
    
    for page in tqdm(range(1, pages_needed + 1), desc="爬取进度"):
        print(f"\n正在爬取第 {page} 页...")
        articles = fetch_articles(page=page, page_size=articles_per_page)
        
        if not articles:
            print(f"页面 {page} 没有找到文章，结束爬取")
            break
            
        print(f"已获取 {len(articles)} 篇文章")
        for i, article in enumerate(articles, 1):
            article_dto = article.get("topicDTO", {})
            article_id = article_dto.get("topicId") or article_dto.get("articleId") or "未知ID"
            
            if save_article(article):
                saved_count += 1
                print(f"  [{i}/{len(articles)}] 已保存文章 (ID: {article_id})")
            else:
                print(f"  [{i}/{len(articles)}] 文章已存在或无效，跳过 (ID: {article_id})")
                
            if saved_count >= total_articles:
                break
        
        if saved_count >= total_articles:
            print(f"已达到目标数量 {total_articles} 篇，结束爬取")
            break
            
        # 添加延迟避免请求过于频繁
        print(f"等待 1 秒后继续...")
        time.sleep(1)
    
    print(f"\n爬取完成，共保存了 {saved_count} 篇文章")
    
    # 显示统计信息
    show_stats()

if __name__ == "__main__":
    main() 