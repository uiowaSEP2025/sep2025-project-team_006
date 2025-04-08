import type { NextApiRequest } from "next";
import { SerializeOptions } from "cookie";
import WebService from "../../../api/WebService";
import { NextResponse } from "next/server";
const webService = new WebService();

export const cookie_config: SerializeOptions = { // Set token in HTTP-only cookie
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24,
  path: "/",
  sameSite: "lax",
};

export async function POST(
  req: NextApiRequest,
) {
  const body = await req.json();
  console.log(body);

  // Authenticate with your backend
  const backendRes = await fetch(webService.AUTH_STUDENT_REGISTER, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: body.email, password: body.password }),
  });
  const data = await backendRes.json();

  if (!backendRes.ok) {
    return NextResponse.json({ success: false, error: data.message }, { status: backendRes.status });
  };

  // Set token in HTTP-only cookie
  const cookie_config: SerializeOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
    path: "/",
    sameSite: "lax",
  };

  const res = NextResponse.json({ success: true }, { status: 200 });
  res.cookies.set("gap_token", data.payload.token, cookie_config);
  res.cookies.set("gap_session", data.payload.session, cookie_config);

  return res;
}
