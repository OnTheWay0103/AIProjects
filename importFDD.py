import os
import csv
import requests
import time
from datetime import datetime
import re

def sanitize_filename(filename):
    """清理文件名中的非法字符"""
    return re.sub(r'[\\/*?:"<>|]', '_', filename)

def download_contracts(csv_path, output_dir, max_retries=3, retry_delay=1):
    """下载合同文件主函数"""
    # 创建输出目录
    os.makedirs(output_dir, exist_ok=True)
    
    # 失败记录文件路径
    failed_path = os.path.join(output_dir, 'failed_downloads.csv')
    failed_fields = ['合同ID', '合同文件', 'URL', '错误信息', '时间']
    
    # 初始化计数器
    total = 0
    success_count = 0
    failure_count = 0
    skipped_count = 0

    # 读取CSV文件
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            total += 1
            contract_id = row['合同ID']
            view_url = row['合同地址']
            conname = row['合同文件']
            
            # 清理文件名并生成路径
            conname_safe = sanitize_filename(conname)
            filename = f"{conname_safe}.pdf"
            filepath = os.path.join(output_dir, filename)
            
            # 检查文件是否已存在
            if os.path.exists(filepath):
                print(f"文件已存在，跳过: {filename}")
                skipped_count += 1
                continue

            # 构造下载URL
            pdf_url = view_url.replace("/viewdocs.action?", "/getdocs.action?")
            
            # 配置请求头
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                            'AppleWebKit/537.36 (KHTML, like Gecko) '
                            'Chrome/58.0.3029.110 Safari/537.3'
            }

            # 带重试机制的下载流程
            success = False
            error = None
            for attempt in range(max_retries):
                try:
                    response = requests.get(pdf_url, headers=headers, 
                                           stream=True, timeout=10)
                    response.raise_for_status()
                    
                    # 保存文件
                    with open(filepath, 'wb') as pdf_file:
                        for chunk in response.iter_content(chunk_size=8192):
                            if chunk:  # 过滤保持连接的空白块
                                pdf_file.write(chunk)
                    
                    print(f"下载成功: {filename}")
                    success = True
                    success_count += 1
                    break  # 成功则退出重试循环
                
                except requests.exceptions.RequestException as e:
                    error = e
                    if attempt < max_retries - 1:
                        print(f"第{attempt+1}次尝试失败，正在重试...")
                        time.sleep(retry_delay)
            
            # 处理下载失败的情况
            if not success:
                failure_count += 1
                error_msg = str(error)
                print(f"下载失败（{conname}）: {error_msg}")
                
                # 记录失败信息
                failed_row = {
                    '合同ID': contract_id,
                    '合同文件': conname,
                    'URL': pdf_url,
                    '错误信息': error_msg,
                    '时间': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                }
                
                # 写入失败日志（追加模式）
                with open(failed_path, 'a', newline='', encoding='utf-8') as f_failed:
                    writer = csv.DictWriter(f_failed, fieldnames=failed_fields)
                    if os.stat(failed_path).st_size == 0:
                        writer.writeheader()
                    writer.writerow(failed_row)

    # 输出统计信息
    print(f"\n处理完成！")
    print(f"总计处理: {total}")
    print(f"成功下载: {success_count}")
    print(f"跳过已存在: {skipped_count}")
    print(f"失败次数: {failure_count}")
    print(f"失败记录已保存至: {failed_path}")

if __name__ == "__main__":
    # 配置路径（根据实际情况修改）
    csv_path = "/Users/zhaoq0103/Desktop/_select_cons_member_id_用户ID_cons_business_type_合同类型_cons_contrac_202504230943.csv"  # CSV文件路径
    output_dir = "./contracts"  # PDF保存目录
    
    # 执行下载（可调整重试参数）
    download_contracts(
        csv_path=csv_path,
        output_dir=output_dir,
        max_retries=2,     # 最大重试次数
        retry_delay=1      # 重试间隔（秒）
    )