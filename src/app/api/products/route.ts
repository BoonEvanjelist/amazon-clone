import { NextRequest, NextResponse } from "next/server";
import { MOCK_PRODUCTS } from "@/lib/mockData";

// Try MongoDB, fall back to mock data if unavailable
async function getProductsFromDB(query: Record<string, unknown>, sort: string, order: string, skip: number, limit: number) {
  try {
    const dbConnect = (await import("@/lib/dbConnect")).default;
    const Product = (await import("@/models/Product")).default;
    await dbConnect();

    const sortObj: Record<string, 1 | -1> = { [sort]: order === "asc" ? 1 : -1 };
    const total = await Product.countDocuments(query);
    const products = await Product.find(query).sort(sortObj).skip(skip).limit(limit).select("-reviews").lean();
    return { products, total, source: "db" };
  } catch {
    return null;
  }
}

function filterMock(params: URLSearchParams) {
  const search = (params.get("search") || "").toLowerCase();
  const category = params.get("category") || "";
  const brand = params.get("brand") || "";
  const minPrice = parseFloat(params.get("minPrice") || "0");
  const maxPrice = parseFloat(params.get("maxPrice") || "9999999");
  const rating = parseFloat(params.get("rating") || "0");
  const isPrime = params.get("isPrime") === "true";
  const sort = params.get("sort") || "rating";
  const order = params.get("order") || "desc";
  const page = parseInt(params.get("page") || "1");
  const limit = parseInt(params.get("limit") || "12");

  let results = MOCK_PRODUCTS.filter((p) => {
    if (search && !p.title.toLowerCase().includes(search) && !p.description.toLowerCase().includes(search)) return false;
    if (category && p.category !== category) return false;
    if (brand && p.brand !== brand) return false;
    if (p.price < minPrice || p.price > maxPrice) return false;
    if (rating > 0 && p.rating < rating) return false;
    if (isPrime && !p.isPrime) return false;
    return true;
  });

  results.sort((a, b) => {
    const valA = a[sort as keyof typeof a] ?? 0;
    const valB = b[sort as keyof typeof b] ?? 0;
    return order === "asc" ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
  });

  const total = results.length;
  const products = results.slice((page - 1) * limit, page * limit);
  return { products, total, page, limit };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
  const sort = searchParams.get("sort") || "rating";
  const order = searchParams.get("order") || "desc";

  // Build MongoDB query
  const minPrice = parseFloat(searchParams.get("minPrice") || "0");
  const maxPrice = parseFloat(searchParams.get("maxPrice") || "999999");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dbQuery: Record<string, any> = { price: { $gte: minPrice, $lte: maxPrice } };
  const category = searchParams.get("category");
  const brand = searchParams.get("brand");
  const rating = parseFloat(searchParams.get("rating") || "0");
  if (category) dbQuery.category = category;
  if (brand) dbQuery.brand = brand;
  if (rating > 0) dbQuery.rating = { $gte: rating };
  if (searchParams.get("isPrime") === "true") dbQuery.isPrime = true;
  const search = searchParams.get("search");
  if (search) dbQuery.$text = { $search: search };

  const dbResult = await getProductsFromDB(dbQuery, sort, order, (page - 1) * limit, limit);

  if (dbResult) {
    return NextResponse.json({
      products: dbResult.products,
      pagination: { total: dbResult.total, page, limit, totalPages: Math.ceil(dbResult.total / limit), hasNext: page * limit < dbResult.total, hasPrev: page > 1 },
    });
  }

  // Fallback: mock data
  const { products, total } = filterMock(searchParams);
  return NextResponse.json({
    products,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit), hasNext: page * limit < total, hasPrev: page > 1 },
    source: "mock",
  });
}

export async function POST(req: NextRequest) {
  try {
    const dbConnect = (await import("@/lib/dbConnect")).default;
    const Product = (await import("@/models/Product")).default;
    await dbConnect();
    const body = await req.json();
    const product = await Product.create(body);
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Product create error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
