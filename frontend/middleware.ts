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

    if (url.pathname in redirects && redirects[url.pathname]["out"] != null) {
        // Example: Add an auth token from cookies (or elsewhere)
        const token = req.cookies.get('gap_token')?.value;

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
              url.pathname = redirects[url.pathname]["out"] as string;
              return NextResponse.redirect(url);
            }

            // Allow the request to continue
            return NextResponse.next();
        } catch (err) {
            console.error('Middleware error:', err);

            url.pathname = '/error';
            url.searchParams.set('code', '500');
            return NextResponse.redirect(url);
        }
    }
}
