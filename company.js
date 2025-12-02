document.addEventListener('DOMContentLoaded', () => {
  const continueBtn = document.getElementById('continueBtn');
  continueBtn.addEventListener('click', () => {
    const type = document.querySelector('input[name="companyType"]:checked')?.value || 'product';
    const focus = document.getElementById('primaryFocus').value || '';
    sessionStorage.setItem('companyMeta', JSON.stringify({ type, focus }));
    window.location.href = 'products.html';
  });
});


