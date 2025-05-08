const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();

// 中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// 模拟用户数据库
const users = [
    {
        id: 1,
        email: 'test@example.com',
        password: 'password123',
        name: '测试用户'
    }
];

// 登录接口
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        req.session.user = {
            id: user.id,
            email: user.email,
            name: user.name
        };
        res.json({ success: true, user: req.session.user });
    } else {
        res.status(401).json({ success: false, message: '邮箱或密码错误' });
    }
});

// 注册接口
app.post('/api/register', (req, res) => {
    const { email, password, name } = req.body;
    
    if (users.some(u => u.email === email)) {
        return res.status(400).json({ success: false, message: '邮箱已被注册' });
    }
    
    const newUser = {
        id: users.length + 1,
        email,
        password,
        name
    };
    
    users.push(newUser);
    res.json({ success: true, user: { id: newUser.id, email: newUser.email, name: newUser.name } });
});

// 忘记密码接口
app.post('/api/forgot-password', (req, res) => {
    const { email } = req.body;
    const user = users.find(u => u.email === email);
    
    if (user) {
        // 这里应该发送重置密码邮件
        res.json({ success: true, message: '重置密码链接已发送到您的邮箱' });
    } else {
        res.status(404).json({ success: false, message: '邮箱未注册' });
    }
});

// 获取当前用户信息
app.get('/api/user', (req, res) => {
    if (req.session.user) {
        res.json({ success: true, user: req.session.user });
    } else {
        res.status(401).json({ success: false, message: '未登录' });
    }
});

// 登出
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
}); 