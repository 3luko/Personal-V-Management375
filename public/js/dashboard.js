import { apiRequest } from "./api.js";
import { clearLoggedInUser, getLoggedInUser, isLoggedIn } from "./session.js";

const message = document.getElementById("message");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const vehicleCount = document.getElementById("vehicleCount");
const logoutButton = document.getElementById("logoutButton");

if (!isLoggedIn()) {
  window.location.href = "./login.html";
}

logoutButton.addEventListener("click", () => {
  clearLoggedInUser();
  window.location.href = "./login.html";
});

async function loadDashboard() {
  const user = getLoggedInUser();

  if (!user) {
    window.location.href = "./login.html";
    return;
  }

  userName.textContent = user.name;
  userEmail.textContent = user.email;

  try {
    const vehicles = await apiRequest(`/users/${user.id}/vehicles`);
    vehicleCount.textContent = vehicles.length;
    message.textContent = "Login session loaded successfully.";
    message.className = "message success";
  } catch (error) {
    vehicleCount.textContent = "0";
    message.textContent = error.message;
    message.className = "message error";
  }
}

loadDashboard();
