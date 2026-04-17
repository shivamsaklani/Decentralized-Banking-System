"use client"

import { startTransition, useSyncExternalStore } from "react"
import { MoonStar, SunMedium } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "astravault-theme"

type ThemeMode = "light" | "dark"

const listeners = new Set<() => void>()

function emitThemeChange() {
  listeners.forEach((listener) => listener())
}

function getThemeSnapshot(): ThemeMode {
  if (typeof document === "undefined") {
    return "light"
  }

  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}

function getServerSnapshot(): ThemeMode {
  return "light"
}

function applyTheme(nextTheme: ThemeMode) {
  const root = document.documentElement

  root.classList.toggle("dark", nextTheme === "dark")
  root.dataset.theme = nextTheme
  root.style.colorScheme = nextTheme
  window.localStorage.setItem(STORAGE_KEY, nextTheme)
  emitThemeChange()
}

function subscribe(listener: () => void) {
  listeners.add(listener)

  if (typeof window === "undefined") {
    return () => {
      listeners.delete(listener)
    }
  }

  const media = window.matchMedia("(prefers-color-scheme: dark)")

  const handleMediaChange = (event: MediaQueryListEvent) => {
    if (window.localStorage.getItem(STORAGE_KEY)) {
      return
    }

    const root = document.documentElement
    const nextTheme: ThemeMode = event.matches ? "dark" : "light"

    root.classList.toggle("dark", nextTheme === "dark")
    root.dataset.theme = "system"
    root.style.colorScheme = nextTheme
    emitThemeChange()
  }

  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      emitThemeChange()
    }
  }

  media.addEventListener("change", handleMediaChange)
  window.addEventListener("storage", handleStorageChange)

  return () => {
    listeners.delete(listener)
    media.removeEventListener("change", handleMediaChange)
    window.removeEventListener("storage", handleStorageChange)
  }
}

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(
    subscribe,
    getThemeSnapshot,
    getServerSnapshot
  )

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark"

    startTransition(() => {
      applyTheme(nextTheme)
    })
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      className={cn(
        "rounded-2xl border-border/80 bg-background/70 backdrop-blur-md",
        className
      )}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      onClick={toggleTheme}
    >
      {theme === "dark" ? (
        <SunMedium className="size-4" />
      ) : (
        <MoonStar className="size-4" />
      )}
    </Button>
  )
}
