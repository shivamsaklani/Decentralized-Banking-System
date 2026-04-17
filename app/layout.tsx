import type { Metadata, Viewport } from "next"
import Script from "next/script"
import { IBM_Plex_Mono, Sora } from "next/font/google"

import "./globals.css"

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
})

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

const themeScript = `
  (() => {
    const storageKey = "astravault-theme";
    const root = document.documentElement;
    const stored = window.localStorage.getItem(storageKey);
    const resolved =
      stored === "light" || stored === "dark"
        ? stored
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";

    root.classList.toggle("dark", resolved === "dark");
    root.dataset.theme =
      stored === "light" || stored === "dark" ? stored : "system";
    root.style.colorScheme = resolved;
  })();
`

export const metadata: Metadata = {
  title: {
    default: "AstraVault",
    template: "%s | AstraVault",
  },
  description:
    "Responsive decentralized banking UI with member login, contract visibility, transaction tracking, and lending actions.",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eff9f8" },
    { media: "(prefers-color-scheme: dark)", color: "#091922" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sora.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script id="theme-script" strategy="beforeInteractive">
          {themeScript}
        </Script>
        {children}
      </body>
    </html>
  )
}
