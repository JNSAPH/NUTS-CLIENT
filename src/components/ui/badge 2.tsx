import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-shadcn-primary text-shadcn-primary-foreground hover:bg-shadcn-primary/80",
        secondary:
          "border-transparent bg-shadcn-secondary text-shadcn-secondary-foreground hover:bg-shadcn-secondary/80",
        destructive:
          "border-transparent bg-shadcn-destructive text-shadcn-destructive-foreground hover:bg-shadcn-destructive/80",
        outline: "text-shadcn-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
