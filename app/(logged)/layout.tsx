import * as React from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { RouteGuard } from "@/components/custom/route-guard"

export default function LoggedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RouteGuard>
      <div className="flex min-h-screen bg-background text-foreground font-sans">
        {/* Sidebar on the left */}
        <Sidebar />

        {/* Grid viewport on the right */}
        <div className="flex-1 flex flex-col min-w-0 bg-background">
          {/* Profile and Theme toolbar header */}
          <Header />

          {/* Nested page view scrolling container */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </RouteGuard>
  )
}
