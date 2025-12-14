// ======================
// REDIRECT IF LOGGED IN
// ======================
if (localStorage.getItem("token")) {
  window.location.replace("products.html");
}

// ======================
// REGISTER
// ======================
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    hideErrors();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    let valid = true;

    if (!name) {
      showError("nameError");
      valid = false;
    }

    if (!email || !email.includes("@")) {
      showError("emailError");
      valid = false;
    }

    if (!password || password.length < 6) {
      showError("passwordError");
      valid = false;
    }

    if (!valid) return;

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Registration failed");
        return;
      }

      alert("Registration successful!");
      window.location.href = "login.html";

    } catch (err) {
      console.error(err);
      alert("Server not reachable");
    }
  });
}

// ======================
// LOGIN
// ======================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    hideErrors();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    let valid = true;

    if (!email) {
      showError("loginEmailError");
      valid = false;
    }

    if (!password) {
      showError("loginPasswordError");
      valid = false;
    }

    if (!valid) return;

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);

      alert("Login successful!");
      window.location.href = "products.html";

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  });
}

// ======================
// HELPERS
// ======================
function showError(id) {
  document.getElementById(id).classList.remove("d-none");
}

function hideErrors() {
  document.querySelectorAll(".text-danger").forEach(el => {
    el.classList.add("d-none");
  });
}
