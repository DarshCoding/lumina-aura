import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createBilling, getBillings } from "@/lib/store";
import type { BillingInput } from "@/lib/types";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const billings = await getBillings();
  return NextResponse.json(billings);
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await req.json()) as BillingInput;
    if (!body.customerName || !body.channel || !body.items?.length) {
      return NextResponse.json(
        { error: "Customer, channel, and items are required" },
        { status: 400 }
      );
    }
    const billing = await createBilling(body);
    return NextResponse.json(billing, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create billing";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
