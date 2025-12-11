const mongoose = require("mongoose");

// Monthly entry schema
const MonthlySchema = new mongoose.Schema({
  month: { type: String, required: true },   // Example: "2024-01"
  costPrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  unitsSold: { type: Number, required: true },

  revenue: Number,
  profit: Number
});

// Main Product Schema
const ProductSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  costPrice: Number,
  sellingPrice: Number,
  unitsSold: Number,
  region: String,

  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  monthlySales: [MonthlySchema],

  createdAt: { type: Date, default: Date.now }
});

// Auto calculate revenue/profit inside monthlySales
ProductSchema.pre("save", function (next) {
  if (this.monthlySales) {
    this.monthlySales = this.monthlySales.map(m => ({
      ...m,
      revenue: m.sellingPrice * m.unitsSold,
      profit: (m.sellingPrice - m.costPrice) * m.unitsSold
    }));
  }
  next();
});

module.exports = mongoose.model("Product", ProductSchema);
