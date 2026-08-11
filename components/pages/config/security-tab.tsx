"use client"

import * as React from "react"
import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { toast } from "react-hot-toast"

interface SecurityTabProps {
  changePassword: (data: any) => Promise<any>
}

export function SecurityTab({ changePassword }: SecurityTabProps) {
  const [currentPassword, setCurrentPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [changingPass, setChangingPass] = React.useState(false)

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error("La confirmación de contraseña nueva no coincide")
      return
    }

    setChangingPass(true)
    try {
      await changePassword({ currentPassword, newPassword })
      toast.success("¡Contraseña actualizada con éxito!")
      setCurrentPassword("")
      newPassword && setNewPassword("")
      confirmPassword && setConfirmPassword("")
    } catch (e: any) {
      toast.error(e.message || "Error al cambiar contraseña")
    } finally {
      setChangingPass(false)
    }
  }

  return (
    <Card className="border-border animate-in fade-in duration-150 font-sans">
      <CardHeader className="pb-3 border-b border-border/50">
        <CardTitle className="text-xs uppercase font-bold text-foreground flex items-center gap-1.5">
          <Lock className="size-4 text-primary" />
          Cambiar Contraseña
        </CardTitle>
        <CardDescription>
          Protege tu cuenta actualizando periódicamente tus credenciales de acceso.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <form onSubmit={handleSavePassword} className="space-y-4 max-w-sm">
          {/* Current Password */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="currPass">Contraseña Actual</Label>
            <Input
              id="currPass"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={changingPass}
            />
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="newPass">Nueva Contraseña</Label>
            <Input
              id="newPass"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={changingPass}
            />
          </div>

          {/* Confirm New Password */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="confirmPass">Confirmar Nueva Contraseña</Label>
            <Input
              id="confirmPass"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={changingPass}
            />
          </div>

          <div className="pt-4 border-t border-border flex justify-end">
            <Button 
              type="submit" 
              className="gap-1.5 cursor-pointer text-xs" 
              disabled={changingPass}
            >
              <Lock className="size-3.5" />
              {changingPass ? "Actualizando..." : "Actualizar Contraseña"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
