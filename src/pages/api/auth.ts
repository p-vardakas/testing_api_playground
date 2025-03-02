import { NextApiRequest, NextApiResponse } from 'next';
import { generateToken } from '@/utils/api';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (email === 'test@test.com' && password === 'test') {
    // Expected response: { token: "ABCD123XYZ" }
    res.status(200).json({ token: generateToken() });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
} 