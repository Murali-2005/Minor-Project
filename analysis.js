// analysis.js — simple chart version (matches compare.js)

async function loadProduct() {
  const id = new URLSearchParams(window.location.search).get("id");

  if (!id) {
    alert("No product selected!");
    return null;
  }

  try {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/products", {
      headers: { Authorization: token }
    });

    const products = await res.json();
    return products.find(p => p._id === id);
  } catch (err) {
    console.error("Fetch failed:", err);
    return null;
  }
}

function prepareData(product) {
  const months = product.monthlySales.map(m => m.month);
  const sales = product.monthlySales.map(m => m.unitsSold);
  const revenue = product.monthlySales.map(m => m.revenue);
  const profit = product.monthlySales.map(m => m.profit);

  return { months, sales, revenue, profit };
}

function drawCharts(data) {
  // Units Sold Chart
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

  // Revenue Chart
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

  // Profit Chart
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

function renderInfo(product) {
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

// MAIN
(async function () {
  const product = await loadProduct();
  if (!product || !product.monthlySales?.length) {
    alert("No monthly sales data found!");
    return;
  }

  renderInfo(product);

  const data = prepareData(product);
  drawCharts(data);
})();
