"use client"

import * as React from "react"
import { Trash2, Search, Plus, AlertTriangle, Loader2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"

interface FieldConfig<T> {
  label: string
  key: string
  render?: (item: T) => React.ReactNode
  searchable?: boolean
}

interface AdminCrudTableProps<T> {
  title: string
  description?: string
  items: T[]
  fields: FieldConfig<T>[]
  onDelete?: (id: string) => Promise<void> | void
  deleteDisabledSelector?: (item: T) => boolean
  // Add Form Modal Support
  addLabel?: string
  renderAddForm?: (close: () => void) => React.ReactNode
  // Edit Form Modal Support
  renderEditForm?: (item: T, close: () => void) => React.ReactNode
}

export function AdminCrudTable<T extends { id: string }>({
  title,
  description,
  items,
  fields,
  onDelete,
  deleteDisabledSelector,
  addLabel,
  renderAddForm,
  renderEditForm
}: AdminCrudTableProps<T>) {
  // Search query state
  const [searchQuery, setSearchQuery] = React.useState("")
  
  // Dialog visibility states
  const [addDialogOpen, setAddDialogOpen] = React.useState(false)
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false)
  const [deletingItemId, setDeletingItemId] = React.useState<string | null>(null)
  const [editingItem, setEditingItem] = React.useState<T | null>(null)
  
  // Deleting in-progress status
  const [isDeleting, setIsDeleting] = React.useState(false)

  // Filter items reactively
  const filteredItems = React.useMemo(() => {
    if (!searchQuery) return items
    const query = searchQuery.toLowerCase()
    
    return items.filter((item) => {
      return fields.some((f) => {
        const val = (item as any)[f.key]
        if (val === undefined || val === null) return false
        return val.toString().toLowerCase().includes(query)
      })
    })
  }, [items, searchQuery, fields])

  const triggerDeleteConfirm = (id: string) => {
    setDeletingItemId(id)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteExecute = async () => {
    if (!deletingItemId || !onDelete) return
    setIsDeleting(true)
    try {
      await onDelete(deletingItemId)
    } finally {
      setIsDeleting(false)
      setDeleteConfirmOpen(false)
      setDeletingItemId(null)
    }
  }

  const triggerEdit = (item: T) => {
    setEditingItem(item)
    setEditDialogOpen(true)
  }

  return (
    <Card className="border border-border/80 shadow-md bg-card/60 backdrop-blur-xs font-sans rounded-2xl overflow-hidden transition-all duration-300">
      
      {/* Table Header Section */}
      <CardHeader className="pb-4 border-b border-border/40 flex flex-row flex-wrap items-center justify-between gap-4">
        <div>
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-foreground">
            {title}
          </CardTitle>
          {description && (
            <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          {/* Reactive Search Bar */}
          <div className="relative flex items-center w-52">
            <Search className="absolute left-2.5 size-3.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Buscar registros..."
              className="pl-8 h-8 text-[11px] placeholder:text-muted-foreground/60 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Add button triggers modal */}
          {addLabel && renderAddForm && (
            <Button 
              size="sm" 
              onClick={() => setAddDialogOpen(true)}
              className="h-8 gap-1.5 shadow-sm text-xs cursor-pointer font-medium"
            >
              <Plus className="size-3.5" />
              <span>{addLabel}</span>
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0 overflow-x-auto">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-xs text-muted-foreground font-mono">
            {searchQuery ? "No se encontraron conincidencias para la búsqueda." : "No hay registros disponibles."}
          </div>
        ) : (
          <table className="w-full text-xs text-left border-collapse table-auto">
            <thead>
              <tr className="border-b border-border bg-muted/20 text-muted-foreground/80 font-mono text-[9px] uppercase tracking-wider">
                {fields.map((f, i) => (
                  <th key={i} className="py-3 px-4 font-semibold">{f.label}</th>
                ))}
                {(onDelete || renderEditForm) && <th className="py-3 px-4 text-right w-24">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} className="border-b border-border/30 hover:bg-muted/10 transition-colors">
                  {fields.map((f, i) => (
                    <td key={i} className="py-3 px-4 font-medium text-foreground/90">
                      {f.render ? f.render(item) : (item as any)[f.key] || "-"}
                    </td>
                  ))}
                  {(onDelete || renderEditForm) && (
                    <td className="py-3 px-4 text-right">
                      <div className="flex gap-1 justify-end items-center">
                        {renderEditForm && (
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => triggerEdit(item)}
                            className="text-primary hover:bg-primary/10 cursor-pointer"
                            title="Editar registro"
                          >
                            <Pencil className="size-3.5" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => triggerDeleteConfirm(item.id)}
                            className="text-destructive hover:bg-destructive/10 cursor-pointer"
                            disabled={deleteDisabledSelector ? deleteDisabledSelector(item) : false}
                            title="Eliminar registro"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>

      {/* --- ADD RECORD DIALOG MODAL --- */}
      {addLabel && renderAddForm && (
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent className="sm:max-w-md border-border bg-popover/95 backdrop-blur-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold uppercase tracking-wider text-foreground">
                {addLabel}
              </DialogTitle>
              <DialogDescription className="text-[10px] text-muted-foreground font-mono">
                Completa los campos del formulario para guardar un nuevo registro.
              </DialogDescription>
            </DialogHeader>
            <div className="pt-2">
              {renderAddForm(() => setAddDialogOpen(false))}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* --- EDIT RECORD DIALOG MODAL --- */}
      {renderEditForm && editingItem && (
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-md border-border bg-popover/95 backdrop-blur-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold uppercase tracking-wider text-foreground">
                Editar Registro
              </DialogTitle>
              <DialogDescription className="text-[10px] text-muted-foreground font-mono">
                Modifica los campos del formulario para actualizar este registro.
              </DialogDescription>
            </DialogHeader>
            <div className="pt-2">
              {renderEditForm(editingItem, () => {
                setEditDialogOpen(false)
                setEditingItem(null)
              })}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* --- CONFIRMATION DELETE DIALOG MODAL --- */}
      {onDelete && (
        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent className="sm:max-w-sm border-destructive/20 bg-popover/95 backdrop-blur-md">
            <DialogHeader className="flex flex-col items-center text-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive border border-destructive/20 mb-1">
                <AlertTriangle className="size-5" />
              </div>
              <DialogTitle className="text-xs uppercase font-bold text-destructive">
                ¿Confirmar Eliminación?
              </DialogTitle>
              <DialogDescription className="text-[11px] text-center text-muted-foreground">
                Esta acción no se puede deshacer y borrará permanentemente el registro seleccionado de la base de datos.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4 flex flex-row gap-2.5 w-full justify-center">
              <DialogClose render={<Button variant="outline" size="sm" className="w-1/2 cursor-pointer" disabled={isDeleting} />}>
                Cancelar
              </DialogClose>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleDeleteExecute}
                className="w-1/2 cursor-pointer gap-1"
                disabled={isDeleting}
              >
                {isDeleting ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                <span>Eliminar</span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

    </Card>
  )
}
