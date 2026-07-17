import { useState } from "react"
import { api } from "../api"

export function useAcademic() {
  const [loading, setLoading] = useState(false)

  // Deaneries
  const getDeaneries = async (): Promise<any> => api.get("academic/deaneries")
  const createDeanery = async (data: any): Promise<any> => api.post("academic/deaneries", data)

  // Careers
  const getCareers = async (deaneryId?: string): Promise<any> => {
    const url = deaneryId ? `academic/careers?deaneryId=${deaneryId}` : "academic/careers"
    return api.get(url)
  }
  const createCareer = async (data: any): Promise<any> => api.post("academic/careers", data)

  // Courses
  const getCourses = async (careerId?: string, semester?: number): Promise<any> => {
    let url = "academic/courses"
    if (careerId || semester) {
      const params = new URLSearchParams()
      if (careerId) params.append("careerId", careerId)
      if (semester) params.append("semester", semester.toString())
      url += `?${params.toString()}`
    }
    return api.get(url)
  }
  const createCourse = async (data: any): Promise<any> => api.post("academic/courses", data)
  const deleteCourse = async (id: string): Promise<any> => api.delete(`academic/courses/${id}`)

  // Sections
  const getSections = async (): Promise<any> => api.get("academic/sections")
  const createSection = async (data: any): Promise<any> => api.post("academic/sections", data)
  const deleteSection = async (id: string): Promise<any> => api.delete(`academic/sections/${id}`)

  // Teachers
  const getTeachers = async (): Promise<any> => api.get("academic/teachers")
  const createTeacher = async (data: any): Promise<any> => api.post("academic/teachers", data)
  const deleteTeacher = async (id: string): Promise<any> => api.delete(`academic/teachers/${id}`)

  // Rooms
  const getRooms = async (): Promise<any> => api.get("academic/rooms")
  const createRoom = async (data: any): Promise<any> => api.post("academic/rooms", data)
  const deleteRoom = async (id: string): Promise<any> => api.delete(`academic/rooms/${id}`)

  // Logs
  const getLogs = async (): Promise<any> => api.get("academic/logs")

  // Users
  const getUsers = async (): Promise<any> => api.get("users")
  const deleteUser = async (id: string): Promise<any> => api.delete(`users/${id}`)

  // Update operations
  const updateDeanery = async (id: string, data: any): Promise<any> => api.put(`academic/deaneries/${id}`, data)
  const updateCareer = async (id: string, data: any): Promise<any> => api.put(`academic/careers/${id}`, data)
  const updateCourse = async (id: string, data: any): Promise<any> => api.put(`academic/courses/${id}`, data)
  const updateTeacher = async (id: string, data: any): Promise<any> => api.put(`academic/teachers/${id}`, data)
  const updateSection = async (id: string, data: any): Promise<any> => api.put(`academic/sections/${id}`, data)
  const updateRoom = async (id: string, data: any): Promise<any> => api.put(`academic/rooms/${id}`, data)

  return {
    getDeaneries, createDeanery, updateDeanery,
    getCareers, createCareer, updateCareer,
    getCourses, createCourse, deleteCourse, updateCourse,
    getSections, createSection, deleteSection, updateSection,
    getTeachers, createTeacher, deleteTeacher, updateTeacher,
    getRooms, createRoom, deleteRoom, updateRoom,
    getLogs, getUsers, deleteUser,
    loading
  }
}
