// productForm.js
// This file handles product form input, validation and saving data
// It stores data locally and also sends it to the backend database


// =====================================================
// FUNCTION TO PARSE COMMA-SEPARATED NUMBERS
// =====================================================
// Converts input like "10, 20, 30" into [10, 20, 30]
function parseNumberList(input, expectedLength) {

  // If input is empty, return empty array
  if (!input) return [];

  // Split input by comma and convert to numbers
  const parts = input
    .split(',')
    .map(s => Number(s.trim()))
    .filter(n => !isNaN(n));

  // If expected length is given, limit array size
  if (expectedLength && parts.length !== expectedLength) {
    return parts.slice(0, expectedLength);
  }

  return parts;
}


// =====================================================
// FUNCTION TO CONVERT PERCENTAGE TO DECIMAL
// =====================================================
// Example: 62 -> 0.62, 0.62 -> 0.62
function pctToDecimal(num) {

  // Check for empty values
  if (num === '' || num === null || num === undefined) return null;

  const n = Number(num);

  // If value is not a number
  if (isNaN(n)) return null;

  // Convert percentage to decimal if needed
  return n > 1 ? n / 100 : n;
}


// =====================================================
// MAIN LOGIC (RUNS AFTER PAGE LOAD)
// =====================================================
document.addEventListener('DOMContentLoaded', () => {

  // Get product form
  const form = document.getElementById('productForm');

  // Required form fields
  const fields = [
    'productName',
    'costPrice',
    'sellingPrice',
    'unitsSold',
    'region'
  ];

  // Restore previously saved values from localStorage
  fields.forEach(id => {

    const el = document.getElementById(id);
    if (!el) return;

    const saved = localStorage.getItem('form_' + id);
    if (saved !== null) {
      el.value = saved;
    }

    // Auto save value while typing
    el.addEventListener('input', () => {
      localStorage.setItem('form_' + id, el.value);
    });
  });


  // ===================================================
  // FORM SUBMIT HANDLING
  // ===================================================
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // prevent page reload

    // Helper function to get input value
    const getVal = (id) =>
      document.getElementById(id).value.trim();

    // Create product object
    const product = {
      productName: getVal('productName'),
      costPrice: Number(getVal('costPrice')) || 0,
      sellingPrice: Number(getVal('sellingPrice')) || 0,
      unitsSold: Number(getVal('unitsSold')) || 0,
      region: getVal('region')
    };

    // Save product locally in sessionStorage
    sessionStorage.setItem(
      'customProduct',
      JSON.stringify(product)
    );

    // Send product data to MongoDB backend
    try {
      const response = await fetch(
        'http://localhost:5000/api/products',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product)
        }
      );

      // If server response is not OK
      if (!response.ok) {
        throw new Error('Failed to save product');
      }

      alert("Product saved successfully");

      // Redirect to analysis page
      window.location.href = 'analysis.html';

    } catch (err) {
      console.error(err);
      alert("Error saving product");
    }
  });
});
