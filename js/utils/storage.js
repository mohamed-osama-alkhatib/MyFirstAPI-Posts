function saveUser(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

function clearUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

function getCurrentUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

function getToken() {
  return localStorage.getItem("token");
}
