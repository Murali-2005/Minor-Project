// products.js
// This file handles adding, editing, saving and deleting products
// It also connects with the backend database and manages monthly sales data


// =====================================================
// REDIRECT IF USER IS NOT LOGGED IN
// =====================================================
if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}


// =====================================================
// LOAD PRODUCTS WHEN PAGE LOADS
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
  loadProductsFromDB();
});


// =====================================================
// FETCH PRODUCTS FROM DATABASE
// =====================================================
async function loadProductsFromDB() {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/products", {
      headers: { "Authorization": token }
    });

    const data = await res.json();

    if (res.ok) {
      products = data;      // store products from DB
      renderProducts();     // display them
    } else {
      console.error("Failed to load products:", data.error);
    }
  } catch (err) {
    console.error("DB fetch failed:", err);
  }
}


// =====================================================
// DEFAULT AND SAMPLE PRODUCTS
// =====================================================
const defaultProduct = () => ({
  productName: 'Sample Product',
  costPrice: 10,
  sellingPrice: 20,
  unitsSold: 100,
  region: 'North'
});

const seedDefaults = () => ([
  { ...defaultProduct(), productName: 'Smart Speaker', costPrice: 15, sellingPrice: 24, unitsSold: 150, region: 'West' },
  { ...defaultProduct(), productName: 'Wireless Earbuds', costPrice: 30, sellingPrice: 59, unitsSold: 220, region: 'South' },
  { ...defaultProduct(), productName: 'E-Reader', costPrice: 50, sellingPrice: 89, unitsSold: 130, region: 'North' },
]);


// =====================================================
// PRODUCT CARD UI (HTML TEMPLATE)
// =====================================================
function productCard(product, index) {
  return `
  <div class="card mb-3" data-index="${index}">
    <div class="card-header d-flex justify-content-between align-items-center">
      <strong>
        Product #${index + 1}
        ${product._id 
          ? '<span class="text-success">(Saved)</span>' 
          : '<span class="text-warning">(New)</span>'}
      </strong>
      <button type="button" class="btn btn-sm btn-outline-danger"
        onclick="removeProduct(${index})">Remove</button>
    </div>

    <div class="card-body">
      <div class="row g-3">

        <div class="col-12 col-md-6">
          <label class="form-label">Product Name</label>
          <input class="form-control"
            id="productName_${index}"
            value="${product.productName}">
        </div>

        <div class="col-6 col-md-3">
          <label class="form-label">Cost Price ($)</label>
          <input type="number" class="form-control"
            id="costPrice_${index}"
            value="${product.costPrice}">
        </div>

        <div class="col-6 col-md-3">
          <label class="form-label">Selling Price ($)</label>
          <input type="number" class="form-control"
            id="sellingPrice_${index}"
            value="${product.sellingPrice}">
        </div>

        <div class="col-6 col-md-3">
          <label class="form-label">Units Sold</label>
          <input type="number" class="form-control"
            id="unitsSold_${index}"
            value="${product.unitsSold}">
        </div>

        <div class="col-6 col-md-3">
          <label class="form-label">Region</label>
          <select class="form-control" id="region_${index}">
            <option ${product.region === 'North' ? 'selected' : ''}>North</option>
            <option ${product.region === 'South' ? 'selected' : ''}>South</option>
            <option ${product.region === 'East' ? 'selected' : ''}>East</option>
            <option ${product.region === 'West' ? 'selected' : ''}>West</option>
          </select>
        </div>
      </div>

      <!-- Buttons -->
      <div class="mt-3">
        <button type="button"
          class="btn btn-success btn-sm"
          onclick="saveProduct(${index})">
          Save Product
        </button>

        <button type="button"
          class="btn btn-info btn-sm mt-2"
          onclick="openMonthlyPopup(${index})">
          Add Monthly Sales
        </button>
      </div>

    </div>
  </div>`;
}


// =====================================================
// GLOBAL PRODUCTS ARRAY
// =====================================================
let products = [];


// =====================================================
// DISPLAY PRODUCTS ON PAGE
// =====================================================
function renderProducts() {
  const container = document.getElementById('productsContainer');
  container.innerHTML =
    products.map((p, i) => productCard(p, i)).join('');
}


// =====================================================
// ADD NEW PRODUCT
// =====================================================
function addProduct(prefill) {
  products.push(prefill || defaultProduct());
  renderProducts();
}


// =====================================================
// REMOVE PRODUCT
// =====================================================
async function removeProduct(index) {
  const product = products[index];

  // If product is not saved in DB
  if (!product._id) {
    products.splice(index, 1);
    renderProducts();
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/api/products/${product._id}`,
      {
        method: "DELETE",
        headers: { "Authorization": token }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Failed to delete product");
      return;
    }

    alert("Product deleted successfully");
    products.splice(index, 1);
    renderProducts();

  } catch (err) {
    console.error(err);
    alert("Error deleting product");
  }
}


// =====================================================
// READ PRODUCT VALUES FROM FORM
// =====================================================
function readProductsFromDOM() {
  products = products.map((p, i) => ({
    _id: p._id || null,
    productName: document.getElementById(`productName_${i}`).value,
    costPrice: Number(document.getElementById(`costPrice_${i}`).value) || 0,
    sellingPrice: Number(document.getElementById(`sellingPrice_${i}`).value) || 0,
    unitsSold: Number(document.getElementById(`unitsSold_${i}`).value) || 0,
    region: document.getElementById(`region_${i}`).value
  }));
}


// =====================================================
// SAVE PRODUCT TO DATABASE
// =====================================================
async function saveProduct(index) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Session expired. Please login again.");
    window.location.href = "login.html";
    return;
  }

  const product = {
    productName: document.getElementById(`productName_${index}`).value,
    costPrice: Number(document.getElementById(`costPrice_${index}`).value) || 0,
    sellingPrice: Number(document.getElementById(`sellingPrice_${index}`).value) || 0,
    unitsSold: Number(document.getElementById(`unitsSold_${index}`).value) || 0,
    region: document.getElementById(`region_${index}`).value
  };

  try {
    const response = await fetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(product)
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Failed to save product");
      return;
    }

    products[index] = { ...product, _id: data.product._id };
    renderProducts();

    alert(`Product "${product.productName}" saved successfully`);

  } catch (err) {
    console.error(err);
    alert("Error saving product");
  }
}


// =====================================================
// LOAD PRODUCTS + EVENTS ON PAGE LOAD
// =====================================================
document.addEventListener('DOMContentLoaded', () => {

  fetchProductsFromDB();

  document.getElementById('addProductBtn')
    .addEventListener('click', () => addProduct(defaultProduct()));

  document.getElementById('productForm')
    .addEventListener('submit', (e) => {
      e.preventDefault();
      readProductsFromDOM();
      window.location.href = 'compare.html';
    });
});


// =====================================================
// MONTHLY SALES POPUP
// =====================================================
let activeProductIndex = null;

// Open popup
function openMonthlyPopup(index) {
  const product = products[index];

  if (!product._id) {
    alert("Please save the product before adding monthly sales");
    return;
  }

  activeProductIndex = index;
  document.getElementById("monthlyPopup").style.display = "flex";
}

// Close popup
function closePopup() {
  document.getElementById("monthlyPopup").style.display = "none";
}

// Save monthly sales
async function saveMonthlySale() {
  const token = localStorage.getItem("token");
  const product = products[activeProductIndex];

  const entry = {
    month: document.getElementById("m_month").value,
    costPrice: Number(document.getElementById("m_cost").value),
    sellingPrice: Number(document.getElementById("m_sell").value),
    unitsSold: Number(document.getElementById("m_units").value)
  };

  const res = await fetch(
    `http://localhost:5000/api/products/${product._id}/monthly`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(entry)
    }
  );

  const data = await res.json();

  if (res.ok) {
    alert("Monthly sales added successfully");
    products[activeProductIndex] = data.product;
    closePopup();
    renderProducts();
  } else {
    alert(data.error);
  }
}


// =====================================================
// MAKE FUNCTIONS AVAILABLE TO HTML
// =====================================================
window.removeProduct = removeProduct;
window.saveProduct = saveProduct;
window.addProduct = addProduct;
window.openMonthlyPopup = openMonthlyPopup;
window.saveMonthlySale = saveMonthlySale;
window.closePopup = closePopup;
