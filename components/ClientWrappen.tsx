"use client";

import { useEffect, useState } from "react";

export const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const checkScreen = () => {
      setIsDesktop(window.innerWidth >= 768); // Tailwind's `md` breakpoint is 768px
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  if (isDesktop === null) return null; // Wait for client

  return <>{isDesktop ? children : null}</>;
};
