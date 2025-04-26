#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
将爬取的文章导出到飞书多维表格
"""

import os
import sqlite3
import json
import requests
import time
from datetime import datetime
from dotenv import load_dotenv
from tqdm import tqdm

# 加载环境变量
load_dotenv()

# 数据库设置
DB_FILE = "scys_articles.db"

# 飞书API配置
FEISHU_APP_ID = os.getenv("FEISHU_APP_ID")
FEISHU_APP_SECRET = os.getenv("FEISHU_APP_SECRET")
FEISHU_FOLDER_TOKEN = os.getenv("FEISHU_FOLDER_TOKEN")  # 可选，用于创建新的多维表格时指定位置

# 已存在的多维表格配置（如果已有）
FEISHU_BITABLE_ID = os.getenv("FEISHU_BITABLE_ID")  # 已有多维表格的ID

# 网站基础URL
BASE_ARTICLE_URL = "https://scys.com/articleDetail/xq_topic/"

def get_access_token():
    """获取飞书访问令牌"""
    url = "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal"
    headers = {
        "Content-Type": "application/json"
    }
    data = {
        "app_id": FEISHU_APP_ID,
        "app_secret": FEISHU_APP_SECRET
    }
    
    response = requests.post(url, headers=headers, json=data)
    if response.status_code == 200:
        result = response.json()
        if result.get("code") == 0:
            return result.get("tenant_access_token")
    
    print(f"获取飞书令牌失败: {response.text}")
    return None

def create_bitable(access_token, name):
    """创建多维表格"""
    url = "https://open.feishu.cn/open-apis/bitable/v1/apps"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    data = {
        "name": name,
        "folder_token": FEISHU_FOLDER_TOKEN if FEISHU_FOLDER_TOKEN else None
    }
    
    # 如果没有提供folder_token，则移除该字段
    if not FEISHU_FOLDER_TOKEN:
        del data["folder_token"]
    
    response = requests.post(url, headers=headers, json=data)
    if response.status_code == 200:
        result = response.json()
        if result.get("code") == 0:
            return result.get("data", {}).get("app", {}).get("app_token")
    
    print(f"创建多维表格失败: {response.text}")
    return None

def create_table(access_token, app_token, table_name, fields):
    """在多维表格中创建数据表"""
    url = f"https://open.feishu.cn/open-apis/bitable/v1/apps/{app_token}/tables"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    data = {
        "table": {
            "name": table_name,
            "fields": fields
        }
    }
    
    response = requests.post(url, headers=headers, json=data)
    if response.status_code == 200:
        result = response.json()
        if result.get("code") == 0:
            return result.get("data", {}).get("table_id")
    
    print(f"创建数据表失败: {response.text}")
    return None

def batch_create_records(access_token, app_token, table_id, records):
    """批量添加记录到数据表"""
    url = f"https://open.feishu.cn/open-apis/bitable/v1/apps/{app_token}/tables/{table_id}/records/batch_create"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    # 飞书API限制每次最多创建500条记录
    batch_size = 100
    total_records = len(records)
    success_count = 0
    
    for i in range(0, total_records, batch_size):
        batch_records = records[i:i + batch_size]
        
        data = {
            "records": batch_records
        }
        
        response = requests.post(url, headers=headers, json=data)
        if response.status_code == 200:
            result = response.json()
            if result.get("code") == 0:
                success_count += len(batch_records)
                print(f"成功添加 {len(batch_records)} 条记录")
            else:
                print(f"添加记录失败: {result.get('msg')}")
        else:
            print(f"添加记录请求失败: {response.status_code}, {response.text}")
        
        # 避免API限流
        if i + batch_size < total_records:
            time.sleep(0.5)
    
    return success_count

def get_articles_from_db(limit=None):
    """从数据库获取文章"""
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    if limit:
        cursor.execute('''
        SELECT article_id, ai_summary_content, gmt_create, author_name 
        FROM articles 
        ORDER BY id  
        LIMIT ?
        ''', (limit,))
    else:
        cursor.execute('''
        SELECT article_id, ai_summary_content, gmt_create, author_name 
        FROM articles 
        ORDER BY id 
        ''')
    
    articles = cursor.fetchall()
    conn.close()
    
    return articles

from datetime import datetime

# 飞书的日期格式：
# "yyyy/MM/dd"：格式如 2021/1/30
# "yyyy-MM-dd HH:mm"：2021/1/30 14:00
# "MM-dd"：1月30日
# "MM/dd/yyyy"：2021/1/30
# "dd/MM/yyyy"：2021/1/30

def format_date(gmt_create, date_format="%Y/%m/%d"):
    """
    格式化日期显示，支持时间戳、日期字符串、datetime对象等多种输入

    Args:
        gmt_create (str/int/datetime): 输入的时间值，支持以下类型：
            - 时间戳字符串（如 "1630454400"）
            - 日期字符串（如 "2023-01-01 12:00:00"）
            - datetime对象
            - 整数时间戳
        date_format (str): 输出的日期格式，默认为 "%Y-%m-%d %H:%M:%S"

    Returns:
        str: 格式化后的日期字符串，解析失败时返回原始输入
    """
    try:
        # 处理 datetime 对象
        if isinstance(gmt_create, datetime):
            return gmt_create.strftime(date_format)

        # 处理整数时间戳或能转换成整数的字符串
        if isinstance(gmt_create, (int, str)):
            if isinstance(gmt_create, str) and gmt_create.isdigit():
                gmt_create = int(gmt_create)
            
            if isinstance(gmt_create, int):
                # 假设时间戳为 UTC 时间，转换为本地时间（根据需求可改用 utcfromtimestamp）
                date_obj = datetime.fromtimestamp(gmt_create)
                return date_obj.strftime(date_format)

        # 处理字符串类型的日期
        formats = [
            "%Y-%m-%d %H:%M:%S",  # 完整时间（新增支持）
            "%Y-%m-%d %H:%M",     # 精确到分钟
            "%Y/%m/%d",           # 斜杠格式
            "%Y-%m-%d",           # 短横线格式
            "%Y-%m"               # 仅年月
        ]

        if isinstance(gmt_create, str):
            # 尝试解析常见日期格式
            for fmt in formats:
                try:
                    date_obj = datetime.strptime(gmt_create, fmt)
                    return date_obj.strftime(date_format)
                except ValueError:
                    continue

        # 所有尝试都失败时返回原始值
        return gmt_create

    except Exception as e:
        # 可选：记录日志（如 logging.error("Date format failed: %s", e)）
        return gmt_create


def export_to_feishu_bitable(num_articles=100, use_existing=False):
    """导出文章到飞书多维表格"""
    if not all([FEISHU_APP_ID, FEISHU_APP_SECRET]):
        print("请先在.env文件中配置飞书API相关参数")
        return False
    
    # 检查现有多维表格ID
    if use_existing and not FEISHU_BITABLE_ID:
        print("使用现有多维表格需要提供FEISHU_BITABLE_ID")
        use_existing = False
    
    # 获取访问令牌
    print("正在获取飞书访问令牌...")
    access_token = get_access_token()
    if not access_token:
        return False
    
    # 获取文章数据
    print(f"正在从数据库获取最新的{num_articles}篇文章...")
    articles = get_articles_from_db(limit=num_articles)
    if not articles:
        print("没有找到文章")
        return False
    
    print(f"找到了{len(articles)}篇文章，开始导出到飞书多维表格...")
    
    # 定义多维表格的字段结构
    fields = [
        {"field_name": "序号", "type": 2,"property": {"formatter": "0" }},
        {"field_name": "文章ID", "type": 1},
        {"field_name": "作者", "type": 1},
        #{"field_name": "创建时间", "type": 5,"property": {"date_formatter": "yyyy/MM/dd", "auto_fill": False }},
        {"field_name": "创建时间", "type": 1},
        {"field_name": "筛选时间", "type": 1},
        {"field_name": "AI摘要", "type": 1, "description": { "text" : "文章的AI生成摘要"}},
        {"field_name": "原文链接", "type": 15, "description":{ "text" :  "指向原始文章的链接"}},
        {"field_name": "当前用户", "type": 1, "description": { "text" :  "正在阅读此文章的用户"}},
        {"field_name": "是否已读", "type": 3, "property": {"options": [{"name": "是"}, {"name": "否"}]}},
        {"field_name": "阅读时间", "type": 5},
        {"field_name": "阅读摘要", "type": 1, "description": { "text" : "用户的阅读笔记"}}
    ]
    
    # 使用现有多维表格或创建新的
    app_token = None
    if use_existing:
        app_token = FEISHU_BITABLE_ID
        print(f"使用现有多维表格: {app_token}")
    else:
        # 创建新的多维表格
        export_date = datetime.now().strftime("%Y年%m月%d日")
        app_token = create_bitable(access_token, f"盛财有数文章汇总 - {export_date}")
        if not app_token:
            print("创建多维表格失败")
            return False
        print(f"成功创建多维表格: {app_token}")
        
        # 将app_token保存到.env文件中供下次使用
        try:
            with open(".env", "r") as f:
                env_content = f.read()
            
            if "FEISHU_BITABLE_ID" in env_content:
                env_content = env_content.replace(
                    f"FEISHU_BITABLE_ID={FEISHU_BITABLE_ID}",
                    f"FEISHU_BITABLE_ID={app_token}"
                ) if FEISHU_BITABLE_ID else env_content + f"\nFEISHU_BITABLE_ID={app_token}"
            else:
                env_content += f"\nFEISHU_BITABLE_ID={app_token}"
            
            with open(".env", "w") as f:
                f.write(env_content)
                
            print(f"已将多维表格ID保存到.env文件中: FEISHU_BITABLE_ID={app_token}")
        except Exception as e:
            print(f"保存多维表格ID到.env文件失败: {str(e)}")
    
    # 创建数据表
    table_name = "精华文章"
    table_id = create_table(access_token, app_token, table_name, fields)
    if not table_id:
        print("创建数据表失败")
        return False
    
    print(f"成功创建数据表: {table_name} (ID: {table_id})")
    
    # 准备文章记录
    records = []
    for i, article in enumerate(tqdm(articles, desc="准备数据"), 1):
        article_id = article['article_id']
        author = article['author_name'] or "佚名"
        gmt_create = format_date(article['gmt_create'])
        filter_time = format_date(article['gmt_create'], "%Y-%m")
        ai_summary = article['ai_summary_content'] or "暂无AI摘要"
        
        # 构建原文链接
        original_link = f"{BASE_ARTICLE_URL}{article_id}"
        
        # 创建记录
        record = {
            "fields": {
                "序号": i,
                "文章ID": article_id,
                "作者": author,
                "创建时间": gmt_create,
                "筛选时间": filter_time,
                "AI摘要": ai_summary,
                "原文链接": {"text":original_link,"link":original_link},
                "是否已读": "否"
            }
        }
        records.append(record)
    
    # 批量添加记录
    success_count = batch_create_records(access_token, app_token, table_id, records)
    
    print(f"\n导出完成! 成功导出 {success_count}/{len(articles)} 篇文章到飞书多维表格")
    print(f"请访问以下链接查看: https://bitable.feishu.cn/app/{app_token}")
    
    return True

if __name__ == "__main__":
    # 默认导出最新的100篇文章到多维表格
    # 设置use_existing=True可以使用已有的多维表格(需在.env中设置FEISHU_BITABLE_ID)
    # export_to_feishu_bitable(10, use_existing=True) 
    export_to_feishu_bitable(5550, use_existing=True) 