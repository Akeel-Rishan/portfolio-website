"use client";

import { useEffect, useState } from "react";

type Breakpoint = "mobile-sm" | "mobile" | "tablet" | "desktop";

export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>("desktop");

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;

      if (width < 380) {
        setBp("mobile-sm");
      } else if (width < 768) {
        setBp("mobile");
      } else if (width < 1024) {
        setBp("tablet");
      } else {
        setBp("desktop");
      }
    };

    update();
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
    };
  }, []);

  return bp;
}
