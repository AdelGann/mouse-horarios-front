"use client"

import * as React from "react"
import { 
  User, 
  Mail, 
  Camera, 
  Save, 
  Loader2 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Select } from "@/components/ui/select"
import { useAuth } from "@/lib/hooks/useAuth"
import { toast } from "react-hot-toast"

export default function ProfilePage() {
  const [user, setUser] = React.useState<any>(null)
  const { getProfile, updateProfile, uploadPhoto, loading } = useAuth()
  
  // Form fields
  const [fullname, setFullname] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [semester, setSemester] = React.useState("1")
  
  // UI states
  const [uploading, setUploading] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const fetchProfile = async () => {
    try {
      const data = await getProfile()
      setUser(data)
      setFullname(data.fullname || "")
      setEmail(data.email || "")
      setSemester(data.semester ? data.semester.toString() : "1")
    } catch (_) {
      if (typeof window !== "undefined") {
        const session = localStorage.getItem("user_session")
        if (session) {
          const parsed = JSON.parse(session)
          setUser(parsed)
          setFullname(parsed.fullname || "")
          setEmail(parsed.email || "")
          setSemester(parsed.semester ? parsed.semester.toString() : "1")
        }
      }
    }
  }

  React.useEffect(() => {
    fetchProfile()
  }, [])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const updatedUser = await updateProfile({
        fullname,
        email,
        semester: parseInt(semester)
      })

      if (typeof window !== "undefined") {
        const session = localStorage.getItem("user_session")
        if (session) {
          const parsed = JSON.parse(session)
          const newSession = { ...parsed, ...updatedUser }
          localStorage.setItem("user_session", JSON.stringify(newSession))
          window.dispatchEvent(new Event("storage"))
        }
      }

      setUser(updatedUser)
      toast.success("Perfil actualizado exitosamente")
    } catch (e: any) {
      toast.error(e.message || "Error al actualizar perfil")
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await uploadPhoto(formData)

      if (typeof window !== "undefined") {
        const session = localStorage.getItem("user_session")
        if (session) {
          const parsed = JSON.parse(session)
          const newSession = { ...parsed, img_url: res.imageUrl }
          localStorage.setItem("user_session", JSON.stringify(newSession))
          window.dispatchEvent(new Event("storage"))
        }
      }

      setUser((prev: any) => prev ? { ...prev, img_url: res.imageUrl } : null)
      toast.success("Foto de perfil cargada con éxito")
    } catch (e: any) {
      toast.error(e.message || "Error al cargar la foto")
    } finally {
      setUploading(false)
    }
  }

  if (!user) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center text-xs text-muted-foreground font-sans">
        <Loader2 className="size-4 animate-spin text-primary mr-2" />
        Cargando perfil...
      </div>
    )
  }

  const avatarUrl = user.img_url 
    ? (user.img_url.startsWith("http") ? user.img_url : `http://localhost:3001${user.img_url}`)
    : null

  return (
    <div className="flex-1 p-6 space-y-6 max-h-[calc(100vh-3.5rem)] overflow-y-auto font-sans max-w-2xl mx-auto">
      
      {/* Page Header */}
      <div className="flex items-center gap-3 border-b border-border/50 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
          <User className="size-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground uppercase">
            Configuración de Perfil
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Administra tu información personal, académica y foto de cuenta.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Photo Upload Card */}
        <Card className="md:col-span-1 border-border">
          <CardContent className="pt-6 flex flex-col items-center gap-4 text-center">
            
            {/* Avatar Container */}
            <div className="relative group w-24 h-24 rounded-full border border-border bg-muted flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt={user.fullname || user.username} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-muted-foreground uppercase">
                  {user.username.slice(0, 2)}
                </span>
              )}
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer disabled:cursor-not-allowed"
                title="Cambiar Foto"
              >
                <Camera className="size-5" />
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                {user.fullname || user.username}
              </h3>
              <p className="text-[10px] text-muted-foreground font-mono">
                @{user.username}
              </p>
            </div>

            {/* Role Badge */}
            <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold border uppercase ${
              user.role === "ADMIN" 
                ? "bg-red-500/10 text-red-500 border-red-500/20" 
                : "bg-primary/10 text-primary border-primary/20"
            }`}>
              Rol: {user.role === "ADMIN" ? "Administrador" : "Estudiante"}
            </span>

            {uploading && (
              <span className="text-[10px] text-muted-foreground animate-pulse">
                Cargando imagen...
              </span>
            )}
          </CardContent>
        </Card>

        {/* Details Form Card */}
        <Card className="md:col-span-2 border-border">
          <CardHeader className="pb-3 border-b border-border/50">
            <CardTitle className="text-xs uppercase font-bold text-foreground">
              Datos Personales y Académicos
            </CardTitle>
            <CardDescription>
              Modifica tus detalles personales. Tu correo institucional debe ser válido.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            
            <form onSubmit={handleSaveProfile} className="space-y-4">
              
              {/* Username */}
              <div className="flex flex-col gap-1">
                <Label htmlFor="usrname">Nombre de Usuario (Permanente)</Label>
                <Input
                  id="usrname"
                  value={user.username}
                  className="bg-muted/40 border-dashed cursor-not-allowed"
                  disabled
                />
              </div>

              {/* Full Name */}
              <div className="flex flex-col gap-1">
                <Label htmlFor="fullnameInput">Nombre Completo</Label>
                <Input
                  id="fullnameInput"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  placeholder="ej: Carlos Gómez"
                  required
                  disabled={loading}
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <Label htmlFor="emailInput">Correo Electrónico</Label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-2.5 size-3.5 text-muted-foreground pointer-events-none" />
                  <Input
                    id="emailInput"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ej: cgomez@ucla.edu.ve"
                    className="pl-8"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Semester */}
              {user.role === "USER" && (
                <div className="flex flex-col gap-1">
                  <Label htmlFor="semesterSelect">Semestre Actual</Label>
                  <Select
                    id="semesterSelect"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    disabled={loading}
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((s) => (
                      <option key={s} value={s.toString()}>
                        Semestre {s}
                      </option>
                    ))}
                  </Select>
                </div>
              )}

              <div className="pt-4 border-t border-border flex justify-end">
                <Button 
                  type="submit" 
                  className="gap-1.5 cursor-pointer" 
                  disabled={loading || uploading}
                >
                  <Save className="size-3.5" />
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
