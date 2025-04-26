console.log('CryptoJS available:', typeof CryptoJS !== 'undefined');  // 添加这行在最开头
console.log('Content script loaded! 999');  // 再添加一行调试代码

// 有道翻译API配置
const YOUDAO_API_URL = 'https://openapi.youdao.com/api';
const APP_KEY = '0ca03dcbfd6d2b35';      // 新的应用ID
const APP_SECRET = 'D4tv76A6IyATvqcgKIiebUaYfXOMpC6R';  // 新的密钥

// 添加调试日志
console.log('Using APP_KEY:', APP_KEY);
console.log('Using APP_SECRET:', APP_SECRET);

// 工具函数：生成随机字符串
function generateRandomString(length) {
    let result = '';
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// 工具函数：截取文本
function truncate(text) {
    if (text.length <= 20) return text;
    return text.substring(0, 10) + text.length + text.substring(text.length - 10);
}

// 计算API签名
function getSign(text, salt, curtime) {
    const str = APP_KEY + truncate(text) + salt + curtime + APP_SECRET;
    return CryptoJS.SHA256(str).toString(CryptoJS.enc.Hex);
}

// 创建悬浮提示框
const tooltip = document.createElement('div');
tooltip.style.display = 'none';
tooltip.className = 'word-tooltip';
document.body.appendChild(tooltip);

// 调用有道翻译API
// ... existing code ...

// 调用有道翻译API
async function translateWithYoudao(text) {
    const salt = generateRandomString(10);
    const curtime = Math.round(new Date().getTime() / 1000);
    const sign = getSign(text, salt, curtime);

    // 添加调试日志
    console.log('Request parameters:', {
        text,
        salt,
        curtime,
        sign
    });

    const params = new URLSearchParams({
        q: text,
        from: 'en',
        to: 'zh-CHS',
        appKey: APP_KEY,
        salt: salt,
        sign: sign,
        signType: 'v3',
        curtime: curtime,
    });

    try {
        console.log('Sending message to background...'); // 新增
        const response = await chrome.runtime.sendMessage({
            type: 'translate',
            params: params.toString()
        });
        
        console.log('Raw API response:', response); // 调试日志
        
        if (response.success && response.data.translation) {
            // 详细打印音标信息
            console.log('Basic data:', response.data.basic);
            console.log('US phonetic:', response.data.basic?.['us-phonetic']);
            console.log('UK phonetic:', response.data.basic?.['uk-phonetic']);
            
            return {
                translation: response.data.translation[0],
                // 优先使用美式音标，如果没有则使用英式音标，如果都没有则使用基本音标
                phonetic: response.data.basic?.['us-phonetic'] || 
                         response.data.basic?.['uk-phonetic'] || 
                         response.data.basic?.phonetic || '',
                explains: response.data.basic?.explains || []
            };
        } else {
            console.log('No valid translation in response'); // 新增
            console.log('Response structure:', JSON.stringify(response, null, 2)); // 新增
        }
    } catch (error) {
        console.error('翻译请求错误：', error);
        console.error('错误详情：', error.message); // 新增
    }
    return null;
}

// ... existing code ...

// 监听选词事件
document.addEventListener('mouseup', async function(e) {
    const selectedText = window.getSelection().toString().trim();
    console.log('Selected text:', selectedText); // 调试日志
    
    if (selectedText.length > 0 && /^[a-zA-Z\s]+$/.test(selectedText)) {
        const result = await translateWithYoudao(selectedText);
        console.log('Translation result:', result); // 调试日志
        
        if (result) {
            console.log('Creating tooltip with:', result); // 添加这行
            // 显示提示框
            tooltip.innerHTML = `
                <div class="word">${selectedText}</div>
                ${result.phonetic ? `<div class="phonetic">[${result.phonetic}]</div>` : ''}
                <div class="translation">${result.translation}</div>
                ${result.explains?.length ? `
                    <div class="explains">
                        ${result.explains.map(exp => `<div>${exp}</div>`).join('')}
                    </div>
                ` : ''}
            `;
            
            // 设置提示框位置
            tooltip.style.display = 'block';
            console.log('Tooltip position:', e.pageX, e.pageY); // 添加这行
            tooltip.style.left = `${e.pageX}px`;
            tooltip.style.top = `${e.pageY + 20}px`;
        }
    }
});

// 点击其他地方隐藏提示框
document.addEventListener('mousedown', function(e) {
    if (!tooltip.contains(e.target)) {
        tooltip.style.display = 'none';
    }
}); 