document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  // ✅ Toast function (reuses global container from base.html.twig)
  function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
  }

  // ✅ Inline error display helper
  function showError(id, message) {
    const input = document.getElementById(id);
    const existingError = input.parentElement.querySelector(".error-message");
    if (existingError) existingError.remove();

    if (message) {
      input.classList.add("border-red-500", "focus:ring-red-400");
      input.classList.remove("border-gray-300", "focus:ring-blue-500");

      const error = document.createElement("p");
      error.className = "error-message text-red-500 text-sm";
      error.textContent = message;
      input.parentElement.appendChild(error);
    } else {
      input.classList.remove("border-red-500", "focus:ring-red-400");
      input.classList.add("border-gray-300", "focus:ring-blue-500");
    }
  }

  // ✅ Handle form submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Clear previous errors
    ["email", "password"].forEach((id) => showError(id, ""));

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;

    let valid = true;

    // Validate fields
    if (!email) {
      showError("email", "Email is required");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError("email", "Enter a valid email address");
      valid = false;
    }

    if (!password) {
      showError("password", "Password is required");
      valid = false;
    }

    if (!valid) return;

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem("ticketapp_users")) || [];
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      showToast("Invalid email or password", "error");
      showError("email", "Invalid credentials");
      showError("password", "Invalid credentials");
      return;
    }

    // Successful login
    // localStorage.setItem("tickser", JSON.stringify(user));
    showToast(`Welcome back, ${user.fullName}!`, "success");

    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1000);
  });
});
