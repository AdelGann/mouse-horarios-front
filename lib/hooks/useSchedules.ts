import { useState } from "react"
import { api } from "../api"

export function useSchedules() {
  const [loading, setLoading] = useState(false)

  // Terms
  const getTerms = async (): Promise<any> => api.get("schedule/terms")
  const createTerm = async (data: any): Promise<any> => api.post("schedule/terms", data)

  // Load global schedule by section (Admin)
  const loadGlobalSchedule = async (scheduleData: any): Promise<any> => {
    setLoading(true)
    try {
      return await api.post("schedule/global", scheduleData)
    } finally {
      setLoading(false)
    }
  }

  // Get global section schedules for canvas
  const getSectionsSchedules = async (careerId: string, semester?: number): Promise<any> => {
    setLoading(true)
    try {
      let url = `schedule/sections-schedules?careerId=${careerId}`
      if (semester) url += `&semester=${semester}`
      return await api.get(url)
    } finally {
      setLoading(false)
    }
  }

  // Personal schedules (Drafts)
  const getPersonalSchedules = async (): Promise<any> => api.get("schedule/personal")
  const savePersonalSchedule = async (draftData: any): Promise<any> => {
    setLoading(true)
    try {
      return await api.post("schedule/personal", draftData)
    } finally {
      setLoading(false)
    }
  }
  const deletePersonalSchedule = async (id: string): Promise<any> => api.delete(`schedule/personal/${id}`)

  // Get all global schedules (Admin)
  const getGlobalSchedules = async (): Promise<any> => api.get("schedule/global")

  // Delete global schedule (Admin)
  const deleteGlobalSchedule = async (id: string): Promise<any> => api.delete(`schedule/global/${id}`)

  return {
    getTerms, createTerm,
    loadGlobalSchedule, getSectionsSchedules,
    getPersonalSchedules, savePersonalSchedule, deletePersonalSchedule,
    getGlobalSchedules, deleteGlobalSchedule,
    loading
  }
}
