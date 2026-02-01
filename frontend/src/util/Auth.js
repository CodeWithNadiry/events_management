import { redirect } from "react-router-dom";

// Get remaining token duration
export function getTokenDuration() {
  const storedExpirationDate = localStorage.getItem("expiration");
  if (!storedExpirationDate) return 0;

  const expirationDate = new Date(storedExpirationDate);
  const now = new Date();

  return expirationDate.getTime() - now.getTime();
}

// Get token from localStorage
export default function getAuthToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const tokenDuration = getTokenDuration();
  if (tokenDuration <= 0) {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    return null; // Token expired
  }

  return token;
}

// Loader for routes that just need token
export function tokenLoader() {
  return getAuthToken();
}

// Loader for protected routes
export function checkAuthLoader() {
  const token = getAuthToken();
  if (!token) {
    return redirect("/auth");
  }
  return null;
}