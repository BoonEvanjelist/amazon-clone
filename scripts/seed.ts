import dbConnect from "../src/lib/dbConnect";
import Product from "../src/models/Product";
import User from "../src/models/User";

const PRODUCTS = [
  {
    title: "Apple MacBook Air M2 (2024)",
    slug: "apple-macbook-air-m2-2024",
    description: "Supercharged by the M2 chip, MacBook Air is the world's thinnest and lightest laptop with all-day battery life, a stunning Liquid Retina display, and an ultra-fast SSD.",
    price: 89999,
    originalPrice: 114900,
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800",
    ],
    category: "Electronics",
    brand: "Apple",
    stock: 25,
    rating: 4.8,
    numReviews: 1240,
    tags: ["laptop", "macbook", "apple", "m2"],
    isFeatured: true,
    isPrime: true,
  },
  {
    title: "Sony WH-1000XM5 Wireless Headphones",
    slug: "sony-wh-1000xm5-wireless",
    description: "Industry-leading noise canceling with Auto NC Optimizer. Crystal clear hands-free calling with Precise Voice Pickup technology. Up to 30-hour battery life.",
    price: 24990,
    originalPrice: 34990,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    ],
    category: "Electronics",
    brand: "Sony",
    stock: 50,
    rating: 4.7,
    numReviews: 3280,
    tags: ["headphones", "sony", "noise-canceling", "wireless"],
    isFeatured: true,
    isPrime: true,
  },
  {
    title: "Nike Air Max 270 Running Shoes",
    slug: "nike-air-max-270",
    description: "Nike Air Max 270 features Nike's first-ever Max Air unit created specifically for Nike Sportswear, delivering an extremely plush, all-day feel.",
    price: 8995,
    originalPrice: 11995,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    ],
    category: "Fashion",
    brand: "Nike",
    stock: 100,
    rating: 4.5,
    numReviews: 8740,
    tags: ["shoes", "nike", "running", "sportswear"],
    isFeatured: false,
    isPrime: true,
  },
  {
    title: 'Samsung 65" 4K QLED Smart TV',
    slug: "samsung-65-4k-qled-smart-tv",
    description: "Experience vivid 4K QLED picture quality with Quantum HDR. Smart TV features with built-in Alexa, Google Assistant, and Samsung Tizen OS.",
    price: 74999,
    originalPrice: 99999,
    images: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?w=800",
    ],
    category: "Electronics",
    brand: "Samsung",
    stock: 15,
    rating: 4.6,
    numReviews: 2150,
    tags: ["tv", "samsung", "4k", "qled", "smart-tv"],
    isFeatured: true,
    isPrime: false,
  },
  {
    title: "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
    slug: "instant-pot-duo-7in1",
    description: "7-in-1 multi-use programmable pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and warmer. 6-quart capacity.",
    price: 6999,
    originalPrice: 9999,
    images: [
      "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800",
    ],
    category: "Kitchen",
    brand: "Instant Pot",
    stock: 75,
    rating: 4.7,
    numReviews: 15200,
    tags: ["kitchen", "pressure-cooker", "instant-pot", "cooking"],
    isFeatured: false,
    isPrime: true,
  },
  {
    title: "Kindle Paperwhite (16 GB) — 2024",
    slug: "kindle-paperwhite-2024",
    description: "Our thinnest, lightest Kindle Paperwhite ever with a 7\" glare-free display, waterproof design, 16 GB storage, and up to 12 weeks of battery life.",
    price: 14999,
    originalPrice: 17999,
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800",
    ],
    category: "Electronics",
    brand: "Amazon",
    stock: 200,
    rating: 4.9,
    numReviews: 45000,
    tags: ["kindle", "ebook", "reader", "amazon"],
    isFeatured: true,
    isPrime: true,
  },
  {
    title: "Levi's Men's 511 Slim Fit Jeans",
    slug: "levis-mens-511-slim-fit-jeans",
    description: "The 511 is the go-to slim fit jean for a cleaner, more modern style. Sits below waist, slim through hip and thigh, slim leg opening.",
    price: 2999,
    originalPrice: 4999,
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800",
    ],
    category: "Fashion",
    brand: "Levi's",
    stock: 150,
    rating: 4.4,
    numReviews: 6800,
    tags: ["jeans", "denim", "levis", "fashion"],
    isFeatured: false,
    isPrime: false,
  },
  {
    title: "Dyson V15 Detect Cordless Vacuum",
    slug: "dyson-v15-detect-cordless",
    description: "Reveals invisible dust with laser detection. Automatically adapts suction across all floor types. 60 minutes run time. HEPA filter captures allergens.",
    price: 49900,
    originalPrice: 62900,
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    ],
    category: "Home",
    brand: "Dyson",
    stock: 30,
    rating: 4.6,
    numReviews: 3400,
    tags: ["vacuum", "dyson", "cordless", "cleaning"],
    isFeatured: false,
    isPrime: true,
  },
];

async function seed() {
  await dbConnect();
  console.log("🌱 Seeding database...");

  // Clear existing
  await Product.deleteMany({});
  await User.deleteMany({});

  // Create admin user
  await User.create({
    name: "Admin User",
    email: "admin@shopsphere.com",
    password: "admin123456",
    role: "admin",
  });

  await User.create({
    name: "Demo User",
    email: "demo@shopsphere.com",
    password: "demo123456",
    role: "user",
  });

  // Create products
  await Product.insertMany(PRODUCTS);

  console.log(`✅ Seeded ${PRODUCTS.length} products and 2 users`);
  console.log("   Admin: admin@shopsphere.com / admin123456");
  console.log("   Demo:  demo@shopsphere.com  / demo123456");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
