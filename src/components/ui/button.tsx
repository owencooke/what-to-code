import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderPinwheel } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

const ButtonWithLoading = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { onClick: () => Promise<void>; loadingText?: string }
>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      onClick,
      loadingText = "Please wait",
      ...props
    },
    ref,
  ) => {
    const [isLoading, setIsLoading] = useState(false);
    const Comp = asChild ? Slot : "button";

    const handleClick = async () => {
      setIsLoading(true);
      await onClick();
      setIsLoading(false);
    };

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          isLoading && "opacity-50 cursor-not-allowed",
        )}
        ref={ref}
        onClick={handleClick}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <LoaderPinwheel className="mr-2 h-4 w-4 animate-spin" />
            {loadingText}
          </>
        ) : (
          props.children
        )}
      </Comp>
    );
  },
);
ButtonWithLoading.displayName = "ButtonWithLoading";

export { Button, ButtonWithLoading, buttonVariants };