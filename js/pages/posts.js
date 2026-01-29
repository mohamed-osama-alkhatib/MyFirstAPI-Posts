let currentPage = 1;
let lastPage = 1;

//----------------------------------//
//            Get Posts              //
//----------------------------------//
function getPosts(reload = true, page = 1) {
  toggleLoader(true);

  fetchPosts(page)
    .then((res) => {
      const posts = res.data.data;
      lastPage = res.data.meta.last_page;

      if (reload) {
        document.getElementById("posts").innerHTML = "";
      }

      posts.forEach(renderPost);
    })
    .catch((err) => console.error(err))
    .finally(() => toggleLoader(false));
}

//----------------------------------//
//          Render Post               //
//----------------------------------//
function renderPost(onePost) {
  const user = getCurrentUser();
  const isMyPost = user && user.id === onePost.author.id;

  let editBtnContent = "";
  if (isMyPost) {
    editBtnContent = `
      <div class="ms-auto">
        <button class="btn btn-outline-secondary btn-sm rounded-pill px-3"
          onclick="editPost('${encodeURIComponent(JSON.stringify(onePost))}')">
          Edit
        </button>
        <button class="btn btn-outline-danger btn-sm rounded-pill px-3"
          onclick="deletePost('${encodeURIComponent(JSON.stringify(onePost))}')">
          Delete
        </button>
      </div>
    `;
  }

  let content = `
    <div class="card shadow-sm mb-4 border-0 rounded-4 overflow-hidden">
      <div class="card-header bg-white d-flex align-items-center py-3 border-0">
        <div onclick="showProfileUser(${onePost.author.id})"
             style="cursor:pointer"
             class="d-flex align-items-center">
          <img src="${onePost.author.profile_image}"
               class="rounded-circle border border-2 shadow-sm"
               style="width:45px;height:45px;object-fit:cover;">
          <div class="ms-2">
            <b class="d-block">@${onePost.author.username}</b>
            <small class="text-muted">${onePost.created_at}</small>
          </div>
        </div>
        ${editBtnContent}
      </div>

      <div class="card-body p-0"
           onclick="postClick(${onePost.id})"
           style="cursor:pointer">
        <img src="${onePost.image}"
             class="w-100"
             style="max-height:450px;object-fit:cover;">

        <div class="p-3">
          <h5 class="fw-bold mb-1">${onePost.title || ""}</h5>
          <p class="text-secondary small mb-3">${onePost.body}</p>
          <hr class="my-2">
          <div class="d-flex align-items-center text-primary">
            <i class="bi bi-chat-left-text-fill me-2"></i>
            <span class="fw-bold small">
              (${onePost.comments_count}) Comments
            </span>
            <div id="post-tags-${onePost.id}" class="ms-auto"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById("posts").innerHTML += content;

  // Tags
  const tagsContainer = document.getElementById(`post-tags-${onePost.id}`);
  tagsContainer.innerHTML = "";
  onePost.tags.forEach((tag) => {
    tagsContainer.innerHTML += `
      <span class="badge rounded-pill bg-light text-dark border ms-1">
        #${tag.name}
      </span>
    `;
  });
}

//----------------------------------//
//           Pagination               //
//----------------------------------//
window.addEventListener("scroll", () => {
  const endOfPage =
    window.innerHeight + window.pageYOffset >= document.body.scrollHeight;

  if (endOfPage && currentPage < lastPage) {
    currentPage++;
    getPosts(false, currentPage);
  }
});

//----------------------------------//
//           Navigation               //
//----------------------------------//
function postClick(id) {
  window.location = `postDetails.html?postId=${id}`;
}

function showProfileUser(id) {
  window.location = `profile.html?userid=${id}`;
}

function showMyProfile() {
  const user = getCurrentUser();
  if (user) {
    window.location = `profile.html?userid=${user.id}`;
  }
}

//----------------------------------//
//        Add / Edit / Delete Post   //
//----------------------------------//
function addPost() {
  document
    .getElementById("createPostModal")
    .querySelector("#titlePostModal").innerText = "Add A New Post";
  document.getElementById("addPost-btn").innerText = "Add";
  document.getElementById("post-id-input").value = "";
  document.getElementById("title-post").value = "";
  document.getElementById("discription-post").value = "";
  document.getElementById("img-post").value = "";
  new bootstrap.Modal(document.getElementById("createPostModal")).show();
}

function editPost(postEncoded) {
  const post = JSON.parse(decodeURIComponent(postEncoded));

  document
    .getElementById("createPostModal")
    .querySelector("#titlePostModal").innerText = "Edit Post";
  document.getElementById("addPost-btn").innerText = "Update";

  document.getElementById("post-id-input").value = post.id;
  document.getElementById("title-post").value = post.title || "";
  document.getElementById("discription-post").value = post.body || "";
  document.getElementById("img-post").value = "";
  new bootstrap.Modal(document.getElementById("createPostModal")).show();
}

function postMethod() {
  const postId = document.getElementById("post-id-input").value;
  const title = document.getElementById("title-post").value;
  const body = document.getElementById("discription-post").value;
  const image = document.getElementById("img-post").files[0];

  const formData = new FormData();
  formData.append("title", title);
  formData.append("body", body);
  if (image) formData.append("image", image);

  const action = postId ? updatePost(postId, formData) : createPost(formData);

  toggleLoader(true);
  action
    .then(() => {
      getPosts();
      bootstrap.Modal.getInstance(
        document.getElementById("createPostModal"),
      ).hide();
      showAlert(
        postId ? "Post updated successfully" : "Post added successfully",
        "success",
      );
    })
    .catch((err) => {
      console.error(err);
      showAlert(
        err?.response?.data?.message || "Failed to save post",
        "danger",
      );
    })
    .finally(() => toggleLoader(false));
}

function deletePost(postEncoded) {
  const post = JSON.parse(decodeURIComponent(postEncoded));
  document.getElementById("delete-post-id-input").value = post.id;
  new bootstrap.Modal(document.getElementById("deletePostModal")).show();
}

function confirmPostDelete() {
  const postId = document.getElementById("delete-post-id-input").value;
  if (!postId) return;

  toggleLoader(true);
  deletePostApi(postId)
    .then(() => {
      getPosts();
      bootstrap.Modal.getInstance(
        document.getElementById("deletePostModal"),
      ).hide();
      showAlert("Post deleted successfully", "success");
    })
    .catch((err) => {
      console.error(err);
      showAlert(
        err?.response?.data?.message || "Failed to delete post",
        "danger",
      );
    })
    .finally(() => toggleLoader(false));
}

//----------------------------------//
//            Init                    //
//----------------------------------//
getPosts();
