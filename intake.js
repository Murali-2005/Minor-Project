function parseNumberList(input, expectedLength) {
  if (!input) return [];
  const parts = input.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n));
  if (expectedLength && parts.length !== expectedLength) return parts.slice(0, expectedLength);
  return parts;
}

function pctToDecimal(num) {
  if (num === '' || num === null || num === undefined) return null;
  const n = Number(num);
  if (isNaN(n)) return null;
  // If user typed 62 treat as 0.62; if 0.62 keep as 0.62
  return n > 1 ? n / 100 : n;
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('productForm');

  // Only required fields
  const fields = ['productName', 'costPrice', 'sellingPrice', 'unitsSold', 'region'];

  // Restore saved values
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const saved = localStorage.getItem('form_' + id);
    if (saved !== null) el.value = saved;

    // Auto save on change
    el.addEventListener('input', () => localStorage.setItem('form_' + id, el.value));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const getVal = (id) => document.getElementById(id).value.trim();
    
    // Create simplified product
    const product = {
      productName: getVal('productName'),
      costPrice: Number(getVal('costPrice')) || 0,
      sellingPrice: Number(getVal('sellingPrice')) || 0,
      unitsSold: Number(getVal('unitsSold')) || 0,
      region: getVal('region')
    };

    // Save locally
    sessionStorage.setItem('customProduct', JSON.stringify(product));

    // Send to MongoDB
    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      
      if (!response.ok) throw new Error('Failed to save product');

      alert("Product saved successfully");
      window.location.href = 'analysis.html'; // Or next page

    } catch (err) {
      console.error(err);
      alert("Error saving product");
    }
  });
});


