import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@/models/User';
import { connectDB } from '@/utils/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ user: any; token: string } | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('Register request body:', req.body);
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    console.error('Missing required fields:', { name: !!name, email: !!email, password: !!password });
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    await connectDB();
    console.log('Connected to database');

    // 检查邮箱是否已存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error('Email already exists:', email);
      return res.status(400).json({ error: 'Email already exists' });
    }

    // 创建新用户
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    console.log('Password hashing:', {
      originalPassword: password,
      salt,
      hashedPassword
    });

    // 验证密码哈希
    const isValidHash = await bcrypt.compare(password, hashedPassword);
    console.log('Password hash validation:', {
      originalPassword: password,
      hashedPassword,
      isValidHash
    });

    if (!isValidHash) {
      throw new Error('Password hashing failed');
    }

    // 创建用户实例
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    // 保存前检查密码
    console.log('Before save:', {
      password: user.password,
      isModified: user.isModified('password')
    });

    // 保存用户
    await user.save();

    // 保存后检查密码
    console.log('After save:', {
      password: user.password,
      isModified: user.isModified('password')
    });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    const userResponse = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt || new Date().toISOString(),
    };

    console.log('Registration successful for user:', email);
    return res.status(201).json({
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ error: 'Failed to register' });
  }
} 