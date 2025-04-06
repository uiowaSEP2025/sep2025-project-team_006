import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
import WebService from "./WebService"; 
const webService = new WebService();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;

  // Authenticate with your backend
  const backendRes = await fetch(webService.AUTH_STUDENT_LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await backendRes.json();

  if (!backendRes.ok) {
    return res.status(backendRes.status).json({ error: data.message });
  }

  const token = data.payload.token;

  // Set token in HTTP-only cookie
  res.setHeader('Set-Cookie', serialize('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24,
    path: '/',
    sameSite: 'lax',
  }));

  res.status(200).json({ success: true });
}
