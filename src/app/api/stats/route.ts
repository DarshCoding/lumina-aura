import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getDashboardStats } from "@/lib/store";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const stats = await getDashboardStats();
  return NextResponse.json(stats);
}
