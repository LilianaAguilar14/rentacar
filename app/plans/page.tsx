import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

// Datos de ejemplo para planes
const plans = [
  {
    id: 1,
    nombre: "Plan Básico",
    descripcion: "Plan con kilometraje limitado",
    precio_mensual: 29.99,
    limite_km: 1000,
    categoria: "Sedan",
    features: [
      "Acceso a vehículos categoría Sedan",
      "Límite de 1000 km mensuales",
      "Seguro básico incluido",
      "Asistencia en carretera 24/7",
    ],
  },
  {
    id: 2,
    nombre: "Plan Estándar",
    descripcion: "Plan con kilometraje extendido",
    precio_mensual: 49.99,
    limite_km: 2000,
    categoria: "Sedan, SUV",
    features: [
      "Acceso a vehículos categoría Sedan y SUV",
      "Límite de 2000 km mensuales",
      "Seguro completo incluido",
      "Asistencia en carretera 24/7",
      "Cambio de vehículo 1 vez al mes",
    ],
  },
  {
    id: 3,
    nombre: "Plan Premium",
    descripcion: "Plan sin límite de kilometraje",
    precio_mensual: 79.99,
    limite_km: null,
    categoria: "Todas las categorías",
    features: [
      "Acceso a todas las categorías de vehículos",
      "Kilometraje ilimitado",
      "Seguro premium incluido",
      "Asistencia en carretera 24/7",
      "Cambio de vehículo ilimitado",
      "Conductor adicional sin costo",
    ],
  },
]

export default function PlansPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Nuestros Planes de Suscripción</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Elige el plan que mejor se adapte a tus necesidades. Todos nuestros planes incluyen mantenimiento y seguro.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl font-bold">{plan.nombre}</CardTitle>
              <p className="text-gray-600">{plan.descripcion}</p>
              <div className="mt-4">
                <span className="text-3xl font-bold text-blue-500">${plan.precio_mensual}</span>
                <span className="text-gray-500">/mes</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-gray-500 mb-4">
                Categorías: <span className="font-medium">{plan.categoria}</span>
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Límite: <span className="font-medium">{plan.limite_km ? `${plan.limite_km} km` : "Ilimitado"}</span>
              </p>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Link href={`/plans/${plan.id}/subscribe`} className="w-full">
                <Button className="w-full bg-blue-500 hover:bg-blue-600">Suscribirse</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

