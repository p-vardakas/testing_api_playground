import { NextApiRequest, NextApiResponse } from 'next';
import { validateToken } from '@/utils/api';
import { store } from '@/lib/store';

// Add request validation
const validateRequest = (req: NextApiRequest): boolean => {
  const contentType = req.headers['content-type'];
  if (req.method === 'POST' && contentType !== 'application/json') {
    return false;
  }
  return true;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Add request validation
  if (!validateRequest(req)) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  // Set CORS and content type headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Validate token
  const token = req.headers.authorization?.replace('Bearer ', '') || null;
  if (!validateToken(token)) {
    return res.status(401).json({ error: 'Invalid or missing token' });
  }

  try {
    switch (req.method) {
      case 'GET':
        const limit = Number(req.query.limit) || 10;
        const page = 1;
        const start = (page - 1) * limit;
        const values = store.getValues();
        const paginatedValues = values.slice(start, start + limit);
        
        return res.status(200).json({
          data: paginatedValues,
          total: values.length,
          page,
          limit
        });

      case 'POST':
        const { title, value } = req.body;
        if (!title || !value) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        const newValue = store.addValue({ title, value });
        return res.status(201).json(newValue);

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Configure API route to handle JSON
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}; 