import WebService from "../../../api/WebService";
import { NextRequest, NextResponse } from "next/server";
const webService = new WebService();

export async function POST(
  req: NextRequest,
) {
  const body = await req.json();

  // Authenticate with backend
  const backendRes = await fetch(webService.AUTH_STUDENT_REGISTER, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: body.email, password: body.password }),
  });
  const data = await backendRes.json();

  if (!backendRes.ok) {
    return NextResponse.json({ success: false, error: data.message }, { status: backendRes.status });
  };

  const res = NextResponse.json({ success: true }, { status: 200 });
  res.cookies.set("gap_token", data.payload.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60,
    path: "/",
    sameSite: "lax",
  });
  res.cookies.set("gap_session", data.payload.session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
    path: "/",
    sameSite: "lax",
  });

  return res;
}
