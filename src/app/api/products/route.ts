import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createProduct, getProducts } from "@/lib/store";
import type { ProductInput } from "@/lib/types";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as ProductInput;
  if (!body.title || !body.code || body.price == null) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const product = await createProduct({
    title: body.title,
    description: body.description || "",
    code: body.code,
    images: body.images?.length ? body.images : [],
    price: Number(body.price),
    discountPercent: Number(body.discountPercent) || 0,
    discountPrice:
      body.discountPrice != null
        ? Number(body.discountPrice)
        : Number(body.price),
    stock: Number(body.stock) || 0,
    category: body.category || "Signature",
    scent: body.scent,
    burnTime: body.burnTime,
    featured: Boolean(body.featured),
  });
  return NextResponse.json(product, { status: 201 });
}
