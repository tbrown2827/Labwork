"use strict";
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!expanded));
    navigation.classList.toggle("open", !expanded);
  });
}

// Academic planner: arrays, functions, event handling, DOM updates and local storage.
const taskForm = document.getElementById("task-form");
if (taskForm) {
  const taskInput = document.getElementById("task-input");
  const taskList = document.getElementById("task-list");
  const taskCount = document.getElementById("task-count");
  const emptyState = document.getElementById("empty-tasks");
  let tasks = [];
  try {
    const saved = JSON.parse(localStorage.getItem("cos106-tasks") || "[]");
    if (Array.isArray(saved)) tasks = saved.filter(t => t && typeof t.text === "string" && typeof t.done === "boolean");
  } catch (error) { tasks = []; }
  function saveTasks() { try { localStorage.setItem("cos106-tasks", JSON.stringify(tasks)); } catch (error) { /* Storage may be disabled. */ } }
  function renderTasks() {
    taskList.replaceChildren();
    tasks.forEach(task => {
      const li = document.createElement("li");
      li.className = "task-item" + (task.done ? " completed" : "");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.done;
      checkbox.id = "task-" + task.id;
      checkbox.addEventListener("change", () => { task.done = checkbox.checked; saveTasks(); renderTasks(); });
      const label = document.createElement("label");
      label.htmlFor = checkbox.id;
      label.textContent = task.text;
      label.style.marginBottom = "0";
      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "delete-task";
      deleteButton.textContent = "Delete";
      deleteButton.setAttribute("aria-label", "Delete task: " + task.text);
      deleteButton.addEventListener("click", () => { tasks = tasks.filter(item => item.id !== task.id); saveTasks(); renderTasks(); });
      li.append(checkbox, label, deleteButton);
      taskList.append(li);
    });
    const remaining = tasks.filter(task => !task.done).length;
    taskCount.textContent = remaining + " remaining";
    emptyState.hidden = tasks.length > 0;
  }
  taskForm.addEventListener("submit", event => {
    event.preventDefault();
    const text = taskInput.value.trim();
    if (!text) return;
    tasks.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2), text, done: false });
    taskInput.value = "";
    saveTasks();
    renderTasks();
    taskInput.focus();
  });
  renderTasks();
}

// Contact form: validate required fields, email format and numeric phone number.
// This is a front-end demonstration: it does not send or save messages.
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  const feedback = document.getElementById("form-feedback");
  const fields = ["name", "email", "phone", "message"];
  function setFieldError(field, message) {
    const input = document.getElementById("contact-" + field);
    const errorText = document.getElementById(field + "-error");
    input.setAttribute("aria-invalid", message ? "true" : "false");
    errorText.textContent = message;
  }
  function validateContact() {
    const values = {};
    let firstInvalid = null;
    fields.forEach(field => {
      values[field] = document.getElementById("contact-" + field).value.trim();
      let message = "";
      if (!values[field]) message = "This field is required.";
      else if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values[field])) {
        message = "Enter a valid email address (e.g. name@example.com).";
      } else if (field === "phone" && !/^\d+$/.test(values[field])) {
        message = "Use digits only, with no spaces or symbols.";
      }
      setFieldError(field, message);
      if (message && !firstInvalid) firstInvalid = document.getElementById("contact-" + field);
    });
    return firstInvalid;
  }
  contactForm.addEventListener("submit", event => {
    event.preventDefault();
    const firstInvalid = validateContact();
    feedback.className = firstInvalid ? "error" : "success";
    feedback.textContent = firstInvalid
      ? "Please correct the highlighted fields and try again."
      : "All fields are valid! This demonstration form does not send messages.";
    if (firstInvalid) firstInvalid.focus();
  });
  // Keep only digits, including when text is pasted or autofilled.
  const phoneInput = document.getElementById("contact-phone");
  phoneInput.addEventListener("input", () => {
    const digits = phoneInput.value.replace(/[^0-9]/g, "");
    if (phoneInput.value !== digits) phoneInput.value = digits;
  });
  fields.forEach(field => {
    document.getElementById("contact-" + field).addEventListener("input", () => {
      if (document.getElementById("contact-" + field).getAttribute("aria-invalid") === "true") {
        validateContact();
      }
      feedback.textContent = "";
      feedback.className = "";
    });
  });
}
