import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { setStock } from "@/lib/store";

type Ctx = { params: { id: string } };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { stock } = (await req.json()) as { stock: number };
  if (stock == null || Number.isNaN(Number(stock))) {
    return NextResponse.json({ error: "Invalid stock" }, { status: 400 });
  }
  const product = await setStock(params.id, Number(stock));
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(product);
}
