const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, '../../data');
const GENERATIONS_FILE = path.join(DATA_DIR, 'generations.json');

// 确保数据目录存在
async function ensureDataDir() {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }
}

// 初始化数据文件
async function initDataFile() {
    await ensureDataDir();
    try {
        await fs.access(GENERATIONS_FILE);
    } catch {
        await fs.writeFile(GENERATIONS_FILE, JSON.stringify([]));
    }
}

// 保存生成记录
async function saveGeneration(data) {
    await initDataFile();
    
    const generations = JSON.parse(await fs.readFile(GENERATIONS_FILE, 'utf8'));
    const newGeneration = {
        id: uuidv4(),
        ...data,
        created_at: new Date().toISOString()
    };
    
    generations.push(newGeneration);
    await fs.writeFile(GENERATIONS_FILE, JSON.stringify(generations, null, 2));
    
    return newGeneration;
}

// 获取生成历史
async function getGenerations(ip) {
    await initDataFile();
    
    const generations = JSON.parse(await fs.readFile(GENERATIONS_FILE, 'utf8'));
    return generations
        .filter(gen => gen.ip === ip)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 10);
}

// 获取所有生成记录（用于画廊）
async function getAllGenerations() {
    await initDataFile();
    
    const generations = JSON.parse(await fs.readFile(GENERATIONS_FILE, 'utf8'));
    return generations
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 100);
}

module.exports = {
    saveGeneration,
    getGenerations,
    getAllGenerations
}; 