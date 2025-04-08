"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Car, CheckCircle } from "lucide-react"

// Datos de ejemplo para reservaciones
const reservations = [
  {
    id: 1,
    fecha_desde: "2025-04-10",
    fecha_hasta: "2025-04-20",
    vehiculo: {
      id: 1,
      marca: "Toyota",
      modelo: "Corolla",
      anio: "2020",
      placa: "XYZ123",
      imagen: "/placeholder.svg?height=100&width=150",
    },
    plan: "Plan Básico",
    estado: "Activa",
  },
  {
    id: 2,
    fecha_desde: "2025-05-15",
    fecha_hasta: "2025-05-25",
    vehiculo: {
      id: 3,
      marca: "Ford",
      modelo: "Mustang",
      anio: "2022",
      placa: "DEF789",
      imagen: "/placeholder.svg?height=100&width=150",
    },
    plan: "Plan Premium",
    estado: "Pendiente",
  },
]

// Datos de ejemplo para historial
const history = [
  {
    id: 3,
    fecha_desde: "2025-01-05",
    fecha_hasta: "2025-01-15",
    vehiculo: {
      id: 2,
      marca: "Honda",
      modelo: "CR-V",
      anio: "2021",
      placa: "ABC456",
      imagen: "/placeholder.svg?height=100&width=150",
    },
    plan: "Plan Estándar",
    estado: "Completada",
  },
  {
    id: 4,
    fecha_desde: "2025-02-20",
    fecha_hasta: "2025-03-05",
    vehiculo: {
      id: 5,
      marca: "Nissan",
      modelo: "Sentra",
      anio: "2020",
      placa: "JKL345",
      imagen: "/placeholder.svg?height=100&width=150",
    },
    plan: "Plan Básico",
    estado: "Completada",
  },
]

export default function ReservationsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mis Reservaciones</h1>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="active">Activas</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
          <TabsTrigger value="calendar">Calendario</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {reservations.length > 0 ? (
            reservations.map((reservation) => (
              <Card key={reservation.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <img
                      src={reservation.vehiculo.imagen || "/placeholder.svg"}
                      alt={`${reservation.vehiculo.marca} ${reservation.vehiculo.modelo}`}
                      className="w-full md:w-40 h-auto object-cover rounded-md"
                    />
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold">
                          {reservation.vehiculo.marca} {reservation.vehiculo.modelo} ({reservation.vehiculo.anio})
                        </h3>
                        <Badge
                          className={
                            reservation.estado === "Activa"
                              ? "bg-green-500"
                              : reservation.estado === "Pendiente"
                                ? "bg-yellow-500"
                                : "bg-gray-500"
                          }
                        >
                          {reservation.estado}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Placa: {reservation.vehiculo.placa}</p>
                      <p className="text-sm text-gray-500">Plan: {reservation.plan}</p>
                      <div className="mt-2 flex items-center text-sm">
                        <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
                        <span>
                          {new Date(reservation.fecha_desde).toLocaleDateString()} -{" "}
                          {new Date(reservation.fecha_hasta).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 md:justify-center">
                      <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-50">
                        Ver Detalles
                      </Button>
                      {reservation.estado === "Activa" && (
                        <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <Car className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No tienes reservaciones activas</h3>
              <p className="mt-1 text-sm text-gray-500">Explora nuestros vehículos y realiza tu primera reservación.</p>
              <Button className="mt-4 bg-blue-500 hover:bg-blue-600">Explorar Vehículos</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {history.length > 0 ? (
            history.map((reservation) => (
              <Card key={reservation.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <img
                      src={reservation.vehiculo.imagen || "/placeholder.svg"}
                      alt={`${reservation.vehiculo.marca} ${reservation.vehiculo.modelo}`}
                      className="w-full md:w-40 h-auto object-cover rounded-md"
                    />
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold">
                          {reservation.vehiculo.marca} {reservation.vehiculo.modelo} ({reservation.vehiculo.anio})
                        </h3>
                        <Badge className="bg-gray-500">{reservation.estado}</Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Placa: {reservation.vehiculo.placa}</p>
                      <p className="text-sm text-gray-500">Plan: {reservation.plan}</p>
                      <div className="mt-2 flex items-center text-sm">
                        <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
                        <span>
                          {new Date(reservation.fecha_desde).toLocaleDateString()} -{" "}
                          {new Date(reservation.fecha_hasta).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 md:justify-center">
                      <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-50">
                        Ver Detalles
                      </Button>
                      <Button className="bg-blue-500 hover:bg-blue-600">Reservar Nuevamente</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No tienes reservaciones anteriores</h3>
              <p className="mt-1 text-sm text-gray-500">Tu historial de reservaciones aparecerá aquí.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Calendario de Reservaciones</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

