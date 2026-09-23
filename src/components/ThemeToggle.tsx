"use client";

import { useEffect } from "react";

export default function ThemeToggle() {
  useEffect(() => {
    try {
      document.documentElement.classList.remove("dark");
      localStorage.removeItem("theme");
    } catch {
      // noop
    }
  }, []);

  return null;
}
