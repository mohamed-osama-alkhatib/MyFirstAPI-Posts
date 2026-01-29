function loginApi(params) {
  return axios.post(`${BASE_URL}login`, params);
}

function registerApi(formData) {
  return axios.post(`${BASE_URL}register`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
