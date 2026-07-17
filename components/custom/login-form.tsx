"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, User, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/hooks/useAuth"
import { toast } from "react-hot-toast"

export function LoginForm() {
  const router = useRouter()
  const { login, loading } = useAuth()
  const [identifier, setIdentifier] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [success, setSuccess] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!identifier) {
      toast.error("Por favor ingresa tu usuario o correo electrónico.")
      return
    }

    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres.")
      return
    }

    try {
      const res = await login({ identifier, password })
      setSuccess(true)
      toast.success("¡Autenticado con éxito! Redirigiendo...")
      
      // Save session details to localstorage
      localStorage.setItem("user_session", JSON.stringify({
        id: res.user.id,
        username: res.user.username,
        email: res.user.email,
        fullname: res.user.fullname,
        role: res.user.role,
        semester: res.user.semester,
        deaneryId: res.user.deaneryId,
        img_url: res.user.img_url,
        access_token: res.access_token
      }))
      
      // Force sync event for sidebar/header updates
      window.dispatchEvent(new Event("storage"))

      setTimeout(() => {
        router.push("/home")
      }, 1000)
    } catch (err: any) {
      toast.error(err.message || "Error al iniciar sesión. Inténtalo de nuevo.")
    }
  }

  const handleDevAutoLogin = async (username: string) => {
    setIdentifier(username)
    setPassword("admin123")
    try {
      const res = await login({ identifier: username, password: "admin123" })
      setSuccess(true)
      toast.success(`¡Autenticado como ${username === "admin" ? "Administrador" : "Estudiante"}!`)
      
      localStorage.setItem("user_session", JSON.stringify({
        id: res.user.id,
        username: res.user.username,
        email: res.user.email,
        fullname: res.user.fullname,
        role: res.user.role,
        semester: res.user.semester,
        deaneryId: res.user.deaneryId,
        img_url: res.user.img_url,
        access_token: res.access_token
      }))
      
      window.dispatchEvent(new Event("storage"))

      setTimeout(() => {
        router.push("/home")
      }, 1000)
    } catch (err: any) {
      toast.error(err.message || "Error en login automático")
    }
  }

  const isDev = process.env.NODE_ENV === "development"

  return (
    <Card className="w-full max-w-sm border border-border bg-card font-sans">
      <CardHeader className="border-b border-border/50 pb-4">
        <CardTitle className="text-sm font-semibold tracking-wide uppercase">
          Iniciar Sesión
        </CardTitle>
        <CardDescription>
          Ingresa tus credenciales para acceder a MiHorario.
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-4">
          {/* Identifier Input */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="identifier">Usuario o Correo</Label>
            <div className="relative flex items-center">
              <User className="absolute left-2.5 size-3.5 text-muted-foreground pointer-events-none" />
              <Input
                id="identifier"
                name="identifier"
                placeholder="ej: cgomez o cgomez@ucla.edu.ve"
                className="pl-8"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={loading || success}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contraseña</Label>
              <Link href="#" className="text-[10px] text-muted-foreground hover:underline hover:text-foreground">
                ¿La olvidaste?
              </Link>
            </div>
            <div className="relative flex items-center">
              <Lock className="absolute left-2.5 size-3.5 text-muted-foreground pointer-events-none" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
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
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-4 border-t border-border/50">
          <Button type="submit" className="w-full justify-center gap-1.5 cursor-pointer" disabled={loading || success}>
            {loading ? "Verificando..." : "Ingresar"}
            {!loading && !success && <ArrowRight className="size-3.5" />}
          </Button>

          {isDev && (
            <div className="flex gap-2 w-full justify-between items-center bg-muted/30 p-2 border border-dashed border-border rounded-lg">
              <span className="text-[9px] font-mono text-muted-foreground uppercase">Dev Mock:</span>
              <div className="flex gap-1.5">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="xs" 
                  onClick={() => handleDevAutoLogin("estudiante")}
                  className="text-[9px] py-1 h-6 cursor-pointer"
                  disabled={loading || success}
                >
                  Estudiante
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="xs" 
                  onClick={() => handleDevAutoLogin("admin")}
                  className="text-[9px] py-1 h-6 cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-500/5 animate-pulse"
                  disabled={loading || success}
                >
                  Admin
                </Button>
              </div>
            </div>
          )}

          <div className="text-[11px] text-muted-foreground text-center font-mono">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="text-foreground font-semibold hover:underline">
              Regístrate aquí
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
