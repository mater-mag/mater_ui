import type { Metadata } from "next"
import { Manrope, Playfair_Display } from "next/font/google"
import "./globals.css"

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext"],
})

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
})

export const metadata: Metadata = {
  title: {
    default: "Matermag.hr - Lifestyle portal",
    template: "%s | Matermag.hr",
  },
  description: "Lifestyle portal za moderne roditelje - vijesti, recepti, zdravlje i lifestyle",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://matermag.hr"),
  openGraph: {
    type: "website",
    locale: "hr_HR",
    siteName: "Matermag.hr",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="hr">
      <body className={`${manrope.variable} ${playfair.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
