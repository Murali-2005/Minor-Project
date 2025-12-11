// ================================
// LOAD PRODUCTS
// ================================
async function loadProducts() {
  const stored = sessionStorage.getItem("products");
  if (stored) return JSON.parse(stored);

  try {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/products", {
      headers: { Authorization: token }
    });

    return await res.json();
  } catch (err) {
    console.error("Failed to load products", err);
    return [];
  }
}



// ================================
// PREPARE DATA
// ================================
function prepareData(products) {
  // Revenue per product
  const revenueByProduct = products.map(p => ({
    name: p.productName,
    revenue: (p.sellingPrice ?? 0) * (p.unitsSold ?? 0),
    region: p.region,
    monthly: p.monthlySales || []
  }));

  // Revenue by region
  const regionRevenue = {};
  revenueByProduct.forEach(p => {
    regionRevenue[p.region] = (regionRevenue[p.region] || 0) + p.revenue;
  });

  // Monthly aggregated revenue
  const monthMap = {}; // { "2024-01": 12300 }

  products.forEach(p => {
    if (!p.monthlySales) return;

    p.monthlySales.forEach(m => {
      const rev = m.revenue ?? (m.sellingPrice * m.unitsSold);
      monthMap[m.month] = (monthMap[m.month] || 0) + rev;
    });
  });

  const months = Object.keys(monthMap).sort();
  const monthlySeries = months.map(m => monthMap[m]);

  return { revenueByProduct, regionRevenue, months, monthlySeries };
}



// ================================
// SIMPLE LINEAR FORECAST
// ================================
function regressionForecast(series, count = 3) {
  const n = series.length;
  if (n < 2) return Array(count).fill(series[n - 1] || 0);

  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += series[i];
    sumXY += i * series[i];
    sumXX += i * i;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const out = [];

  for (let i = 1; i <= count; i++) {
    const x = n - 1 + i;
    out.push(intercept + slope * x);
  }
  return out;
}



// ================================
// BUILD CHARTS
// ================================
function buildCharts(data, products) {

  // -------------------------
  // Revenue By Product (BAR)
  // -------------------------
  new Chart(document.getElementById("revenueByProduct"), {
    type: "bar",
    data: {
      labels: data.revenueByProduct.map(p => p.name),
      datasets: [{
        label: "Revenue",
        data: data.revenueByProduct.map(p => p.revenue),
        backgroundColor: "rgba(54,162,235,0.7)",
        borderColor: "#1e88e5",
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { beginAtZero: true } }
    }
  });


  // -------------------------
  // Units Sold Per Product (BAR)
  // -------------------------
  new Chart(document.getElementById("unitsSoldPerProduct"), {
    type: "bar",
    data: {
      labels: products.map(p => p.productName),
      datasets: [{
        label: "Units Sold",
        data: products.map(p => Number(p.unitsSold) || 0),
        backgroundColor: "rgba(75,192,192,0.7)",
        borderColor: "#00897b",
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { beginAtZero: true } }
    }
  });


  // -------------------------
  // Revenue By Region (PIE)
  // -------------------------
  new Chart(document.getElementById("revenueByRegion"), {
    type: "pie",
    data: {
      labels: Object.keys(data.regionRevenue),
      datasets: [{
        data: Object.values(data.regionRevenue),
        backgroundColor: ["#ff6b6b", "#4dabf7", "#ffd43b", "#51cf66"]
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });


  // -------------------------
  // Monthly Revenue + Forecast (LINE)
  // -------------------------
  const forecast = regressionForecast(data.monthlySeries, 3);
  const finalLabels = data.months.concat(["F+1", "F+2", "F+3"]);

  new Chart(document.getElementById("monthlyRevenue"), {
    type: "line",
    data: {
      labels: finalLabels,
      datasets: [
        {
          label: "Actual Revenue",
          data: data.monthlySeries,
          borderColor: "#1e88e5",
          borderWidth: 2,
          tension: 0.3,
          fill: false
        },
        {
          label: "Forecast",
          data: Array(data.monthlySeries.length).fill(null).concat(forecast),
          borderColor: "red",
          borderDash: [6, 4],
          borderWidth: 2,
          tension: 0.3,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}



// ================================
// INSIGHTS SECTION
// ================================
function showInsights(data) {
  const list = document.getElementById("insightsList");
  list.innerHTML = "";

  const top = data.revenueByProduct.sort((a, b) => b.revenue - a.revenue)[0];
  if (top) list.innerHTML += `<li><b>Top Product:</b> ${top.name} (₹${top.revenue.toFixed(2)})</li>`;

  const total = data.revenueByProduct.reduce((a, b) => a + b.revenue, 0);
  list.innerHTML += `<li><b>Total Revenue:</b> ₹${total.toFixed(2)}</li>`;

  const bestRegion = Object.entries(data.regionRevenue)
    .sort((a, b) => b[1] - a[1])[0];

  if (bestRegion)
    list.innerHTML += `<li><b>Best Region:</b> ${bestRegion[0]}</li>`;

  const future = regressionForecast(data.monthlySeries, 3);
  list.innerHTML += `<li><b>Forecast (Next 3 Months):</b> ${future.map(v => v.toFixed(0)).join(", ")}</li>`;
}



// ================================
// EXPORT CHART
// ================================
function initExport() {
  document.getElementById("exportBtn").onclick = () => {
    const canvas = document.getElementById("revenueByProduct");
    const link = document.createElement("a");
    link.href = canvas.toDataURL();
    link.download = "sales_chart.png";
    link.click();
  };
}



// ================================
// MAIN FUNCTION
// ================================
(async function () {
  const products = await loadProducts();

  const data = prepareData(products);

  buildCharts(data, products);

  showInsights(data);

  initExport();
})();
