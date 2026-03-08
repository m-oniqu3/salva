"use client";

import { useEffect, useState } from "react";

export function useCurrentUrl() {
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  return currentUrl;
}
