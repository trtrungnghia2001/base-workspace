import { authService } from "@/features/auth/data/api";
import { useAuthStore } from "@/features/auth/data/store";
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import ENV from "./env";

// 1. Định nghĩa Type cho hàng đợi
interface FailedRequest {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}

const axiosInstance = axios.create({
  baseURL: ENV.API_URL,
  withCredentials: true,
});

// Biến điều khiển hàng đợi với kiểu dữ liệu cụ thể
let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // 2. Ép kiểu originalRequest để có thuộc tính _retry
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!originalRequest) return Promise.reject(error);

    const responseStatus = error.response?.status;
    const {
      currentAuth,
      setAccessToken,
      logout: logoutStore,
    } = useAuthStore.getState();

    // 1. Nếu không phải lỗi 401 hoặc request này đã từng retry rồi
    if (responseStatus !== 401 || originalRequest._retry) {
      return Promise.reject(error.response?.data ?? error);
    }

    // 2. Tránh refresh khi chưa login hoặc đang ở trang auth/logout
    if (
      !currentAuth ||
      originalRequest.url?.includes("/logout") ||
      originalRequest.url?.includes("/refresh-token")
    ) {
      return Promise.reject(error.response?.data ?? error);
    }

    // 3. Xử lý hàng đợi khi đang có một request refresh khác đang chạy
    if (isRefreshing) {
      return new Promise<string | null>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshResponse = await authService.refreshToken();

      if (
        refreshResponse.statusCode === 200 ||
        refreshResponse.statusCode === 201
      ) {
        const newAccessToken = refreshResponse.data.accessToken;

        setAccessToken(newAccessToken);
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      }

      throw new Error(
        "Refresh token failed with status: " + refreshResponse.statusCode,
      );
    } catch (refreshError) {
      processQueue(refreshError, null);

      // Cố gắng logout ở server để xóa cookie, sau đó xóa store
      await authService.logout().catch(() => {
        /* Ignore error if logout fails */
      });
      logoutStore();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosInstance;
