import { useState } from "react"
import { api } from "../api"

export function useNotices() {
  const [loading, setLoading] = useState(false)

  const getNotices = async (): Promise<any> => {
    setLoading(true)
    try {
      return await api.get("notices")
    } finally {
      setLoading(false)
    }
  }

  const createNotice = async (noticeData: any): Promise<any> => {
    setLoading(true)
    try {
      return await api.post("notices", noticeData)
    } finally {
      setLoading(false)
    }
  }

  const updateNotice = async (id: string, noticeData: any): Promise<any> => {
    setLoading(true)
    try {
      return await api.put(`notices/${id}`, noticeData)
    } finally {
      setLoading(false)
    }
  }

  const deleteNotice = async (id: string): Promise<any> => {
    setLoading(true)
    try {
      return await api.delete(`notices/${id}`)
    } finally {
      setLoading(false)
    }
  }

  return { getNotices, createNotice, updateNotice, deleteNotice, loading }
}
