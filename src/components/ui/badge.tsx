import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-pastel-green focus-visible:ring-pastel-green/50 focus-visible:ring-[3px] aria-invalid:ring-pastel-red/20 dark:aria-invalid:ring-pastel-red/40 aria-invalid:border-pastel-red transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-pastel-green text-pastel-dark-blue [a&]:hover:bg-pastel-green/90",
        secondary:
          "border-transparent bg-pastel-blue text-pastel-dark-blue [a&]:hover:bg-pastel-blue/90",
        destructive:
          "border-transparent bg-pastel-red text-white [a&]:hover:bg-pastel-red/90 focus-visible:ring-pastel-red/20 dark:focus-visible:ring-pastel-red/40 dark:bg-pastel-red/60",
        outline:
          "text-pastel-dark-blue [a&]:hover:bg-pastel-blue [a&]:hover:text-pastel-green",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
