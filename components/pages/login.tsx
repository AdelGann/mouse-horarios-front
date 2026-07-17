"use client"

import * as React from "react"
import Link from "next/link"
import { MousePointerClick } from "lucide-react"
import { LoginForm } from "@/components/custom/login-form"

export function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-mono relative items-center justify-center p-4">
      {/* Subtle grid background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35" />

      {/* Header Link */}
      <div className="mb-6 flex justify-center">
        <Link href="/" className="flex items-center gap-2 font-heading text-sm font-semibold tracking-wider hover:opacity-90">
          <div className="flex h-7 w-7 items-center justify-center bg-primary text-primary-foreground">
            <MousePointerClick className="size-4" />
          </div>
          <span className="text-foreground">Mi<span className="text-muted-foreground font-light">Horario</span></span>
          <span className="rounded-none border border-foreground/10 px-1.5 py-0.5 text-[9px] font-medium tracking-normal text-muted-foreground">
            DCYT
          </span>
        </Link>
      </div>

      {/* Form Card */}
      <LoginForm />

      {/* Back link */}
      <div className="mt-8 text-[11px] text-muted-foreground font-mono">
        <Link href="/" className="hover:underline hover:text-foreground">
          ← Volver a la landing page
        </Link>
      </div>
    </div>
  )
}
