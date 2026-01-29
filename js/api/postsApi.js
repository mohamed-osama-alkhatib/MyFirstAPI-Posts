function getAuthHeaders() {
  const token = getToken();
  return token ? { authorization: `Bearer ${token}` } : {};
}

function fetchPosts(page = 1) {
  return axios.get(`${BASE_URL}posts?limit=5&page=${page}`);
}

function fetchSinglePost(postId) {
  return axios.get(`${BASE_URL}posts/${postId}`);
}

function createPost(formData) {
  const headers = {
    ...getAuthHeaders(),
    "Content-Type": "multipart/form-data",
  };
  return axios.post(`${BASE_URL}posts`, formData, { headers });
}

function updatePost(postId, formData) {
  formData.append("_method", "put");
  const headers = {
    ...getAuthHeaders(),
    "Content-Type": "multipart/form-data",
  };
  return axios.post(`${BASE_URL}posts/${postId}`, formData, { headers });
}

function deletePostApi(postId) {
  return axios.delete(`${BASE_URL}posts/${postId}`, {
    headers: getAuthHeaders(),
  });
}

function addCommentApi(postId, body) {
  return axios.post(
    `${BASE_URL}posts/${postId}/comments`,
    { body },
    { headers: getAuthHeaders() },
  );
}
