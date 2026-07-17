import Link from "next/link"
import { MousePointerClick, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-muted/30 py-8 text-muted-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-heading text-sm font-semibold tracking-wider text-foreground">
              <div className="flex h-6 w-6 items-center justify-center bg-primary text-primary-foreground">
                <MousePointerClick className="size-3.5" />
              </div>
              <span>Mi<span className="font-light text-muted-foreground">Horario</span></span>
            </div>
            <p className="text-[11px]/relaxed max-w-xs">
              El planificador de horarios inteligente para el Decanato de Ciencias y Tecnología (DCYT) de la UCLA. Diseña tus materias, evita colisiones y prepara tu inscripción con facilidad.
            </p>
          </div>

          {/* Col 2: Carreras DCYT */}
          <div>
            <h3 className="font-heading text-xs font-semibold text-foreground mb-3">Carreras DCYT</h3>
            <ul className="space-y-2 text-[11px]">
              <li>Ingeniería Informática</li>
              <li>Ingeniería de Computación</li>
              <li>Lic. en Análisis de Sistemas</li>
              <li>Ingeniería de Producción</li>
              <li>Lic. en Ciencias Matemáticas / Física</li>
            </ul>
          </div>

          {/* Col 3: Enlaces */}
          <div>
            <h3 className="font-heading text-xs font-semibold text-foreground mb-3">Recursos</h3>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors">
                  Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-foreground transition-colors">
                  Registrarse
                </Link>
              </li>
              <li>
                <a href="https://dcyt.ucla.edu.ve" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
                  Portal DCYT UCLA
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Info */}
          <div>
            <h3 className="font-heading text-xs font-semibold text-foreground mb-3">Universidad</h3>
            <p className="text-[11px]/relaxed">
              Universidad Centro Occidental Lisandro Alvarado (UCLA). Barquisimeto, Estado Lara, Venezuela.
            </p>
            <div className="mt-4 border border-border bg-background p-2 text-[10px]">
              <span className="font-semibold text-foreground">Estado del Servidor:</span> Activo (DCYT-v1)
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px]">
          <p>© {new Date().getFullYear()} MiHorario. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Hecho con <Heart className="size-3 text-destructive fill-destructive" /> para la comunidad estudiantil del DCYT.
          </p>
        </div>
      </div>
    </footer>
  )
}
