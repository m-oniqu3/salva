"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Create and return ref.
 * Gets and returns information about the element's (ref) size and position relative the the viewport
 */
function useClientRect<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        setRect(ref.current.getBoundingClientRect());
      }
    };

    // Set rect on mount
    handleResize();

    // Update on window resize
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { ref, rect };
}

export default useClientRect;
