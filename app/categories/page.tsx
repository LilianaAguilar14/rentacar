import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Datos de ejemplo para categorías
const categories = [
  {
    id: 1,
    nombre: "SUV",
    descripcion: "Vehículos deportivos utilitarios",
    imagen: "/placeholder.svg?height=200&width=300",
    vehiculos_disponibles: 12,
  },
  {
    id: 2,
    nombre: "Sedan",
    descripcion: "Vehículos compactos para ciudad",
    imagen: "/placeholder.svg?height=200&width=300",
    vehiculos_disponibles: 18,
  },
  {
    id: 3,
    nombre: "Luxury",
    descripcion: "Vehículos de alta gama",
    imagen: "/placeholder.svg?height=200&width=300",
    vehiculos_disponibles: 5,
  },
  {
    id: 4,
    nombre: "Pickup",
    descripcion: "Camionetas para carga y trabajo",
    imagen: "/placeholder.svg?height=200&width=300",
    vehiculos_disponibles: 8,
  },
  {
    id: 5,
    nombre: "Compact",
    descripcion: "Vehículos pequeños y económicos",
    imagen: "/placeholder.svg?height=200&width=300",
    vehiculos_disponibles: 15,
  },
  {
    id: 6,
    nombre: "Van",
    descripcion: "Vehículos espaciosos para transporte de pasajeros",
    imagen: "/placeholder.svg?height=200&width=300",
    vehiculos_disponibles: 6,
  },
]

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Categorías de Vehículos</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            <img
              src={category.imagen || "/placeholder.svg"}
              alt={category.nombre}
              className="w-full h-48 object-cover"
            />
            <CardHeader>
              <CardTitle>{category.nombre}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{category.descripcion}</p>
              <p className="text-sm text-gray-500">
                Vehículos disponibles: <span className="font-medium">{category.vehiculos_disponibles}</span>
              </p>
            </CardContent>
            <CardFooter>
              <Link href={`/vehicles?category=${category.id}`} className="w-full">
                <Button className="w-full bg-blue-500 hover:bg-blue-600">Ver Vehículos</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

