"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { X, Sun, Moon, Laptop, Check, Pipette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ThemeCustomizerDialogProps {
  isOpen: boolean
  onClose: () => void
}

interface PresetColor {
  name: string
  h: number
  s: number
  l: number
  primaryBg: string
  accentBg: string
}

const PRESET_COLORS: PresetColor[] = [
  { name: "Azul UCLA", h: 215, s: 80, l: 40, primaryBg: "#1542a4", accentBg: "#dbeafe" },
  { name: "Azul Acero", h: 210, s: 25, l: 45, primaryBg: "#546e7a", accentBg: "#eceff1" },
  { name: "Azul Profundo", h: 222, s: 65, l: 35, primaryBg: "#1e3a8a", accentBg: "#dbeafe" },
  { name: "Gris Metálico", h: 220, s: 10, l: 50, primaryBg: "#64748b", accentBg: "#f1f5f9" },
  { name: "Verde Bosque", h: 145, s: 60, l: 28, primaryBg: "#1b5e20", accentBg: "#e8f5e9" },
  { name: "Menta", h: 165, s: 70, l: 35, primaryBg: "#00796b", accentBg: "#e0f2f1" },
  { name: "Verde DCYT", h: 140, s: 65, l: 32, primaryBg: "#2e7d32", accentBg: "#e8f5e9" },
  { name: "Oliva", h: 85, s: 50, l: 30, primaryBg: "#558b2f", accentBg: "#f1f8e9" },
  { name: "Oro UCLA", h: 48, s: 90, l: 45, primaryBg: "#f57f17", accentBg: "#fffde7" },
  { name: "Naranja Bronce", h: 30, s: 80, l: 38, primaryBg: "#e65100", accentBg: "#fff3e0" },
  { name: "Sand", h: 25, s: 30, l: 45, primaryBg: "#8d6e63", accentBg: "#efebe9" },
  { name: "Terracota", h: 12, s: 65, l: 42, primaryBg: "#d84315", accentBg: "#fbe9e7" },
  { name: "Rojo Carmín", h: 0, s: 75, l: 40, primaryBg: "#c62828", accentBg: "#ffebee" },
  { name: "Vino", h: 335, s: 60, l: 35, primaryBg: "#880e4f", accentBg: "#fce4ec" },
  { name: "Morado", h: 275, s: 60, l: 38, primaryBg: "#4a148c", accentBg: "#f3e5f5" },
]

export function ThemeCustomizerDialog({ isOpen, onClose }: ThemeCustomizerDialogProps) {
  const [mounted, setMounted] = React.useState(false)
  const [activeMode, setActiveMode] = React.useState<"light" | "dark" | "system">("dark")
  const [activeColorIdx, setActiveColorIdx] = React.useState<number>(0)
  const [customColor, setCustomColor] = React.useState("#1542a4")
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Ensure portal only mounts on client side
  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (!isOpen) return
    try {
      const savedMode = (localStorage.getItem("app-theme-mode") || "dark") as "light" | "dark" | "system"
      const savedHue = localStorage.getItem("app-theme-hue")
      const savedSat = localStorage.getItem("app-theme-sat")
      const savedLight = localStorage.getItem("app-theme-light")
      const savedHex = localStorage.getItem("app-theme-custom-hex") || "#1542a4"

      setActiveMode(savedMode)
      setCustomColor(savedHex)

      if (savedHue && savedSat && savedLight) {
        const h = parseInt(savedHue)
        const s = parseInt(savedSat)
        const l = parseInt(savedLight)
        const idx = PRESET_COLORS.findIndex((c) => c.h === h && c.s === s && c.l === l)
        setActiveColorIdx(idx >= 0 ? idx : -1)
      }
    } catch (_) {}
  }, [isOpen])

  if (!isOpen || !mounted) return null

  const hexToHsl = (hex: string) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255
    let g = parseInt(hex.slice(3, 5), 16) / 255
    let b = parseInt(hex.slice(5, 7), 16) / 255
    let max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h = 0, s = 0, l = (max + min) / 2
    if (max !== min) {
      let d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    }
  }

  const applyTheme = (mode: "light" | "dark" | "system", h: number, s: number, l: number, customHex?: string) => {
    try {
      localStorage.setItem("app-theme-mode", mode)
      localStorage.setItem("app-theme-hue", h.toString())
      localStorage.setItem("app-theme-sat", s.toString())
      localStorage.setItem("app-theme-light", l.toString())
      if (customHex) {
        localStorage.setItem("app-theme-custom-hex", customHex)
      }

      let isDark = mode === "dark"
      if (mode === "system") {
        isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      }

      const root = document.documentElement
      
      if (isDark) {
        root.classList.add("dark")
        root.style.setProperty("--background", `hsl(${h}, 15%, 11%)`)
        root.style.setProperty("--foreground", `hsl(${h}, 10%, 96%)`)
        root.style.setProperty("--card", `hsl(${h}, 15%, 14%)`)
        root.style.setProperty("--card-foreground", `hsl(${h}, 10%, 96%)`)
        root.style.setProperty("--popover", `hsl(${h}, 15%, 14%)`)
        root.style.setProperty("--popover-foreground", `hsl(${h}, 10%, 96%)`)
        
        root.style.setProperty("--primary", `hsl(${h}, ${s}%, ${l}%)`)
        root.style.setProperty("--primary-foreground", l < 50 ? "#ffffff" : "#000000")
        
        root.style.setProperty("--secondary", `hsl(${h}, ${Math.max(10, s - 30)}%, 22%)`)
        root.style.setProperty("--secondary-foreground", `hsl(${h}, 10%, 96%)`)
        
        root.style.setProperty("--muted", `hsl(${h}, ${Math.max(10, s - 40)}%, 16%)`)
        root.style.setProperty("--muted-foreground", `hsl(${h}, 10%, 65%)`)
        root.style.setProperty("--accent", `hsl(${h}, ${s}%, ${Math.min(90, l + 15)}%)`)
        root.style.setProperty("--accent-foreground", l + 15 < 55 ? "#ffffff" : "#000000")
        
        root.style.setProperty("--border", `hsl(${h}, ${Math.max(10, s - 30)}%, 18%)`)
        root.style.setProperty("--input", `hsl(${h}, ${Math.max(10, s - 30)}%, 18%)`)
        root.style.setProperty("--ring", `hsl(${h}, ${s}%, ${l}%)`)
        
        root.style.setProperty("--sidebar", `hsl(${h}, 15%, 9%)`)
        root.style.setProperty("--sidebar-foreground", `hsl(${h}, 10%, 96%)`)
        root.style.setProperty("--sidebar-primary", `hsl(${h}, ${s}%, ${l}%)`)
        root.style.setProperty("--sidebar-primary-foreground", l < 50 ? "#ffffff" : "#000000")
        root.style.setProperty("--sidebar-accent", `hsl(${h}, ${Math.max(10, s - 30)}%, 16%)`)
        root.style.setProperty("--sidebar-accent-foreground", `hsl(${h}, 10%, 96%)`)
        root.style.setProperty("--sidebar-border", `hsl(${h}, ${Math.max(10, s - 30)}%, 14%)`)
        root.style.setProperty("--sidebar-ring", `hsl(${h}, ${s}%, ${l}%)`)
      } else {
        root.classList.remove("dark")
        root.style.setProperty("--background", `hsl(${h}, 20%, 98%)`)
        root.style.setProperty("--foreground", `hsl(${h}, 25%, 15%)`)
        root.style.setProperty("--card", `#ffffff`)
        root.style.setProperty("--card-foreground", `hsl(${h}, 25%, 15%)`)
        root.style.setProperty("--popover", `#ffffff`)
        root.style.setProperty("--popover-foreground", `hsl(${h}, 25%, 15%)`)
        
        root.style.setProperty("--primary", `hsl(${h}, ${s}%, ${l}%)`)
        root.style.setProperty("--primary-foreground", l < 55 ? "#ffffff" : "#000000")
        
        root.style.setProperty("--secondary", `hsl(${h}, 25%, 92%)`)
        root.style.setProperty("--secondary-foreground", `hsl(${h}, 25%, 20%)`)
        
        root.style.setProperty("--muted", `hsl(${h}, 10%, 96%)`)
        root.style.setProperty("--muted-foreground", `hsl(${h}, 15%, 45%)`)
        root.style.setProperty("--accent", `hsl(${h}, ${s}%, ${Math.max(10, l - 10)}%)`)
        root.style.setProperty("--accent-foreground", l - 10 < 55 ? "#ffffff" : "#000000")
        
        root.style.setProperty("--border", `hsl(${h}, 15%, 90%)`)
        root.style.setProperty("--input", `hsl(${h}, 15%, 90%)`)
        root.style.setProperty("--ring", `hsl(${h}, ${s}%, ${l}%)`)
        
        root.style.setProperty("--sidebar", `hsl(${h}, 15%, 96%)`)
        root.style.setProperty("--sidebar-foreground", `hsl(${h}, 25%, 15%)`)
        root.style.setProperty("--sidebar-primary", `hsl(${h}, ${s}%, ${l}%)`)
        root.style.setProperty("--sidebar-primary-foreground", l < 55 ? "#ffffff" : "#000000")
        root.style.setProperty("--sidebar-accent", `hsl(${h}, 15%, 92%)`)
        root.style.setProperty("--sidebar-accent-foreground", `hsl(${h}, 25%, 15%)`)
        root.style.setProperty("--sidebar-border", `hsl(${h}, 15%, 88%)`)
        root.style.setProperty("--sidebar-ring", `hsl(${h}, ${s}%, ${l}%)`)
      }

      root.setAttribute("data-theme", `custom-${h}`)
    } catch (e) {
      console.error(e)
    }
  }

  const handleModeChange = (mode: "light" | "dark" | "system") => {
    setActiveMode(mode)
    let h = 215, s = 80, l = 40
    if (activeColorIdx >= 0) {
      const preset = PRESET_COLORS[activeColorIdx]
      h = preset.h
      s = preset.s
      l = preset.l
    } else {
      const hsl = hexToHsl(customColor)
      h = hsl.h
      s = hsl.s
      l = hsl.l
    }
    applyTheme(mode, h, s, l)
  }

  const handlePresetSelect = (idx: number) => {
    setActiveColorIdx(idx)
    const preset = PRESET_COLORS[idx]
    applyTheme(activeMode, preset.h, preset.s, preset.l)
  }

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setCustomColor(val)
    setActiveColorIdx(-1)
    const hsl = hexToHsl(val)
    applyTheme(activeMode, hsl.h, hsl.s, hsl.l, val)
  }

  // Render to document.body using a React Portal to escape backdrop-filters & overflows
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dialog Backdrop Overlay */}
      <div 
        className="fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity duration-150" 
        onClick={onClose}
      />

      {/* Customizer Card Panel */}
      <div className="relative w-full max-w-[340px] bg-card border border-border rounded-2xl shadow-xl z-50 flex flex-col max-h-[90vh] overflow-hidden text-xs text-foreground font-sans animate-in zoom-in-95 duration-100">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 px-4 py-3 shrink-0">
          <h2 className="text-sm font-semibold tracking-wide text-foreground font-heading">
            Personalizar MiHorario
          </h2>
          <Button variant="ghost" size="icon-xs" onClick={onClose} className="rounded-full">
            <X className="size-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          
          {/* Modes Segmented Toggles (Diseño) */}
          <div className="space-y-2">
            <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider font-heading">
              Diseño
            </h3>
            <div className="grid grid-cols-3 gap-1 bg-muted/40 p-1 rounded-xl border border-border/60">
              <button
                type="button"
                onClick={() => handleModeChange("light")}
                className={cn(
                  "flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-[10px] font-medium transition-all cursor-pointer",
                  activeMode === "light"
                    ? "bg-card text-foreground shadow-xs border border-border"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Sun className="size-3.5" />
                <span>Claro</span>
              </button>
              
              <button
                type="button"
                onClick={() => handleModeChange("dark")}
                className={cn(
                  "flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-[10px] font-medium transition-all cursor-pointer",
                  activeMode === "dark"
                    ? "bg-card text-foreground shadow-xs border border-border"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Moon className="size-3.5" />
                <span>Oscuro</span>
              </button>

              <button
                type="button"
                onClick={() => handleModeChange("system")}
                className={cn(
                  "flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-[10px] font-medium transition-all cursor-pointer",
                  activeMode === "system"
                    ? "bg-card text-foreground shadow-xs border border-border"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Laptop className="size-3.5" />
                <span>Dispositivo</span>
              </button>
            </div>
          </div>

          {/* Color Presets Grid */}
          <div className="space-y-2">
            <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider font-heading">
              Paleta de Colores
            </h3>
            
            <div className="grid grid-cols-4 gap-3 justify-items-center">
              {PRESET_COLORS.map((preset, idx) => {
                const isActive = activeColorIdx === idx
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handlePresetSelect(idx)}
                    className="relative w-12 h-12 rounded-full border border-border bg-muted/30 overflow-hidden flex flex-col cursor-pointer transition-all hover:scale-105 active:scale-95 group focus:outline-hidden"
                    title={preset.name}
                  >
                    <div 
                      className="w-full h-1/2" 
                      style={{ backgroundColor: preset.primaryBg }}
                    />
                    <div 
                      className="w-full h-1/2" 
                      style={{ backgroundColor: preset.accentBg }}
                    />

                    {isActive && (
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                        <div className="bg-primary border border-primary-foreground text-primary-foreground p-0.5 rounded-full shadow-sm">
                          <Check className="size-3" />
                        </div>
                      </div>
                    )}
                  </button>
                )
              })}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "relative w-12 h-12 rounded-full border border-dashed flex flex-col items-center justify-center bg-muted/10 cursor-pointer transition-all hover:bg-muted/30 hover:scale-105 active:scale-95 focus:outline-hidden",
                  activeColorIdx === -1 ? "border-primary" : "border-border"
                )}
                title="Color Personalizado"
              >
                <div 
                  className="absolute inset-0 rounded-full opacity-60" 
                  style={{ backgroundColor: customColor }}
                />
                
                <div className="relative z-10 bg-background border border-border text-foreground p-1 rounded-full shadow-xs">
                  <Pipette className="size-3.5" />
                </div>

                <input
                  ref={fileInputRef}
                  type="color"
                  value={customColor}
                  onChange={handleCustomColorChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full pointer-events-none"
                />

                {activeColorIdx === -1 && (
                  <div className="absolute -top-1.5 -right-1.5 bg-primary border border-primary-foreground text-primary-foreground p-0.5 rounded-full shadow-sm z-20">
                    <Check className="size-2.5" />
                  </div>
                )}
              </button>
            </div>
          </div>

        </div>

        <div className="p-3 bg-muted/40 border-t border-border/50 text-[10px] text-center text-muted-foreground font-mono">
          Tema activo: {activeColorIdx >= 0 ? PRESET_COLORS[activeColorIdx].name : "Personalizado"}
        </div>
      </div>
    </div>,
    document.body
  )
}
