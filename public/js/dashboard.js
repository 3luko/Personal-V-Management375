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

if (!isLoggedIn()) {
  window.location.href = "./login.html";
}

logoutButton.addEventListener("click", () => {
  clearLoggedInUser();
  window.location.href = "./login.html";
});

function showMessage(text, type) {
  message.textContent = text;
  message.className = `message ${type}`;
}

function renderVehicles(vehicles) {
  vehicleList.innerHTML = "";

  if (!vehicles.length) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "empty-state";
    emptyItem.textContent = allVehicles.length
      ? "No vehicles match the current filters."
      : "No vehicles added yet.";
    vehicleList.appendChild(emptyItem);
    return;
  }

  vehicles.forEach((vehicle) => {
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
  });
}

function applyVehicleFilters() {
  const searchValue = vehicleSearch.value.trim().toLowerCase();
  const makeValue = vehicleMakeFilter.value.trim().toLowerCase();
  const yearValue = vehicleYearFilter.value.trim();

  const filteredVehicles = allVehicles.filter((vehicle) => {
    const matchesSearch =
      !searchValue ||
      vehicle.make.toLowerCase().includes(searchValue) ||
      vehicle.model.toLowerCase().includes(searchValue) ||
      (vehicle.vin || "").toLowerCase().includes(searchValue);

    const matchesMake = !makeValue || vehicle.make.toLowerCase().includes(makeValue);
    const matchesYear = !yearValue || String(vehicle.year) === yearValue;

    return matchesSearch && matchesMake && matchesYear;
  });

  renderVehicles(filteredVehicles);
}

async function loadVehicles() {
  if (!currentUser) {
    return;
  }

  allVehicles = await apiRequest(`/users/${currentUser.id}/vehicles`);
  vehicleCount.textContent = allVehicles.length;
  applyVehicleFilters();
}

async function loadDashboard() {
  currentUser = getLoggedInUser();

  if (!currentUser) {
    window.location.href = "./login.html";
    return;
  }

  userName.textContent = currentUser.name;
  userEmail.textContent = currentUser.email;

  try {
    await loadVehicles();
    showMessage("Login session loaded successfully.", "success");
  } catch (error) {
    vehicleCount.textContent = "0";
    renderVehicles([]);
    showMessage(error.message, "error");
  }
}

vehicleForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!currentUser) {
    window.location.href = "./login.html";
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

  try {
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
