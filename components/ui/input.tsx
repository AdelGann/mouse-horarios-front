import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type = "text", ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-8 w-full rounded-lg border border-input bg-background px-3 py-1 text-xs shadow-xs transition-colors file:border-0 file:bg-transparent file:text-xs file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-xs",
        className
      )}
      {...props}
    />
  )
}

export { Input }
