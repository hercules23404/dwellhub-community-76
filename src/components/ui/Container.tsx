
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: string;
  animate?: boolean;
}

const maxWidthMap = {
  xs: "max-w-xs",
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  full: "max-w-full",
};

export function Container({ 
  children, 
  className, 
  maxWidth = "xl", 
  padding = "px-4 py-6 md:px-6 md:py-8",
  animate = true,
}: ContainerProps) {
  return (
    <div
      className={cn(
        "w-full mx-auto",
        maxWidthMap[maxWidth],
        padding,
        animate && "animate-fade-up",
        className
      )}
    >
      {children}
    </div>
  );
}
