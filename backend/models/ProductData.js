const mongoose = require("mongoose");

// Monthly sales entry schema
const MonthlySchema = new mongoose.Schema({
  month: { type: String, required: true },  // example: "2024-01"
  costPrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  unitsSold: { type: Number, required: true },

  revenue: Number,
  profit: Number
});

// Product schema
const ProductSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  costPrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  unitsSold: { type: Number, required: true },
  region: { type: String, required: true },

  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  monthlySales: [MonthlySchema],  

  createdAt: { type: Date, default: Date.now }
});

// Auto-calc monthly profit & revenue
ProductSchema.pre("save", function (next) {
  if (this.monthlySales?.length > 0) {
    this.monthlySales = this.monthlySales.map(m => ({
      ...m,
      revenue: m.sellingPrice * m.unitsSold,
      profit: (m.sellingPrice - m.costPrice) * m.unitsSold
    }));
  }
  next();
});

module.exports = mongoose.model("Product", ProductSchema);
