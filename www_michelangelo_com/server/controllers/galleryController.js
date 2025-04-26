const { getAllGenerations } = require('../services/fileStorageService');

const getGallery = async (req, res) => {
    try {
        const generations = await getAllGenerations();
        
        res.json({
            success: true,
            data: generations
        });
    } catch (error) {
        console.error('获取画廊失败:', error);
        res.status(500).json({
            success: false,
            error: '获取画廊失败'
        });
    }
};

module.exports = { getGallery }; 