"use client"

import * as React from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { RouteGuard } from "@/components/custom/route-guard"

export default function LoggedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  return (
    <RouteGuard>
      <div className="flex min-h-screen bg-background text-foreground font-sans overflow-x-hidden relative">
        {/* Sidebar on the left */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Grid viewport on the right */}
        <div className="flex-1 flex flex-col min-w-0 bg-background h-screen overflow-hidden">
          {/* Profile and Theme toolbar header */}
          <Header onMenuClick={() => setSidebarOpen(true)} />

          {/* Nested page view scrolling container */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {children}
          </div>
        </div>
      </div>
    </RouteGuard>
  )
}
