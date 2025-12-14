const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Product = require("./models/Product");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "SUPER_SECRET_JWT_KEY";   // One secret only

// ----------- DATABASE CONNECTION -------------
mongoose.connect('mongodb://localhost:27017/salesDashboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));


// ----------- USER MODEL (OWNER) -------------
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model("User", UserSchema);

// ----------- REGISTER API (FINAL) -------------
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // -------- BACKEND VALIDATION --------
    if (!name || name.trim().length < 3) {
      return res.status(400).json({ error: "Name must be at least 3 characters" });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    // Check duplicate
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await new User({
      name: name.trim(),
      email: email.trim(),
      password: hashedPassword
    }).save();

    res.json({ message: "Registered successfully" });

  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});



// ----------- LOGIN API (FINAL) -------------
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const correct = await bcrypt.compare(password, user.password);
    if (!correct) return res.status(400).json({ error: "Incorrect password" });

    const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: "7d" });

    res.json({ message: "Login successful", token, userId: user._id });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ----------- AUTH MIDDLEWARE -------------
function auth(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}

// ----------- PRODUCT ROUTES (PROTECTED) -------------

// Add Product
app.post('/api/products', auth, async (req, res) => {
  try {
    const product = new Product({ ...req.body, ownerId: req.userId });
    await product.save();
    res.json({ message: "Product saved", product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all products (only for logged-in owner)
app.get('/api/products', auth, async (req, res) => {
  const products = await Product.find({ ownerId: req.userId });
  res.json(products);
});

// Delete product (owner only)
app.delete('/api/products/:id', auth, async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({
      _id: req.params.id,
      ownerId: req.userId
    });

    if (!deleted) return res.status(404).json({ error: "Product not found" });

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD MONTHLY SALES ENTRY
app.post("/api/products/:id/monthly", auth, async (req, res) => {
  try {
    const { month, costPrice, sellingPrice, unitsSold } = req.body;

    const product = await Product.findOne({
      _id: req.params.id,
      ownerId: req.userId
    });

    if (!product) return res.status(404).json({ error: "Product not found" });

    product.monthlySales.push({
      month,
      costPrice,
      sellingPrice,
      unitsSold
    });

    await product.save();
    res.json({ message: "Monthly sales added", product });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
