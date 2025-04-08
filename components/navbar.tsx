"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Car,
  ListIcon as Category,
  CreditCard,
  Home,
  Menu,
  User,
  X,
  LogOut,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("cliente"); // "cliente" o "admin"
  const pathname = usePathname();
  const router = useRouter();

  // Verificar autenticación y rol leyendo sessionStorage
  useEffect(() => {
    const token = sessionStorage.getItem("auth_token");
    setIsAuthenticated(!!token);

    if (token) {
      // Se asume que "auth_user" es un objeto JSON que contiene la propiedad "role"
      const user = sessionStorage.getItem("auth_user");
      if (user) {
        try {
          const parsedUser = JSON.parse(user);
          // Comprueba si el usuario es administrador
          setUserRole(parsedUser.role === "admin" ? "admin" : "cliente");
        } catch (error) {
          console.error("Error al parsear auth_user:", error);
          setUserRole("cliente");
        }
      } else {
        setUserRole("cliente");
      }
    } else {
      setUserRole("cliente");
    }
  }, [pathname]);

  const handleLogout = () => {
    // Eliminar los datos de autenticación del sessionStorage
    sessionStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_user");
    setIsAuthenticated(false);
    setUserRole("cliente");
    // Redirigir a la página de inicio
    router.push("/");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Car className="h-6 w-6 text-blue-500" />
            <span className="font-bold text-xl">Pinkoilyn Automóvil</span>
          </Link>

          {/* Navegación para Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            {isAuthenticated && (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-blue-500 flex items-center gap-1">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
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
                {userRole === "admin" && (
                  <Link href="/admin" className="text-gray-600 hover:text-blue-500 flex items-center gap-1">
                    <Settings className="h-4 w-4" />
                    <span>Administración</span>
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Botones de Autenticación (Desktop) */}
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
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    Registrarse
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Botón de Menú para Mobile */}
          <button
            className="md:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Menú Mobile */}
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
                    href="/dashboard"
                    className="text-gray-600 hover:text-blue-500 flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
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
                  {userRole === "admin" && (
                    <Link
                      href="/admin"
                      className="text-gray-600 hover:text-blue-500 flex items-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="h-5 w-5" />
                      <span>Administración</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
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
                    <Button
                      variant="outline"
                      className="w-full border-blue-500 text-blue-500 hover:bg-blue-50"
                    >
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-blue-500 hover:bg-blue-600">
                      Registrarse
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
