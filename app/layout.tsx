"use client"
import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Navbar />
          {children}
          <footer className="bg-gray-100 py-6 mt-auto">
            <div className="container mx-auto px-4 md:px-6">
              <p className="text-center text-gray-600">
                © 2025 Sistema de Renta de Carros. Todos los derechos reservados.
              </p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'