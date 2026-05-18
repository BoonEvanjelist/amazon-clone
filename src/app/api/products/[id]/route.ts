import { NextRequest, NextResponse } from "next/server";
import { MOCK_PRODUCTS } from "@/lib/mockData";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Try MongoDB first
  try {
    const dbConnect = (await import("@/lib/dbConnect")).default;
    const Product = (await import("@/models/Product")).default;
    await dbConnect();

    const product = await Product.findOne({
      $or: [{ _id: id }, { slug: id }],
    }).lean();

    if (product) {
      return NextResponse.json({ product });
    }
  } catch {
    // DB not available — fall through to mock data
  }

  // Fallback: find in mock data by _id or slug
  const product = MOCK_PRODUCTS.find((p) => p._id === id || p.slug === id);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ product });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const product = await Product.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Product PUT error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    await Product.findByIdAndDelete(id);
    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    console.error("Product DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
