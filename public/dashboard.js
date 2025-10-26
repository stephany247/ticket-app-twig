// public/js/dashboard.js
import { getSession, logout } from "./session.js";

document.addEventListener("DOMContentLoaded", () => {
  const session = getSession();
  if (!session) {
    window.location.href = "/auth/login";
    return;
  }

  const userNameEl = document.getElementById("user-name");
  const totalTicketsEl = document.getElementById("total-tickets");
  const openTicketsEl = document.getElementById("open-tickets");
  const inProgressTicketsEl = document.getElementById("inprogress-tickets");
  const closedTicketsEl = document.getElementById("closed-tickets");
  const logoutBtn = document.getElementById("logout-btn");

  const users = JSON.parse(localStorage.getItem("ticketapp_users")) || [];
  const currentUserIndex = users.findIndex((u) => u.email === session.email);

  if (currentUserIndex === -1) {
    console.error("Current user not found!");
    return;
  }

  let tickets = users[currentUserIndex].tickets || [];

  // Update user name
  userNameEl.textContent = session.fullName;

  // Count tickets by status
  const total = tickets.length;
  const open = tickets.filter(t => t.status === "Open").length;
  const inProgress = tickets.filter(t => t.status === "In Progress").length;
  const closed = tickets.filter(t => t.status === "Closed").length;

  totalTicketsEl.textContent = total;
  openTicketsEl.textContent = open;
  inProgressTicketsEl.textContent = inProgress;
  closedTicketsEl.textContent = closed;

  // Logout handler
  logoutBtn.addEventListener("click", () => {
    logout();
    window.location.href = "/auth/login";
  });
});
