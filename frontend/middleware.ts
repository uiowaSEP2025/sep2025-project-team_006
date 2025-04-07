import { NextRequest, NextResponse } from 'next/server';
import WebService from './api/WebService';

const webService = new WebService();

export const redirects: Record<string, { out: string | null, student: string | null, faculty: string | null }> = {
    "/faculty": { out: null, student: null, faculty: "/facultyHome" },
    "/students": { out: null, student: "/studentHome", faculty: null }, 
    "/facultyHome": { out: "/faculty", student: "/faculty", faculty: null },
    "/studentHome": { out: "/students", student: null, faculty: "/students" },
    "/metricSetting": { out: "/", student: "/faculty", faculty: null },
    "/studentList": { out: "/", student: "/faculty", faculty: null },
    "/studentList/application": { out: "/", student: "/faculty", faculty: null },
};

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Example: Add an auth token from cookies (or elsewhere)
  const token = req.cookies.get('token')?.value;

  try {
    // Forward the request to your backend
    const backendRes = await fetch(webService.AUTH_INFO, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: req.body,
    });

    const json = backendRes.json();

    // If backend is unauthorized or returns a bad status, redirect
    if (backendRes.status === 401 || backendRes.status === 403) {
      if (url.pathname in redirects) {
        url.pathname = redirects[url.pathname]["out"] ?? "/";
      } else {
        url.pathname = '/login'; // or wherever you want to send them
      }
      url.searchParams.set('code', backendRes.status.toString());
      return NextResponse.redirect(url);
    }

    // Optionally: rewrite the request to hit your own API handler
    // Or just allow the request to continue
    return NextResponse.next();

  } catch (err) {
    console.error('Middleware error:', err);

    url.pathname = '/error';
    url.searchParams.set('code', '500');
    return NextResponse.redirect(url);
  }
}
