"use client"

import * as React from "react"
import { Plus, Trash2, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { toast } from "react-hot-toast"

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

export function GlobalScheduleEditForm({
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
          })) || [{ dayOfWeek: 1, startTime: "08:00", endTime: "08:45", roomId: rooms[0]?.id || "" }]
        }))
      : [{ courseId: "", teacherId: "", slots: [{ dayOfWeek: 1, startTime: "08:00", endTime: "08:45", roomId: rooms[0]?.id || "" }] }]
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

      <div className="border-t border-border/60 pt-3 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Materias</span>
          <Button type="button" variant="outline" size="xs" className="gap-1 cursor-pointer"
            onClick={() => setEditSubjects(prev => [...prev, {
              courseId: "", teacherId: "",
              slots: [{ dayOfWeek: 1, startTime: "08:00", endTime: "08:45", roomId: rooms[0]?.id || "" }]
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
                ? { ...s, slots: [...s.slots, { dayOfWeek: 1, startTime: "08:00", endTime: "08:45", roomId: rooms[0]?.id || "" }] }
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
