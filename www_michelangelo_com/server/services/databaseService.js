const mysql = require('mysql2/promise');
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

// 创建数据库连接池
const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 保存生成记录
const saveToDatabase = async (data) => {
    const connection = await pool.getConnection();
    try {
        await connection.execute(
            'INSERT INTO generations (prompt, style, image_url, ip_address, created_at) VALUES (?, ?, ?, ?, NOW())',
            [data.prompt, data.style, data.imageUrl, data.ip]
        );
    } catch (error) {
        console.error('保存生成记录失败:', error);
        throw new Error('保存记录失败');
    } finally {
        connection.release();
    }
};

// 获取用户生成历史
const getGenerationHistory = async (ip) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(
            'SELECT * FROM generations WHERE ip_address = ? ORDER BY created_at DESC LIMIT 10',
            [ip]
        );
        return rows;
    } catch (error) {
        console.error('获取生成历史失败:', error);
        throw new Error('获取历史记录失败');
    } finally {
        connection.release();
    }
};

module.exports = {
    saveToDatabase,
    getGenerationHistory
}; 