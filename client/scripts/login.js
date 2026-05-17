// login.js - Handles user login and registration logic

import { apiRequest } from "../public/js/api.js";
import { isLoggedIn, saveLoggedInUser } from "../public/js/session.js";

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

if (isLoggedIn()) {
    window.location.href = "./dashboard.html";
}

function showMessage(text, type) {
    message.textContent = text;
    message.className = `message ${type}`;
}

// Switch tabs
loginTab.addEventListener("click", () => {
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
    loginTab.classList.add("active");
    registerTab.classList.remove("active");
    message.textContent = "";
    message.className = "message";
});

registerTab.addEventListener("click", () => {
    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
    registerTab.classList.add("active");
    loginTab.classList.remove("active");
    message.textContent = "";
    message.className = "message";
});

// LOGIN USER
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const data = await apiRequest("/users/login", {
            method: "POST",
            body: { email, password }
        });

        saveLoggedInUser(data.user);
        showMessage(data.message, "success");

        window.setTimeout(() => {
            window.location.href = "./dashboard.html";
        }, 400);
    } catch (error) {
        showMessage(error.message, "error");
    }
});

// Registration Form
registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    try {
        await apiRequest("/users", {
            method: "POST",
            body: { name, email, password }
        });

        showMessage("Account created successfully! Please sign in.", "success");
        registerForm.reset();
        loginTab.click();
    } catch (error) {
        showMessage(error.message, "error");
    }
});



