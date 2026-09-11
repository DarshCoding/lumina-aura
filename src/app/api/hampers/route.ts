import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createHamper, getHampers } from "@/lib/store";
import type { GiftHamperInput } from "@/lib/types";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const hampers = await getHampers();
  return NextResponse.json(hampers);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GiftHamperInput;
    if (
      !body.customerName?.trim() ||
      !body.customerEmail?.trim() ||
      !body.candleProductId ||
      !body.fragranceId ||
      !body.colorId ||
      !body.flowerId
    ) {
      return NextResponse.json(
        {
          error:
            "Name, email, candle, fragrance, color, and flower are required",
        },
        { status: 400 }
      );
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.customerEmail);
    if (!emailOk) {
      return NextResponse.json(
        { error: "Please enter a valid email" },
        { status: 400 }
      );
    }

    const hamper = await createHamper(body);
    return NextResponse.json(hamper, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create hamper";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
