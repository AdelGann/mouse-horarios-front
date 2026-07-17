"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, User, Mail, GraduationCap, ArrowRight, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { useAuth } from "@/lib/hooks/useAuth"
import { toast } from "react-hot-toast"

export function RegisterForm() {
  const router = useRouter()
  const { register, loading } = useAuth()
  
  // Step state (0: Account details, 1: Academic details)
  const [step, setStep] = React.useState(0)
  
  // Form fields
  const [fullname, setFullname] = React.useState("")
  const [username, setUsername] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [semester, setSemester] = React.useState("1")
  const [career, setCareer] = React.useState("Ingeniería Informática")
  
  // UI states
  const [showPassword, setShowPassword] = React.useState(false)
  const [success, setSuccess] = React.useState(false)

  // DCYT Careers list
  const CAREERS = [
    "Ingeniería Informática",
    "Ingeniería de Computación",
    "Ingeniería de Producción",
    "Licenciatura en Análisis de Sistemas",
    "Licenciatura en Ciencias Matemáticas",
    "Licenciatura en Física",
  ]

  const nextStep = () => {
    if (step === 0) {
      if (!fullname || !username || !email || !password) {
        toast.error("Por favor completa todos los campos obligatorios.")
        return
      }
      if (!email.includes("@")) {
        toast.error("Ingresa un correo electrónico válido.")
        return
      }
      if (password.length < 6) {
        toast.error("La contraseña debe tener al menos 6 caracteres.")
        return
      }
      setStep(1)
    }
  }

  const prevStep = () => {
    setStep(0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!career || !semester) {
      toast.error("Por favor completa los datos académicos.")
      return
    }

    try {
      await register({
        username,
        email,
        password,
        fullname,
        semester: parseInt(semester),
        deaneryId: "dcyt-id"
      })
      
      setSuccess(true)
      toast.success("¡Cuenta creada con éxito! Redirigiendo al login...")

      setTimeout(() => {
        router.push("/login")
      }, 1500)
    } catch (err: any) {
      toast.error(err.message || "Error al registrar la cuenta. Inténtalo de nuevo.")
    }
  }

  return (
    <Card className="w-full max-w-sm border border-border bg-card font-sans">
      <CardHeader className="border-b border-border/50 pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-semibold tracking-wide uppercase">
            Crear Cuenta
          </CardTitle>
          <span className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-1.5 py-0.5 border border-border rounded-sm">
            Paso {step + 1} de 2
          </span>
        </div>
        <CardDescription>
          {step === 0 
            ? "Paso 1: Registra tus datos personales e inicio de sesión." 
            : "Paso 2: Especifica tus datos de carrera y semestre en el DCYT."}
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={step === 0 ? (e) => { e.preventDefault(); nextStep(); } : handleSubmit}>
        <CardContent className="space-y-4 pt-4">
          {/* STEP 1: Account Information */}
          {step === 0 && (
            <div className="space-y-4">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="fullname">Nombre Completo</Label>
                <div className="relative flex items-center">
                  <User className="absolute left-2.5 size-3.5 text-muted-foreground pointer-events-none" />
                  <Input
                    id="fullname"
                    placeholder="ej: Carlos Gómez"
                    className="pl-8"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    disabled={loading || success}
                    required
                  />
                </div>
              </div>

              {/* Username */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="username">Nombre de Usuario</Label>
                <div className="relative flex items-center">
                  <User className="absolute left-2.5 size-3.5 text-muted-foreground pointer-events-none" />
                  <Input
                    id="username"
                    placeholder="ej: cgomez"
                    className="pl-8"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading || success}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Correo Institucional / Personal</Label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-2.5 size-3.5 text-muted-foreground pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="ej: cgomez@ucla.edu.ve"
                    className="pl-8"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading || success}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-2.5 size-3.5 text-muted-foreground pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    className="pl-8 pr-8"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading || success}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 text-muted-foreground hover:text-foreground focus:outline-hidden cursor-pointer"
                    title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Academic Information */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Deanery (Fixed/Disabled) */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="deanery">Decanato</Label>
                <div className="relative flex items-center">
                  <GraduationCap className="absolute left-2.5 size-3.5 text-muted-foreground pointer-events-none" />
                  <Input
                    id="deanery"
                    value="DCYT (Decanato de Ciencias y Tecnología)"
                    className="pl-8 bg-muted/50 border-dashed border-border"
                    disabled
                  />
                </div>
              </div>

              {/* Career Selection */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="career">Carrera</Label>
                <Select
                  id="career"
                  value={career}
                  onChange={(e) => setCareer(e.target.value)}
                  disabled={loading || success}
                  required
                >
                  {CAREERS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Semester Selection */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="semester">Semestre Actual</Label>
                <Select
                  id="semester"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  disabled={loading || success}
                  required
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((sem) => (
                    <option key={sem} value={sem}>
                      Semestre {sem}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-4 border-t border-border/50">
          <div className="flex w-full gap-2">
            {step === 1 && (
              <Button
                type="button"
                variant="outline"
                className="w-1/2 justify-center gap-1 cursor-pointer"
                onClick={prevStep}
                disabled={loading || success}
              >
                <ChevronLeft className="size-3.5" />
                Atrás
              </Button>
            )}
            
            {step === 0 ? (
              <Button type="submit" className="w-full justify-center gap-1 cursor-pointer">
                Siguiente
                <ChevronRight className="size-3.5" />
              </Button>
            ) : (
              <Button type="submit" className="w-1/2 justify-center gap-1.5 cursor-pointer" disabled={loading || success}>
                {loading ? "Creando..." : "Registrar"}
                {!loading && !success && <CheckCircle2 className="size-3.5" />}
              </Button>
            )}
          </div>

          <div className="text-[11px] text-muted-foreground text-center font-mono">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="text-foreground font-semibold hover:underline">
              Inicia sesión aquí
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
