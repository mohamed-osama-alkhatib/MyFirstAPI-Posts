function showAlert(message, type = "success") {
  const alertPlaceholder = document.getElementById("success-alert");

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <div class="alert alert-${type} alert-dismissible" role="alert">
      <div>${message}</div>
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;
  alertPlaceholder.append(wrapper);
}
