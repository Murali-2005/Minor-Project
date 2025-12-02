const mongoose = require("mongoose");

// Product Schema
const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  category: { type: String },
  costPrice: { type: Number, required: true },
  sellPrice: { type: Number, required: true },
  salesUnits: { type: Number, required: true },

  // Auto Calculated
  profit: Number,
  revenue: Number,
  margin: Number,

  KPI: {
    engagement: Number,
    retention: Number,
    conversion: Number,
    supportTickets: Number,
    satisfaction: Number
  },

  trends: [Number],

  segments: [
    {
      segment: String,
      percentage: Number
    }
  ]
});

// Auto-calculation middlewares
productSchema.pre("save", function (next) {
  this.revenue = this.sellPrice * this.salesUnits;
  this.profit = (this.sellPrice - this.costPrice) * this.salesUnits;
  this.margin = this.sellPrice
    ? ((this.sellPrice - this.costPrice) / this.sellPrice) * 100
    : 0;

  next();
});

// Main Schema — each user can have multiple submissions
const productDataSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true           // 🔥 MUST ADD THIS
  },

  companyType: { type: String, required: true },
  focusArea: { type: String, required: true },

  products: [productSchema],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Auto update timestamp
productDataSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("ProductData", productDataSchema);
