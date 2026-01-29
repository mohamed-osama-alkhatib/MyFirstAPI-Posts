function getUserIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("userid");
  return id;
}

function resolveProfileUserId() {
  const urlId = getUserIdFromUrl();
  if (urlId) return urlId;

  const current = getCurrentUser ? getCurrentUser() : null;
  return current ? current.id : null;
}

const idUser = resolveProfileUserId();

function toggleLoader(show = true) {
  const loader = document.getElementById("loader");
  if (!loader) return;
  loader.style.visibility = show ? "visible" : "hidden";
}

function getProfileUser() {
  if (!idUser) {
    showAlert("User ID not found", "danger");
    return;
  }

  const userUrl = `${BASE_URL}users/${idUser}`;
  toggleLoader(true);
  axios
    .get(userUrl)
    .then((response) => {
      const user = response?.data?.data;
      if (!user) {
        showAlert("User not found", "danger");
        return;
      }

      const userInfo = `
        <div class="row align-items-center p-3">
          <div class="col-12 col-md-3 d-flex justify-content-center justify-content-md-start mb-3 mb-md-0">
            <div class="position-relative">
              <img src="${user.profile_image || ""}" class="rounded-circle shadow-sm border border-4 border-white" 
                   style="width: 140px; height: 140px; object-fit: cover;">
            </div>
          </div>

          <div class="col-12 col-md-5 text-center text-md-start">
            <h2 class="fw-bold text-dark mb-1" style="letter-spacing: -0.5px;">${user.name || ""}</h2>
            <p class="text-primary fw-600 mb-3" style="font-size: 1.1rem; opacity: 0.8;">@${user.username || ""}</p>
            <div class="d-flex align-items-center justify-content-center justify-content-md-start text-secondary">
              <div class="bg-light rounded-pill px-3 py-1 border">
                <i class="bi bi-envelope-fill me-2 text-primary"></i>
                <span class="small fw-bold">${user.email || ""}</span>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-4 mt-4 mt-md-0">
            <div class="d-flex justify-content-center justify-content-md-end gap-3">
              <div class="stat-card bg-white shadow-sm border rounded-3 p-3 text-center" style="min-width: 100px;">
                <h4 class="fw-black text-dark mb-0">${user.posts_count || 0}</h4>
                <small class="text-muted text-uppercase fw-bold" style="font-size: 0.7rem; letter-spacing: 1px;">Posts</small>
              </div>
              <div class="stat-card bg-white shadow-sm border rounded-3 p-3 text-center" style="min-width: 100px;">
                <h4 class="fw-black text-dark mb-0">${user.comments_count || 0}</h4>
                <small class="text-muted text-uppercase fw-bold" style="font-size: 0.7rem; letter-spacing: 1px;">Comments</small>
              </div>
            </div>
          </div>
        </div>
      `;

      const headerEl = document.getElementById("profile-header");
      if (headerEl) headerEl.innerHTML = userInfo;

      const titleUsernameEl = document.getElementById(
        "profile-body-title-username",
      );
      if (titleUsernameEl) titleUsernameEl.innerText = user.username || "";
    })
    .catch((error) => {
      console.error("Profile Error:", error);
      showAlert("Failed to load profile", "danger");
    })
    .finally(() => toggleLoader(false));
}

function getUserPosts() {
  if (!idUser) {
    console.warn("User id is not present");
    return;
  }

  const userOfPostsUrl = `${BASE_URL}users/${idUser}/posts`;
  toggleLoader(true);
  axios
    .get(userOfPostsUrl)
    .then((response) => {
      const posts = response?.data?.data || [];
      const postsContainer = document.getElementById("user-posts");
      if (!postsContainer) return;
      postsContainer.innerHTML = "";

      for (let post of posts) {
        let tagsHtml = "";
        if (Array.isArray(post.tags)) {
          for (let tag of post.tags) {
            tagsHtml += `<span class="badge rounded-pill bg-light text-dark border me-1">#${tag.name}</span>`;
          }
        }

        let content = `
          <div class="col-12 col-md-6 col-lg-4">
            <div class="card h-100 shadow-sm border-0 post-card" style="cursor: pointer" onclick="postClicked(${post.id})">
              <div class="user-post-img-container">
                <img src="${post.image || ""}" class="card-img-top" alt="post">
              </div>
              <div class="card-body">
                <small class="text-muted">${post.created_at || ""}</small>
                <h6 class="card-title fw-bold mt-2 text-truncate">${post.title || "No Title"}</h6>
                <p class="card-text text-secondary small text-truncate">${post.body || ""}</p>
                <hr class="my-2">
                <div class="d-flex align-items-center justify-content-between">
                  <div class="small">
                    <i class="bi bi-chat-dots me-1"></i>
                    <span>${post.comments_count || 0} Comments</span>
                  </div>
                  <div class="tags-div">${tagsHtml}</div>
                </div>
              </div>
            </div>
          </div>`;
        postsContainer.innerHTML += content;
      }
    })
    .catch((error) => {
      console.error("Posts Error:", error);
      showAlert("Failed to load user posts", "danger");
    })
    .finally(() => toggleLoader(false));
}

function postClicked(postId) {
  if (!postId) return;
  window.location = `postDetails.html?postId=${postId}`;
}

getProfileUser();
getUserPosts();
