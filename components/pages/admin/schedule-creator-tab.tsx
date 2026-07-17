"use client"

import * as React from "react"
import { Calendar, Plus, Trash2, Save, Loader2, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { AdminCrudTable } from "@/components/custom/admin-crud-table"
import { GlobalScheduleEditForm } from "./schedule-edit-form"
import { toast } from "react-hot-toast"

interface ScheduleCreatorTabProps {
  terms: any[]
  sections: any[]
  careers: any[]
  courses: any[]
  teachers: any[]
  rooms: any[]
  globalSchedules: any[]
  onLoadSchedule: (payload: any) => Promise<void>
  onDeleteSchedule: (id: string) => Promise<void>
  onUpdateSchedule: (id: string, payload: any) => Promise<void>
  fetchData: () => Promise<void>
}

export function ScheduleCreatorTab({
  terms,
  sections,
  careers,
  courses,
  teachers,
  rooms,
  globalSchedules,
  onLoadSchedule,
  onDeleteSchedule,
  onUpdateSchedule,
  fetchData
}: ScheduleCreatorTabProps) {
  // Form state
  const [schedTermId, setSchedTermId] = React.useState("")
  const [schedSectionId, setSchedSectionId] = React.useState("")
  const [schedCareerId, setSchedCareerId] = React.useState("")
  const [schedSemester, setSchedSemester] = React.useState("1")
  const [schedSubjects, setSchedSubjects] = React.useState<any[]>([
    { courseId: "", teacherId: "", slots: [{ dayOfWeek: 1, startTime: "08:00", endTime: "08:45", roomId: "" }] }
  ])
  const [saving, setSaving] = React.useState(false)

  // Sync initial dropdown selections
  React.useEffect(() => {
    if (terms.length > 0 && !schedTermId) setSchedTermId(terms[0].id)
    if (sections.length > 0 && !schedSectionId) setSchedSectionId(sections[0].id)
    if (careers.length > 0 && !schedCareerId) setSchedCareerId(careers[0].id)
    if (rooms.length > 0) {
      setSchedSubjects(prev => prev.map(s => ({
        ...s,
        slots: s.slots.map(sl => ({ ...sl, roomId: sl.roomId || rooms[0].id }))
      })))
    }
  }, [terms, sections, careers, rooms])

  const filteredCourses = courses.filter(
    (c: any) => c.careerId === schedCareerId && c.semester === parseInt(schedSemester)
  )

  const addSubjectRow = () => {
    setSchedSubjects(prev => [
      ...prev,
      { 
        courseId: "", 
        teacherId: "", 
        slots: [{ dayOfWeek: 1, startTime: "08:00", endTime: "08:45", roomId: rooms[0]?.id || "" }] 
      }
    ])
  }

  const removeSubjectRow = (idx: number) => {
    setSchedSubjects(prev => prev.filter((_, i) => i !== idx))
  }

  const updateSubjectRow = (sIdx: number, field: string, value: any) => {
    setSchedSubjects(prev => prev.map((sub, i) => i === sIdx ? { ...sub, [field]: value } : sub))
  }

  const addSlotRow = (sIdx: number) => {
    setSchedSubjects(prev => prev.map((sub, i) => i === sIdx ? {
      ...sub,
      slots: [...sub.slots, { dayOfWeek: 1, startTime: "08:00", endTime: "08:45", roomId: rooms[0]?.id || "" }]
    } : sub))
  }

  const removeSlotRow = (sIdx: number, slIdx: number) => {
    setSchedSubjects(prev => prev.map((sub, i) => i === sIdx ? {
      ...sub,
      slots: sub.slots.filter((_: any, j: number) => j !== slIdx)
    } : sub))
  }

  const updateSlotRow = (sIdx: number, slIdx: number, field: string, value: any) => {
    setSchedSubjects(prev => prev.map((sub, i) => i === sIdx ? {
      ...sub,
      slots: sub.slots.map((sl: any, j: number) => j === slIdx ? { ...sl, [field]: value } : sl)
    } : sub))
  }

  const handleSaveGlobalSchedule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!schedTermId || !schedSectionId || !schedSemester) {
      toast.error("Por favor completa los campos principales de sección y semestre")
      return
    }

    const invalid = schedSubjects.some(s => !s.courseId || s.slots.some((sl: any) => !sl.startTime || !sl.endTime || !sl.roomId))
    if (invalid) {
      toast.error("Por favor selecciona una materia base, profesor y aula para cada fila de clase.")
      return
    }

    setSaving(true)
    try {
      await onLoadSchedule({
        termId: schedTermId,
        sectionId: schedSectionId,
        semester: parseInt(schedSemester),
        subjects: schedSubjects
      })
      toast.success("Horario publicado exitosamente")
      // Reset subjects
      setSchedSubjects([{ courseId: "", teacherId: "", slots: [{ dayOfWeek: 1, startTime: "08:00", endTime: "08:45", roomId: rooms[0]?.id || "" }] }])
      fetchData()
    } catch (err: any) {
      toast.error(err.message || "Error al publicar horario")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Creator Form */}
      <Card className="border border-border/80 shadow-xs">
        <CardHeader className="border-b border-border/50 bg-muted/10">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Calendar className="size-4 text-primary" />
            CREADOR Y CARGA DE HORARIOS GLOBALES
          </CardTitle>
          <CardDescription className="text-[11px]">
            Elige el lapso académico, carrera, semestre y sección para diagramar el horario escolar.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-6">
          <form onSubmit={handleSaveGlobalSchedule} className="space-y-6">
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
                <Button type="button" variant="outline" size="xs" onClick={addSubjectRow} className="gap-1 cursor-pointer">
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
                        type="button"
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

                  <div className="pl-4 border-l-2 border-primary/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Horarios de Clase</span>
                      <Button type="button" variant="ghost" size="xs" onClick={() => addSlotRow(sIdx)} className="text-[10px] h-7 px-2 cursor-pointer">
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
                            {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                          </Select>
                        </div>

                        <div className="sm:col-span-1 flex justify-end">
                          <Button 
                            type="button"
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
            </div>

            <Button type="submit" className="w-full cursor-pointer mt-2" disabled={saving}>
              {saving ? <Loader2 className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />}
              Publicar Horario Escolar
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 2. Global Schedules List Table */}
      <AdminCrudTable
        title="Horarios Escolares Publicados"
        description="Grilla de horarios globales diagramados y distribuidos para consulta escolar."
        items={globalSchedules}
        fields={[
          {
            label: "Lapso Académico",
            key: "term",
            render: (item: any) => item.term?.name || "N/A"
          },
          {
            label: "Carrera / Facultad",
            key: "career",
            render: (item: any) => item.subjects?.[0]?.course?.career?.name || "N/A"
          },
          {
            label: "Semestre",
            key: "semester",
            render: (item: any) => `Semestre ${item.semester}`
          },
          {
            label: "Sección",
            key: "section",
            render: (item: any) => item.section?.name || "N/A"
          },
          {
            label: "Materias",
            key: "subjects",
            render: (item: any) => (
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                {item.subjects?.length || 0} Materias
              </span>
            )
          }
        ]}
        onDelete={onDeleteSchedule}
        addLabel="" // Hide default add since we have our custom builder card
        renderEditForm={(item, close) => (
          <GlobalScheduleEditForm
            item={item}
            terms={terms}
            sections={sections}
            careers={careers}
            courses={courses}
            teachers={teachers}
            rooms={rooms}
            onClose={close}
            onSave={async (payload) => {
              await onUpdateSchedule(item.id, payload)
              toast.success("Horario escolar actualizado exitosamente")
              fetchData()
            }}
          />
        )}
      />
    </div>
  )
}
