#!/bin/bash

# 图片地址数组
image_urls=(
"https://pro-yeahgo.oss-cn-shenzhen.aliyuncs.com/goods/brand/rc-upload-1636019093369-2%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20211104160755.png?imgHeight=3128&imgWidth=3220"
"https://pro-yeahgo.oss-cn-shenzhen.aliyuncs.com/goods/brand/rc-upload-1636019093369-6%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20211104193214.png?imgHeight=873&imgWidth=1477"
"https://pro-yeahgo.oss-cn-shenzhen.aliyuncs.com/goods/brand/rc-upload-1636019093369-11%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20211104193249.png?imgHeight=244&imgWidth=358"
"https://pro-yeahgo.oss-cn-shenzhen.aliyuncs.com/goods/brand/rc-upload-1637202172222-2%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20211118112512.jpg?imgHeight=337&imgWidth=638"
"https://pro-yeahgo.oss-cn-shenzhen.aliyuncs.com/goods/brand/rc-upload-1637202172222-6%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20211118112610.jpg?imgHeight=8000&imgWidth=8000"
"https://pro-yeahgo.oss-cn-shenzhen.aliyuncs.com/goods/brand/rc-upload-1637202172222-10%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20211118112631.png?imgHeight=150&imgWidth=150"
"https://pro-yeahgo.oss-cn-shenzhen.aliyuncs.com/goods/brand/rc-upload-1637202172222-14%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20211118112641.jpg?imgHeight=128&imgWidth=128"
"https://pro-yeahgo.oss-cn-shenzhen.aliyuncs.com/goods/brand/rc-upload-1638147587498-2%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20211129154638.jpg?imgHeight=300&imgWidth=300"
"https://pro-yeahgo.oss-cn-shenzhen.aliyuncs.com/goods/brand/rc-upload-1638498615166-2-y_g-%E9%98%BF%E7%8E%9B%E5%B0%BC.jpg?imgHeight=205&imgWidth=316"
"https://pro-yeahgo.oss-cn-shenzhen.aliyuncs.com/goods/brand/rc-upload-1638498615166-6-y_g-%E8%BF%AA%E5%A5%A5.jpg?imgHeight=393&imgWidth=500"
"https://pro-yeahgo.oss-cn-shenzhen.aliyuncs.com/goods/brand/rc-upload-1638498615166-10-y_g-%E6%B3%95%E5%9B%BD%E5%A4%A7%E4%BD%BF.jpg?imgHeight=300&imgWidth=300"
"https://pro-yeahgo.oss-cn-shenzhen.aliyuncs.com/goods/brand/rc-upload-1638498615166-14-y_g-%E6%B5%B7%E8%93%9D%E4%B9%8B%E8%B0%9C.jpg?imgHeight=658&imgWidth=658"
"https://pro-yeahgo.oss-cn-shenzhen.aliyuncs.com/goods/brand/rc-upload-1638498615166-18-y_g-%E7%BA%AA%E6%A2%B5%E5%B8%8C.jpg?imgHeight=302&imgWidth=550"
"https://pro-yeahgo.oss-cn-shenzhen.aliyuncs.com/goods/brand/rc-upload-1638498615166-22-y_g-%E7%A7%91%E9%A2%9C%E6%B0%8F.jpg?imgHeight=234&imgWidth=316"
"https://pro-yeahgo.oss-cn-shenzhen.aliyuncs.com/goods/brand/rc-upload-1638498615166-26-y_g-%E5%85%B0%E8%94%BB.jpg?imgHeight=500&imgWidth=1000"
"https://pro-yeahgo.oss-cn-shenzhen.aliyuncs.com/goods/brand/rc-upload-1638498615166-30-y_g-%E5%85%B0%E8%8A%9D.jpg?imgHeight=243&imgWidth=496"
"https://pro-yeahgo.oss-cn-shenzhen.aliyuncs.com/goods/brand/rc-upload-1638498615166-34-y_g-%E9%AD%85%E5%8F%AFMAC.jpg?imgHeight=640&imgWidth=640"
"https://pro-yeahgo.oss-cn-shenzhen.aliyuncs.com/goods/brand/rc-upload-1638498615166-38-y_g-%E7%BA%B3%E6%96%AF%EF%BC%88NARS).jpg?imgHeight=280&imgWidth=280"
"https://pro-yeahgo.oss-cn-shenzhen.aliyuncs.com/goods/brand/rc-upload-1638498615166-42-y_g-%E7%BA%BD%E8%A5%BF%E4%B9%8B%E8%B0%9C.jpg?imgHeight=200&imgWidth=200"
"https://pro-yeahgo.oss-cn-shenzhen.aliyuncs.com/goods/brand/rc-upload-1638498615166-46-y_g-%E6%AC%A7%E8%88%92%E4%B8%B9.jpg?imgHeight=220&imgWidth=320"
"https://pro-yeahgo.oss-cn-shenzhen.aliyuncs.com/goods/brand/rc-upload-1638498615166-53-y_g-%E9%A6%99%E5%A5%88%E5%84%BF.jpg?imgHeight=237&imgWidth=416"
"https://pro-yeahgo.oss-cn-shenzhen.aliyuncs.com/goods/brand/rc-upload-1638498615166-57-y_g-%E9%9B%85%E8%AF%97%E5%85%B0%E9%BB%9B.jpg?imgHeight=300&imgWidth=600"
"https://pro-yeahgo.oss-cn-shenzhen.aliyuncs.com/goods/brand/rc-upload-1638498615166-61-y_g-%E6%98%93%E6%97%85.webp?imgHeight=500&imgWidth=500"
"https://pro-yeahgo.oss-cn-shenzhen.aliyuncs.com/goods/brand/rc-upload-1638498615166-65-y_g-%E6%82%A6%E6%9C%A8%E4%B9%8B%E6%BA%90.jpg?imgHeight=412&imgWidth=468"
"https://pro-yeahgo.oss-cn-shenzhen.aliyuncs.com/goods/brand/rc-upload-1638498615166-69-y_g-APMMONACO.jpg?imgHeight=796&imgWidth=1063"
"https://pro-yeahgo.oss-cn-shenzhen.aliyuncs.com/goods/brand/rc-upload-1638498615166-73-y_g-CPD%E8%82%8C%E8%82%A4%E4%B9%8B%E9%92%A5.jpg?imgHeight=260&imgWidth=325"
"https://pro-yeahgo.oss-cn-shenzhen.aliyuncs.com/goods/brand/rc-upload-1638498615166-79-y_g-GOC%20IN%20C.jpg?imgHeight=944&imgWidth=708"
"https://pro-yeahgo.oss-cn-shenzhen.aliyuncs.com/goods/brand/rc-upload-1638498615166-83-y_g-HR%E8%B5%AB%E8%8E%B2%E5%A8%9C.jpg?imgHeight=300&imgWidth=300"
"https://pro-yeahgo.oss-cn-shenzhen.aliyuncs.com/goods/brand/rc-upload-1638498615166-87-y_g-SH-II.jpg?imgHeight=324&imgWidth=640"
"https://pro-yeahgo-oss.yeahgo.com/goods%2Fbrand%2Frc-upload-1702344324307-4-y_g-3c0148c9-f64a-4126-b1df-a70a2732c1a5.png?imgHeight=474&imgWidth=779"
"https://pro-yeahgo-oss.yeahgo.com/goods%2Fbrand%2Frc-upload-1702344324307-8-y_g-9b88ed92-a96c-459f-96a3-62419f5934d2.png?imgHeight=199&imgWidth=655"
"https://pro-yeahgo-oss.yeahgo.com/goods%2Fbrand%2Frc-upload-1702344324307-12-y_g-3d66dee0-2f98-4efc-a1f9-7ca6a8989aba.png?imgHeight=708&imgWidth=702"
"https://pro-yeahgo-oss.yeahgo.com/goods%2Fbrand%2Frc-upload-1702344324307-16-y_g-4a0a0d0e-749b-499a-8bef-aefb9fbbb302.jpg?imgHeight=580&imgWidth=720"
"https://pro-yeahgo-oss.yeahgo.com/goods%2Fbrand%2Frc-upload-1702344324307-20-y_g-06f6913d-c1ec-4c33-bce1-772f932bd319.png?imgHeight=800&imgWidth=800"
"https://pro-yeahgo-oss.yeahgo.com/goods%2Fbrand%2Frc-upload-1702344324307-24-y_g-37fb2245-b340-4d48-a70b-3abab2430594.jpg?imgHeight=493&imgWidth=720"
"https://pro-yeahgo-oss.yeahgo.com/goods%2Fbrand%2Frc-upload-1702344324307-28-y_g-ae137181-501d-47fd-b8d1-7f47dd0ed43c.png?imgHeight=595&imgWidth=1226"
"https://pro-yeahgo-oss.yeahgo.com/goods%2Fbrand%2Frc-upload-1702344324307-32-y_g-c8ed0e2a-ea48-4afb-a629-2cbc4471a8cc.png?imgHeight=800&imgWidth=800"
"https://pro-yeahgo-oss.yeahgo.com/goods%2Fbrand%2Frc-upload-1702344324307-36-y_g-d166cb73-4f9d-4d80-a002-a78a423c1604.jpg?imgHeight=320&imgWidth=774"
"https://pro-yeahgo-oss.yeahgo.com/goods%2Fbrand%2Frc-upload-1702344324307-40-y_g-e8356264-4246-4fa5-b6cc-1c88cde9b6c9.png?imgHeight=800&imgWidth=800"
"https://pro-yeahgo-oss.yeahgo.com/goods%2Fbrand%2Frc-upload-1702344324307-44-y_g-f84b900e-8c8e-4add-a361-20f6fd3772c2.jpg?imgHeight=720&imgWidth=600"
"https://pro-yeahgo-oss.yeahgo.com/goods%2Fbrand%2Frc-upload-1702861486159-2-y_g-1.png?imgHeight=112&imgWidth=355"
"https://pro-yeahgo-oss.yeahgo.com/goods%2Fbrand%2Frc-upload-1702948298053-3-y_g-1.png?imgHeight=200&imgWidth=444"
"https://pro-yeahgo-oss.yeahgo.com/goods%2Fbrand%2Frc-upload-1703207828957-2-y_g-1.png?imgHeight=322&imgWidth=469"
"https://pro-yeahgo-oss.yeahgo.com/goods%2Fbrand%2Frc-upload-1704416502638-120-y_g-%E5%B7%B4%E6%AF%94.png?imgHeight=137&imgWidth=124"
)

# 本地保存路径
local_path="./logos/"

# 循环遍历图片地址数组并下载图片
for url in "${image_urls[@]}"
do
    # 从 URL 提取文件名
    filename=$(basename "$url"|sed 's/\?.*//')
    
    # 下载图片
    echo "Downloading: $filename"
    curl -o "$local_path/$filename" "$url"
    
    # 检查下载状态
    if [ $? -eq 0 ]; then
        echo "Downloaded $filename successfully"
    else
        echo "Failed to download $filename"
    fi
done
