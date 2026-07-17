import { useState } from "react"
import { api } from "../api"

export function useAuth() {
  const [loading, setLoading] = useState(false)

  const login = async (credentials: any): Promise<any> => {
    setLoading(true)
    try {
      return await api.post("auth/login", credentials)
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: any): Promise<any> => {
    setLoading(true)
    try {
      return await api.post("auth/register", userData)
    } finally {
      setLoading(false)
    }
  }

  const getProfile = async (): Promise<any> => {
    setLoading(true)
    try {
      return await api.get("auth/profile")
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (profileData: any): Promise<any> => {
    setLoading(true)
    try {
      return await api.put("users/profile", profileData)
    } finally {
      setLoading(false)
    }
  }

  const uploadPhoto = async (formData: FormData): Promise<any> => {
    setLoading(true)
    try {
      return await api.post("users/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
    } finally {
      setLoading(false)
    }
  }

  return { login, register, getProfile, updateProfile, uploadPhoto, loading }
}
