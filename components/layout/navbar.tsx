"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MousePointerClick, Menu, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)
  const [isMounted, setIsMounted] = React.useState(false)
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const session = localStorage.getItem("user_session")
        setIsLoggedIn(!!session)
      }
    }
    checkAuth()
    
    window.addEventListener("storage", checkAuth)
    return () => window.removeEventListener("storage", checkAuth)
  }, [])

  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/register")

  const displayLoggedIn = isMounted && isLoggedIn

  const navLinks = [
    { name: "Inicio", href: "/" },
    ...(displayLoggedIn ? [{ name: "Planificador", href: "/home" }] : []),
    { name: "DCYT UCLA", href: "#dcyt" },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-md">
      {/* 3-Column Grid to guarantee absolute mathematical centering of links */}
      <div className="mx-auto grid grid-cols-3 h-14 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        
        {/* Column 1: Brand Logo (Left Aligned) */}
        <div className="flex items-center justify-start">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-wider hover:opacity-90">
            <div className="flex h-7 w-7 items-center justify-center bg-primary text-primary-foreground rounded-lg shadow-sm">
              <MousePointerClick className="size-4" />
            </div>
            <span className="text-foreground font-bold">
              Mi<span className="text-muted-foreground font-normal">Horario</span>
            </span>
            <span className="hidden sm:inline-block rounded-md border border-border bg-muted/50 px-1.5 py-0.5 text-[9px] font-medium tracking-normal text-muted-foreground">
              DCYT
            </span>
          </Link>
        </div>

        {/* Column 2: Navigation Links (Centermost Alignment) */}
        <div className="flex items-center justify-center">
          {!isAuthPage && (
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "text-xs font-medium text-muted-foreground transition-colors hover:text-foreground relative py-1",
                    pathname === link.href && "text-foreground font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-primary after:rounded-full"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          )}
        </div>

        {/* Column 3: Action Buttons (Right Aligned) */}
        <div className="flex items-center justify-end gap-2">
          {isAuthPage ? (
            <Link href="/">
              <Button variant="ghost" size="sm">
                Volver al Inicio
              </Button>
            </Link>
          ) : displayLoggedIn ? (
            <Link href="/home">
              <Button size="sm" className="gap-1 shadow-sm cursor-pointer">
                Ir al Panel
                <ArrowRight className="size-3" />
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login" className="hidden xs:inline-block">
                <Button variant="ghost" size="sm">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="gap-1 shadow-sm cursor-pointer">
                  Registrarse
                  <ArrowRight className="size-3" />
                </Button>
              </Link>
            </>
          )}

          {/* Mobile Menu Toggle */}
          {!isAuthPage && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex h-8 w-8 items-center justify-center border border-border hover:bg-muted text-muted-foreground hover:text-foreground md:hidden rounded-lg focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isOpen && !isAuthPage && (
        <div className="border-b border-border bg-background px-4 py-4 md:hidden animate-in fade-in slide-in-from-top-2 duration-100">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "text-xs font-medium text-muted-foreground transition-colors hover:text-foreground py-1",
                  pathname === link.href && "text-foreground font-semibold"
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-border flex flex-col gap-2">
              {displayLoggedIn ? (
                <Link href="/home" onClick={() => setIsOpen(false)}>
                  <Button className="w-full justify-center cursor-pointer" size="sm">
                    Ir al Panel
                  </Button>
                </Link>
              ) : (
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full justify-center cursor-pointer" size="sm">
                    Iniciar Sesión
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
