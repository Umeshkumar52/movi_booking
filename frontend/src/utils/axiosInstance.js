import axios from "axios";

//  for text data send on server
const instance = axios.create({
  baseURL: " http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// for formData send on server
export const multiInstance = axios.create({
  baseURL: " http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "multipart/form-data",
  },
  withCredentials: true,
});

// refresh and access token handling after token expire
// *****************************************************
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    const url = originalRequest.url;

    // ❌ Never refresh for auth APIs
    if (
      url.includes("/auth/login") ||
      url.includes("/auth/logout") ||
      url.includes("/auth/refresh-token") ||
      url.includes("/auth/me")
    ) {
      return Promise.reject(error);
    }

    // ✅ Try refresh only once
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await instance.get("/auth/refresh-token", {
          withCredentials: true,
        });

        return instance(originalRequest); // retry
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// Multiple form data


multiInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response.status === 401) {
      const { data } = await axios.get(
        "http://localhost:5000/api/v1/auth/refresh-token",
        {
          withCredentials: true,
        },
      );
      setAccessToken(data.accessToken);
      error.config.headers.Authorization = `Bearer ${data.accessToken}`;
      return axios(error.config);
    }
    return Promise.reject(error);
  },
);

export default instance;
