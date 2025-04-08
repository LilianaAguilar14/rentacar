"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Car } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Rol {
  id_rol: number
  nombre_rol: string
  // Otros campos si los tienes en tu API
}

export default function RegisterPage() {
  const [roles, setRoles] = useState<Rol[]>([])
  const [formData, setFormData] = useState({
    nombres: "",
    email: "",
    telefono: "",
    dui: "",
    id_rol: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Obtener la lista de roles desde la API al montar el componente
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/rols")
        const data = await res.json()
        setRoles(data)
      } catch (error) {
        console.error("Error al obtener roles:", error)
      }
    }
    fetchRoles()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error de registro",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombres: formData.nombres,
          email: formData.email,
          telefono: formData.telefono,
          dui: formData.dui,
          id_rol: Number(formData.id_rol),
          // Si deseas enviar la contraseña, configura la API para manejarla y hashearla
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Registro exitoso",
          description:
            "Tu cuenta ha sido creada. Ahora puedes iniciar sesión.",
          variant: "default",
        })
        router.push("/login")
      } else {
        toast({
          title: "Error de registro",
          description: data.message || "Ocurrió un error.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "Error de red",
        description: "No se pudo conectar al servidor.",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[80vh] px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
            <Car className="h-6 w-6 text-blue-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Crear Cuenta
          </CardTitle>
          <CardDescription className="text-center">
            Ingresa tus datos para registrarte en nuestra plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div className="space-y-2">
              <Label htmlFor="nombres">Nombre Completo</Label>
              <Input
                id="nombres"
                name="nombres"
                placeholder="Juan Pérez"
                value={formData.nombres}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="ejemplo@correo.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                name="telefono"
                placeholder="5551234567"
                value={formData.telefono}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dui">DUI</Label>
              <Input
                id="dui"
                name="dui"
                placeholder="123456789"
                value={formData.dui}
                onChange={handleChange}
              />
            </div>
            {/* Selección del rol */}
            <div className="space-y-2">
              <Label htmlFor="id_rol">Rol</Label>
              <select
                id="id_rol"
                name="id_rol"
                value={formData.id_rol}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
                required
              >
                <option value="">Seleccione un rol</option>
                {roles.map((rol) => (
                  <option key={rol.id_rol} value={rol.id_rol}>
                    {rol.nombre_rol}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? "Procesando..." : "Registrarse"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Iniciar Sesión
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
