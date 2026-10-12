// ===================================================================
// Student Registration Form - validation logic
// Concepts: addEventListener, submit event, event object, preventDefault,
// trim, classList add/remove/toggle, data-* + dataset, attribute change
// ===================================================================

const form = document.getElementById("regForm");
const successBox = document.getElementById("successMessage");

// ---------- Helpers ----------

// Show an error message under a field and highlight it with the .error class
function showError(id, message) {
  const input = document.getElementById(id);
  document.getElementById(id + "-error").textContent = message;
  input.classList.add("error");      // classList.add()
  input.classList.remove("valid");
}

// Clear the error message and highlight when the field is corrected
function clearError(id) {
  const input = document.getElementById(id);
  document.getElementById(id + "-error").textContent = "";
  input.classList.remove("error");   // classList.remove()
}

// Mark a field as valid (green border)
function markValid(id) {
  clearError(id);
  document.getElementById(id).classList.add("valid");
}

// ---------- Individual validators (each returns true when valid) ----------

function validateStudentId() {
  const el = document.getElementById("studentId");
  const value = el.value.trim();                 // trim() removes extra spaces
  el.value = value;
  if (value === "") return showError("studentId", "Student ID is required."), false;
  if (!/^\d{4}-\d{5}$/.test(value))
    return showError("studentId", "Student ID must follow the format " + el.dataset.hint.replace("Format: ", "") + "."), false;
  markValid("studentId");
  return true;
}

function validateFullName() {
  const el = document.getElementById("fullName");
  const value = el.value.trim().replace(/\s+/g, " ");
  el.value = value;
  if (value === "") return showError("fullName", "Full name is required."), false;
  if (!/^[A-Za-z][A-Za-z.'\- ]+$/.test(value) || value.split(" ").length < 2)
    return showError("fullName", "Enter your first and last name using letters only."), false;
  markValid("fullName");
  return true;
}

function validateEmail() {
  const el = document.getElementById("email");
  const value = el.value.trim();
  el.value = value;
  if (value === "") return showError("email", "Email is required."), false;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value))
    return showError("email", "Enter a valid email address (e.g. name@school.edu)."), false;
  markValid("email");
  return true;
}

function validatePhone() {
  const el = document.getElementById("phone");
  const value = el.value.trim();
  el.value = value;
  if (value === "") return showError("phone", "Phone number is required."), false;
  if (!/^09\d{2}-\d{3}-\d{4}$/.test(value))
    return showError("phone", "Phone must follow " + el.dataset.hint.replace("Format: ", "") + " (e.g. 0912-345-6789)."), false;
  markValid("phone");
  return true;
}

function validateDob() {
  const el = document.getElementById("dob");
  if (el.value === "") return showError("dob", "Date of birth is required."), false;
  const dob = new Date(el.value);
  const today = new Date();
  if (dob >= today) return showError("dob", "Date of birth must be in the past."), false;
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  if (age < 15) return showError("dob", "You must be at least 15 years old to register."), false;
  markValid("dob");
  return true;
}

function validateGender() {
  const group = document.getElementById("gender");
  const chosen = form.querySelector('input[name="gender"]:checked');
  if (!chosen) {
    document.getElementById("gender-error").textContent = "Please select a gender.";
    group.classList.add("error");
    return false;
  }
  document.getElementById("gender-error").textContent = "";
  group.classList.remove("error");
  return true;
}

function validateSelect(id, message) {
  const el = document.getElementById(id);
  if (el.value === "") return showError(id, message), false;
  markValid(id);
  return true;
}

function validatePassword() {
  const el = document.getElementById("password");
  const value = el.value.trim();
  if (value === "") return showError("password", "Password is required."), false;
  if (value.length < 8) return showError("password", "Password must be at least 8 characters."), false;
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value))
    return showError("password", "Password must contain at least one letter and one number."), false;
  markValid("password");
  return true;
}

function validateConfirmPassword() {
  const pw = document.getElementById("password").value.trim();
  const confirm = document.getElementById("confirmPassword").value.trim();
  if (confirm === "") return showError("confirmPassword", "Please confirm your password."), false;
  if (pw !== confirm) return showError("confirmPassword", "Passwords do not match."), false;
  markValid("confirmPassword");
  return true;
}

function validateAddress() {
  const el = document.getElementById("address");
  const value = el.value.trim();
  el.value = value;
  if (value === "") return showError("address", "Address is required."), false;
  if (value.length < 10) return showError("address", "Address is too short. Please enter your complete address."), false;
  markValid("address");
  return true;
}

function validateAgree() {
  const el = document.getElementById("agree");
  if (!el.checked) {
    document.getElementById("agree-error").textContent = "You must agree before submitting.";
    return false;
  }
  document.getElementById("agree-error").textContent = "";
  return true;
}

// ---------- Form submission ----------
form.addEventListener("submit", function (event) {
  event.preventDefault();               // stop the page from reloading / submitting
  successBox.classList.add("hidden");

  // Run every validator (no short-circuit so ALL errors show at once)
  const results = [
    validateStudentId(),
    validateFullName(),
    validateEmail(),
    validatePhone(),
    validateDob(),
    validateGender(),
    validateSelect("program", "Please select a program."),
    validateSelect("year", "Please select a year level."),
    validatePassword(),
    validateConfirmPassword(),
    validateAddress(),
    validateAgree()
  ];

  if (results.every(Boolean)) {
    const name = document.getElementById("fullName").value;
    successBox.textContent = "Registration successful! Welcome, " + name + ".";
    successBox.classList.remove("hidden");
    // Remove validation styling after success
    form.querySelectorAll(".error, .valid").forEach(el => el.classList.remove("error", "valid"));
    successBox.scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    // Focus the first invalid field to help the user
    const firstBad = form.querySelector("input.error, select.error, textarea.error");
    if (firstBad) firstBad.focus();
  }
});

// ---------- Live feedback: clear/revalidate a field as soon as it is corrected ----------
const liveValidators = {
  studentId: validateStudentId, fullName: validateFullName, email: validateEmail,
  phone: validatePhone, dob: validateDob, password: validatePassword,
  confirmPassword: validateConfirmPassword, address: validateAddress,
  program: () => validateSelect("program", "Please select a program."),
  year: () => validateSelect("year", "Please select a year level.")
};

form.addEventListener("input", function (event) {
  const id = event.target.id;           // event object tells us which field changed
  if (id === "address") {
    document.getElementById("addressCount").textContent = event.target.value.length + " / 150";
  }
  if (event.target.classList.contains("error") && liveValidators[id]) liveValidators[id]();
  if (id === "password" && document.getElementById("confirmPassword").classList.contains("error"))
    validateConfirmPassword();
  if (event.target.name === "gender") validateGender();
  if (id === "agree") validateAgree();
});

form.addEventListener("change", function (event) {
  const id = event.target.id;
  if (liveValidators[id] && event.target.tagName === "SELECT") liveValidators[id]();
});

// ---------- Show / Hide password ----------
// Uses classList.toggle() for the button style AND changes the input's "type" attribute.
// The button's data-target (read via dataset) says which input to control.
document.querySelectorAll(".toggle-pw").forEach(function (btn) {
  btn.addEventListener("click", function (event) {
    const input = document.getElementById(event.currentTarget.dataset.target);
    const showing = btn.classList.toggle("active");           // classList.toggle()
    input.setAttribute("type", showing ? "text" : "password"); // attribute manipulation
    btn.textContent = showing ? "Hide" : "Show";
  });
});

// ---------- Phone auto-format: 09XXXXXXXXX -> 09XX-XXX-XXXX ----------
document.getElementById("phone").addEventListener("input", function (event) {
  const digits = event.target.value.replace(/\D/g, "").slice(0, 11);
  let out = digits;
  if (digits.length > 7) out = digits.slice(0, 4) + "-" + digits.slice(4, 7) + "-" + digits.slice(7);
  else if (digits.length > 4) out = digits.slice(0, 4) + "-" + digits.slice(4);
  event.target.value = out;
});

// ---------- Date of birth cannot be in the future (max attribute set dynamically) ----------
document.getElementById("dob").setAttribute("max", new Date().toISOString().split("T")[0]);

// ---------- Reset ----------
form.addEventListener("reset", function () {
  successBox.classList.add("hidden");
  successBox.textContent = "";
  form.querySelectorAll(".error, .valid").forEach(el => el.classList.remove("error", "valid"));
  form.querySelectorAll(".error-msg").forEach(el => (el.textContent = ""));
  // Return password fields and toggle buttons to their original state
  form.querySelectorAll(".toggle-pw").forEach(function (btn) {
    btn.classList.remove("active");
    btn.textContent = "Show";
    document.getElementById(btn.dataset.target).setAttribute("type", "password");
  });
  document.getElementById("addressCount").textContent = "0 / 150";
});