
import type { Metadata } from "next"
import { Heebo } from "next/font/google"
import "./globals.css"

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "המרוץ למיליון | אופק מתמטי 2026",
  description: "בוחרים שכבה, פותרים תרגילים, ועוקבים אחרי ההתקדמות - שערי ציון רמלה",
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${heebo.className} antialiased`}>{children}</body>
    </html>
  )
}
