import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

let isRefreshing = false;
let failedQueue: { resolve: (token: string | null) => void; reject: (error: unknown) => void }[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_HOST, // Use the API host from environment variables
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to attach token
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise<string | null>((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        if (token && originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        return apiClient(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const response = await axios.post(
                    `${process.env.API_HOST}/auth/refresh-token`,
                    { refreshToken }
                );

                const { accessToken, refreshToken: newRefreshToken } = response.data;
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', newRefreshToken);
                processQueue(null, accessToken);

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                }
                return apiClient(originalRequest);
            } catch (err) {
                processQueue(err, null);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

// Export a named function for Orval mutator compatibility
export function apiClientFunction<T>(config: AxiosRequestConfig) {
    return apiClient<T>(config);
}
