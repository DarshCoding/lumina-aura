import { cookies } from "next/headers";

const ADMIN_USER = "admin";
const ADMIN_PASS = "lummina2024";
const SESSION_COOKIE = "la_admin_session";
const SESSION_VALUE = "authenticated";

export function validateCredentials(username: string, password: string) {
  return username === ADMIN_USER && password === ADMIN_PASS;
}

export async function isAuthenticated() {
  const jar = cookies();
  return jar.get(SESSION_COOKIE)?.value === SESSION_VALUE;
}

export function sessionCookieOptions() {
  return {
    name: SESSION_COOKIE,
    value: SESSION_VALUE,
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}

export function clearSessionCookieOptions() {
  return {
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
}
