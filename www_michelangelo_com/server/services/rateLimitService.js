const Redis = require('redis');
const { promisify } = require('util');

const REDIS_URL = process.env.REDIS_URL;
const DAILY_LIMIT = 10; // 每日生成次数限制

// 创建 Redis 客户端
const client = Redis.createClient({
    url: REDIS_URL
});

// 将 Redis 方法转换为 Promise
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const expireAsync = promisify(client.expire).bind(client);

// 检查是否达到生成限制
const rateLimit = async (ip) => {
    try {
        const key = `generation:${ip}:${new Date().toISOString().split('T')[0]}`;
        
        // 获取今日已生成次数
        const count = await getAsync(key);
        const currentCount = count ? parseInt(count) : 0;

        // 如果达到限制，返回 false
        if (currentCount >= DAILY_LIMIT) {
            return false;
        }

        // 增加计数
        await setAsync(key, currentCount + 1);
        // 设置 24 小时过期
        await expireAsync(key, 86400);

        return true;
    } catch (error) {
        console.error('速率限制检查失败:', error);
        // 如果 Redis 服务不可用，允许生成
        return true;
    }
};

module.exports = { rateLimit }; 