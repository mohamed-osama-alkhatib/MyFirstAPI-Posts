function setupUI() {
  const token = getToken();

  const loginDiv = document.getElementById("login-div");
  const logoutDiv = document.getElementById("logout-div");
  const addPostBtn = document.getElementById("button-addPost");
  const addComment = document.getElementById("addCommentDiv");

  if (!token) {
    logoutDiv?.style.setProperty("display", "flex", "important");
    loginDiv?.style.setProperty("display", "none", "important");
    addPostBtn?.style.setProperty("display", "none", "important");
    addComment && (addComment.style.display = "none");
  } else {
    loginDiv?.style.setProperty("display", "flex", "important");
    logoutDiv?.style.setProperty("display", "none", "important");
    addPostBtn?.style.setProperty("display", "block", "important");
    addComment && (addComment.style.display = "block");

    const user = getCurrentUser();
    document.getElementById("userImg-header").src = user.profile_image;
    document.getElementById("username-header").innerHTML = user.username;
  }
}
