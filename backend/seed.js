const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Product = require("./models/Product");

mongoose.connect("mongodb://localhost:27017/salesDashboard")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// ------------------- OWNERS ---------------------
const owners = [
  { name: "Owner One", email: "owner1@example.com", password: "123456", months: 24 },
  { name: "Owner Two", email: "owner2@example.com", password: "123456", months: 17 },
  { name: "Owner Three", email: "owner3@example.com", password: "123456", months: 12 }
];

// ------------------- PRODUCT LISTS ---------------------
const ownerProducts = [
  // Owner 1 products
  [
    "Apple AirPods Pro",
    "Samsung Galaxy Watch 6",
    "Amazon Echo Dot 5",
    "Sony WH-1000XM5",
    "Logitech MX Master 3",
    "Canon EOS M50",
    "HP Omen Gaming Mouse",
    "Bose QuietComfort 45",
    "Mi Smart Band 7"
  ],

  // Owner 2 products
  [
    "Nike Air Zoom Pegasus",
    "Adidas Ultraboost 22",
    "Puma Velocity Nitro",
    "Woodland Leather Boots",
    "Reebok Floatride Energy",
    "Skechers GoWalk 6",
    "New Balance 1080v12"
  ],

  // Owner 3 products
  [
    "Dell XPS 13",
    "HP Envy 15",
    "Lenovo ThinkPad X1",
    "ASUS ROG Strix G15",
    "Acer Swift 3",
    "MSI Bravo 15",
    "Samsung Galaxy Book2"
  ],
];

// ------------------- GENERATE MONTH LIST ---------------------
function generateMonthList(totalMonths) {
  const months = [];
  const now = new Date();

  for (let i = totalMonths - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    months.push(m);
  }
  return months;
}

// ------------------- SEASONALITY MULTIPLIER ---------------------
function getSeasonalMultiplier(monthIndex) {
  const month = monthIndex % 12;

  if (month <= 1) return 0.85;     // Jan-Feb low
  if (month >= 2 && month <= 4) return 1.0;   // Mar-May normal
  if (month >= 5 && month <= 7) return 1.35;  // Jun-Aug peak
  if (month >= 8 && month <= 9) return 1.0;   // Sep-Oct normal
  if (month >= 10) return 1.5;    // Nov-Dec festival spike

  return 1;
}

// ------------------- MONTHLY SALES GENERATOR ---------------------
function generateMonthlySales(months) {
  const out = [];

  months.forEach((m, i) => {
    const season = getSeasonalMultiplier(i);

    // random base values
    const baseUnits = Math.floor(Math.random() * 60 + 40); // 40–100
    const unitsSold = Math.round(baseUnits * season);

    const cost = Math.floor(Math.random() * 40 + 50);  // 50–90
    const selling = cost + Math.floor(Math.random() * 50 + 50); // +50–100 margin

    out.push({
      month: m,
      costPrice: cost,
      sellingPrice: selling,
      unitsSold
    });
  });

  return out;
}

// ------------------- CREATE PRODUCTS PER OWNER ---------------------
function createProducts(ownerId, productNames, months) {
  return productNames.map(name => ({
    productName: name,
    costPrice: Math.floor(Math.random() * 50 + 40),
    sellingPrice: Math.floor(Math.random() * 80 + 120),
    unitsSold: Math.floor(Math.random() * 200 + 50),
    region: ["North", "South", "East", "West"][Math.floor(Math.random() * 4)],
    ownerId,
    monthlySales: generateMonthlySales(months)
  }));
}

async function runSeed() {
  try {
    console.log("Clearing old data...");
    await User.deleteMany({});
    await Product.deleteMany({});

    for (let i = 0; i < owners.length; i++) {
      const owner = owners[i];
      const hashed = await bcrypt.hash(owner.password, 10);

      const user = await User.create({
        name: owner.name,
        email: owner.email,
        password: hashed
      });

      console.log(`Created user: ${user.email}`);

      const months = generateMonthList(owner.months);

      // choose 5–10 products randomly for each owner
      const productList = ownerProducts[i];
      const count = Math.floor(Math.random() * 6) + 5;
      const selected = productList.slice(0, count);

      const products = createProducts(user._id, selected, months);

      await Product.insertMany(products);
      console.log(`Added ${products.length} products for ${user.email}`);
    }

    console.log("\n✔ DATABASE SEEDED SUCCESSFULLY\n");
    process.exit();

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

runSeed();
