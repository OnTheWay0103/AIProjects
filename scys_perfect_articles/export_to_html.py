#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
将爬取的文章导出为HTML文件
"""

import os
import sqlite3
from datetime import datetime
import webbrowser
from tqdm import tqdm

# 数据库设置
DB_FILE = "scys_articles.db"

# 网站基础URL
BASE_ARTICLE_URL = "https://scys.com/articleDetail/xq_topic/"

def get_articles_from_db(limit=None):
    """从数据库获取文章"""
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    if limit:
        cursor.execute('''
        SELECT article_id, ai_summary_content, gmt_create, author_name 
        FROM articles 
        ORDER BY id DESC 
        LIMIT ?
        ''', (limit,))
    else:
        cursor.execute('''
        SELECT article_id, ai_summary_content, gmt_create, author_name 
        FROM articles 
        ORDER BY id DESC
        ''')
    
    articles = cursor.fetchall()
    conn.close()
    
    return articles

def format_date(gmt_create):
    """格式化日期显示"""
    try:
        # 尝试解析不同格式的日期
        if isinstance(gmt_create, str) and gmt_create.isdigit():
            # 如果是时间戳字符串
            timestamp = int(gmt_create)
            date_obj = datetime.fromtimestamp(timestamp)
            return date_obj.strftime("%Y年%m月%d日 %H:%M")
        else:
            date_obj = datetime.strptime(gmt_create, "%Y-%m-%d %H:%M:%S")
            return date_obj.strftime("%Y年%m月%d日 %H:%M")
    except:
        return gmt_create

def export_to_html(num_articles=20, open_browser=True):
    """导出文章到HTML文件"""
    # 获取文章数据
    print(f"正在从数据库获取最新的{num_articles}篇文章...")
    articles = get_articles_from_db(limit=num_articles)
    if not articles:
        print("没有找到文章")
        return False
    
    print(f"找到了{len(articles)}篇文章，开始导出到HTML...")
    
    # 创建导出目录
    export_dir = "exported_articles"
    if not os.path.exists(export_dir):
        os.makedirs(export_dir)
    
    # 创建汇总HTML
    export_date = datetime.now().strftime("%Y年%m月%d日")
    summary_filename = f"文章汇总_{export_date.replace(':', '-')}.html"
    summary_file = os.path.join(export_dir, summary_filename)
    
    with open(summary_file, "w", encoding="utf-8") as f:
        # HTML头部
        f.write(f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>盛财有数文章汇总 - {export_date}</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 20px; }}
        table {{ border-collapse: collapse; width: 100%; }}
        th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
        th {{ background-color: #f2f2f2; }}
        tr:nth-child(even) {{ background-color: #f9f9f9; }}
        h1 {{ color: #333; }}
        .summary {{ max-width: 400px; overflow: hidden; text-overflow: ellipsis; }}
    </style>
</head>
<body>
    <h1>盛财有数文章汇总 - {export_date}</h1>
    <p>共导出 {len(articles)} 篇文章</p>
    <table>
        <tr>
            <th>序号</th>
            <th>作者</th>
            <th>创建时间</th>
            <th>AI摘要</th>
            <th>原文链接</th>
            <th>本地链接</th>
            <th>当前用户</th>
            <th>是否已读</th>
            <th>阅读时间</th>
            <th>阅读摘要</th>
        </tr>
""")
        
        # 添加每篇文章信息并创建单独的HTML文件
        for i, article in enumerate(tqdm(articles, desc="生成HTML文件"), 1):
            article_id = article['article_id']
            author = article['author_name'] or "佚名"
            gmt_create = format_date(article['gmt_create'])
            ai_summary = article['ai_summary_content'] or "未提供AI摘要"
            
            # 处理可能过长的摘要
            if ai_summary and len(ai_summary) > 100:
                ai_summary_display = ai_summary[:97] + "..."
            else:
                ai_summary_display = ai_summary
                
            # 构建原文链接
            original_link = f"{BASE_ARTICLE_URL}{article_id}"
            
            # 创建单独的文章HTML文件
            article_filename = f"article_{article_id}.html"
            article_path = os.path.join(export_dir, article_filename)
            
            # 写入汇总表格
            f.write(f"""
        <tr>
            <td>{i}</td>
            <td>{author}</td>
            <td>{gmt_create}</td>
            <td class="summary">{ai_summary_display}</td>
            <td><a href="{original_link}" target="_blank">原文链接</a></td>
            <td><a href="{article_filename}" target="_blank">本地查看</a></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>""")
            
            # 创建单独的文章HTML文件
            with open(article_path, "w", encoding="utf-8") as article_file:
                article_file.write(f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{author}的文章 - {article_id}</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 20px; max-width: 800px; margin: 0 auto; line-height: 1.6; }}
        h1 {{ color: #333; }}
        .meta {{ color: #666; margin-bottom: 20px; }}
        .summary {{ background-color: #f9f9f9; padding: 15px; border-left: 4px solid #ddd; margin-bottom: 20px; }}
        a {{ color: #0066cc; }}
        .reading-form {{ background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin-top: 30px; }}
        input, textarea {{ width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px; }}
        button {{ background-color: #4CAF50; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; }}
        button:hover {{ background-color: #45a049; }}
    </style>
</head>
<body>
    <h1>{author}的文章</h1>
    <div class="meta">
        <p>创建时间: {gmt_create}</p>
        <p>文章ID: {article_id}</p>
        <p><a href="{original_link}" target="_blank">原文链接</a> | <a href="{summary_filename}">返回汇总</a></p>
    </div>
    
    <h2>AI摘要</h2>
    <div class="summary">
        {ai_summary}
    </div>
    
    <div class="reading-form">
        <h2>阅读记录</h2>
        <form id="readingForm">
            <div>
                <label for="reader">阅读者:</label>
                <input type="text" id="reader" name="reader">
                
                <label for="is_read">是否已读:</label>
                <select id="is_read" name="is_read">
                    <option value="是">是</option>
                    <option value="否">否</option>
                </select>
                
                <label for="read_date">阅读时间:</label>
                <input type="date" id="read_date" name="read_date">
                
                <label for="notes">阅读笔记:</label>
                <textarea id="notes" name="notes" rows="5"></textarea>
                
                <button type="button" onclick="saveNotes()">保存笔记</button>
            </div>
        </form>
    </div>

    <script>
        // 设置当前日期为默认值
        document.getElementById('read_date').valueAsDate = new Date();
        
        function saveNotes() {{
            // 在实际应用中，这里应该发送数据到服务器
            // 这里只是一个演示
            const reader = document.getElementById('reader').value;
            const isRead = document.getElementById('is_read').value;
            const readDate = document.getElementById('read_date').value;
            const notes = document.getElementById('notes').value;
            
            if (!reader) {{
                alert('请输入阅读者名称');
                return;
            }}
            
            // 显示保存成功消息
            alert('笔记已保存！\\n\\n阅读者: ' + reader + '\\n是否已读: ' + isRead + '\\n阅读时间: ' + readDate + '\\n笔记内容: ' + notes);
            
            // 在实际应用中，这里可以将数据保存到localStorage或发送到服务器
            localStorage.setItem('article_{article_id}_reader', reader);
            localStorage.setItem('article_{article_id}_is_read', isRead);
            localStorage.setItem('article_{article_id}_read_date', readDate);
            localStorage.setItem('article_{article_id}_notes', notes);
        }}
        
        // 加载保存的数据
        window.onload = function() {{
            const reader = localStorage.getItem('article_{article_id}_reader');
            const isRead = localStorage.getItem('article_{article_id}_is_read');
            const readDate = localStorage.getItem('article_{article_id}_read_date');
            const notes = localStorage.getItem('article_{article_id}_notes');
            
            if (reader) document.getElementById('reader').value = reader;
            if (isRead) document.getElementById('is_read').value = isRead;
            if (readDate) document.getElementById('read_date').value = readDate;
            if (notes) document.getElementById('notes').value = notes;
        }};
    </script>
</body>
</html>""")
        
        # 完成汇总HTML
        f.write("""
    </table>
    <script>
        // 可以在这里添加一些JavaScript功能，例如排序、过滤等
    </script>
</body>
</html>""")
    
    print(f"\n导出完成! 汇总文件保存在: {summary_file}")
    
    # 自动在浏览器中打开汇总文件
    if open_browser:
        try:
            webbrowser.open('file://' + os.path.abspath(summary_file))
            print("已在浏览器中打开汇总文件")
        except:
            print(f"无法自动打开浏览器，请手动打开文件: {summary_file}")
    
    return True

if __name__ == "__main__":
    # 默认导出最新的20篇文章并在浏览器中打开
    export_to_html(20, open_browser=True) 