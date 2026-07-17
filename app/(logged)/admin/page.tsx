"use client"

import * as React from "react"
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Calendar, 
  BookOpen, 
  Users, 
  History, 
  MapPin, 
  UserSquare2, 
  FolderPlus, 
  Clock, 
  Save, 
  Loader2,
  Bell,
  GraduationCap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Select } from "@/components/ui/select"
import { useAcademic } from "@/lib/hooks/useAcademic"
import { useSchedules } from "@/lib/hooks/useSchedules"
import { useNotices } from "@/lib/hooks/useNotices"
import { AdminCrudTable } from "@/components/custom/admin-crud-table"
import { toast } from "react-hot-toast"

// ─── GlobalScheduleEditForm ───────────────────────────────────────────────────
// Extracted as a proper component so hooks are called at the top level (React rules of hooks)
interface GlobalScheduleEditFormProps {
  item: any
  terms: any[]
  sections: any[]
  careers: any[]
  courses: any[]
  teachers: any[]
  rooms: any[]
  onSave: (payload: any) => Promise<void>
  onClose: () => void
}

function GlobalScheduleEditForm({
  item, terms, sections, careers, courses, teachers, rooms, onSave, onClose
}: GlobalScheduleEditFormProps) {
  const [editTermId, setEditTermId] = React.useState(item.term?.id || "")
  const [editSectionId, setEditSectionId] = React.useState(item.section?.id || "")
  const [editSemester, setEditSemester] = React.useState(String(item.semester || "1"))
  const [editCareerId, setEditCareerId] = React.useState(
    item.subjects?.[0]?.course?.career?.id || careers[0]?.id || ""
  )
  const [editSubjects, setEditSubjects] = React.useState<any[]>(
    item.subjects?.length > 0
      ? item.subjects.map((sub: any) => ({
          courseId: sub.course?.id || "",
          teacherId: sub.teacher?.id || "",
          slots: sub.slots?.map((slot: any) => ({
            dayOfWeek: slot.dayOfWeek,
            startTime: slot.startTime,
            endTime: slot.endTime,
            roomId: slot.room?.id || ""
          })) || [{ dayOfWeek: 1, startTime: "08:00", endTime: "08:45", roomId: "" }]
        }))
      : [{ courseId: "", teacherId: "", slots: [{ dayOfWeek: 1, startTime: "08:00", endTime: "08:45", roomId: "" }] }]
  )
  const [saving, setSaving] = React.useState(false)

  const filteredCourses = courses.filter(
    (c: any) => c.careerId === editCareerId && c.semester === parseInt(editSemester)
  )

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const invalid = editSubjects.some(s => !s.courseId || s.slots.some((sl: any) => !sl.startTime || !sl.endTime || !sl.roomId))
    if (invalid) {
      toast.error("Por favor selecciona un salón para cada bloque de hora.")
      return
    }
    setSaving(true)
    try {
      await onSave({
        id: item.id,
        termId: editTermId,
        sectionId: editSectionId,
        semester: parseInt(editSemester),
        subjects: editSubjects
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  const updateSubject = (si: number, field: string, val: any) =>
    setEditSubjects(prev => prev.map((s, i) => i === si ? { ...s, [field]: val } : s))

  const updateSlot = (si: number, slIdx: number, field: string, val: any) =>
    setEditSubjects(prev => prev.map((s, i) => i === si
      ? { ...s, slots: s.slots.map((sl: any, j: number) => j === slIdx ? { ...sl, [field]: val } : sl) }
      : s))

  return (
    <form onSubmit={handleSave} className="space-y-4 font-sans max-h-[65vh] overflow-y-auto pr-1">
      {/* Header fields */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="gs-term">Lapso Académico</Label>
          <Select id="gs-term" value={editTermId} onChange={e => setEditTermId(e.target.value)}>
            <option value="">-- Selecciona Lapso --</option>
            {terms.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="gs-sec">Sección</Label>
          <Select id="gs-sec" value={editSectionId} onChange={e => setEditSectionId(e.target.value)}>
            <option value="">-- Selecciona Sección --</option>
            {sections.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="gs-career">Carrera</Label>
          <Select id="gs-career" value={editCareerId} onChange={e => setEditCareerId(e.target.value)}>
            {careers.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="gs-sem">Semestre</Label>
          <Select id="gs-sem" value={editSemester} onChange={e => setEditSemester(e.target.value)}>
            {Array.from({ length: 10 }, (_, i) => i + 1).map(s => (
              <option key={s} value={s}>Semestre {s}</option>
            ))}
          </Select>
        </div>
      </div>

      {/* Subjects list */}
      <div className="border-t border-border/60 pt-3 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Materias</span>
          <Button type="button" variant="outline" size="xs" className="gap-1 cursor-pointer"
            onClick={() => setEditSubjects(prev => [...prev, {
              courseId: "", teacherId: "",
              slots: [{ dayOfWeek: 1, startTime: "08:00", endTime: "08:45", roomId: "" }]
            }])}>
            <Plus className="size-3" /> Agregar
          </Button>
        </div>

        {editSubjects.map((sub, si) => (
          <div key={si} className="p-3 border border-border/50 rounded-lg bg-muted/5 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <Label className="text-[10px]">Materia</Label>
                <Select value={sub.courseId} onChange={e => updateSubject(si, "courseId", e.target.value)}>
                  <option value="">-- Selecciona --</option>
                  {filteredCourses.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>
              </div>
              <div className="flex items-end gap-1">
                <div className="flex-1 flex flex-col gap-1">
                  <Label className="text-[10px]">Profesor</Label>
                  <Select value={sub.teacherId} onChange={e => updateSubject(si, "teacherId", e.target.value)}>
                    <option value="">Sin Profesor</option>
                    {teachers.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </Select>
                </div>
                <Button type="button" variant="ghost" size="icon-xs"
                  disabled={editSubjects.length === 1}
                  className="text-destructive hover:bg-destructive/10 cursor-pointer mb-0.5"
                  onClick={() => setEditSubjects(prev => prev.filter((_, i) => i !== si))}>
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>

            {/* Slots */}
            {sub.slots.map((slot: any, slIdx: number) => (
              <div key={slIdx} className="grid grid-cols-12 gap-1.5 items-center pl-2 border-l-2 border-primary/20">
                <div className="col-span-3">
                  <Select value={slot.dayOfWeek} onChange={e => updateSlot(si, slIdx, "dayOfWeek", parseInt(e.target.value))}>
                    <option value={1}>Lunes</option>
                    <option value={2}>Martes</option>
                    <option value={3}>Miércoles</option>
                    <option value={4}>Jueves</option>
                    <option value={5}>Viernes</option>
                    <option value={6}>Sábado</option>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Input type="time" value={slot.startTime} className="h-7 text-[10px]"
                    onChange={e => updateSlot(si, slIdx, "startTime", e.target.value)} />
                </div>
                <span className="col-span-1 text-center text-[10px] text-muted-foreground">a</span>
                <div className="col-span-2">
                  <Input type="time" value={slot.endTime} className="h-7 text-[10px]"
                    onChange={e => updateSlot(si, slIdx, "endTime", e.target.value)} />
                </div>
                <div className="col-span-3">
                  <Select value={slot.roomId} onChange={e => updateSlot(si, slIdx, "roomId", e.target.value)}>
                    <option value="">Sin Aula</option>
                    {rooms.map((r: any) => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </Select>
                </div>
                <div className="col-span-1 flex justify-end">
                  <Button type="button" variant="ghost" size="icon-xs"
                    disabled={sub.slots.length === 1}
                    className="text-destructive hover:bg-destructive/10 cursor-pointer"
                    onClick={() => setEditSubjects(prev => prev.map((s, i) => i === si
                      ? { ...s, slots: s.slots.filter((_: any, j: number) => j !== slIdx) }
                      : s))}>
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </div>
            ))}
            <Button type="button" variant="ghost" size="xs" className="text-[10px] h-6 px-2 cursor-pointer"
              onClick={() => setEditSubjects(prev => prev.map((s, i) => i === si
                ? { ...s, slots: [...s.slots, { dayOfWeek: 1, startTime: "08:00", endTime: "08:45", roomId: "" }] }
                : s))}>
              + Bloque de hora
            </Button>
          </div>
        ))}
      </div>

      <Button type="submit" className="w-full cursor-pointer mt-2" disabled={saving}>
        {saving ? <Loader2 className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />}
        Guardar Cambios
      </Button>
    </form>
  )
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = React.useState("horarios")
  
  // Custom hooks
  const { 
    getDeaneries, createDeanery, updateDeanery,
    getCareers, createCareer, updateCareer,
    getCourses, createCourse, deleteCourse, updateCourse,
    getSections, createSection, deleteSection, updateSection,
    getTeachers, createTeacher, deleteTeacher, updateTeacher,
    getRooms, createRoom, deleteRoom, updateRoom,
    getLogs, getUsers, deleteUser
  } = useAcademic()

  const { getTerms, createTerm, loadGlobalSchedule, getGlobalSchedules, deleteGlobalSchedule } = useSchedules()
  const { getNotices, createNotice, updateNotice, deleteNotice } = useNotices()

  // Data lists
  const [deaneries, setDeaneries] = React.useState<any[]>([])
  const [careers, setCareers] = React.useState<any[]>([])
  const [courses, setCourses] = React.useState<any[]>([])
  const [teachers, setTeachers] = React.useState<any[]>([])
  const [sections, setSections] = React.useState<any[]>([])
  const [rooms, setRooms] = React.useState<any[]>([])
  const [logs, setLogs] = React.useState<any[]>([])
  const [users, setUsers] = React.useState<any[]>([])
  const [terms, setTerms] = React.useState<any[]>([])
  const [notices, setNotices] = React.useState<any[]>([])
  const [globalSchedules, setGlobalSchedules] = React.useState<any[]>([])

  // Loading states
  const [loading, setLoading] = React.useState(false)

  // Forms state
  const [newDeanery, setNewDeanery] = React.useState("")
  const [newCareer, setNewCareer] = React.useState({ name: "", deaneryId: "" })
  const [newCourse, setNewCourse] = React.useState({ name: "", semester: "1", careerId: "" })
  const [newTeacher, setNewTeacher] = React.useState("")
  const [newSection, setNewSection] = React.useState("")
  const [newRoom, setNewRoom] = React.useState({ name: "", capacity: "" })
  const [newNotice, setNewNotice] = React.useState({ title: "", content: "" })

  // Schedule Builder state
  const [schedTermId, setSchedTermId] = React.useState("")
  const [schedSectionId, setSchedSectionId] = React.useState("")
  const [schedCareerId, setSchedCareerId] = React.useState("")
  const [schedSemester, setSchedSemester] = React.useState("1")
  const [schedSubjects, setSchedSubjects] = React.useState<any[]>([
    { courseId: "", teacherId: "", slots: [{ dayOfWeek: 1, startTime: "08:00", endTime: "08:45", roomId: "" }] }
  ])

  // Fetch initial setup
  const fetchData = async () => {
    try {
      const ds = await getDeaneries()
      setDeaneries(ds)

      const cs = await getCareers()
      setCareers(cs)
      if (cs.length > 0) {
        setNewCareer(prev => ({ ...prev, deaneryId: ds[0]?.id || "" }))
        setNewCourse(prev => ({ ...prev, careerId: cs[0]?.id || "" }))
        setSchedCareerId(cs[0]?.id || "")
      }

      const crs = await getCourses()
      setCourses(crs)

      const ts = await getTeachers()
      setTeachers(ts)

      const secs = await getSections()
      setSections(secs)
      if (secs.length > 0) setSchedSectionId(secs[0].id)

      const rms = await getRooms()
      setRooms(rms)
      if (rms.length > 0) {
        setSchedSubjects(prev => prev.map(s => ({
          ...s,
          slots: s.slots.map(sl => ({ ...sl, roomId: sl.roomId || rms[0].id }))
        })))
      }

      const tms = await getTerms()
      setTerms(tms)
      if (tms.length > 0) setSchedTermId(tms[0].id)

      const us = await getUsers()
      setUsers(us)

      const lg = await getLogs()
      setLogs(lg)

      const nts = await getNotices()
      setNotices(nts)

      const gs = await getGlobalSchedules()
      setGlobalSchedules(gs)
    } catch (e: any) {
      console.error("Failed to load admin data:", e)
    }
  }

  React.useEffect(() => {
    fetchData()
    
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "")
      if (hash) setActiveTab(hash)
    }
    
    handleHashChange()
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  // --- CRUD Handlers ---
  const handleAddDeanery = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDeanery) return
    try {
      await createDeanery({ name: newDeanery })
      setNewDeanery("")
      toast.success("Decanato creado exitosamente")
      fetchData()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handleAddCareer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCareer.name || !newCareer.deaneryId) return
    try {
      await createCareer(newCareer)
      setNewCareer({ name: "", deaneryId: deaneries[0]?.id || "" })
      toast.success("Carrera creada exitosamente")
      fetchData()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCourse.name || !newCourse.careerId) return
    try {
      await createCourse(newCourse)
      setNewCourse({ name: "", semester: "1", careerId: careers[0]?.id || "" })
      toast.success("Materia creada exitosamente")
      fetchData()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handleDeleteCourse = async (id: string) => {
    try {
      await deleteCourse(id)
      toast.success("Materia eliminada")
      fetchData()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTeacher) return
    try {
      await createTeacher({ name: newTeacher })
      setNewTeacher("")
      toast.success("Profesor registrado exitosamente")
      fetchData()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handleDeleteTeacher = async (id: string) => {
    try {
      await deleteTeacher(id)
      toast.success("Profesor eliminado")
      fetchData()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSection) return
    try {
      await createSection({ name: newSection })
      setNewSection("")
      toast.success("Sección registrada exitosamente")
      fetchData()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handleDeleteSection = async (id: string) => {
    try {
      await deleteSection(id)
      toast.success("Sección eliminada")
      fetchData()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRoom.name) return
    try {
      await createRoom({
        name: newRoom.name,
        capacity: newRoom.capacity ? parseInt(newRoom.capacity) : null
      })
      setNewRoom({ name: "", capacity: "" })
      toast.success("Aula creada exitosamente")
      fetchData()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handleDeleteRoom = async (id: string) => {
    try {
      await deleteRoom(id)
      toast.success("Aula eliminada")
      fetchData()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id)
      toast.success("Usuario eliminado")
      fetchData()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  // --- Announcement Handlers ---
  const handleAddNotice = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNotice.title || !newNotice.content) return
    try {
      await createNotice(newNotice)
      setNewNotice({ title: "", content: "" })
      toast.success("Aviso publicado exitosamente")
      fetchData()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handleDeleteNotice = async (id: string) => {
    try {
      await deleteNotice(id)
      toast.success("Aviso eliminado")
      fetchData()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handleDeleteGlobalSchedule = async (id: string) => {
    try {
      await deleteGlobalSchedule(id)
      toast.success("Horario global eliminado exitosamente")
      fetchData()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  // --- Schedule Builder Actions ---
  const filteredCourses = courses.filter(
    (c) => c.careerId === schedCareerId && c.semester === parseInt(schedSemester)
  )

  const addSubjectRow = () => {
    setSchedSubjects(prev => [
      ...prev,
      { courseId: "", teacherId: "", slots: [{ dayOfWeek: 1, startTime: "08:00", endTime: "08:45", roomId: rooms[0]?.id || "" }] }
    ])
  }

  const removeSubjectRow = (idx: number) => {
    setSchedSubjects(prev => prev.filter((_sub: any, i: number) => i !== idx))
  }

  const updateSubjectRow = (idx: number, field: string, val: any) => {
    setSchedSubjects(prev => prev.map((item, i) => i === idx ? { ...item, [field]: val } : item))
  }

  const addSlotRow = (subIdx: number) => {
    setSchedSubjects(prev => prev.map((item, i) => {
      if (i === subIdx) {
        return {
          ...item,
          slots: [...item.slots, { dayOfWeek: 1, startTime: "08:00", endTime: "08:45", roomId: rooms[0]?.id || "" }]
        }
      }
      return item
    }))
  }

  const removeSlotRow = (subIdx: number, slotIdx: number) => {
    setSchedSubjects(prev => prev.map((item, i) => {
      if (i === subIdx) {
        return {
          ...item,
          slots: item.slots.filter((_slot: any, s: number) => s !== slotIdx)
        }
      }
      return item
    }))
  }

  const updateSlotRow = (subIdx: number, slotIdx: number, field: string, val: any) => {
    setSchedSubjects(prev => prev.map((item, i) => {
      if (i === subIdx) {
        const newSlots = item.slots.map((s: any, idx: number) => 
          idx === slotIdx ? { ...s, [field]: val } : s
        )
        return { ...item, slots: newSlots }
      }
      return item
    }))
  }

  const handleSaveGlobalSchedule = async () => {
    const invalid = schedSubjects.some(s => !s.courseId || s.slots.some((sl: any) => !sl.startTime || !sl.endTime || !sl.roomId))
    if (invalid || !schedTermId || !schedSectionId) {
      toast.error("Por favor completa todos los campos (materia, hora de inicio/fin y salón) para cada bloque.")
      return
    }

    setLoading(true)
    try {
      await loadGlobalSchedule({
        termId: schedTermId,
        sectionId: schedSectionId,
        semester: parseInt(schedSemester),
        subjects: schedSubjects
      })
      toast.success("Horario global guardado con éxito")
      setSchedSubjects([
        { courseId: "", teacherId: "", slots: [{ dayOfWeek: 1, startTime: "08:00", endTime: "08:45", roomId: rooms[0]?.id || "" }] }
      ])
      fetchData()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 p-6 space-y-6 font-sans">
      
      {/* Page Header */}
      <div className="flex items-center gap-3 border-b border-border/50 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
          <ShieldCheck className="size-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground uppercase">
            Módulo de Administración
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configuración global de datos académicos del decanato, avisos y auditoría.
          </p>
        </div>
      </div>

      {/* Grid Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Sidebar Tabs */}
        <div className="flex flex-col gap-1 border-r border-border/50 pr-4">
          <button
            onClick={() => { setActiveTab("horarios"); window.location.hash = "horarios"; }}
            className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-left cursor-pointer transition-all ${
              activeTab === "horarios" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            <Calendar className="size-4" />
            <span>Cargar Horarios</span>
          </button>
          
          <button
            onClick={() => { setActiveTab("decanatos"); window.location.hash = "decanatos"; }}
            className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-left cursor-pointer transition-all ${
              activeTab === "decanatos" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            <GraduationCap className="size-4" />
            <span>Decanatos</span>
          </button>

          <button
            onClick={() => { setActiveTab("carreras"); window.location.hash = "carreras"; }}
            className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-left cursor-pointer transition-all ${
              activeTab === "carreras" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            <FolderPlus className="size-4" />
            <span>Carreras</span>
          </button>

          <button
            onClick={() => { setActiveTab("noticias"); window.location.hash = "noticias"; }}
            className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-left cursor-pointer transition-all ${
              activeTab === "noticias" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            <Bell className="size-4" />
            <span>Avisos de Inscripción</span>
          </button>

          <button
            onClick={() => { setActiveTab("materias"); window.location.hash = "materias"; }}
            className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-left cursor-pointer transition-all ${
              activeTab === "materias" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            <BookOpen className="size-4" />
            <span>Materias Base</span>
          </button>

          <button
            onClick={() => { setActiveTab("profesores"); window.location.hash = "profesores"; }}
            className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-left cursor-pointer transition-all ${
              activeTab === "profesores" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            <UserSquare2 className="size-4" />
            <span>Profesores</span>
          </button>

          <button
            onClick={() => { setActiveTab("secciones"); window.location.hash = "secciones"; }}
            className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-left cursor-pointer transition-all ${
              activeTab === "secciones" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            <FolderPlus className="size-4" />
            <span>Secciones</span>
          </button>

          <button
            onClick={() => { setActiveTab("aulas"); window.location.hash = "aulas"; }}
            className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-left cursor-pointer transition-all ${
              activeTab === "aulas" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            <MapPin className="size-4" />
            <span>Aulas</span>
          </button>

          <button
            onClick={() => { setActiveTab("usuarios"); window.location.hash = "usuarios"; }}
            className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-left cursor-pointer transition-all ${
              activeTab === "usuarios" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            <Users className="size-4" />
            <span>Gestionar Usuarios</span>
          </button>

          <button
            onClick={() => { setActiveTab("logs"); window.location.hash = "logs"; }}
            className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-left cursor-pointer transition-all ${
              activeTab === "logs" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            <History className="size-4" />
            <span>Logs de Auditoría</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="md:col-span-3 space-y-6">

          {/* TAB: HORARIOS BUILDER */}
          {activeTab === "horarios" && (
            <div className="space-y-6">
              <Card className="border border-border/80 shadow-md rounded-2xl overflow-hidden bg-card/60 backdrop-blur-xs">
                <CardHeader className="pb-3 border-b border-border/50">
                  <CardTitle className="text-xs uppercase font-bold text-foreground">
                    Creador y Carga de Horarios Globales
                  </CardTitle>
                  <CardDescription>
                    Elige el lapso académico, carrera, semestre y sección para diagramar el horario escolar.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4 space-y-6">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="schedTerm">Lapso Académico</Label>
                      <Select
                        id="schedTerm"
                        value={schedTermId}
                        onChange={(e) => setSchedTermId(e.target.value)}
                      >
                        <option value="">-- Selecciona Lapso --</option>
                        {terms.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </Select>
                    </div>
 
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="schedCareer">Carrera</Label>
                      <Select
                        id="schedCareer"
                        value={schedCareerId}
                        onChange={(e) => setSchedCareerId(e.target.value)}
                      >
                        {careers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </Select>
                    </div>
 
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="schedSem">Semestre</Label>
                      <Select
                        id="schedSem"
                        value={schedSemester}
                        onChange={(e) => setSchedSemester(e.target.value)}
                      >
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(s => (
                          <option key={s} value={s}>Semestre {s}</option>
                        ))}
                      </Select>
                    </div>
 
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="schedSec">Sección</Label>
                      <Select
                        id="schedSec"
                        value={schedSectionId}
                        onChange={(e) => setSchedSectionId(e.target.value)}
                      >
                        <option value="">-- Selecciona Sección --</option>
                        {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </Select>
                    </div>
                  </div>

                  <div className="border-t border-border/60 pt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Materias y Bloques de Clase
                      </h3>
                      <Button variant="outline" size="xs" onClick={addSubjectRow} className="gap-1 cursor-pointer">
                        <Plus className="size-3" />
                        Agregar Materia
                      </Button>
                    </div>

                    {schedSubjects.map((sub, sIdx) => (
                      <div key={sIdx} className="p-4 border border-border/60 bg-muted/10 rounded-xl space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1">
                            <Label>Materia Base</Label>
                            <Select
                              value={sub.courseId}
                              onChange={(e) => updateSubjectRow(sIdx, "courseId", e.target.value)}
                            >
                              <option value="">-- Selecciona Materia --</option>
                              {filteredCourses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </Select>
                          </div>

                          <div className="flex items-end gap-2">
                            <div className="flex-1 flex flex-col gap-1">
                              <Label>Profesor</Label>
                              <Select
                                value={sub.teacherId}
                                onChange={(e) => updateSubjectRow(sIdx, "teacherId", e.target.value)}
                              >
                                <option value="">Sin Profesor</option>
                                {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                              </Select>
                            </div>

                            <Button 
                              variant="ghost" 
                              size="icon-sm" 
                              onClick={() => removeSubjectRow(sIdx)}
                              className="text-destructive hover:bg-destructive/10 cursor-pointer"
                              disabled={schedSubjects.length === 1}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Slots for this Subject */}
                        <div className="pl-4 border-l-2 border-primary/20 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Horarios de Clase</span>
                            <Button variant="ghost" size="xs" onClick={() => addSlotRow(sIdx)} className="text-[10px] h-7 px-2 cursor-pointer">
                              + Agregar Bloque de Hora
                            </Button>
                          </div>

                          {sub.slots.map((slot: any, slIdx: number) => (
                            <div key={slIdx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                              <div className="sm:col-span-3">
                                <Select
                                  value={slot.dayOfWeek}
                                  onChange={(e) => updateSlotRow(sIdx, slIdx, "dayOfWeek", parseInt(e.target.value))}
                                >
                                  <option value={1}>Lunes</option>
                                  <option value={2}>Martes</option>
                                  <option value={3}>Miércoles</option>
                                  <option value={4}>Jueves</option>
                                  <option value={5}>Viernes</option>
                                  <option value={6}>Sábado</option>
                                </Select>
                              </div>

                              <div className="sm:col-span-2">
                                <Input
                                  type="time"
                                  value={slot.startTime}
                                  onChange={(e) => updateSlotRow(sIdx, slIdx, "startTime", e.target.value)}
                                  className="h-8 text-[11px]"
                                />
                              </div>

                              <span className="sm:col-span-1 text-center text-muted-foreground text-[10px]">a</span>

                              <div className="sm:col-span-2">
                                <Input
                                  type="time"
                                  value={slot.endTime}
                                  onChange={(e) => updateSlotRow(sIdx, slIdx, "endTime", e.target.value)}
                                  className="h-8 text-[11px]"
                                />
                              </div>

                              <div className="sm:col-span-3">
                                <Select
                                  value={slot.roomId}
                                  onChange={(e) => updateSlotRow(sIdx, slIdx, "roomId", e.target.value)}
                                >
                                  <option value="">Sin Aula</option>
                                  {rooms.map(r => <option key={r.id} value={r.id}>{r.name} ({r.capacity} cap)</option>)}
                                </Select>
                              </div>

                              <div className="sm:col-span-1 flex justify-end">
                                <Button
                                  variant="ghost"
                                  size="icon-xs"
                                  onClick={() => removeSlotRow(sIdx, slIdx)}
                                  className="text-destructive hover:bg-destructive/10 cursor-pointer"
                                  disabled={sub.slots.length === 1}
                                >
                                  <Trash2 className="size-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    <div className="pt-4 border-t border-border flex justify-end">
                      <Button 
                        onClick={handleSaveGlobalSchedule} 
                        className="px-6 cursor-pointer"
                        disabled={loading}
                      >
                        {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />}
                        <span>Publicar Horario</span>
                      </Button>
                    </div>
                  </div>

                </CardContent>
              </Card>

              {/* LIST OF LOADED GLOBAL SCHEDULES */}
              <AdminCrudTable
                title="Horarios Globales Cargados"
                description="Listado de horarios configurados para cada sección y lapso académico."
                items={globalSchedules}
                fields={[
                  { 
                    label: "Lapso", 
                    key: "term", 
                    render: (item: any) => item.term?.name || "N/A" 
                  },
                  {
                    label: "Carrera",
                    key: "career",
                    render: (item: any) => {
                      const career = item.subjects?.[0]?.course?.career
                      return career ? (
                        <span className="font-medium text-foreground/90">{career.name}</span>
                      ) : (
                        <span className="text-muted-foreground italic text-[10px]">Sin carrera</span>
                      )
                    }
                  },
                  { 
                    label: "Sección", 
                    key: "section", 
                    render: (item: any) => item.section?.name || "N/A" 
                  },
                  { 
                    label: "Semestre", 
                    key: "semester", 
                    render: (item: any) => `${item.semester}° Sem.`
                  },
                  { 
                    label: "Materias", 
                    key: "subjects",
                    render: (item: any) => (
                      <span className="font-mono bg-primary/8 text-primary border border-primary/20 px-1.5 py-0.5 rounded-sm text-[10px] font-semibold">
                        {item.subjects?.length || 0} materias
                      </span>
                    )
                  }
                ]}
                onDelete={handleDeleteGlobalSchedule}
                renderEditForm={(item: any, close) => (
                  <GlobalScheduleEditForm
                    item={item}
                    terms={terms}
                    sections={sections}
                    careers={careers}
                    courses={courses}
                    teachers={teachers}
                    rooms={rooms}
                    onSave={async (payload) => {
                      await loadGlobalSchedule(payload)
                      toast.success("Horario actualizado exitosamente")
                      fetchData()
                    }}
                    onClose={close}
                  />
                )}
              />
            </div>
          )}

          {/* TAB: DECANATOS */}
          {activeTab === "decanatos" && (
            <AdminCrudTable
              title="Decanatos Registrados"
              description="Listado de facultades y decanatos en el sistema de base de datos."
              items={deaneries}
              fields={[
                { label: "Código / ID", key: "id" },
                { label: "Nombre del Decanato", key: "name" }
              ]}
              addLabel="Crear Decanato"
              renderAddForm={(close) => (
                <form onSubmit={async (e) => { e.preventDefault(); await handleAddDeanery(e); close(); }} className="space-y-4 font-sans">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="decName">Nombre Completo del Decanato</Label>
                    <Input
                      id="decName"
                      placeholder="ej: Decanato de Ciencias y Tecnología"
                      value={newDeanery}
                      onChange={(e) => setNewDeanery(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full cursor-pointer mt-3">Guardar Decanato</Button>
                </form>
              )}
              renderEditForm={(item, close) => {
                const [editName, setEditName] = React.useState(item.name)
                return (
                  <form onSubmit={async (e) => {
                    e.preventDefault()
                    await updateDeanery(item.id, { name: editName })
                    toast.success("Decanato actualizado exitosamente")
                    fetchData()
                    close()
                  }} className="space-y-4 font-sans">
                    <div className="flex flex-col gap-1.5">
                      <Label>Nombre Completo del Decanato</Label>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full cursor-pointer mt-3">Guardar Cambios</Button>
                  </form>
                )
              }}
            />
          )}

          {/* TAB: CARRERAS */}
          {activeTab === "carreras" && (
            <AdminCrudTable
              title="Carreras Registradas"
              description="Lista de carreras ofertadas asociadas a sus respectivos decanatos."
              items={careers}
              fields={[
                { label: "Carrera", key: "name" },
                { 
                  label: "Decanato", 
                  key: "deanery",
                  render: (item: any) => item.deanery?.name || "N/A"
                }
              ]}
              addLabel="Crear Carrera"
              renderAddForm={(close) => (
                <form onSubmit={async (e) => { e.preventDefault(); await handleAddCareer(e); close(); }} className="space-y-4 font-sans">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="carName">Nombre de la Carrera</Label>
                    <Input
                      id="carName"
                      placeholder="ej: Ingeniería Informática"
                      value={newCareer.name}
                      onChange={(e) => setNewCareer(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="carDec">Pertenece al Decanato</Label>
                    <Select
                      id="carDec"
                      value={newCareer.deaneryId}
                      onChange={(e) => setNewCareer(prev => ({ ...prev, deaneryId: e.target.value }))}
                    >
                      {deaneries.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </Select>
                  </div>
                  <Button type="submit" className="w-full cursor-pointer mt-3">Guardar Carrera</Button>
                </form>
              )}
              renderEditForm={(item, close) => {
                const [editName, setEditName] = React.useState(item.name)
                const [editDec, setEditDec] = React.useState(item.deaneryId || "")
                return (
                  <form onSubmit={async (e) => {
                    e.preventDefault()
                    await updateCareer(item.id, { name: editName, deaneryId: editDec })
                    toast.success("Carrera actualizada exitosamente")
                    fetchData()
                    close()
                  }} className="space-y-4 font-sans">
                    <div className="flex flex-col gap-1.5">
                      <Label>Nombre de la Carrera</Label>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label>Decanato</Label>
                      <Select
                        value={editDec}
                        onChange={(e) => setEditDec(e.target.value)}
                      >
                        {deaneries.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </Select>
                    </div>
                    <Button type="submit" className="w-full cursor-pointer mt-3">Guardar Cambios</Button>
                  </form>
                )
              }}
            />
          )}

          {/* TAB: NOTICIAS / AVISOS */}
          {activeTab === "noticias" && (
            <AdminCrudTable
              title="Avisos Publicados"
              description="Listado de comunicados actualmente visibles para los estudiantes en su cartelera."
              items={notices}
              fields={[
                { label: "Título del Aviso", key: "title" },
                { label: "Detalles del Contenido", key: "content" },
                { 
                  label: "Fecha de Publicación", 
                  key: "createdAt",
                  render: (item: any) => new Date(item.createdAt).toLocaleDateString()
                }
              ]}
              onDelete={handleDeleteNotice}
              addLabel="Publicar Aviso"
              renderAddForm={(close) => (
                <form onSubmit={async (e) => { e.preventDefault(); await handleAddNotice(e); close(); }} className="space-y-4 font-sans">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="nTitle">Título del Aviso</Label>
                    <Input
                      id="nTitle"
                      placeholder="ej: Inscripciones Lapso 2026-1"
                      value={newNotice.title}
                      onChange={(e) => setNewNotice(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="nContent">Contenido / Detalles</Label>
                    <textarea
                      id="nContent"
                      placeholder="Detalles sobre fechas, prioridades o carreras convocadas..."
                      value={newNotice.content}
                      onChange={(e) => setNewNotice(prev => ({ ...prev, content: e.target.value }))}
                      className="flex min-h-24 w-full border border-input bg-transparent px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-lg outline-none"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full cursor-pointer mt-3">Publicar Comunicado</Button>
                </form>
              )}
              renderEditForm={(item, close) => {
                const [editTitle, setEditTitle] = React.useState(item.title)
                const [editContent, setEditContent] = React.useState(item.content)
                return (
                  <form onSubmit={async (e) => {
                    e.preventDefault()
                    await updateNotice(item.id, { title: editTitle, content: editContent })
                    toast.success("Aviso actualizado exitosamente")
                    fetchData()
                    close()
                  }} className="space-y-4 font-sans">
                    <div className="flex flex-col gap-1.5">
                      <Label>Título del Aviso</Label>
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label>Contenido / Detalles</Label>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="flex min-h-24 w-full border border-input bg-transparent px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-lg outline-none"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full cursor-pointer mt-3">Guardar Cambios</Button>
                  </form>
                )
              }}
            />
          )}

          {/* TAB: MATERIAS BASE */}
          {activeTab === "materias" && (
            <AdminCrudTable
              title="Materias Registradas"
              description="Materias base curriculares clasificadas por carrera y semestre."
              items={courses}
              fields={[
                { label: "Nombre", key: "name" },
                { 
                  label: "Semestre", 
                  key: "semester",
                  render: (item: any) => `Semestre ${item.semester}`
                },
                { 
                  label: "Carrera", 
                  key: "career",
                  render: (item: any) => item.career?.name || "N/A"
                }
              ]}
              onDelete={handleDeleteCourse}
              addLabel="Crear Materia"
              renderAddForm={(close) => (
                <form onSubmit={async (e) => { e.preventDefault(); await handleAddCourse(e); close(); }} className="space-y-4 font-sans">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="mName">Nombre de Materia</Label>
                    <Input
                      id="mName"
                      placeholder="ej: Algoritmos"
                      value={newCourse.name}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="mSem">Semestre</Label>
                    <Select
                      id="mSem"
                      value={newCourse.semester}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, semester: e.target.value }))}
                    >
                      {Array.from({ length: 10 }, (_, i) => i + 1).map(s => (
                        <option key={s} value={s.toString()}>Semestre {s}</option>
                      ))}
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="mCar">Carrera</Label>
                    <Select
                      id="mCar"
                      value={newCourse.careerId}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, careerId: e.target.value }))}
                    >
                      {careers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </Select>
                  </div>
                  <Button type="submit" className="w-full cursor-pointer mt-3">Guardar Materia</Button>
                </form>
              )}
              renderEditForm={(item, close) => {
                const [editName, setEditName] = React.useState(item.name)
                const [editSem, setEditSem] = React.useState(item.semester ? item.semester.toString() : "1")
                const [editCar, setEditCar] = React.useState(item.careerId || "")
                return (
                  <form onSubmit={async (e) => {
                    e.preventDefault()
                    await updateCourse(item.id, { name: editName, semester: editSem, careerId: editCar })
                    toast.success("Materia actualizada exitosamente")
                    fetchData()
                    close()
                  }} className="space-y-4 font-sans">
                    <div className="flex flex-col gap-1.5">
                      <Label>Nombre de Materia</Label>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label>Semestre</Label>
                      <Select
                        value={editSem}
                        onChange={(e) => setEditSem(e.target.value)}
                      >
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(s => (
                          <option key={s} value={s.toString()}>Semestre {s}</option>
                        ))}
                      </Select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label>Carrera</Label>
                      <Select
                        value={editCar}
                        onChange={(e) => setEditCar(e.target.value)}
                      >
                        {careers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </Select>
                    </div>
                    <Button type="submit" className="w-full cursor-pointer mt-3">Guardar Cambios</Button>
                  </form>
                )
              }}
            />
          )}

          {/* TAB: PROFESORES */}
          {activeTab === "profesores" && (
            <AdminCrudTable
              title="Profesores Registrados"
              description="Nómina docente habilitada para impartir clases en el decanato."
              items={teachers}
              fields={[
                { label: "Nombre Completo", key: "name" }
              ]}
              onDelete={handleDeleteTeacher}
              addLabel="Registrar Profesor"
              renderAddForm={(close) => (
                <form onSubmit={async (e) => { e.preventDefault(); await handleAddTeacher(e); close(); }} className="space-y-4 font-sans">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="tName">Nombre Completo del Profesor</Label>
                    <Input
                      id="tName"
                      placeholder="ej: Ing. Carlos Gómez"
                      value={newTeacher}
                      onChange={(e) => setNewTeacher(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full cursor-pointer mt-3">Registrar Profesor</Button>
                </form>
              )}
              renderEditForm={(item, close) => {
                const [editName, setEditName] = React.useState(item.name)
                return (
                  <form onSubmit={async (e) => {
                    e.preventDefault()
                    await updateTeacher(item.id, { name: editName })
                    toast.success("Profesor actualizado exitosamente")
                    fetchData()
                    close()
                  }} className="space-y-4 font-sans">
                    <div className="flex flex-col gap-1.5">
                      <Label>Nombre Completo del Profesor</Label>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full cursor-pointer mt-3">Guardar Cambios</Button>
                  </form>
                )
              }}
            />
          )}

          {/* TAB: SECCIONES */}
          {activeTab === "secciones" && (
            <AdminCrudTable
              title="Secciones Registradas"
              description="Secciones habilitadas para la conformación de bloques horarios."
              items={sections}
              fields={[
                { label: "Identificador Sección", key: "name" }
              ]}
              onDelete={handleDeleteSection}
              addLabel="Crear Sección"
              renderAddForm={(close) => (
                <form onSubmit={async (e) => { e.preventDefault(); await handleAddSection(e); close(); }} className="space-y-4 font-sans">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="sName">Identificador de la Sección</Label>
                    <Input
                      id="sName"
                      placeholder="ej: Sección 1"
                      value={newSection}
                      onChange={(e) => setNewSection(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full cursor-pointer mt-3">Guardar Sección</Button>
                </form>
              )}
              renderEditForm={(item, close) => {
                const [editName, setEditName] = React.useState(item.name)
                return (
                  <form onSubmit={async (e) => {
                    e.preventDefault()
                    await updateSection(item.id, { name: editName })
                    toast.success("Sección actualizada exitosamente")
                    fetchData()
                    close()
                  }} className="space-y-4 font-sans">
                    <div className="flex flex-col gap-1.5">
                      <Label>Identificador de la Sección</Label>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full cursor-pointer mt-3">Guardar Cambios</Button>
                  </form>
                )
              }}
            />
          )}

          {/* TAB: AULAS */}
          {activeTab === "aulas" && (
            <AdminCrudTable
              title="Aulas Registradas"
              description="Espacios físicos escolares con aforo determinado asignables a horarios."
              items={rooms}
              fields={[
                { label: "Aula / Salón", key: "name" },
                { 
                  label: "Capacidad", 
                  key: "capacity",
                  render: (item: any) => item.capacity ? `${item.capacity} puestos` : "N/A"
                }
              ]}
              onDelete={handleDeleteRoom}
              addLabel="Registrar Aula"
              renderAddForm={(close) => (
                <form onSubmit={async (e) => { e.preventDefault(); await handleAddRoom(e); close(); }} className="space-y-4 font-sans">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="rName">Nombre / Nro de Aula</Label>
                    <Input
                      id="rName"
                      placeholder="ej: Aula 101 - Edif. A"
                      value={newRoom.name}
                      onChange={(e) => setNewRoom(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="rCap">Capacidad de Aforo (Puestos)</Label>
                    <Input
                      id="rCap"
                      type="number"
                      placeholder="ej: 35"
                      value={newRoom.capacity}
                      onChange={(e) => setNewRoom(prev => ({ ...prev, capacity: e.target.value }))}
                    />
                  </div>
                  <Button type="submit" className="w-full cursor-pointer mt-3">Guardar Aula</Button>
                </form>
              )}
              renderEditForm={(item, close) => {
                const [editName, setEditName] = React.useState(item.name)
                const [editCap, setEditCap] = React.useState(item.capacity ? item.capacity.toString() : "")
                return (
                  <form onSubmit={async (e) => {
                    e.preventDefault()
                    await updateRoom(item.id, { name: editName, capacity: editCap })
                    toast.success("Aula actualizada exitosamente")
                    fetchData()
                    close()
                  }} className="space-y-4 font-sans">
                    <div className="flex flex-col gap-1.5">
                      <Label>Nombre / Nro de Aula</Label>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label>Capacidad de Aforo (Puestos)</Label>
                      <Input
                        type="number"
                        value={editCap}
                        onChange={(e) => setEditCap(e.target.value)}
                      />
                    </div>
                    <Button type="submit" className="w-full cursor-pointer mt-3">Guardar Cambios</Button>
                  </form>
                )
              }}
            />
          )}

          {/* TAB: GESTIONAR USUARIOS */}
          {activeTab === "usuarios" && (
            <AdminCrudTable
              title="Listado de Usuarios Registrados"
              description="Visualiza y elimina cuentas de estudiantes y personal administrativo."
              items={users}
              fields={[
                { label: "Usuario", key: "username" },
                { label: "Nombre Completo", key: "fullname" },
                { label: "Correo", key: "email" },
                { 
                  label: "Rol de Cuenta", 
                  key: "role",
                  render: (item: any) => (
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      item.role === "ADMIN" ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-primary/10 text-primary border border-primary/20"
                    }`}>
                      {item.role}
                    </span>
                  )
                },
                { 
                  label: "Semestre", 
                  key: "semester",
                  render: (item: any) => item.semester ? `Semestre ${item.semester}` : "N/A"
                }
              ]}
              onDelete={handleDeleteUser}
              deleteDisabledSelector={(item: any) => item.username === "admin"}
            />
          )}

          {/* TAB: AUDIT LOGS */}
          {activeTab === "logs" && (
            <Card className="border border-border/80 shadow-md rounded-2xl overflow-hidden bg-card/60 backdrop-blur-xs">
              <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-xs uppercase flex items-center gap-1">
                  <Clock className="size-4 text-primary" />
                  Logs de Auditoría Administrativa
                </CardTitle>
                <CardDescription>
                  Listado de operaciones administrativas registradas en el backend.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {logs.length === 0 ? (
                    <div className="text-center py-6 text-xs text-muted-foreground font-mono">
                      No hay logs de auditoría disponibles en este momento.
                    </div>
                  ) : (
                    logs.map(log => (
                      <div key={log.id} className="p-3 border border-border/60 rounded-lg flex flex-col gap-1.5 bg-muted/10 text-xs">
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className="font-bold text-primary tracking-wide uppercase">{log.action}</span>
                          <span className="text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-foreground font-semibold">{log.details}</p>
                        <div className="flex gap-4 text-[9px] text-muted-foreground mt-0.5">
                          <span>Usuario: <strong className="text-foreground">{log.username || "Sistema"}</strong></span>
                          {log.ipAddress && <span>IP: <strong>{log.ipAddress}</strong></span>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  )
}
