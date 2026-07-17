"use client"

import * as React from "react"
import Link from "next/link"
import { 
  ArrowRight, 
  Calendar, 
  Sparkles, 
  Layers, 
  CheckCircle, 
  MousePointerClick, 
  BookOpen, 
  AlertTriangle, 
  Download, 
  RefreshCw,
  FileCheck,
  CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { MockSchedulerPreview } from "@/components/custom/mock-scheduler-preview"
import { cn } from "@/lib/utils"

// DCYT Careers list
const DCYT_CAREERS = [
  {
    name: "Ingeniería Informática",
    code: "INF",
    semesters: 10,
    color: "from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400",
    desc: "Formación integral en desarrollo de software, redes de comunicación y computación inteligente."
  },
  {
    name: "Ingeniería de Computación",
    code: "COM",
    semesters: 10,
    color: "from-purple-500/10 to-pink-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400",
    desc: "Diseño e integración de sistemas basados en hardware, microcontroladores e infraestructura física."
  },
  {
    name: "Lic. en Análisis de Sistemas",
    code: "LIS",
    semesters: 9,
    color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    desc: "Planificación, modelado matemático y optimización de flujos de información en organizaciones."
  },
  {
    name: "Ingeniería de Producción",
    code: "PRO",
    semesters: 10,
    color: "from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400",
    desc: "Gestión de cadenas de suministro, logística industrial y control de calidad operativa."
  },
  {
    name: "Lic. en Ciencias Matemáticas",
    code: "MAT",
    semesters: 10,
    color: "from-rose-500/10 to-red-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400",
    desc: "Investigación en matemáticas abstractas, modelado teórico y resolución de problemas complejos."
  },
  {
    name: "Licenciatura en Física",
    code: "FIS",
    semesters: 10,
    color: "from-cyan-500/10 to-sky-500/10 border-cyan-500/20 text-cyan-600 dark:text-cyan-400",
    desc: "Estudio de las leyes fundamentales de la materia, física cuántica y experimentación científica."
  }
]

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans">
      <Navbar />

      {/* Hero Section: Grid Split Layout */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-muted/30 to-background py-16 sm:py-24">
        {/* Subtle dot-matrix pattern */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-50" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Details (Left Aligned, 7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 border border-primary/20 bg-primary/5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="size-3.5" />
              <span>Universidad Centro Occidental Lisandro Alvarado</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              Planifica tu semestre <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                sin hojas de cálculo rotas
              </span>
            </h1>

            <p className="text-sm sm:text-base/relaxed text-muted-foreground max-w-xl">
              Diseña tus borradores de materias de forma interactiva en la UCLA DCYT. Evita colisiones de horarios, verifica cupos oficiales y exporta tu PDF listo para el proceso de inscripción.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/register">
                <Button size="lg" className="gap-2 shadow-md">
                  Comenzar ahora
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="#demo">
                <Button size="lg" variant="outline">
                  Ver Simulador
                </Button>
              </Link>
            </div>

            {/* Quick Stats Grid */}
            <div className="pt-8 grid grid-cols-3 gap-6 border-t border-border/80 max-w-md">
              <div>
                <div className="text-xl font-extrabold text-foreground">6 Carreras</div>
                <div className="text-[10px] text-muted-foreground uppercase font-semibold">DCYT Activas</div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-foreground">100% Digital</div>
                <div className="text-[10px] text-muted-foreground uppercase font-semibold">Carga de Datos</div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-foreground">ilimitado</div>
                <div className="text-[10px] text-muted-foreground uppercase font-semibold">Borradores</div>
              </div>
            </div>
          </div>

          {/* Hero Mockup (Right Aligned, 5 cols) */}
          <div className="lg:col-span-5 relative w-full flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card shadow-xl overflow-hidden p-3 space-y-3">
              {/* Window Header controls */}
              <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 block" />
                </div>
                <span className="text-[9px] font-mono text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md border border-border">
                  horario_borrador_1.pdf
                </span>
              </div>

              {/* Mockup Schedule Preview Grid */}
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-primary/5 p-2 rounded-lg border border-primary/10">
                  <div className="text-[10px]">
                    <div className="font-bold text-foreground">Álgebra Lineal</div>
                    <div className="text-muted-foreground text-[8px]">Sección A • 4 créditos</div>
                  </div>
                  <span className="text-[9px] bg-primary text-primary-foreground font-semibold px-2 py-0.5 rounded-md shadow-xs">
                    07:00 AM - 08:30 AM
                  </span>
                </div>

                <div className="flex justify-between items-center bg-accent/10 p-2 rounded-lg border border-accent/20">
                  <div className="text-[10px]">
                    <div className="font-bold text-foreground">Algoritmos y Programación II</div>
                    <div className="text-muted-foreground text-[8px]">Sección B • Prof. Carlos M.</div>
                  </div>
                  <span className="text-[9px] bg-accent text-accent-foreground font-semibold px-2 py-0.5 rounded-md shadow-xs">
                    10:10 AM - 11:40 AM
                  </span>
                </div>

                {/* Overlap Clash illustration warning */}
                <div className="border border-destructive/30 bg-destructive/5 rounded-lg p-2.5 flex items-start gap-2">
                  <AlertTriangle className="size-4 text-destructive shrink-0 mt-0.5" />
                  <div className="text-[9px]/tight text-destructive">
                    <div className="font-bold uppercase tracking-wider">Conflicto de Horario</div>
                    <span>Cálculo I (Sec B) choca el Martes con Álgebra (Sec B).</span>
                  </div>
                </div>
              </div>

              {/* Sidebar card preview snippet */}
              <div className="bg-muted/40 p-2.5 rounded-xl border border-border/60 flex items-center justify-between text-[9px] font-mono">
                <span className="text-muted-foreground">Estado: 2 Borradores guardados</span>
                <span className="flex items-center gap-1 text-emerald-500 font-bold">
                  <CheckCircle2 className="size-3" /> Listo para Inscribir
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Careers Catalog section */}
      <section id="carreras" className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="space-y-3 mb-10 max-w-xl mx-auto">
          <div className="inline-block border border-border bg-muted/60 px-3 py-1 rounded-full text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">
            Decanato de Ciencias y Tecnología
          </div>
          <h2 className="font-heading text-2xl font-bold text-foreground uppercase tracking-wide">
            Planificador de Carreras DCYT
          </h2>
          <p className="text-xs text-muted-foreground">
            Soportamos los pensums de estudio y la oferta de asignaturas de todas las áreas académicas del decanato.
          </p>
        </div>

        {/* Careers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DCYT_CAREERS.map((c) => (
            <div 
              key={c.code}
              className={cn(
                "border rounded-2xl p-5 text-left flex flex-col justify-between transition-all bg-gradient-to-br hover:shadow-md hover:scale-[1.01]",
                c.color
              )}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-background px-2.5 py-0.5 rounded-full border border-border">
                    Cod: {c.code}
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {c.semesters} Semestres
                  </span>
                </div>
                <h3 className="font-heading text-sm font-bold text-foreground uppercase pt-1">
                  {c.name}
                </h3>
                <p className="text-[11px]/relaxed text-muted-foreground">
                  {c.desc}
                </p>
              </div>
              <div className="pt-4 border-t border-border/30 mt-4 flex justify-between items-center text-[10px] font-mono text-muted-foreground">
                <span>Materias actualizadas</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 block animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Visual Workflow Steps (Timeline Card Layout) */}
      <section className="border-t border-b border-border bg-muted/20 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-3 mb-12">
            <h2 className="font-heading text-2xl font-bold uppercase tracking-wide text-foreground">
              Cómo funciona el Planificador
            </h2>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Tres sencillos pasos para asegurar un horario óptimo antes del día de tu inscripción académica.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-card border border-border p-6 rounded-2xl flex flex-col items-center text-center space-y-4">
              <div className="flex h-10 w-10 items-center justify-center bg-primary/10 text-primary rounded-xl">
                <RefreshCw className="size-5" />
              </div>
              <h3 className="font-heading text-xs font-bold text-foreground uppercase tracking-wider">
                1. Carga Académica
              </h3>
              <p className="text-[11px]/relaxed text-muted-foreground">
                Selecciona tu carrera y semestre actual. El sistema carga automáticamente las materias correspondientes y la lista oficial de secciones.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-card border border-border p-6 rounded-2xl flex flex-col items-center text-center space-y-4">
              <div className="flex h-10 w-10 items-center justify-center bg-primary/10 text-primary rounded-xl">
                <Layers className="size-5" />
              </div>
              <h3 className="font-heading text-xs font-bold text-foreground uppercase tracking-wider">
                2. Organiza y Compara
              </h3>
              <p className="text-[11px]/relaxed text-muted-foreground">
                Crea uno o varios borradores de horarios. Arrastra asignaturas al canvas y compara las alternativas para elegir el mejor bloque académico.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-card border border-border p-6 rounded-2xl flex flex-col items-center text-center space-y-4">
              <div className="flex h-10 w-10 items-center justify-center bg-primary/10 text-primary rounded-xl">
                <FileCheck className="size-5" />
              </div>
              <h3 className="font-heading text-xs font-bold text-foreground uppercase tracking-wider">
                3. Asegura e Inscribe
              </h3>
              <p className="text-[11px]/relaxed text-muted-foreground">
                Verifica posibles choques de horario de forma automática. Una vez validado, exporta tu borrador o PDF y realiza tu inscripción sin contratiempos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Interactive Simulator Section */}
      <section id="demo" className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-3 mb-8 text-center">
          <div className="inline-block border border-border bg-muted/60 px-3 py-1 rounded-full text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">
            Área Experimental
          </div>
          <h2 className="font-heading text-2xl font-bold text-foreground uppercase tracking-wide">
            Simulador de Horarios en Tiempo Real
          </h2>
          <p className="max-w-xl mx-auto text-xs text-muted-foreground">
            Diseña tu plan de estudio de prueba directamente desde esta demostración interactiva. El simulador detecta colisiones de horas automáticamente.
          </p>
        </div>

        {/* The Live Interactive preview container */}
        <div className="border border-border p-5 bg-card/60 backdrop-blur-xs rounded-2xl shadow-md relative">
          <div className="absolute top-0 right-6 -translate-y-1/2 border border-border bg-background px-3 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400 shadow-xs flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block animate-pulse" />
            Entorno en vivo
          </div>
          <MockSchedulerPreview />
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="mx-auto w-full max-w-3xl px-4 py-16 text-center space-y-6">
        <h2 className="font-heading text-3xl font-extrabold text-foreground tracking-tight">
          ¿Listo para optimizar tu inscripción?
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
          Únete a los estudiantes del DCYT UCLA que han simplificado su planificación académica. Crea tu cuenta gratuita hoy mismo.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/register">
            <Button size="lg" className="gap-2 shadow-md">
              Crear mi cuenta gratis
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
