import { NextRequest, NextResponse } from "next/server";
import {
  clearSessionCookieOptions,
  sessionCookieOptions,
  validateCredentials,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, password, action } = body as {
    username?: string;
    password?: string;
    action?: string;
  };

  if (action === "logout") {
    const res = NextResponse.json({ ok: true });
    const opts = clearSessionCookieOptions();
    res.cookies.set(opts.name, opts.value, opts);
    return res;
  }

  if (!username || !password || !validateCredentials(username, password)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  const opts = sessionCookieOptions();
  res.cookies.set(opts.name, opts.value, opts);
  return res;
}
