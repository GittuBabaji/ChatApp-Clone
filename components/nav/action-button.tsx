'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ButtonProps {
  label: string;
  children: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  align?: "start" | "center" | "end";
}

const Button_custom = ({
  label,
  children,
  side = "top",
  align = "center",
}: ButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side={side} align={align} className="text-md semi-bold bg-zinc-800 text-white">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Button_custom;
