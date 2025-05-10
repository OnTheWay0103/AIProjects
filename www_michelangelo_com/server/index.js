require('dotenv').config({ path: '.env.local' });
const express = require('express');
const cors = require('cors');
const path = require('path');
const { errorHandler } = require('./middleware/errorHandler');

// 调试环境变量
console.log('环境变量:', {
    STABILITY_API_KEY: process.env.STABILITY_API_KEY ? '已设置' : '未设置',
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT
});

// 调试当前工作目录
console.log('当前工作目录:', process.cwd());

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// 路由
console.log('正在加载路由...');
app.use('/api/generate', require('./routes/generate'));
app.use('/api/save', require('./routes/save'));
app.use('/api/gallery', require('./routes/gallery'));
console.log('路由加载完成');

// 错误处理
app.use(errorHandler);

// 启动服务器
const PORT = process.env.PORT || 3001;
console.log(`正在启动服务器，端口: ${PORT}...`);

app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
}).on('error', (error) => {
    console.error('服务器启动失败:', error);
}); 