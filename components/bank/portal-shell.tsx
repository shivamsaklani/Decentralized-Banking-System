"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Bell, Menu, Search, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { AppLogo } from "@/components/bank/app-logo"
import { PortalSidebar } from "@/components/bank/portal-sidebar"
import { ThemeToggle } from "@/components/bank/theme-toggle"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getPortalRoute } from "@/lib/portal-navigation"
import { useWeb3 } from "@/lib/web3-context"

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const currentRoute = getPortalRoute(pathname)
  const { user, account } = useWeb3()
  const [menuState, setMenuState] = useState({
    open: false,
    pathname: "",
  })
  const menuOpen = menuState.open && menuState.pathname === pathname

  const openMenu = () => {
    setMenuState({
      open: true,
      pathname,
    })
  }

  const closeMenu = () => {
    setMenuState({
      open: false,
      pathname,
    })
  }

  return (
    <div className="shell-container py-4 sm:py-5">
      <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-background/70 shadow-[0_40px_120px_-64px_rgba(5,19,30,0.65)] backdrop-blur-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(45,212,191,0.12),transparent_22%)]" />
        <div className="relative flex min-h-[calc(100vh-2rem)]">
          <aside className="hidden w-[330px] shrink-0 border-r border-border/70 lg:flex">
            <div className="flex h-full w-full flex-col p-5">
              <AppLogo />
              <div className="mt-6 flex-1">
                <PortalSidebar currentPath={pathname} />
              </div>
            </div>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-20 border-b border-border/70 bg-background/70 backdrop-blur-xl">
              <div className="flex flex-wrap items-center gap-3 px-4 py-4 sm:px-5 lg:px-6">
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  className="rounded-2xl border-border/80 bg-background/70 lg:hidden"
                  aria-label="Open dashboard navigation"
                  onClick={openMenu}
                >
                  <Menu className="size-4" />
                </Button>

                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.34em] text-primary/80">
                    {currentRoute.eyebrow}
                  </p>
                  <h1 className="mt-1 truncate text-xl font-semibold tracking-tight sm:text-2xl">
                    {currentRoute.title}
                  </h1>
                  <p className="mt-1 hidden max-w-3xl text-sm text-muted-foreground lg:block">
                    {currentRoute.subtitle}
                  </p>
                </div>

                <div className="hidden min-w-0 flex-[0_1_360px] md:block">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder={currentRoute.searchPlaceholder}
                      className="h-11 rounded-2xl border-border/80 bg-background/70 pl-11 pr-4"
                    />
                  </div>
                </div>

                <div className="ml-auto flex items-center gap-2 sm:ml-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    className="rounded-2xl border-border/80 bg-background/70"
                    aria-label="Notifications"
                  >
                    <Bell className="size-4" />
                  </Button>
                  <ThemeToggle />
                  <Link
                    href="/"
                    className="hidden items-center gap-3 rounded-[1.2rem] border border-border/70 bg-background/65 px-3 py-2 md:flex"
                  >
                    <Avatar size="sm">
                      <AvatarFallback>{user ? user.name.slice(0, 2).toUpperCase() : "NA"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user ? user.name : "Not connected"}</p>
                      <p className="text-xs text-muted-foreground">
                        {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Read-only mode"}
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </header>

            <main className="flex-1 px-4 py-4 sm:px-5 lg:px-6 lg:py-6">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32 }}
              >
                {children}
              </motion.div>
            </main>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <>
            <motion.button
              type="button"
              className="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-label="Close dashboard navigation"
              onClick={closeMenu}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-[88%] max-w-sm p-4 lg:hidden"
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
                    aria-label="Close dashboard navigation"
                    onClick={closeMenu}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
                <div className="mt-6 flex-1">
                  <PortalSidebar
                    currentPath={pathname}
                    mobile
                    onNavigate={closeMenu}
                  />
                </div>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
