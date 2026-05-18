"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/product/ProductCard";
import { ProductsPageSkeleton } from "@/components/ui/Skeleton";
import { SlidersHorizontal, LayoutGrid, List, ChevronDown, ChevronUp, X, Search } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const CATEGORIES = ["Electronics", "Fashion", "Home", "Kitchen", "Books", "Sports", "Beauty", "Toys", "Automotive"];
const BRANDS = ["Apple", "Samsung", "Sony", "Nike", "Amazon", "Dyson", "Levi's", "Instant Pot"];
const SORT_OPTIONS = [
  { value: "rating-desc", label: "Best Rated" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "createdAt-desc", label: "Newest First" },
  { value: "numReviews-desc", label: "Most Reviewed" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Product = any;

interface Pagination {
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

function FilterSection({ title, children, defaultOpen = true }: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 dark:border-gray-700 pb-4 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full font-semibold text-sm text-gray-800 dark:text-gray-200 mb-3"
      >
        {title}
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && children}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="section py-8"><ProductsPageSkeleton count={12} /></div>}>
      <ProductsPageInner />
    </Suspense>
  );
}

function ProductsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filter state
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [brand, setBrand] = useState(searchParams.get("brand") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [minRating, setMinRating] = useState(searchParams.get("rating") || "");
  const [isPrime, setIsPrime] = useState(searchParams.get("isPrime") === "true");
  const [sort, setSort] = useState(searchParams.get("sort") || "rating-desc");
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));
  const search = searchParams.get("search") || "";

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      if (brand) params.set("brand", brand);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
      if (minRating) params.set("rating", minRating);
      if (isPrime) params.set("isPrime", "true");
      params.set("page", page.toString());
      params.set("limit", "12");

      const [sortField, sortOrder] = sort.split("-");
      params.set("sort", sortField);
      params.set("order", sortOrder);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
      setPagination(data.pagination || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, category, brand, minPrice, maxPrice, minRating, isPrime, sort, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const clearFilters = () => {
    setCategory("");
    setBrand("");
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
    setIsPrime(false);
    setPage(1);
    router.push("/products");
  };

  const hasFilters = category || brand || minPrice || maxPrice || minRating || isPrime;

  const FilterSidebar = () => (
    <div className="space-y-0">
      {/* Clear filters */}
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1.5 text-sm text-red-600 font-medium mb-4 hover:text-red-700"
        >
          <X size={14} /> Clear all filters
        </button>
      )}

      {/* Category */}
      <FilterSection title="Category">
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="category"
                checked={category === cat}
                onChange={() => { setCategory(cat === category ? "" : cat); setPage(1); }}
                className="w-4 h-4 accent-navy-700"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-navy-500 transition-colors">{cat}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
            placeholder="Min"
            className="input py-2 text-sm"
          />
          <span className="text-gray-400">—</span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
            placeholder="Max"
            className="input py-2 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {[["0", "500"], ["500", "2000"], ["2000", "10000"], ["10000", "50000"]].map(([min, max]) => (
            <button
              key={min+max}
              onClick={() => { setMinPrice(min); setMaxPrice(max); setPage(1); }}
              className="text-xs px-3 py-1.5 rounded-xl border border-gray-200 hover:border-navy-300 hover:bg-navy-50 hover:text-navy-700 transition-all"
            >
              {formatPrice(Number(min))} – {formatPrice(Number(max))}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Customer Rating" defaultOpen={false}>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((r) => (
            <label key={r} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={minRating === r.toString()}
                onChange={() => { setMinRating(r.toString()); setPage(1); }}
                className="w-4 h-4 accent-navy-700"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1">
                {"★".repeat(r)}{"☆".repeat(5 - r)} & Up
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Brand" defaultOpen={false}>
        <div className="space-y-2">
          {BRANDS.map((b) => (
            <label key={b} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={brand === b}
                onChange={() => { setBrand(brand === b ? "" : b); setPage(1); }}
                className="w-4 h-4 rounded accent-navy-700"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{b}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Prime */}
      <FilterSection title="Availability" defaultOpen={false}>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={isPrime}
            onChange={() => { setIsPrime(!isPrime); setPage(1); }}
            className="w-4 h-4 rounded accent-navy-700"
          />
          <span className="text-sm font-medium text-blue-700">Prime</span>
        </label>
      </FilterSection>
    </div>
  );

  return (
    <div className="section py-8">
      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 sticky top-24">
            <h2 className="font-bold text-base text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <SlidersHorizontal size={18} /> Filters
            </h2>
            <FilterSidebar />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <div>
              {search && (
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-1.5">
                  <Search size={14} /> Results for &ldquo;<strong className="text-gray-900">{search}</strong>&rdquo;
                </p>
              )}
              <p className="font-semibold text-gray-800 dark:text-gray-100">
                {pagination ? `${pagination.total.toLocaleString()} products` : "Loading..."}
                {category && ` in ${category}`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden btn-ghost text-sm"
              >
                <SlidersHorizontal size={16} /> Filters
              </button>

              {/* Sort */}
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="input py-2 text-sm w-auto cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              {/* View toggle */}
              <div className="flex items-center bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-1 gap-1">
                <button
                  onClick={() => setView("grid")}
                  className={`p-2 rounded-lg transition-all ${view === "grid" ? "bg-navy-800 text-white" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"}`}
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`p-2 rounded-lg transition-all ${view === "list" ? "bg-navy-800 text-white" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Products */}
          {loading ? (
            <ProductsPageSkeleton count={12} />
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-800">No products found</h3>
              <p className="text-gray-500 mt-2 mb-6">Try adjusting your filters or search terms</p>
              <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
            </div>
          ) : (
            <div className={view === "grid" ? "grid grid-cols-2 md:grid-cols-3 gap-5" : "space-y-4"}>
              {products.map((product) => (
                <ProductCard key={product._id} product={product} view={view} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button
                onClick={() => setPage(page - 1)}
                disabled={!pagination.hasPrev}
                className="btn-ghost px-4 py-2 text-sm disabled:opacity-40"
              >
                ← Prev
              </button>
              {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                      p === page
                        ? "bg-navy-800 text-white"
                        : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-navy-300"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(page + 1)}
                disabled={!pagination.hasNext}
                className="btn-ghost px-4 py-2 text-sm disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 p-6 overflow-y-auto animate-slide-in-right">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg">Filters</h2>
              <button onClick={() => setSidebarOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <FilterSidebar />
            <button onClick={() => setSidebarOpen(false)} className="btn-primary w-full mt-4">
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}  // end ProductsPageInner

