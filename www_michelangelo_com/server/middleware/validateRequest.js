const validateGenerateRequest = (req, res, next) => {
    const { prompt, style } = req.body;

    // 检查必要参数
    if (!prompt) {
        return res.status(400).json({
            success: false,
            error: '提示词不能为空'
        });
    }

    if (!style) {
        return res.status(400).json({
            success: false,
            error: '请选择风格'
        });
    }

    next();
};

module.exports = { validateGenerateRequest }; 