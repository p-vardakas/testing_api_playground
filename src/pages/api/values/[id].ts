import { NextApiRequest, NextApiResponse } from 'next';
import { validateToken } from '@/utils/api';
import { store } from '@/lib/store';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
    const id = Number(req.query.id);
    const values = store.getValues();
    const valueIndex = values.findIndex(v => v.id === id);

    if (valueIndex === -1) {
      return res.status(404).json({ error: 'Value not found' });
    }

    switch (req.method) {
      case 'GET':
        return res.status(200).json(values[valueIndex]);

      case 'PUT':
        if (id <= 6) {
          return res.status(403).json({ error: 'Cannot modify predefined values' });
        }

        const { title, value } = req.body;
        if (!title || !value) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        const updatedValue = store.updateValue(id, { title, value });
        return res.status(200).json(updatedValue);

      case 'PATCH':
        if (id <= 6) {
          return res.status(403).json({ error: 'Cannot modify predefined values' });
        }

        const updates = req.body;
        const patchedValue = store.updateValue(id, updates);
        return res.status(200).json(patchedValue);

      case 'DELETE':
        if (id <= 6) {
          return res.status(403).json({ error: 'Cannot delete predefined values' });
        }

        store.deleteValue(id);
        return res.status(204).end();

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