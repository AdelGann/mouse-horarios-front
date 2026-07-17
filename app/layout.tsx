import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/app/globals.css"
import { Toaster } from "react-hot-toast"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "MiHorario | UCLA DCYT",
  description: "Planificador inteligente de horarios para el Decanato de Ciencias y Tecnología de la UCLA. Diseña múltiples borradores de tus materias, evita colisiones de secciones y simplifica tu inscripción.",
  keywords: ["UCLA", "DCYT", "Horarios", "Inscripción", "Estudiantes", "Universidad", "Barquisimeto"],
  authors: [{ name: "Comunidad Estudiantil DCYT" }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" data-theme="ucla-dark" className={`${inter.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const mode = localStorage.getItem('app-theme-mode') || 'dark';
                const h = parseInt(localStorage.getItem('app-theme-hue') || '215');
                const s = parseInt(localStorage.getItem('app-theme-sat') || '80');
                const l = parseInt(localStorage.getItem('app-theme-light') || '40');
                
                let isDark = mode === 'dark';
                if (mode === 'system') {
                  isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                }
                
                const root = document.documentElement;
                root.setAttribute('data-theme', 'custom-' + h);
                
                if (isDark) {
                  root.classList.add('dark');
                  root.style.setProperty('--background', 'hsl(' + h + ', 15%, 11%)');
                  root.style.setProperty('--foreground', 'hsl(' + h + ', 10%, 96%)');
                  root.style.setProperty('--card', 'hsl(' + h + ', 15%, 14%)');
                  root.style.setProperty('--card-foreground', 'hsl(' + h + ', 10%, 96%)');
                  root.style.setProperty('--popover', 'hsl(' + h + ', 15%, 14%)');
                  root.style.setProperty('--popover-foreground', 'hsl(' + h + ', 10%, 96%)');
                  
                  root.style.setProperty('--primary', 'hsl(' + h + ', ' + s + '%, ' + l + '%)');
                  root.style.setProperty('--primary-foreground', l < 50 ? '#ffffff' : '#000000');
                  root.style.setProperty('--secondary', 'hsl(' + h + ', ' + Math.max(10, s - 30) + '%, 22%)');
                  root.style.setProperty('--secondary-foreground', 'hsl(' + h + ', 10%, 96%)');
                  root.style.setProperty('--muted', 'hsl(' + h + ', ' + Math.max(10, s - 40) + '%, 16%)');
                  root.style.setProperty('--muted-foreground', 'hsl(' + h + ', 10%, 65%)');
                  root.style.setProperty('--accent', 'hsl(' + h + ', ' + s + '%, ' + Math.min(90, l + 15) + '%)');
                  root.style.setProperty('--accent-foreground', l + 15 < 55 ? '#ffffff' : '#000000');
                  root.style.setProperty('--border', 'hsl(' + h + ', ' + Math.max(10, s - 30) + '%, 18%)');
                  root.style.setProperty('--input', 'hsl(' + h + ', ' + Math.max(10, s - 30) + '%, 18%)');
                  root.style.setProperty('--ring', 'hsl(' + h + ', ' + s + '%, ' + l + '%)');
                  
                  root.style.setProperty('--sidebar', 'hsl(' + h + ', 15%, 9%)');
                  root.style.setProperty('--sidebar-foreground', 'hsl(' + h + ', 10%, 96%)');
                  root.style.setProperty('--sidebar-primary', 'hsl(' + h + ', ' + s + '%, ' + l + '%)');
                  root.style.setProperty('--sidebar-primary-foreground', l < 50 ? '#ffffff' : '#000000');
                  root.style.setProperty('--sidebar-accent', 'hsl(' + h + ', ' + Math.max(10, s - 30) + '%, 16%)');
                  root.style.setProperty('--sidebar-accent-foreground', 'hsl(' + h + ', 10%, 96%)');
                  root.style.setProperty('--sidebar-border', 'hsl(' + h + ', ' + Math.max(10, s - 30) + '%, 14%)');
                } else {
                  root.classList.remove('dark');
                  root.style.setProperty('--background', 'hsl(' + h + ', 20%, 98%)');
                  root.style.setProperty('--foreground', 'hsl(' + h + ', 25%, 15%)');
                  root.style.setProperty('--card', '#ffffff');
                  root.style.setProperty('--card-foreground', 'hsl(' + h + ', 25%, 15%)');
                  root.style.setProperty('--popover', '#ffffff');
                  root.style.setProperty('--popover-foreground', 'hsl(' + h + ', 25%, 15%)');
                  
                  root.style.setProperty('--primary', 'hsl(' + h + ', ' + s + '%, ' + l + '%)');
                  root.style.setProperty('--primary-foreground', l < 55 ? '#ffffff' : '#000000');
                  root.style.setProperty('--secondary', 'hsl(' + h + ', 25%, 92%)');
                  root.style.setProperty('--secondary-foreground', 'hsl(' + h + ', 25%, 20%)');
                  root.style.setProperty('--muted', 'hsl(' + h + ', 10%, 96%)');
                  root.style.setProperty('--muted-foreground', 'hsl(' + h + ', 15%, 45%)');
                  root.style.setProperty('--accent', 'hsl(' + h + ', ' + s + '%, ' + Math.max(10, l - 10) + '%)');
                  root.style.setProperty('--accent-foreground', l - 10 < 55 ? '#ffffff' : '#000000');
                  root.style.setProperty('--border', 'hsl(' + h + ', 15%, 90%)');
                  root.style.setProperty('--input', 'hsl(' + h + ', 15%, 90%)');
                  root.style.setProperty('--ring', 'hsl(' + h + ', ' + s + '%, ' + l + '%)');
                  
                  root.style.setProperty('--sidebar', 'hsl(' + h + ', 15%, 96%)');
                  root.style.setProperty('--sidebar-foreground', 'hsl(' + h + ', 25%, 15%)');
                  root.style.setProperty('--sidebar-primary', 'hsl(' + h + ', ' + s + '%, ' + l + '%)');
                  root.style.setProperty('--sidebar-primary-foreground', l < 55 ? '#ffffff' : '#000000');
                  root.style.setProperty('--sidebar-accent', 'hsl(' + h + ', 15%, 92%)');
                  root.style.setProperty('--sidebar-accent-foreground', 'hsl(' + h + ', 25%, 15%)');
                  root.style.setProperty('--sidebar-border', 'hsl(' + h + ', 15%, 88%)');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen bg-background text-foreground font-sans">
        {children}
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  )
}
