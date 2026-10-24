"use client";

import { useLayoutEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "theme";

function aplicarTema(tema: "light" | "dark") {
  document.documentElement.classList.toggle("dark", tema === "dark");
}

export function ThemeToggle() {
  useLayoutEffect(() => {
    const tema = localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
    aplicarTema(tema);
  }, []);

  function alternar() {
    const proximo = document.documentElement.classList.contains("dark")
      ? "light"
      : "dark";

    localStorage.setItem(STORAGE_KEY, proximo);
    aplicarTema(proximo);
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={alternar}
      aria-label="Alternar entre tema claro e escuro"
      className="bg-card shadow-sm"
    >
      <Sun className="hidden dark:block" />
      <Moon className="dark:hidden" />
    </Button>
  );
}
