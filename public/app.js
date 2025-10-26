// function showToast(message, type = 'info') {
window.showToast = function (message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  // Remove toast after 3s
  setTimeout(() => {
    toast.remove();
  }, 3000);
};
