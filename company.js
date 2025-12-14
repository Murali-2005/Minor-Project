// company.js
// This file is used to store company type details
// and move the user to the products page


// Wait until the HTML page is fully loaded
document.addEventListener('DOMContentLoaded', () => {

  // Get the Continue button
  const continueBtn = document.getElementById('continueBtn');

  // When user clicks the Continue button
  continueBtn.addEventListener('click', () => {

    // Get selected company type (product / service / both)
    // If nothing is selected, default value is 'product'
    const type =
      document.querySelector('input[name="companyType"]:checked')?.value
      || 'product';

    // Get value entered in primary focus input field
    const focus = document.getElementById('primaryFocus').value || '';

    // Store company details in sessionStorage
    // sessionStorage is used so data is available only for this session
    sessionStorage.setItem(
      'companyMeta',
      JSON.stringify({ type, focus })
    );

    // Redirect user to products page
    window.location.href = 'products.html';
  });
});
