"use client";

import { useEffect, useState } from "react";

type WindowSize = {
  width: number;
  height: number;
};

export function useWindowSize() {
  const [size, setSize] = useState<WindowSize>({ width: 0, height: 0 });

  useEffect(() => {
    let timeoutId: number | undefined;

    const updateSize = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setSize({
          width: window.innerWidth,
          height: window.innerHeight
        });
      }, 150);
    };

    setSize({
      width: window.innerWidth,
      height: window.innerHeight
    });

    window.addEventListener("resize", updateSize);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  return size;
}
