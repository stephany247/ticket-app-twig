// public/js/ticket.js
import { getSession, isAuthenticated } from "./session.js";

document.addEventListener("DOMContentLoaded", () => {
  if (!isAuthenticated()) {
    window.location.href = "/auth/login";
    return;
  }

  const session = getSession();
  const users = JSON.parse(localStorage.getItem("ticketapp_users")) || [];
  const currentUserIndex = users.findIndex((u) => u.email === session.email);

  if (currentUserIndex === -1) {
    console.error("Current user not found!");
    return;
  }

  let tickets = users[currentUserIndex].tickets || [];
  const ticketForm = document.getElementById("ticket-form");
  const ticketList = document.getElementById("ticket-list");
  const formTitle = document.getElementById("form-title");

  let editTicketId = null;

  // --- Toast Function ---
  function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  // --- Inline Error Function ---
  function showError(input, message) {
    const error = input.parentElement.querySelector(".error-message");
    if (error) error.remove();

    if (message) {
      input.classList.add("border-red-500", "focus:ring-red-400");
      const p = document.createElement("p");
      p.className = "error-message text-red-500 text-sm mt-1";
      p.textContent = message;
      input.parentElement.appendChild(p);
    } else {
      input.classList.remove("border-red-500", "focus:ring-red-400");
    }
  }

  // --- Render Tickets ---
  function renderTickets() {
    if (!tickets.length) {
      ticketList.innerHTML = `<p class="text-gray-500 text-sm">No tickets yet.</p>`;
      return;
    }

    ticketList.innerHTML = tickets
      .map(
        (t) => `
      <div class="p-4 border border-blue-500 rounded-2xl shadow-sm bg-white flex flex-col justify-between gap-2">
        <div class="flex justify-between items-center">
          <h3 class="font-semibold text-lg capitalize">${t.title}</h3>
          <span class="px-2 py-1 text-xs rounded-full ${
            t.status === "Open"
              ? "bg-green-200 text-green-800"
              : t.status === "In Progress"
              ? "bg-yellow-200 text-yellow-800"
              : "bg-gray-200 text-gray-800"
          }">${t.status}</span>
        </div>
        <p class="text-gray-600 text-sm">${t.description}</p>
        <div class="flex items-center justify-between gap-2 text-sm">
          ${
            t.priority
              ? `<span class="font-medium rounded-full ${
                  t.priority === "High"
                    ? "text-red-800"
                    : t.priority === "Medium"
                    ? "text-yellow-800"
                    : "text-green-800"
                }">Priority: ${t.priority}</span>`
              : ""
          }
          <div class="flex gap-2 self-end">
            <button data-id="${
              t.id
            }" class="edit-btn text-blue-600 hover:underline text-smn cursor-pointer">Edit</button>
            <button data-id="${
              t.id
            }" class="delete-btn text-red-600 hover:underline text-smn cursor-pointer">Delete</button>
          </div>
        </div>
      </div>
    `
      )
      .join("");

    // Attach edit/delete handlers
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", () => startEdit(btn.dataset.id));
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => deleteTicket(btn.dataset.id));
    });
  }

  // --- Save Tickets to LocalStorage ---
  function saveTickets() {
    session.tickets = tickets;
    users[currentUserIndex] = session;
    localStorage.setItem("ticketapp_users", JSON.stringify(users));
  }

  // --- Create/Update Ticket ---
  ticketForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const titleInput = document.getElementById("title");
    const descInput = document.getElementById("description");
    const priorityInput = document.getElementById("priority");
    const statusInput = document.getElementById("status");

    // Reset errors
    [titleInput, statusInput].forEach((el) => showError(el, ""));

    let valid = true;
    if (!titleInput.value.trim()) {
      showError(titleInput, "Title is required.");
      valid = false;
    }
    if (!statusInput.value) {
      showError(statusInput, "Select a status.");
      valid = false;
    }
    if (!valid) return;

    if (editTicketId) {
      // Update
      tickets = tickets.map((t) =>
        t.id === editTicketId
          ? {
              ...t,
              title: titleInput.value,
              description: descInput.value.trim() || "No description provided.",
            //   ...(priorityInput.value ? { priority: priorityInput.value } : {}),
              priority: priorityInput.value,
              status: statusInput.value,
            }
          : t
      );
      showToast("Ticket updated successfully!", "success");
      editTicketId = null;
      formTitle.textContent = "Create New Ticket";
      ticketForm.querySelector("button[type=submit]").textContent =
        "Create Ticket";
    } else {
      // Create
      const newTicket = {
        id: Date.now(),
        title: titleInput.value,
        description: descInput.value.trim() || "No description provided",
        priority: priorityInput.value.trim() || "Low",
        status: statusInput.value,
      };
      tickets.push(newTicket);
      showToast("Ticket created successfully!", "success");
    }

    saveTickets();
    ticketForm.reset();
    renderTickets();
  });

  // --- Start Edit ---
  function startEdit(id) {
    const ticket = tickets.find((t) => t.id == id);
    if (!ticket) return;

    document.getElementById("title").value = ticket.title;
    document.getElementById("description").value = ticket.description;
    document.getElementById("priority").value = ticket.priority || "";
    document.getElementById("status").value = ticket.status;

    formTitle.textContent = "Edit Ticket";
    ticketForm.querySelector("button[type=submit]").textContent =
      "Update Ticket";
    editTicketId = ticket.id;
  }

  // --- Delete Ticket ---
  function deleteTicket(id) {
    if (!confirm("Are you sure you want to delete this ticket?")) return;

    tickets = tickets.filter((t) => t.id != id);
    saveTickets();
    showToast("Ticket deleted", "info");
    renderTickets();
  }

  // Initial render
  renderTickets();
});
