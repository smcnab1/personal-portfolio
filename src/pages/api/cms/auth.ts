import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const _prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    try {
      const { email, password } = req.body;

      // For now, use a simple admin user
      // In production, you should create a proper user management system
      const adminEmail = process.env.CMS_ADMIN_EMAIL || 'admin@sammcnab.co.uk';
      const adminPassword = process.env.CMS_ADMIN_PASSWORD || 'admin123';

      if (email === adminEmail && password === adminPassword) {
        // Set a simple session cookie
        res.setHeader(
          'Set-Cookie',
          `cms-auth=true; Path=/; HttpOnly; SameSite=Strict; Max-Age=3600`,
        );
        res.status(200).json({ success: true, message: 'Login successful' });
      } else {
        res
          .status(401)
          .json({ success: false, message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Error validating token:', error);
      res.status(500).json({ success: false, message: 'Login failed' });
    }
  } else if (req.method === 'DELETE') {
    // Logout
    res.setHeader(
      'Set-Cookie',
      `cms-auth=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`,
    );
    res.status(200).json({ success: true, message: 'Logout successful' });
  } else {
    res.setHeader('Allow', ['POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
