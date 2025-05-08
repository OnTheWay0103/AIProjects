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

  console.log('Login request body:', req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    console.error('Missing credentials:', { email: !!email, password: !!password });
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    await connectDB();
    console.log('Connected to database');

    const user = await User.findOne({ email });
    console.log('Found user:', user ? {
      id: user._id,
      name: user.name,
      email: user.email,
      hasPassword: !!user.password
    } : 'no');

    if (!user) {
      console.error('User not found:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password validation:', {
      providedPassword: password,
      storedHash: user.password,
      isValid: isValidPassword
    });

    if (!isValidPassword) {
      console.error('Invalid password for user:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

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

    console.log('Login successful for user:', email);
    return res.status(200).json({
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ error: 'Failed to login' });
  }
} 