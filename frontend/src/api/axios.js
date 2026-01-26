import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;
console.log(BASE_URL);

const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true // REQUIRED: Tells Axios to send cookies with requests
});

// MEMORY STORAGE FOR ACCESS TOKEN
let accessToken = null;

export const setAccessToken = (token) => {
    accessToken = token;
};

// QUEUE LOGIC (Prevents multiple refresh calls)
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Request Interceptor (Attaches Token)
axiosPrivate.interceptors.request.use(
    (config) => {
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor (Handles Refresh)
axiosPrivate.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Trigger: 401 Error & We haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            
            if (isRefreshing) {
                // If refresh is already in progress, wait
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token) => {
                            originalRequest.headers['Authorization'] = `Bearer ${token}`;
                            resolve(axiosPrivate(originalRequest));
                        },
                        reject: (err) => { reject(err); }
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Call the backend to get a new token (Cookie is sent automatically)
                const response = await axios.post(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true });
                
                const newAccessToken = response.data.accessToken;
                
                setAccessToken(newAccessToken);
                processQueue(null, newAccessToken);
                
                // Retry the original request
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axiosPrivate(originalRequest);

            } catch (err) {
                processQueue(err, null);
                // Force logout or redirect here
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosPrivate;