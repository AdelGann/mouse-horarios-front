"use client"

import * as React from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

// ==========================================
// 1. DECANATOS (Deanery)
// ==========================================
const DeanerySchema = Yup.object().shape({
  name: Yup.string()
    .required("El nombre del decanato es requerido")
    .min(5, "El nombre debe tener al menos 5 caracteres")
})

export function AddDeaneryForm({ onSave, onClose }: { onSave: (name: string) => Promise<void>; onClose: () => void }) {
  const formik = useFormik({
    initialValues: { name: "" },
    validationSchema: DeanerySchema,
    onSubmit: async (values) => {
      await onSave(values.name)
      onClose()
    }
  })

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 font-sans">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nombre Completo del Decanato</Label>
        <Input
          id="name"
          name="name"
          placeholder="ej: Decanato de Ciencias y Tecnología (DCYT)"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={formik.touched.name && formik.errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        {formik.touched.name && formik.errors.name && (
          <span className="text-[10px] text-destructive font-medium">{formik.errors.name}</span>
        )}
      </div>
      <Button type="submit" className="w-full cursor-pointer mt-3" disabled={formik.isSubmitting}>
        Guardar Decanato
      </Button>
    </form>
  )
}

export function EditDeaneryForm({ item, onSave, onClose }: { item: any; onSave: (id: string, name: string) => Promise<void>; onClose: () => void }) {
  const formik = useFormik({
    initialValues: { name: item.name || "" },
    validationSchema: DeanerySchema,
    onSubmit: async (values) => {
      await onSave(item.id, values.name)
      onClose()
    }
  })

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 font-sans">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nombre Completo del Decanato</Label>
        <Input
          id="name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={formik.touched.name && formik.errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        {formik.touched.name && formik.errors.name && (
          <span className="text-[10px] text-destructive font-medium">{formik.errors.name}</span>
        )}
      </div>
      <Button type="submit" className="w-full cursor-pointer mt-3" disabled={formik.isSubmitting}>
        Guardar Cambios
      </Button>
    </form>
  )
}

// ==========================================
// 2. CARRERAS (Career)
// ==========================================
const CareerSchema = Yup.object().shape({
  name: Yup.string()
    .required("El nombre de la carrera es requerido")
    .min(4, "Debe tener al menos 4 caracteres"),
  deaneryId: Yup.string()
    .required("El decanato es requerido")
})

export function AddCareerForm({ deaneries, onSave, onClose }: { deaneries: any[]; onSave: (data: { name: string; deaneryId: string }) => Promise<void>; onClose: () => void }) {
  const formik = useFormik({
    initialValues: { name: "", deaneryId: deaneries[0]?.id || "" },
    validationSchema: CareerSchema,
    onSubmit: async (values) => {
      await onSave(values)
      onClose()
    }
  })

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 font-sans">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nombre de la Carrera</Label>
        <Input
          id="name"
          name="name"
          placeholder="ej: Ingeniería Informática"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={formik.touched.name && formik.errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        {formik.touched.name && formik.errors.name && (
          <span className="text-[10px] text-destructive font-medium">{formik.errors.name}</span>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="deaneryId">Pertenece al Decanato</Label>
        <Select
          id="deaneryId"
          name="deaneryId"
          value={formik.values.deaneryId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          {deaneries.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </Select>
        {formik.touched.deaneryId && formik.errors.deaneryId && (
          <span className="text-[10px] text-destructive font-medium">{formik.errors.deaneryId}</span>
        )}
      </div>
      <Button type="submit" className="w-full cursor-pointer mt-3" disabled={formik.isSubmitting}>
        Guardar Carrera
      </Button>
    </form>
  )
}

export function EditCareerForm({ item, deaneries, onSave, onClose }: { item: any; deaneries: any[]; onSave: (id: string, data: { name: string; deaneryId: string }) => Promise<void>; onClose: () => void }) {
  const formik = useFormik({
    initialValues: { name: item.name || "", deaneryId: item.deaneryId || deaneries[0]?.id || "" },
    validationSchema: CareerSchema,
    onSubmit: async (values) => {
      await onSave(item.id, values)
      onClose()
    }
  })

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 font-sans">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nombre de la Carrera</Label>
        <Input
          id="name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={formik.touched.name && formik.errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        {formik.touched.name && formik.errors.name && (
          <span className="text-[10px] text-destructive font-medium">{formik.errors.name}</span>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="deaneryId">Pertenece al Decanato</Label>
        <Select
          id="deaneryId"
          name="deaneryId"
          value={formik.values.deaneryId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          {deaneries.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </Select>
        {formik.touched.deaneryId && formik.errors.deaneryId && (
          <span className="text-[10px] text-destructive font-medium">{formik.errors.deaneryId}</span>
        )}
      </div>
      <Button type="submit" className="w-full cursor-pointer mt-3" disabled={formik.isSubmitting}>
        Guardar Cambios
      </Button>
    </form>
  )
}

// ==========================================
// 3. AVISOS (Notice)
// ==========================================
const NoticeSchema = Yup.object().shape({
  title: Yup.string()
    .required("El título es requerido")
    .min(3, "Debe tener al menos 3 caracteres"),
  content: Yup.string()
    .required("El contenido es requerido")
    .min(5, "Debe tener al menos 5 caracteres")
})

export function AddNoticeForm({ onSave, onClose }: { onSave: (data: { title: string; content: string }) => Promise<void>; onClose: () => void }) {
  const formik = useFormik({
    initialValues: { title: "", content: "" },
    validationSchema: NoticeSchema,
    onSubmit: async (values) => {
      await onSave(values)
      onClose()
    }
  })

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 font-sans">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Título del Aviso</Label>
        <Input
          id="title"
          name="title"
          placeholder="ej: Fechas de Inscripción Lapso 2026-1"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={formik.touched.title && formik.errors.title ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        {formik.touched.title && formik.errors.title && (
          <span className="text-[10px] text-destructive font-medium">{formik.errors.title}</span>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="content">Contenido / Detalle</Label>
        <textarea
          id="content"
          name="content"
          placeholder="Escribe el aviso informativo aquí..."
          value={formik.values.content}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          rows={4}
          className={`flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
            formik.touched.content && formik.errors.content ? "border-destructive focus-visible:ring-destructive" : ""
          }`}
        />
        {formik.touched.content && formik.errors.content && (
          <span className="text-[10px] text-destructive font-medium">{formik.errors.content}</span>
        )}
      </div>
      <Button type="submit" className="w-full cursor-pointer mt-3" disabled={formik.isSubmitting}>
        Guardar Aviso
      </Button>
    </form>
  )
}

export function EditNoticeForm({ item, onSave, onClose }: { item: any; onSave: (id: string, data: { title: string; content: string }) => Promise<void>; onClose: () => void }) {
  const formik = useFormik({
    initialValues: { title: item.title || "", content: item.content || "" },
    validationSchema: NoticeSchema,
    onSubmit: async (values) => {
      await onSave(item.id, values)
      onClose()
    }
  })

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 font-sans">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Título del Aviso</Label>
        <Input
          id="title"
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={formik.touched.title && formik.errors.title ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        {formik.touched.title && formik.errors.title && (
          <span className="text-[10px] text-destructive font-medium">{formik.errors.title}</span>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="content">Contenido / Detalle</Label>
        <textarea
          id="content"
          name="content"
          value={formik.values.content}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          rows={4}
          className={`flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
            formik.touched.content && formik.errors.content ? "border-destructive focus-visible:ring-destructive" : ""
          }`}
        />
        {formik.touched.content && formik.errors.content && (
          <span className="text-[10px] text-destructive font-medium">{formik.errors.content}</span>
        )}
      </div>
      <Button type="submit" className="w-full cursor-pointer mt-3" disabled={formik.isSubmitting}>
        Guardar Cambios
      </Button>
    </form>
  )
}

// ==========================================
// 4. MATERIAS BASE (Course)
// ==========================================
const CourseSchema = Yup.object().shape({
  name: Yup.string()
    .required("El nombre de la materia es requerido")
    .min(3, "Debe tener al menos 3 caracteres"),
  semester: Yup.number()
    .required("El semestre es requerido")
    .min(1, "Semestre mínimo 1")
    .max(10, "Semestre máximo 10"),
  careerId: Yup.string()
    .required("La carrera es requerida")
})

export function AddCourseForm({ careers, onSave, onClose }: { careers: any[]; onSave: (data: { name: string; semester: number; careerId: string }) => Promise<void>; onClose: () => void }) {
  const formik = useFormik({
    initialValues: { name: "", semester: 1, careerId: careers[0]?.id || "" },
    validationSchema: CourseSchema,
    onSubmit: async (values) => {
      await onSave(values)
      onClose()
    }
  })

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 font-sans">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nombre de la Materia</Label>
        <Input
          id="name"
          name="name"
          placeholder="ej: Algoritmos"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={formik.touched.name && formik.errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        {formik.touched.name && formik.errors.name && (
          <span className="text-[10px] text-destructive font-medium">{formik.errors.name}</span>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="semester">Semestre</Label>
        <Select
          id="semester"
          name="semester"
          value={formik.values.semester}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          {Array.from({ length: 10 }, (_, i) => i + 1).map(s => (
            <option key={s} value={s}>Semestre {s}</option>
          ))}
        </Select>
        {formik.touched.semester && formik.errors.semester && (
          <span className="text-[10px] text-destructive font-medium">{formik.errors.semester}</span>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="careerId">Pertenece a la Carrera</Label>
        <Select
          id="careerId"
          name="careerId"
          value={formik.values.careerId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          {careers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </Select>
        {formik.touched.careerId && formik.errors.careerId && (
          <span className="text-[10px] text-destructive font-medium">{formik.errors.careerId}</span>
        )}
      </div>
      <Button type="submit" className="w-full cursor-pointer mt-3" disabled={formik.isSubmitting}>
        Guardar Materia Base
      </Button>
    </form>
  )
}

export function EditCourseForm({ item, careers, onSave, onClose }: { item: any; careers: any[]; onSave: (id: string, data: { name: string; semester: number; careerId: string }) => Promise<void>; onClose: () => void }) {
  const formik = useFormik({
    initialValues: { name: item.name || "", semester: item.semester || 1, careerId: item.careerId || careers[0]?.id || "" },
    validationSchema: CourseSchema,
    onSubmit: async (values) => {
      await onSave(item.id, values)
      onClose()
    }
  })

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 font-sans">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nombre de la Materia</Label>
        <Input
          id="name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={formik.touched.name && formik.errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        {formik.touched.name && formik.errors.name && (
          <span className="text-[10px] text-destructive font-medium">{formik.errors.name}</span>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="semester">Semestre</Label>
        <Select
          id="semester"
          name="semester"
          value={formik.values.semester}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          {Array.from({ length: 10 }, (_, i) => i + 1).map(s => (
            <option key={s} value={s}>Semestre {s}</option>
          ))}
        </Select>
        {formik.touched.semester && formik.errors.semester && (
          <span className="text-[10px] text-destructive font-medium">{formik.errors.semester}</span>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="careerId">Pertenece a la Carrera</Label>
        <Select
          id="careerId"
          name="careerId"
          value={formik.values.careerId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          {careers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </Select>
        {formik.touched.careerId && formik.errors.careerId && (
          <span className="text-[10px] text-destructive font-medium">{formik.errors.careerId}</span>
        )}
      </div>
      <Button type="submit" className="w-full cursor-pointer mt-3" disabled={formik.isSubmitting}>
        Guardar Cambios
      </Button>
    </form>
  )
}

// ==========================================
// 5. PROFESORES (Teacher)
// ==========================================
const TeacherSchema = Yup.object().shape({
  name: Yup.string()
    .required("El nombre del profesor es requerido")
    .min(3, "Debe tener al menos 3 caracteres")
})

export function AddTeacherForm({ onSave, onClose }: { onSave: (name: string) => Promise<void>; onClose: () => void }) {
  const formik = useFormik({
    initialValues: { name: "" },
    validationSchema: TeacherSchema,
    onSubmit: async (values) => {
      await onSave(values.name)
      onClose()
    }
  })

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 font-sans">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nombre Completo del Profesor</Label>
        <Input
          id="name"
          name="name"
          placeholder="ej: Ing. Carlos Gómez"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={formik.touched.name && formik.errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        {formik.touched.name && formik.errors.name && (
          <span className="text-[10px] text-destructive font-medium">{formik.errors.name}</span>
        )}
      </div>
      <Button type="submit" className="w-full cursor-pointer mt-3" disabled={formik.isSubmitting}>
        Guardar Profesor
      </Button>
    </form>
  )
}

export function EditTeacherForm({ item, onSave, onClose }: { item: any; onSave: (id: string, name: string) => Promise<void>; onClose: () => void }) {
  const formik = useFormik({
    initialValues: { name: item.name || "" },
    validationSchema: TeacherSchema,
    onSubmit: async (values) => {
      await onSave(item.id, values.name)
      onClose()
    }
  })

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 font-sans">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nombre Completo del Profesor</Label>
        <Input
          id="name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={formik.touched.name && formik.errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        {formik.touched.name && formik.errors.name && (
          <span className="text-[10px] text-destructive font-medium">{formik.errors.name}</span>
        )}
      </div>
      <Button type="submit" className="w-full cursor-pointer mt-3" disabled={formik.isSubmitting}>
        Guardar Cambios
      </Button>
    </form>
  )
}

// ==========================================
// 6. SECCIONES (Section)
// ==========================================
const SectionSchema = Yup.object().shape({
  name: Yup.string()
    .required("El nombre de la sección es requerido")
    .min(2, "Debe tener al menos 2 caracteres")
})

export function AddSectionForm({ onSave, onClose }: { onSave: (name: string) => Promise<void>; onClose: () => void }) {
  const formik = useFormik({
    initialValues: { name: "" },
    validationSchema: SectionSchema,
    onSubmit: async (values) => {
      await onSave(values.name)
      onClose()
    }
  })

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 font-sans">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nombre de la Sección</Label>
        <Input
          id="name"
          name="name"
          placeholder="ej: Sección 1 o Sección A"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={formik.touched.name && formik.errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        {formik.touched.name && formik.errors.name && (
          <span className="text-[10px] text-destructive font-medium">{formik.errors.name}</span>
        )}
      </div>
      <Button type="submit" className="w-full cursor-pointer mt-3" disabled={formik.isSubmitting}>
        Guardar Sección
      </Button>
    </form>
  )
}

export function EditSectionForm({ item, onSave, onClose }: { item: any; onSave: (id: string, name: string) => Promise<void>; onClose: () => void }) {
  const formik = useFormik({
    initialValues: { name: item.name || "" },
    validationSchema: SectionSchema,
    onSubmit: async (values) => {
      await onSave(item.id, values.name)
      onClose()
    }
  })

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 font-sans">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nombre de la Sección</Label>
        <Input
          id="name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={formik.touched.name && formik.errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        {formik.touched.name && formik.errors.name && (
          <span className="text-[10px] text-destructive font-medium">{formik.errors.name}</span>
        )}
      </div>
      <Button type="submit" className="w-full cursor-pointer mt-3" disabled={formik.isSubmitting}>
        Guardar Cambios
      </Button>
    </form>
  )
}

// ==========================================
// 7. AULAS (Room)
// ==========================================
const RoomSchema = Yup.object().shape({
  name: Yup.string()
    .required("El nombre del salón es requerido")
    .min(2, "Debe tener al menos 2 caracteres"),
  capacity: Yup.number()
    .required("La capacidad es requerida")
    .min(1, "La capacidad debe ser al menos 1 puesto")
})

export function AddRoomForm({ onSave, onClose }: { onSave: (data: { name: string; capacity: number }) => Promise<void>; onClose: () => void }) {
  const formik = useFormik({
    initialValues: { name: "", capacity: 30 },
    validationSchema: RoomSchema,
    onSubmit: async (values) => {
      await onSave(values)
      onClose()
    }
  })

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 font-sans">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nombre del Salón / Aula</Label>
        <Input
          id="name"
          name="name"
          placeholder="ej: Aula 101 - Edif. A"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={formik.touched.name && formik.errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        {formik.touched.name && formik.errors.name && (
          <span className="text-[10px] text-destructive font-medium">{formik.errors.name}</span>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="capacity">Capacidad de Puestos</Label>
        <Input
          id="capacity"
          name="capacity"
          type="number"
          placeholder="ej: 30"
          value={formik.values.capacity}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={formik.touched.capacity && formik.errors.capacity ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        {formik.touched.capacity && formik.errors.capacity && (
          <span className="text-[10px] text-destructive font-medium">{formik.errors.capacity}</span>
        )}
      </div>
      <Button type="submit" className="w-full cursor-pointer mt-3" disabled={formik.isSubmitting}>
        Guardar Aula
      </Button>
    </form>
  )
}

export function EditRoomForm({ item, onSave, onClose }: { item: any; onSave: (id: string, data: { name: string; capacity: number }) => Promise<void>; onClose: () => void }) {
  const formik = useFormik({
    initialValues: { name: item.name || "", capacity: item.capacity || 30 },
    validationSchema: RoomSchema,
    onSubmit: async (values) => {
      await onSave(item.id, values)
      onClose()
    }
  })

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 font-sans">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nombre del Salón / Aula</Label>
        <Input
          id="name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={formik.touched.name && formik.errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        {formik.touched.name && formik.errors.name && (
          <span className="text-[10px] text-destructive font-medium">{formik.errors.name}</span>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="capacity">Capacidad de Puestos</Label>
        <Input
          id="capacity"
          name="capacity"
          type="number"
          value={formik.values.capacity}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={formik.touched.capacity && formik.errors.capacity ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        {formik.touched.capacity && formik.errors.capacity && (
          <span className="text-[10px] text-destructive font-medium">{formik.errors.capacity}</span>
        )}
      </div>
      <Button type="submit" className="w-full cursor-pointer mt-3" disabled={formik.isSubmitting}>
        Guardar Cambios
      </Button>
    </form>
  )
}
