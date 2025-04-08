import { NextRequest, NextResponse } from 'next/server';
import WebService from './api/WebService';
import { cookie_settings } from './lib/constants';

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
        const token = req.cookies.get('gap_token')?.value;
        const session = req.cookies.get("gap_session")?.value;
        if (!token || !session) {
            url.pathname = redirects[url.pathname]["out"] as string;
            return NextResponse.redirect(url);
        }

        let res;
        const where_to = await checkAuthStatus(url.pathname, token, session);
        if (where_to.location != null) {
            // Something required us to redirect, so do so.
            url.pathname = where_to.location;
            res = NextResponse.redirect(url);
        } else {
            // We're good. Allow the request to continue.
            res = NextResponse.next();
        }

        if (where_to.token != token) {
            res.cookies.set("gap_token", where_to.token);
        }
        return res;
    }
}

const checkAuthStatus = async (path: string, token: string, session: string) => {
    // Forward the request to the backend.
    const info = await fetch(webService.AUTH_INFO, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        }
    });
    const info_json = await info.json();

    // If backend is unauthorized or returns a bad status, we redirect.
    // One exception is if the auth token is expired. We refresh it via our session token and try again in this case.
    if (info.status === 409) {
        // Refresh the auth token.
        const refresh = await fetch(webService.AUTH_REFRESH, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ session })
        });
        const refresh_json = await refresh.json();

        if (refresh.ok) {
            // This should *only* ever recurse once.
            return checkAuthStatus(path, refresh_json.payload.token, session);
        } else {
            return { location: redirects[path]["out"] as string, token };
        }
    } else if (!info.ok) {
        // old conditional checked only 401 and 403, if anything goes haywire just go
        return { location: redirects[path]["out"] as string, token };
    }

    return { location: redirects[path][info_json.payload.account_type], token };
}
