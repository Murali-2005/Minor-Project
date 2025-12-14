// // analysis.js — simple chart version (matches compare.js)

// async function loadProduct() {
//   const id = new URLSearchParams(window.location.search).get("id");

//   if (!id) {
//     alert("No product selected!");
//     return null;
//   }

//   try {
//     const token = localStorage.getItem("token");
//     const res = await fetch("http://localhost:5000/api/products", {
//       headers: { Authorization: token }
//     });

//     const products = await res.json();
//     return products.find(p => p._id === id);
//   } catch (err) {
//     console.error("Fetch failed:", err);
//     return null;
//   }
// }

// function prepareData(product) {
//   const months = product.monthlySales.map(m => m.month);
//   const sales = product.monthlySales.map(m => m.unitsSold);
//   const revenue = product.monthlySales.map(m => m.revenue);
//   const profit = product.monthlySales.map(m => m.profit);

//   return { months, sales, revenue, profit };
// }

// function drawCharts(data) {
//   // Units Sold Chart
//   new Chart(document.getElementById("salesTrend"), {
//     type: "line",
//     data: {
//       labels: data.months,
//       datasets: [{
//         label: "Units Sold",
//         data: data.sales,
//         borderColor: "#007bff",
//         borderWidth: 2,
//         fill: false
//       }]
//     },
//     options: {
//       responsive: true,
//       maintainAspectRatio: false
//     }
//   });

//   // Revenue Chart
//   new Chart(document.getElementById("revenueTrend"), {
//     type: "bar",
//     data: {
//       labels: data.months,
//       datasets: [{
//         label: "Revenue",
//         data: data.revenue,
//         backgroundColor: "rgba(54,162,235,0.6)",
//         borderColor: "#007bff",
//         borderWidth: 1
//       }]
//     },
//     options: {
//       responsive: true,
//       maintainAspectRatio: false
//     }
//   });

//   // Profit Chart
//   new Chart(document.getElementById("profitTrend"), {
//     type: "line",
//     data: {
//       labels: data.months,
//       datasets: [{
//         label: "Profit",
//         data: data.profit,
//         borderColor: "#28a745",
//         borderWidth: 2,
//         fill: false
//       }]
//     },
//     options: {
//       responsive: true,
//       maintainAspectRatio: false
//     }
//   });
// }

// function renderInfo(product) {
//   document.getElementById("infoBox").innerHTML = `
//     <div class="card p-3">
//       <h4>${product.productName}</h4>
//       <p><b>Region:</b> ${product.region}</p>
//       <p><b>Base Cost Price:</b> ₹${product.costPrice}</p>
//       <p><b>Base Selling Price:</b> ₹${product.sellingPrice}</p>
//       <p><b>Total Units Sold:</b> ${product.unitsSold}</p>
//     </div>
//   `;
// }

// // MAIN
// (async function () {
//   const product = await loadProduct();
//   if (!product || !product.monthlySales?.length) {
//     alert("No monthly sales data found!");
//     return;
//   }

//   renderInfo(product);

//   const data = prepareData(product);
//   drawCharts(data);
// })();


// analysis.js
// This file is used to fetch product data and display charts
// It uses Chart.js to show sales, revenue and profit trends


// -----------------------------------------------------------
// Function to load selected product details
// -----------------------------------------------------------
async function loadProduct() {

  // Get product id from URL (analysis.html?id=xxxx)
  const id = new URLSearchParams(window.location.search).get("id");

  // If no product is selected, show error
  if (!id) {
    alert("No product selected!");
    return null;
  }

  try {
    // Get login token from localStorage
    const token = localStorage.getItem("token");

    // Fetch all products from backend API
    const res = await fetch("http://localhost:5000/api/products", {
      headers: {
        Authorization: token
      }
    });

    // Convert response to JSON
    const products = await res.json();

    // Find and return only the selected product
    return products.find(p => p._id === id);

  } catch (err) {
    // If API fails, show error in console
    console.error("Fetch failed:", err);
    return null;
  }
}


// -----------------------------------------------------------
// Function to prepare data for charts
// -----------------------------------------------------------
function prepareData(product) {

  // Extract month names
  const months = product.monthlySales.map(m => m.month);

  // Extract units sold
  const sales = product.monthlySales.map(m => m.unitsSold);

  // Extract revenue values
  const revenue = product.monthlySales.map(m => m.revenue);

  // Extract profit values
  const profit = product.monthlySales.map(m => m.profit);

  // Return all data in one object
  return { months, sales, revenue, profit };
}


// -----------------------------------------------------------
// Function to draw charts using Chart.js
// -----------------------------------------------------------
function drawCharts(data) {

  // -------- Sales Trend Chart --------
  new Chart(document.getElementById("salesTrend"), {
    type: "line",
    data: {
      labels: data.months,
      datasets: [{
        label: "Units Sold",
        data: data.sales,
        borderColor: "#007bff",
        borderWidth: 2,
        fill: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });


  // -------- Revenue Chart --------
  new Chart(document.getElementById("revenueTrend"), {
    type: "bar",
    data: {
      labels: data.months,
      datasets: [{
        label: "Revenue",
        data: data.revenue,
        backgroundColor: "rgba(54,162,235,0.6)",
        borderColor: "#007bff",
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });


  // -------- Profit Trend Chart --------
  new Chart(document.getElementById("profitTrend"), {
    type: "line",
    data: {
      labels: data.months,
      datasets: [{
        label: "Profit",
        data: data.profit,
        borderColor: "#28a745",
        borderWidth: 2,
        fill: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}


// -----------------------------------------------------------
// Function to display product information on the page
// -----------------------------------------------------------
function renderInfo(product) {

  // Display product details inside infoBox div
  document.getElementById("infoBox").innerHTML = `
    <div class="card p-3">
      <h4>${product.productName}</h4>
      <p><b>Region:</b> ${product.region}</p>
      <p><b>Base Cost Price:</b> ₹${product.costPrice}</p>
      <p><b>Base Selling Price:</b> ₹${product.sellingPrice}</p>
      <p><b>Total Units Sold:</b> ${product.unitsSold}</p>
    </div>
  `;
}


// -----------------------------------------------------------
// MAIN FUNCTION (Executes when page loads)
// -----------------------------------------------------------
(async function () {

  // Load selected product
  const product = await loadProduct();

  // Check if product or monthly data is missing
  if (!product || !product.monthlySales?.length) {
    alert("No monthly sales data found!");
    return;
  }

  // Show product details
  renderInfo(product);

  // Prepare chart data
  const data = prepareData(product);

  // Draw charts
  drawCharts(data);

})();
