import axios from 'axios';

const api = axios.create({
  baseURL: "https://aurelia-ai-blog-summarizer.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('aurelia_user');

  if (stored) {
    const { token } = JSON.parse(stored);
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    return Promise.reject(err);
  }
);

export default api;