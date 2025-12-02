// Simple data set with extended KPIs for each product (sample values)
const baseProducts = {
  A: { name: 'Smart Speaker',   category: 'Electronics', price: 24, totalSales: 150, seasons: [40, 50, 30, 30] },
  B: { name: 'Graphic Tee',     category: 'Apparel',     price: 18, totalSales: 105, seasons: [28, 33, 24, 20] },
  C: { name: 'Fitness Tracker', category: 'Sports',      price: 32, totalSales:  89, seasons: [22, 28, 19, 20] },
  D: { name: 'Paperback Novel', category: 'Books',       price: 10, totalSales:  73, seasons: [18, 22, 16, 17] },
};

// Derived and additional KPIs (mock, for demonstration)
const productKPIs = {
  A: {
    grossMargin: 0.58, // 58%
    profitMargin: 0.22, // 22%
    cltv: 180, cac: 28,
    dau: 120, wau: 540, mau: 2100,
    churnRate: 0.04, retentionRate: 0.96,
    conversionRate: 0.11,
    sessionDurationMin: 7.2, sessionFreqPerUser: 3.1,
    featureAdoptionRate: 0.63,
    nps: 41,
    topFeatures: ['Quick Export', 'Smart Filters', 'Auto-Sync'],
    segments: [
      { name: 'SMB', users: 900, adoptionRate: 0.67, top: ['Smart Filters', 'Auto-Sync'] },
      { name: 'Enterprise', users: 600, adoptionRate: 0.58, top: ['Quick Export', 'Audit Log'] },
      { name: 'Developer', users: 300, adoptionRate: 0.71, top: ['API', 'Webhooks'] },
    ],
    usageTrends: { labels: ['W1','W2','W3','W4','W5','W6','W7','W8'], values: [210,230,240,250,260,255,270,285] },
    funnel: { stages: ['Visit','Sign-up','Onboarded','Activated','Paid'], values: [5000, 900, 700, 560, 330] },
    healthScore: 0.78, expansionRisk: 0.18,
    timeToMarketDays: 45, releaseVelocityPerQ: 8,
    defectRatePer1000Users: 0.9,
    supportResponseHrs: 3.4,
    competitiveValueIndex: 0.82,
  },
  B: {
    grossMargin: 0.52, profitMargin: 0.17, cltv: 140, cac: 22, dau: 95, wau: 410, mau: 1700,
    churnRate: 0.06, retentionRate: 0.94, conversionRate: 0.09,
    sessionDurationMin: 6.1, sessionFreqPerUser: 2.7,
    featureAdoptionRate: 0.55, nps: 34,
    topFeatures: ['Size Guide', 'Wishlist'],
    segments: [
      { name: 'Budget', users: 1100, adoptionRate: 0.52, top: ['Wishlist'] },
      { name: 'Fashion', users: 650, adoptionRate: 0.57, top: ['Size Guide'] },
    ],
    usageTrends: { labels: ['W1','W2','W3','W4','W5','W6','W7','W8'], values: [170,175,180,178,185,190,192,200] },
    funnel: { stages: ['Visit','Sign-up','Onboarded','Activated','Paid'], values: [4200, 800, 580, 470, 260] },
    healthScore: 0.71, expansionRisk: 0.25, timeToMarketDays: 52, releaseVelocityPerQ: 6,
    defectRatePer1000Users: 1.2, supportResponseHrs: 4.1, competitiveValueIndex: 0.77,
  },
  C: {
    grossMargin: 0.61, profitMargin: 0.24, cltv: 210, cac: 31, dau: 80, wau: 350, mau: 1500,
    churnRate: 0.05, retentionRate: 0.95, conversionRate: 0.12,
    sessionDurationMin: 7.8, sessionFreqPerUser: 3.4,
    featureAdoptionRate: 0.59, nps: 46,
    topFeatures: ['Training Plans', 'Performance Metrics'],
    segments: [
      { name: 'Athlete', users: 500, adoptionRate: 0.66, top: ['Performance Metrics'] },
      { name: 'Casual', users: 900, adoptionRate: 0.54, top: ['Training Plans'] },
    ],
    usageTrends: { labels: ['W1','W2','W3','W4','W5','W6','W7','W8'], values: [130,132,138,140,145,150,152,158] },
    funnel: { stages: ['Visit','Sign-up','Onboarded','Activated','Paid'], values: [3600, 720, 560, 460, 250] },
    healthScore: 0.79, expansionRisk: 0.16, timeToMarketDays: 41, releaseVelocityPerQ: 9,
    defectRatePer1000Users: 0.8, supportResponseHrs: 3.0, competitiveValueIndex: 0.85,
  },
  D: {
    grossMargin: 0.47, profitMargin: 0.15, cltv: 95, cac: 15, dau: 60, wau: 290, mau: 1200,
    churnRate: 0.07, retentionRate: 0.93, conversionRate: 0.08,
    sessionDurationMin: 5.4, sessionFreqPerUser: 2.3,
    featureAdoptionRate: 0.48, nps: 29,
    topFeatures: ['Bookmarks', 'Reading Progress'],
    segments: [
      { name: 'Students', users: 800, adoptionRate: 0.49, top: ['Bookmarks'] },
      { name: 'Readers', users: 500, adoptionRate: 0.47, top: ['Reading Progress'] },
    ],
    usageTrends: { labels: ['W1','W2','W3','W4','W5','W6','W7','W8'], values: [98,95,100,102,103,104,101,106] },
    funnel: { stages: ['Visit','Sign-up','Onboarded','Activated','Paid'], values: [3000, 600, 430, 350, 180] },
    healthScore: 0.66, expansionRisk: 0.31, timeToMarketDays: 60, releaseVelocityPerQ: 5,
    defectRatePer1000Users: 1.5, supportResponseHrs: 5.2, competitiveValueIndex: 0.72,
  },
};

function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function asPct(v) { return `${Math.round(v * 100)}%`; }
function asNum(v) { return v.toLocaleString(); }
function asHrs(v) { return `${v.toFixed(1)}h`; }
function asMin(v) { return `${v.toFixed(1)}m`; }

function renderKPIs(productId) {
  let base = baseProducts[productId];
  let kpi = productKPIs[productId];
  if (productId === 'CUSTOM') {
    const raw = sessionStorage.getItem('customProduct');
    if (raw) {
      try {
        const { base: b, kpis: k } = JSON.parse(raw);
        base = { name: b.name, category: b.category, price: b.price, totalSales: b.totalSales, seasons: b.seasons };
        kpi = k;
      } catch {}
    }
  }
  const title = document.getElementById('productTitle');
  title.textContent = `${base.name} • ${base.category}`;

  const revenue = base.price * base.totalSales;

  const items = [
    { label: 'Revenue', value: `$${asNum(revenue)}` },
    { label: 'Total Sales', value: asNum(base.totalSales) },
    { label: 'Gross Margin', value: asPct(kpi.grossMargin) },
    { label: 'Profit Margin', value: asPct(kpi.profitMargin) },
    { label: 'CLTV', value: `$${asNum(kpi.cltv)}` },
    { label: 'CAC', value: `$${asNum(kpi.cac)}` },
    { label: 'DAU / WAU / MAU', value: `${asNum(kpi.dau)} / ${asNum(kpi.wau)} / ${asNum(kpi.mau)}` },
    { label: 'Churn / Retention', value: `${asPct(kpi.churnRate)} / ${asPct(kpi.retentionRate)}` },
    { label: 'Conversion Rate', value: asPct(kpi.conversionRate) },
    { label: 'Session Duration', value: asMin(kpi.sessionDurationMin) },
    { label: 'Session Frequency', value: `${kpi.sessionFreqPerUser.toFixed(1)}×/user` },
    { label: 'Feature Adoption', value: asPct(kpi.featureAdoptionRate) },
    { label: 'NPS', value: `${kpi.nps}` },
    { label: 'Top Features', value: kpi.topFeatures.join(', ') },
    { label: 'Health Score / Expansion Risk', value: `${asPct(kpi.healthScore)} / ${asPct(kpi.expansionRisk)}` },
    { label: 'Time to Market', value: `${kpi.timeToMarketDays} days` },
    { label: 'Release Velocity', value: `${kpi.releaseVelocityPerQ}/quarter` },
    { label: 'Defect Rate', value: `${kpi.defectRatePer1000Users}/1000 users` },
    { label: 'Support Response', value: asHrs(kpi.supportResponseHrs) },
    { label: 'Competitive Value', value: asPct(kpi.competitiveValueIndex) },
  ];

  const kpiCards = document.getElementById('kpiCards');
  kpiCards.innerHTML = items.map(it => `
    <div class="col-12 col-sm-6 col-lg-4 col-xxl-3">
      <div class="card shadow-sm h-100">
        <div class="card-body">
          <div class="text-muted small mb-1">${it.label}</div>
          <div class="fs-5 fw-semibold">${it.value}</div>
        </div>
      </div>
    </div>
  `).join('');

  // Segments table
  const tbody = document.querySelector('#segmentsTable tbody');
  tbody.innerHTML = kpi.segments.map(s => `
    <tr>
      <td>${s.name}</td>
      <td class="text-end">${asNum(s.users)}</td>
      <td class="text-end">${asPct(s.adoptionRate)}</td>
      <td>${s.top.join(', ')}</td>
    </tr>
  `).join('');

  // Charts
  buildPeerCharts(productId);
  new Chart(document.getElementById('usageTrendsChart'), {
    type: 'line',
    data: {
      labels: kpi.usageTrends.labels,
      datasets: [{ label: 'Active Users', data: kpi.usageTrends.values, fill: false, borderColor: '#3b82f6', tension: 0.25 }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });

  // Funnel as horizontal bar
  new Chart(document.getElementById('funnelChart'), {
    type: 'bar',
    data: {
      labels: kpi.funnel.stages,
      datasets: [{ label: 'Users', data: kpi.funnel.values, backgroundColor: '#22c55e', borderRadius: 6 }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { x: { beginAtZero: true } }
    }
  });
}

function buildPeerCharts(productId) {
  const colors = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444'];
  let peers = Object.entries(baseProducts);
  if (productId === 'CUSTOM') {
    // No predefined peers for custom submission; hide charts if only one item
    const raw = sessionStorage.getItem('customProduct');
    if (!raw) return;
    try {
      const { base } = JSON.parse(raw);
      peers = [['CUSTOM', base]];
    } catch {}
  }
  const labels = peers.map(([_, p]) => p.name);
  const totals = peers.map(([_, p]) => p.totalSales);

  // Pie: total sales share among peers
  const pieEl = document.getElementById('peerPieChart');
  if (pieEl) {
    const activeIndex = Object.keys(baseProducts).indexOf(productId);
    const pie = new Chart(pieEl, {
      type: 'pie',
      data: { labels, datasets: [{ data: totals, backgroundColor: colors }] },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });
    if (activeIndex >= 0) {
      pie.setActiveElements([{ datasetIndex: 0, index: activeIndex }]);
    }
    pie.update();
  }

  // Bar: seasonwise sales across peers
  const barEl = document.getElementById('peerBarChart');
  if (barEl) {
    const datasets = peers.map(([id, p], idx) => ({
      label: p.name,
      data: p.seasons,
      backgroundColor: id === productId ? '#3b82f6' : colors[idx],
      borderRadius: 6,
    }));
    new Chart(barEl, {
      type: 'bar',
      data: { labels: ['Spring','Summer','Autumn','Winter'], datasets },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } }
    });
  }
}

function initAnalysis() {
  const id = getQueryParam('id');
  if (!id || (!baseProducts[id] && id !== 'CUSTOM')) {
    window.location.href = 'index.html';
    return;
  }
  renderKPIs(id);
}

document.addEventListener('DOMContentLoaded', initAnalysis);


