import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Datos de ejemplo para vehículos
const vehicles = [
  {
    id: 1,
    marca: "Toyota",
    modelo: "Corolla",
    anio: "2020",
    placa: "XYZ123",
    categoria: "Sedan",
    estado: "Disponible",
    imagen: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    marca: "Honda",
    modelo: "CR-V",
    anio: "2021",
    placa: "ABC456",
    categoria: "SUV",
    estado: "Disponible",
    imagen: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    marca: "Ford",
    modelo: "Mustang",
    anio: "2022",
    placa: "DEF789",
    categoria: "Luxury",
    estado: "Reservado",
    imagen: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    marca: "Chevrolet",
    modelo: "Equinox",
    anio: "2021",
    placa: "GHI012",
    categoria: "SUV",
    estado: "Disponible",
    imagen: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    marca: "Nissan",
    modelo: "Sentra",
    anio: "2020",
    placa: "JKL345",
    categoria: "Sedan",
    estado: "Disponible",
    imagen: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 6,
    marca: "BMW",
    modelo: "X5",
    anio: "2022",
    placa: "MNO678",
    categoria: "Luxury",
    estado: "Disponible",
    imagen: "/placeholder.svg?height=200&width=300",
  },
]

export default function VehiclesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Nuestros Vehículos</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="overflow-hidden">
            <img
              src={vehicle.imagen || "/placeholder.svg"}
              alt={`${vehicle.marca} ${vehicle.modelo}`}
              className="w-full h-48 object-cover"
            />
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>
                  {vehicle.marca} {vehicle.modelo}
                </CardTitle>
                <Badge className={vehicle.estado === "Disponible" ? "bg-green-500" : "bg-yellow-500"}>
                  {vehicle.estado}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Año: {vehicle.anio}</p>
                <p className="text-sm text-gray-500">Placa: {vehicle.placa}</p>
                <p className="text-sm text-gray-500">Categoría: {vehicle.categoria}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/vehicles/${vehicle.id}`} className="w-full">
                <Button className="w-full bg-blue-500 hover:bg-blue-600">
                  {vehicle.estado === "Disponible" ? "Reservar Ahora" : "Ver Detalles"}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

