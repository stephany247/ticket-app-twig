import { isAuthenticated } from "./session.js";

document.addEventListener("DOMContentLoaded", () => {
  // List of protected routes
  const protectedPaths = ["/dashboard", "/tickets"];
  const authPaths = ["/auth/login", "/auth/register"];

  // Get current path (without query params)
  const currentPath = window.location.pathname;

  const userIsLoggedIn = isAuthenticated();

  // If user is not logged in and trying to access a protected page
  if (!userIsLoggedIn && protectedPaths.includes(currentPath)) {
    window.location.href = "/auth/login";
  }

  // If user is logged in but tries to go to login/register, redirect to dashboard
  if (userIsLoggedIn && authPaths.includes(currentPath)) {
    window.location.href = "/dashboard";
  }
});
