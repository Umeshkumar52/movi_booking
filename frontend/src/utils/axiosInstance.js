import axios from "axios";

//  for text data send on server
const instance = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// for formData send on server
export const multiInstance = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  headers: {
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

const setupInterceptors = (axiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
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
        url.includes("/auth/me") ||
        url.includes("/auth/signup")
      ) {
        return Promise.reject(error);
      }

      // ✅ Try refresh
      if (error.response.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return axiosInstance(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          await instance.get("/auth/refresh-token", {
            withCredentials: true,
          });
          
          isRefreshing = false;
          processQueue(null);
          
          return axiosInstance(originalRequest); // retry with the SAME instance
        } catch (err) {
          isRefreshing = false;
          processQueue(err);
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    }
  );
};

setupInterceptors(instance);
setupInterceptors(multiInstance);

export default instance;
