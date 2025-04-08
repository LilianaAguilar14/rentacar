"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Car, ListIcon as Category, CreditCard, Home, Menu, User, X, LogOut } from "lucide-react"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Verificar autenticación al cargar el componente
  useEffect(() => {
    const authToken = document.cookie.includes("auth_token=")
    setIsAuthenticated(authToken)
  }, [pathname])

  const handleLogout = () => {
    // Eliminar la cookie de autenticación
    document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    setIsAuthenticated(false)
    router.push("/login")
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Car className="h-6 w-6 text-blue-500" />
            <span className="font-bold text-xl">CarRental</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-blue-500 flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span>Inicio</span>
            </Link>

            {isAuthenticated && (
              <>
                <Link href="/categories" className="text-gray-600 hover:text-blue-500 flex items-center gap-1">
                  <Category className="h-4 w-4" />
                  <span>Categorías</span>
                </Link>
                <Link href="/plans" className="text-gray-600 hover:text-blue-500 flex items-center gap-1">
                  <CreditCard className="h-4 w-4" />
                  <span>Planes</span>
                </Link>
                <Link href="/vehicles" className="text-gray-600 hover:text-blue-500 flex items-center gap-1">
                  <Car className="h-4 w-4" />
                  <span>Vehículos</span>
                </Link>
              </>
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <Link href="/reservations">
                  <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-50">
                    Mis Reservaciones
                  </Button>
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-50 flex items-center gap-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-50">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-blue-500 hover:bg-blue-600">Registrarse</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-500 hover:text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-blue-500 flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-5 w-5" />
                <span>Inicio</span>
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    href="/categories"
                    className="text-gray-600 hover:text-blue-500 flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Category className="h-5 w-5" />
                    <span>Categorías</span>
                  </Link>
                  <Link
                    href="/plans"
                    className="text-gray-600 hover:text-blue-500 flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <CreditCard className="h-5 w-5" />
                    <span>Planes</span>
                  </Link>
                  <Link
                    href="/vehicles"
                    className="text-gray-600 hover:text-blue-500 flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Car className="h-5 w-5" />
                    <span>Vehículos</span>
                  </Link>
                  <Link
                    href="/reservations"
                    className="text-gray-600 hover:text-blue-500 flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span>Mis Reservaciones</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="text-red-500 hover:text-red-700 flex items-center gap-2"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Cerrar Sesión</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-2">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-blue-500 text-blue-500 hover:bg-blue-50">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-blue-500 hover:bg-blue-600">Registrarse</Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

