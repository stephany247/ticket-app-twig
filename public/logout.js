// public/js/logoutHandler.js
import { logout } from "./session.js";

document.addEventListener("DOMContentLoaded", () => {
  // Select both logout buttons
  const logoutButtons = document.querySelectorAll(".logout-btn");

  if (logoutButtons.length === 0) {
    console.warn("No logout buttons found!");
    return;
  }


  logoutButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      // Clear session
      logout();

      // Show toast
      showToast("You have been logged out.", "info");

      // Redirect after short delay
      setTimeout(() => (window.location.href = "/"), 1000);
    });
  });
});
