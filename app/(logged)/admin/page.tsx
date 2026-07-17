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
import { 
  AddDeaneryForm, EditDeaneryForm,
  AddCareerForm, EditCareerForm,
  AddNoticeForm, EditNoticeForm,
  AddCourseForm, EditCourseForm,
  AddTeacherForm, EditTeacherForm,
  AddSectionForm, EditSectionForm,
  AddRoomForm, EditRoomForm 
} from "@/components/custom/admin-forms"
import { ScheduleCreatorTab } from "@/components/pages/admin/schedule-creator-tab"
import { AuditLogsTab } from "@/components/pages/admin/audit-logs-tab"

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

  // Fetch initial setup
  const fetchData = async () => {
    try {
      const ds = await getDeaneries()
      setDeaneries(ds)

      const cs = await getCareers()
      setCareers(cs)

      const crs = await getCourses()
      setCourses(crs)

      const ts = await getTeachers()
      setTeachers(ts)

      const secs = await getSections()
      setSections(secs)

      const rms = await getRooms()
      setRooms(rms)

      const tms = await getTerms()
      setTerms(tms)

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
  const handleDeleteCourse = async (id: string) => {
    try {
      await deleteCourse(id)
      toast.success("Materia eliminada")
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

  const handleDeleteSection = async (id: string) => {
    try {
      await deleteSection(id)
      toast.success("Sección eliminada")
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
            <ScheduleCreatorTab
              terms={terms}
              sections={sections}
              careers={careers}
              courses={courses}
              teachers={teachers}
              rooms={rooms}
              globalSchedules={globalSchedules}
              onLoadSchedule={loadGlobalSchedule}
              onDeleteSchedule={handleDeleteGlobalSchedule}
              onUpdateSchedule={async (id, payload) => {
                await loadGlobalSchedule(payload)
              }}
              fetchData={fetchData}
            />
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
                <AddDeaneryForm
                  onClose={close}
                  onSave={async (name) => {
                    await createDeanery({ name })
                    toast.success("Decanato creado exitosamente")
                    fetchData()
                  }}
                />
              )}
              renderEditForm={(item, close) => (
                <EditDeaneryForm
                  item={item}
                  onClose={close}
                  onSave={async (id, name) => {
                    await updateDeanery(id, { name })
                    toast.success("Decanato actualizado exitosamente")
                    fetchData()
                  }}
                />
              )}
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
                <AddCareerForm
                  deaneries={deaneries}
                  onClose={close}
                  onSave={async (values) => {
                    await createCareer(values)
                    toast.success("Carrera creada exitosamente")
                    fetchData()
                  }}
                />
              )}
              renderEditForm={(item, close) => (
                <EditCareerForm
                  item={item}
                  deaneries={deaneries}
                  onClose={close}
                  onSave={async (id, values) => {
                    await updateCareer(id, values)
                    toast.success("Carrera actualizada exitosamente")
                    fetchData()
                  }}
                />
              )}
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
                <AddNoticeForm
                  onClose={close}
                  onSave={async (values) => {
                    await createNotice(values)
                    toast.success("Aviso publicado exitosamente")
                    fetchData()
                  }}
                />
              )}
              renderEditForm={(item, close) => (
                <EditNoticeForm
                  item={item}
                  onClose={close}
                  onSave={async (id, values) => {
                    await updateNotice(id, values)
                    toast.success("Aviso actualizado exitosamente")
                    fetchData()
                  }}
                />
              )}
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
                <AddCourseForm
                  careers={careers}
                  onClose={close}
                  onSave={async (values) => {
                    await createCourse(values)
                    toast.success("Materia creada exitosamente")
                    fetchData()
                  }}
                />
              )}
              renderEditForm={(item, close) => (
                <EditCourseForm
                  item={item}
                  careers={careers}
                  onClose={close}
                  onSave={async (id, values) => {
                    await updateCourse(id, values)
                    toast.success("Materia actualizada exitosamente")
                    fetchData()
                  }}
                />
              )}
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
                <AddTeacherForm
                  onClose={close}
                  onSave={async (name) => {
                    await createTeacher({ name })
                    toast.success("Profesor registrado exitosamente")
                    fetchData()
                  }}
                />
              )}
              renderEditForm={(item, close) => (
                <EditTeacherForm
                  item={item}
                  onClose={close}
                  onSave={async (id, name) => {
                    await updateTeacher(id, { name })
                    toast.success("Profesor actualizado exitosamente")
                    fetchData()
                  }}
                />
              )}
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
                <AddSectionForm
                  onClose={close}
                  onSave={async (name) => {
                    await createSection({ name })
                    toast.success("Sección registrada exitosamente")
                    fetchData()
                  }}
                />
              )}
              renderEditForm={(item, close) => (
                <EditSectionForm
                  item={item}
                  onClose={close}
                  onSave={async (id, name) => {
                    await updateSection(id, { name })
                    toast.success("Sección actualizada exitosamente")
                    fetchData()
                  }}
                />
              )}
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
                <AddRoomForm
                  onClose={close}
                  onSave={async (values) => {
                    await createRoom(values)
                    toast.success("Aula creada exitosamente")
                    fetchData()
                  }}
                />
              )}
              renderEditForm={(item, close) => (
                <EditRoomForm
                  item={item}
                  onClose={close}
                  onSave={async (id, values) => {
                    await updateRoom(id, values)
                    toast.success("Aula actualizada exitosamente")
                    fetchData()
                  }}
                />
              )}
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
            <AuditLogsTab logs={logs} />
          )}

        </div>
      </div>
    </div>
  )
}
