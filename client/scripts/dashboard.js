// client/scripts/dashboard.js
// Handles the main dashboard logic for displaying and managing vehicles

import { apiRequest } from "./api.js";
import { clearLoggedInUser, getLoggedInUser, isLoggedIn } from "./session.js";

const message = document.getElementById("message");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const vehicleCount = document.getElementById("vehicleCount");
const vehicleForm = document.getElementById("vehicleForm");
const vehicleList = document.getElementById("vehicleList");
const vehicleSearch = document.getElementById("vehicleSearch");
const vehicleMakeFilter = document.getElementById("vehicleMakeFilter");
const vehicleYearFilter = document.getElementById("vehicleYearFilter");
const clearFiltersButton = document.getElementById("clearFiltersButton");
const logoutButton = document.getElementById("logoutButton");

let currentUser = null;
let allVehicles = [];

try {
  if (!isLoggedIn()) {
    window.location.href = "../pages/login.html";
  }
} catch (error) {
  console.error("Error occurred while checking login status:", error);
}

logoutButton.addEventListener("click", () => {
  try {
    clearLoggedInUser();
    window.location.href = "../pages/login.html";
  } catch (error) {
    console.error("Error occurred while clearing logged-in user:", error);
  }
});

function showMessage(text, type) {
  try {
    message.textContent = text;
    message.className = `message ${type}`;
  } catch (error) {
    console.error("Error occurred while showing message:", error);
  }
}

function renderVehicles(vehicles) {
  vehicleList.innerHTML = "";

  if (!vehicles.length) {
    try {
      const emptyItem = document.createElement("li");
      emptyItem.className = "empty-state";
      emptyItem.textContent = allVehicles.length
        ? "No vehicles match the current filters."
        : "No vehicles added yet.";
      vehicleList.appendChild(emptyItem);
      return;
    } catch (error) {
      console.error("Error occurred while rendering empty state:", error);
    }
  }

  vehicles.forEach((vehicle) => {
    try {
      const listItem = document.createElement("li");
      listItem.className = "vehicle-item";
      listItem.innerHTML = `
        <div class="vehicle-item-header">
          <div>
            <span class="vehicle-title">${vehicle.year} ${vehicle.make} ${vehicle.model}</span>
            <span class="vehicle-meta">VIN: ${vehicle.vin || "Not provided"}</span>
          </div>
          <button class="delete-btn" data-id="${vehicle._id}">Delete</button>
        </div>
      `;
      vehicleList.appendChild(listItem);
    } catch (error) {
      console.error("Error occurred while rendering a vehicle item:", error);
    }
  });
}

function applyVehicleFilters() {
  const searchValue = vehicleSearch.value.trim().toLowerCase();
  const makeValue = vehicleMakeFilter.value.trim().toLowerCase();
  const yearValue = vehicleYearFilter.value.trim();

  const filteredVehicles = allVehicles.filter((vehicle) => {
    try {
      const matchesSearch =
        !searchValue ||
        vehicle.make.toLowerCase().includes(searchValue) ||
        vehicle.model.toLowerCase().includes(searchValue) ||
        (vehicle.vin || "").toLowerCase().includes(searchValue);

      const matchesMake = !makeValue || vehicle.make.toLowerCase().includes(makeValue);
      const matchesYear = !yearValue || String(vehicle.year) === yearValue;

      return matchesSearch && matchesMake && matchesYear;
    } catch (error) {
      console.error("Error occurred while applying filters to a vehicle:", error);
      return false;
    }
  });

  renderVehicles(filteredVehicles);
}

async function loadVehicles() {
  if (!currentUser) {
    return;
  }
  try {
  allVehicles = await apiRequest(`/users/${currentUser.id}/vehicles`);
  vehicleCount.textContent = allVehicles.length;
  applyVehicleFilters();
  } catch (error) {
    console.error("Error loading vehicles:", error);
    throw new Error("Failed to load vehicles. Please try again later.");
  }
}

async function loadDashboard() {
  try {
    currentUser = getLoggedInUser();

    if (!currentUser) {
      window.location.href = "../pages/login.html";
      return;
    }

    userName.textContent = currentUser.name;
    userEmail.textContent = currentUser.email;
  
    await loadVehicles();
    showMessage("Login session loaded successfully.", "success");
  } catch (error) {
    console.error("Error during dashboard load:", error);
    vehicleCount.textContent = "0";
    renderVehicles([]);
    showMessage(error.message, "error");
  }
}

vehicleForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    if (!currentUser) {
      window.location.href = "../pages/login.html";
      return;
    }

    const make = document.getElementById("vehicleMake").value.trim();
    const model = document.getElementById("vehicleModel").value.trim();
    const year = Number(document.getElementById("vehicleYear").value);
    const vin = document.getElementById("vehicleVin").value.trim();
    const vehiclePayload = {
      make,
      model,
      year,
      owner: currentUser.id
    };

    if (vin) {
      vehiclePayload.vin = vin;
    }
    await apiRequest("/vehicles", {
      method: "POST",
      body: vehiclePayload
    });

    vehicleForm.reset();
    await loadVehicles();
    showMessage("Vehicle added successfully.", "success");
  } catch (error) {
    showMessage(error.message, "error");
  }
});

vehicleList.addEventListener("click", async (event) => {
  const deleteButton = event.target.closest(".delete-btn");

  if (!deleteButton) {
    return;
  }

  try {
    await apiRequest(`/vehicles/${deleteButton.dataset.id}`, {
      method: "DELETE"
    });

    await loadVehicles();
    showMessage("Vehicle deleted successfully.", "success");
  } catch (error) {
    showMessage(error.message, "error");
  }
});

vehicleSearch.addEventListener("input", applyVehicleFilters);
vehicleMakeFilter.addEventListener("input", applyVehicleFilters);
vehicleYearFilter.addEventListener("input", applyVehicleFilters);
clearFiltersButton.addEventListener("click", () => {
  vehicleSearch.value = "";
  vehicleMakeFilter.value = "";
  vehicleYearFilter.value = "";
  applyVehicleFilters();
});

loadDashboard();
