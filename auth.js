// REGISTER BUTTON HANDLER

if (localStorage.getItem("token")) {
  window.location.replace("products.html");
}

async function registerUser() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("http://localhost:5000/api/register", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({name, email, password})
  });

  const data = await res.json();

  if (res.ok) {
    alert("Registration successful!");
    window.location.href = "login.html";
  } else {
    alert(data.error || "Registration failed");
  }
}


// LOGIN BUTTON HANDLER
async function loginUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("http://localhost:5000/api/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({email, password})
  });

  const data = await res.json();

  if (res.ok) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.userId);

    alert("Login successful!");

    window.location.href = "products.html";
  } else {
    alert(data.error || "Login failed");
  }
}
