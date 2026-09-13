import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const emptyVariants = cva(
  "rounded-xl border-dashed flex w-full min-w-0 flex-1 flex-col items-center justify-center text-center text-balance",
  {
    variants: {
      size: {
        sm: "gap-2 p-4",
        default: "gap-4 p-6",
        lg: "gap-6 p-8",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

function Empty({
  className,
  size,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyVariants>) {
  return (
    <div
      data-slot="empty"
      className={cn(emptyVariants({ size, className }))}
      {...props}
    />
  );
}

function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-header"
      className={cn("gap-2 flex max-w-sm flex-col items-center", className)}
      {...props}
    />
  );
}

const emptyMediaVariants = cva(
  "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "bg-muted text-foreground flex shrink-0 items-center justify-center rounded-lg",
      },
      size: {
        sm: "",
        default: "",
        lg: "",
      },
    },
    compoundVariants: [
      {
        variant: "icon",
        size: "sm",
        class: "size-6 [&_svg:not([class*='size-'])]:size-3",
      },
      {
        variant: "icon",
        size: "default",
        class: "size-8 [&_svg:not([class*='size-'])]:size-4",
      },
      {
        variant: "icon",
        size: "lg",
        class: "size-12 [&_svg:not([class*='size-'])]:size-6",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function EmptyMedia({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant, size, className }))}
      {...props}
    />
  );
}

const emptyTitleVariants = cva("font-medium tracking-tight", {
  variants: {
    size: {
      sm: "text-xs",
      default: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

function EmptyTitle({
  className,
  size,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyTitleVariants>) {
  return (
    <div
      data-slot="empty-title"
      className={cn(emptyTitleVariants({ size, className }))}
      {...props}
    />
  );
}

const emptyDescriptionVariants = cva(
  "text-muted-foreground [&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
  {
    variants: {
      size: {
        sm: "text-xs/relaxed",
        default: "text-sm/relaxed",
        lg: "text-base/relaxed",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

function EmptyDescription({
  className,
  size,
  ...props
}: React.ComponentProps<"p"> & VariantProps<typeof emptyDescriptionVariants>) {
  return (
    <div
      data-slot="empty-description"
      className={cn(emptyDescriptionVariants({ size, className }))}
      {...props}
    />
  );
}

const emptyContentVariants = cva(
  "flex w-full min-w-0 flex-col items-center text-balance",
  {
    variants: {
      size: {
        sm: "gap-1.5 text-xs max-w-xs",
        default: "gap-2.5 text-sm max-w-sm",
        lg: "gap-3.5 text-base max-w-md",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

function EmptyContent({
  className,
  size,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyContentVariants>) {
  return (
    <div
      data-slot="empty-content"
      className={cn(emptyContentVariants({ size, className }))}
      {...props}
    />
  );
}

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
};
