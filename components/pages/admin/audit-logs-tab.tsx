"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

interface AuditLogsTabProps {
  logs: any[]
}

export function AuditLogsTab({ logs }: AuditLogsTabProps) {
  return (
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
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 font-sans">
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
  )
}
