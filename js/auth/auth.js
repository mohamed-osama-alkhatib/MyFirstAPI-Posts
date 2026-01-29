function loginBtn() {
  const username = document.getElementById("user-username").value;
  const password = document.getElementById("user-password").value;

  loginApi({ username, password }).then((res) => {
    saveUser(res.data.token, res.data.user);
    bootstrap.Modal.getInstance(document.getElementById("loginModal")).hide();

    showAlert("You logged in successfully");
    setupUI();
  });
}

function registerBtn() {
  const email = document.getElementById("email-user");
  const name = document.getElementById("name-user");
  const username = document.getElementById("username-user");
  const password = document.getElementById("password-user");
  const image = document.getElementById("imgProfile-post").files[0];

  const formData = new FormData();
  formData.append("email", email.value);
  formData.append("name", name.value);
  formData.append("username", username.value);
  formData.append("password", password.value);
  formData.append("image", image);

  registerApi(formData)
    .then((res) => {
      saveUser(res.data.token, res.data.user);

      bootstrap.Modal.getInstance(
        document.getElementById("registerModal"),
      ).hide();

      showAlert("Successfully registered", "success");
      setupUI();
    })
    .catch((err) => {
      showAlert(err.response.data.message, "danger");
    });
}

function logoutBtn() {
  clearUser();
  setupUI();
  showAlert("You logged out successfully");
}
