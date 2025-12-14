// productsOverview.js
// This file displays product summary data using table and charts
// It shows total sales and seasonal sales using Chart.js


// PRODUCT DATA (STATIC SAMPLE DATA)
const products = [
  { id: 'A', name: 'Smart Speaker',   category: 'Electronics', price: 24, totalSales: 150, seasons: [40, 50, 30, 30] },
  { id: 'B', name: 'Graphic Tee',     category: 'Apparel',     price: 18, totalSales: 105, seasons: [28, 33, 24, 20] },
  { id: 'C', name: 'Fitness Tracker', category: 'Sports',     price: 32, totalSales:  89, seasons: [22, 28, 19, 20] },
  { id: 'D', name: 'Paperback Novel', category: 'Books',      price: 10, totalSales:  73, seasons: [18, 22, 16, 17] },
];

// Seasons used for bar chart
const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];

// DOM ELEMENTS
const tableBody = document.querySelector('#productsTable tbody');

// CHART VARIABLES
let pieChart;
let barChart;


// FORMAT NUMBER FOR DISPLAY
function formatCurrency(value) {
  // Convert number into readable format
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}



// RENDER PRODUCTS TABLE
function renderTable() {

  // Create table rows dynamically
  const rows = products.map((p) => {
    return `
      <tr data-id="${p.id}">
        <td>${p.name}</td>
        <td>${p.category}</td>
      </tr>
    `;
  }).join('');

  tableBody.innerHTML = rows;

  // Add click event for each row
  // Redirect to analysis page with product id
  [...tableBody.querySelectorAll('tr')].forEach((row) => {
    row.addEventListener('click', () => {
      const productId = row.getAttribute('data-id');
      window.location.href =
        `analysis.html?id=${encodeURIComponent(productId)}`;
    });
  });
}


// BUILD PIE CHART (TOTAL SALES)
function buildPieChart() {

  const ctx = document.getElementById('pieChart');
  if (!ctx) return;

  const labels = products.map(p => p.name);
  const data = products.map(p => p.totalSales);

  const colors = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444'];

  pieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: (ctx) =>
              `${ctx.label}: ${formatCurrency(ctx.parsed)}`
          }
        }
      }
    }
  });
}

// BUILD BAR CHART (SEASONAL SALES)

function buildBarChart() {

  const ctx = document.getElementById('barChart');
  if (!ctx) return;

  const colors = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444'];

  // Create dataset for each product
  const datasets = products.map((p, idx) => ({
    label: p.name,
    data: p.seasons,
    backgroundColor: colors[idx],
    borderRadius: 6
  }));

  barChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: seasons,
      datasets
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 }
        }
      },
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: (ctx) =>
              `${ctx.dataset.label}: ${formatCurrency(ctx.parsed.y)}`
          }
        }
      }
    }
  });
}


// INITIAL FUNCTION (RUNS ON PAGE LOAD)
function init() {
  renderTable();
  buildPieChart();
  buildBarChart();
}

// CALL INIT AFTER PAGE LOAD
document.addEventListener('DOMContentLoaded', init);
