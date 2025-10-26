// public/js/session.js

const SESSION_DURATION = 1000 * 60 * 60; // 1 hour

// 🧠 Create a session when user logs in or registers
export function createSession(user) {
  const sessionData = {
    ...user,
    expiry: Date.now() + SESSION_DURATION,
  };
  localStorage.setItem("ticketapp_user", JSON.stringify(sessionData));
}

// 🧠 Retrieve and validate session
export function getSession() {
  const data = JSON.parse(localStorage.getItem("ticketapp_user"));
  if (!data) return null;

  // If expired, clear and return null
  if (Date.now() > data.expiry || !data.expiry) {
    localStorage.removeItem("ticketapp_user");
    return null;
  }

  return data;
}

// 🧠 Check authentication status
export function isAuthenticated() {
  return !!getSession();
}

// 🧠 Log out user
export function logout() {
  const data = JSON.parse(localStorage.getItem("ticketapp_user"));
  if (data) {
    data.expiry = null; // mark session invalid
    localStorage.setItem("ticketapp_user", JSON.stringify(data));
  }
}

