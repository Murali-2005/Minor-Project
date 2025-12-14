// compare.js
// This file is used to compare products using charts and simple analysis
// It displays revenue, region-wise comparison, monthly trend and forecast


// =====================================================
// LOAD PRODUCTS
// =====================================================
// First try to get products from sessionStorage
// If not found, fetch products from backend API
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
    console.error("Load error:", err);
    return [];
  }
}


// =====================================================
// PREPARE DATA FOR CHARTS
// =====================================================
function prepareData(products) {

  // Calculate revenue for each product
  const revenueByProduct = products.map(p => ({
    name: p.productName,
    revenue: (p.sellingPrice ?? 0) * (p.unitsSold ?? 0),
    region: p.region,
    monthly: p.monthlySales || []
  }));

  // Calculate total revenue by region
  const revenueRegion = {};
  revenueByProduct.forEach(p => {
    revenueRegion[p.region] =
      (revenueRegion[p.region] || 0) + p.revenue;
  });

  // Calculate monthly revenue for all products combined
  const monthMap = {};
  products.forEach(p => {
    if (!Array.isArray(p.monthlySales)) return;

    p.monthlySales.forEach(m => {
      const rev =
        (typeof m.revenue === 'number')
          ? m.revenue
          : (m.sellingPrice ?? 0) * (m.unitsSold ?? 0);

      if (m && m.month) {
        monthMap[m.month] = (monthMap[m.month] || 0) + rev;
      }
    });
  });

  // Sort months and prepare series
  const sortedMonths = Object.keys(monthMap).sort();
  const monthlySeries = sortedMonths.map(m => monthMap[m]);

  return {
    revenueByProduct,
    revenueRegion,
    sortedMonths,
    monthlySeries
  };
}


// =====================================================
// SIMPLE FORECAST USING LINEAR REGRESSION
// =====================================================
// This function predicts next few months based on past trend
function regressionForecast(series, count = 3) {
  const n = series.length;

  // If data is very small, return same value
  if (n < 2) return Array(count).fill(series[n - 1] || 0);

  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += series[i];
    sumXY += i * series[i];
    sumXX += i * i;
  }

  const denom = (n * sumXX - sumX * sumX);
  const slope =
    denom === 0 ? 0 : (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;

  const result = [];
  for (let i = 1; i <= count; i++) {
    const x = n - 1 + i;
    result.push(intercept + slope * x);
  }

  return result;
}


// =====================================================
// BUILD MAIN CHARTS
// =====================================================
function buildCharts(data) {

  // -------- Revenue by Product (Bar Chart) --------
  new Chart(document.getElementById("revenueByProduct"), {
    type: "bar",
    data: {
      labels: data.revenueByProduct.map(p => p.name),
      datasets: [{
        label: "Revenue",
        data: data.revenueByProduct.map(p => p.revenue),
        backgroundColor: "rgba(54,162,235,0.6)"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });


  // -------- Revenue by Region (Pie Chart) --------
  new Chart(document.getElementById("revenueByRegion"), {
    type: "pie",
    data: {
      labels: Object.keys(data.revenueRegion),
      datasets: [{
        data: Object.values(data.revenueRegion),
        backgroundColor: [
          "#ff6384",
          "#36a2eb",
          "#ffce56",
          "#4bc0c0"
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });


  // -------- Monthly Revenue + Forecast (Line Chart) --------
  const forecast = regressionForecast(data.monthlySeries, 3);
  const finalLabels =
    data.sortedMonths.concat(["F+1", "F+2", "F+3"]);

  new Chart(document.getElementById("monthlyRevenue"), {
    type: "line",
    data: {
      labels: finalLabels,
      datasets: [
        {
          label: "Actual Revenue",
          data: data.monthlySeries,
          borderColor: "#007bff",
          fill: false
        },
        {
          label: "Forecast",
          data: Array(data.monthlySeries.length)
            .fill(null)
            .concat(forecast),
          borderColor: "#ff0000",
          borderDash: [6, 3],
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


// =====================================================
// UNITS SOLD PER PRODUCT CHART
// =====================================================
function buildUnitsSoldChart(products) {

  const labels = products.map(p => p.productName);
  const units = products.map(p => Number(p.unitsSold) || 0);

  new Chart(document.getElementById("unitsSoldPerProduct"), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Units Sold",
        data: units,
        backgroundColor: "rgba(75,192,192,0.6)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Units Sold"
          }
        }
      }
    }
  });
}


// =====================================================
// SHOW SIMPLE INSIGHTS
// =====================================================
function showInsights(data) {

  const el = document.getElementById("insightsList");
  el.innerHTML = "";

  // Find top product
  const top =
    data.revenueByProduct
      .sort((a, b) => b.revenue - a.revenue)[0];

  if (top) {
    el.innerHTML +=
      `<li>Top Product: <b>${top.name}</b> (₹${top.revenue.toFixed(2)})</li>`;
  }

  // Total revenue
  const total =
    data.revenueByProduct.reduce((a, b) => a + b.revenue, 0);
  el.innerHTML +=
    `<li>Total Revenue: ₹${total.toFixed(2)}</li>`;

  // Best performing region
  const regions = Object.entries(data.revenueRegion);
  if (regions.length) {
    const best =
      regions.sort((a, b) => b[1] - a[1])[0];
    el.innerHTML +=
      `<li>Best Region: <b>${best[0]}</b></li>`;
  }

  // Forecast values
  const forecast = regressionForecast(data.monthlySeries, 3);
  el.innerHTML +=
    `<li>Next 3 months forecast: ${forecast
      .map(f => Math.round(f))
      .join(", ")}</li>`;
}


// =====================================================
// EXPORT CHART AS IMAGE
// =====================================================
function initExport() {

  document.getElementById("exportBtn").onclick = () => {
    const canvas = document.getElementById("revenueByProduct");
    const url = canvas.toDataURL("image/png");

    const a = document.createElement("a");
    a.href = url;
    a.download = "sales_chart.png";
    a.click();
  };
}


// =====================================================
// MAIN FUNCTION (RUNS ON PAGE LOAD)
// =====================================================
(async function () {

  const products = await loadProducts();

  const data = prepareData(products);

  buildCharts(data);
  buildUnitsSoldChart(products);
  showInsights(data);
  initExport();

})();
