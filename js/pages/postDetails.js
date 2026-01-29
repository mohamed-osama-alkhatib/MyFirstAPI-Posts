const postId = new URLSearchParams(window.location.search).get("postId");

function renderPostDetails(post) {
  const comments = Array.isArray(post.comments) ? post.comments : [];

  // owner name
  const ownerEl = document.getElementById("post-owner");
  if (ownerEl) ownerEl.innerText = post.author?.username || "Unknown";

  // build tags
  let tagsHtml = "";
  if (Array.isArray(post.tags)) {
    for (let tag of post.tags) {
      tagsHtml += `<button class="btn btn-sm rounded-pill bg-secondary text-white me-1">#${tag.name}</button>`;
    }
  }

  // build comments list
  let commentsContent = "";
  if (comments.length) {
    for (let comment of comments) {
      commentsContent += `
        <div class="p-3 mb-2 rounded-4 shadow-sm" style="background-color: #f0f2f5; border: 1px solid #e0e0e0;">
          <div class="d-flex align-items-center mb-2">
            <img src="${comment.author?.profile_image || ""}" class="rounded-circle border" style="width: 35px; height: 35px; object-fit: cover;">
            <b class="ms-2 small text-primary">@${comment.author?.username || "user"}</b>
          </div>
          <div class="ms-1" style="font-size: 0.95rem; line-height: 1.4;">
            ${comment.body}
          </div>
        </div>
      `;
    }
  } else {
    commentsContent = '<p class="text-center text-muted">No comments yet.</p>';
  }

  // full post HTML (includes input with id="add-comment-input")
  const content = `
    <div class="card border-0 rounded-4 overflow-hidden mb-5">
      <div class="card-header bg-white py-3 border-0 d-flex align-items-center">
        <img src="${post.author?.profile_image || ""}" class="rounded-circle border border-2 shadow-sm" style="width: 50px; height: 50px; object-fit: cover;">
        <div class="ms-3">
          <h6 class="mb-0 fw-bold">${post.author?.username || ""}</h6>
          <small class="text-muted">${post.created_at || ""}</small>
        </div>
      </div>

      <div class="card-body p-0">
        <img src="${post.image || ""}" class="w-100" style="max-height: 500px; object-fit: cover;">
        <div class="p-4">
          <h4 class="fw-bold mb-2">${post.title || ""}</h4>
          <p class="text-secondary fs-5">${post.body || ""}</p>
          <hr class="my-4">
          <div class="d-flex align-items-center mb-4 text-muted">
            <i class="bi bi-chat-dots-fill me-2 text-primary"></i>
            <span class="fw-bold">(${post.comments_count || 0}) Comments</span>
            <div class="ms-auto">${tagsHtml}</div>
          </div>

          <div id="comments-list" class="mb-4">${commentsContent}</div>

          <div class="input-group mb-2 shadow-sm rounded-3 overflow-hidden">
            <input id="add-comment-input" type="text" class="form-control border-0 p-3 bg-light" placeholder="Write a comment...">
            <button class="btn btn-primary px-4" type="button" id="btn-add-comment">
              <i class="bi bi-send-fill"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  const postEl = document.getElementById("post");
  if (postEl) postEl.innerHTML = content;

  // attach event after insertion
  const btn = document.getElementById("btn-add-comment");
  if (btn) {
    btn.addEventListener("click", () => addComment());
  }
}

function getPost() {
  toggleLoader(true);

  fetchSinglePost(postId)
    .then((res) => {
      if (res && res.data && res.data.data) {
        renderPostDetails(res.data.data);
      } else {
        console.error("fetchSinglePost: unexpected response", res);
      }
    })
    .catch((err) => {
      console.error("Error fetching post:", err);
      showAlert("Failed to load post", "danger");
    })
    .finally(() => toggleLoader(false));
}

function addComment() {
  const input = document.getElementById("add-comment-input");
  if (!input) {
    showAlert("Comment input not found", "danger");
    return;
  }
  const body = input.value;
  if (!body || !body.trim()) return;

  addCommentApi(postId, body)
    .then(() => {
      input.value = "";
      getPost();
    })
    .catch((err) => {
      console.error("addComment error:", err);
      showAlert(
        err?.response?.data?.message || "Failed to add comment",
        "danger",
      );
    });
}

// initial load
getPost();
