"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRight, Menu, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { buttonVariants, Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const landingNavItems = [
  { label: "Dashboard", href: "/dashboard", description: "Overview of your funds." },
  { label: "Deposit", href: "/deposit", description: "Earn yield on your ETH." },
  { label: "Borrow", href: "/borrow", description: "Access instant liquidity." },
]

import { AppLogo } from "./app-logo"
import { ThemeToggle } from "./theme-toggle"

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 shell-container pt-4 sm:pt-5">
        <div className="panel-surface flex items-center justify-between gap-3 rounded-[1.75rem] px-4 py-3 sm:px-5">
          <AppLogo />

          <nav className="hidden items-center gap-2 lg:flex">
            {landingNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden sm:inline-flex" />
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ size: "lg" }),
                "hidden h-11 rounded-2xl px-4 sm:inline-flex"
              )}
            >
              Launch dashboard
              <ArrowRight className="size-4" />
            </Link>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="rounded-2xl border-border/80 bg-background/70 backdrop-blur-md lg:hidden"
              aria-label="Open navigation menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <>
            <motion.button
              type="button"
              className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              aria-label="Close navigation menu"
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-[86%] max-w-sm p-4 lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 240, damping: 28 }}
            >
              <div className="panel-surface flex h-full flex-col rounded-[2rem] p-5">
                <div className="flex items-center justify-between">
                  <AppLogo />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="rounded-2xl"
                    aria-label="Close navigation menu"
                    onClick={() => setMenuOpen(false)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>

                <div className="mt-8 space-y-2">
                  {landingNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-3xl border border-border/70 bg-background/60 px-4 py-4"
                      onClick={() => setMenuOpen(false)}
                    >
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </Link>
                  ))}
                </div>

                <div className="mt-auto space-y-3">
                  <ThemeToggle className="w-full justify-center rounded-2xl" />
                  <Link
                    href="/dashboard"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "h-12 w-full rounded-2xl"
                    )}
                    onClick={() => setMenuOpen(false)}
                  >
                    Open member dashboard
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  )
}
