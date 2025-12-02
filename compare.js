let products = [];
let pieChart, barChart;

function loadProducts() {
  const raw = sessionStorage.getItem('companyProducts');
  if (!raw) return [];
  try { return JSON.parse(raw) || []; } catch { return []; }
}

function uniq(arr) { return [...new Set(arr)]; }

function renderCategoryPills(categories) {
  const pills = document.getElementById('categoryPills');
  pills.innerHTML = ['All', ...categories].map(cat => `
    <button type="button" class="btn btn-sm btn${cat==='All' ? '' : '-'}outline-primary" data-cat="${cat}">${cat}</button>
  `).join('');
  pills.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => selectCategory(btn.getAttribute('data-cat'))));
}

function selectCategory(category) {
  const filtered = category === 'All' ? products : products.filter(p => p.category === category);
  document.getElementById('categoryTitle').textContent = category === 'All' ? 'All Products' : `${category}`;
  renderTable(filtered);
  renderCharts(filtered);
}

function renderTable(list) {
  const tbody = document.querySelector('#compareTable tbody');
  tbody.innerHTML = list.map(p => `
    <tr>
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td class="text-end">$${p.price}</td>
      <td class="text-end">${(p.totalSales||0).toLocaleString()}</td>
      <td class="text-end">${Number(p.grossMargin||0)}%</td>
      <td class="text-end">${Number(p.profitMargin||0)}%</td>
    </tr>
  `).join('');
}

function renderCharts(list) {
  const labels = list.map(p => p.name);
  const totals = list.map(p => p.totalSales || 0);
  const colors = ['#6366f1','#22c55e','#f59e0b','#ef4444','#06b6d4','#a855f7','#84cc16'];

  const pieEl = document.getElementById('categoryPie');
  if (pieChart) pieChart.destroy();
  pieChart = new Chart(pieEl, { type: 'pie', data: { labels, datasets: [{ data: totals, backgroundColor: colors }] }, options: { plugins: { legend: { position: 'bottom' } } } });

  const barEl = document.getElementById('categoryBar');
  if (barChart) barChart.destroy();
  const datasets = list.map((p, idx) => ({ label: p.name, data: p.seasons || [0,0,0,0], backgroundColor: colors[idx%colors.length], borderRadius: 6 }));
  barChart = new Chart(barEl, { type: 'bar', data: { labels: ['Spring','Summer','Autumn','Winter'], datasets }, options: { plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero: true } } } });
}

document.addEventListener('DOMContentLoaded', () => {
  products = loadProducts();
  if (!products.length) {
    window.location.href = 'products.html';
    return;
  }
  const categories = uniq(products.map(p => p.category));
  renderCategoryPills(categories);
  selectCategory('All');
});


