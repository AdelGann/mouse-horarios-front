import axios from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

// Create axios instance
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request Interceptor: Auto-inject JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const session = localStorage.getItem("user_session")
      if (session) {
        try {
          const parsed = JSON.parse(session)
          if (parsed.access_token) {
            config.headers["Authorization"] = `Bearer ${parsed.access_token}`
          }
        } catch (_) {}
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor: Auto-redirect to login on 401 and extract response data
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("user_session")
        if (
          window.location.pathname !== "/login" &&
          window.location.pathname !== "/register" &&
          window.location.pathname !== "/"
        ) {
          window.location.href = "/login"
        }
      }
    }
    
    const message = error.response?.data?.message || error.message || "Algo salió mal"
    return Promise.reject(new Error(message))
  }
)
