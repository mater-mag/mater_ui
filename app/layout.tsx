import type { Metadata } from "next"
import { Open_Sans, Lora } from "next/font/google"
import "./globals.css"

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin", "latin-ext"],
})

const lora = Lora({
  variable: "--font-lora",
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
      <body className={`${openSans.variable} ${lora.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
