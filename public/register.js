import { createSession } from "./session.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  const showError = (id, message) => {
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
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // RESET ERRORS
    ["fullName", "email", "password", "confirmPassword"].forEach((id) =>
      showError(id, "")
    );

    // FIELD VALUES
    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    let valid = true;

    // VALIDATIONS
    if (!fullName) {
      showError("fullName", "Full name is required");
      valid = false;
    } else if (fullName.length < 3) {
      showError("fullName", "Full name must be at least 3 characters");
      valid = false;
    }

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
    } else if (password.length < 6) {
      showError("password", "Password must be at least 6 characters");
      valid = false;
    }

    if (!confirmPassword) {
      showError("confirmPassword", "Confirm your password");
      valid = false;
    } else if (password !== confirmPassword) {
      showError("confirmPassword", "Passwords do not match");
      valid = false;
    }

    if (!valid) return;

    // USERS STORAGE
    const users = JSON.parse(localStorage.getItem("ticketapp_users")) || [];
    const existingUser = users.find((user) => user.email === email);

    if (existingUser) {
      showError("email", "Email already registered. Please log in instead.");
      return;
    }

    // CREATE NEW USER
    const newUser = {
      id: Date.now(),
      fullName,
      email,
      password,
      tickets: [],
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    createSession(newUser)
    localStorage.setItem("ticketapp_users", JSON.stringify(users));

    showToast("Registration successful! Redirecting...", "success");

    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1000);
  });
});
