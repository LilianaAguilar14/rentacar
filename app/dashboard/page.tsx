"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Car, CreditCard, Calendar, Clock } from "lucide-react";

const userStats = {
  activeReservations: 2,
  completedReservations: 5,
  activePlan: "Plan Estándar",
  nextPayment: "15/05/2025",
};

const activeReservations = [
  {
    id: 1,
    vehiculo: "Toyota Corolla (2020)",
    fechaInicio: "10/04/2025",
    fechaFin: "20/04/2025",
    imagen: "/placeholder.svg?height=100&width=150",
  },
  {
    id: 2,
    vehiculo: "Ford Mustang (2022)",
    fechaInicio: "15/05/2025",
    fechaFin: "25/05/2025",
    imagen: "/placeholder.svg?height=100&width=150",
  },
];

export default function DashboardPage() {
  const [userName, setUserName] = useState("Usuario");

  useEffect(() => {
    const token = sessionStorage.getItem("auth_token");
    if (!token) return;

    async function fetchUser() {
      try {
        const response = await fetch("http://localhost:8000/api/userarios", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error("Error al obtener el usuario:", response.status);
          return;
        }

        const data = await response.json();
        // Extraemos solo el nombre usando la propiedad "nombres"
        setUserName(data.nombres);
      } catch (error) {
        console.error("Error en la solicitud GET al usuario:", error);
      }
    }

    fetchUser();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Encabezado del Dashboard */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Bienvenido, {userName}</h1>
          <p className="text-gray-500">
            Aquí puedes gestionar tus reservaciones y suscripciones
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/vehicles">
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Car className="h-4 w-4 mr-2" />
              Rentar un Vehículo
            </Button>
          </Link>
          <Link href="/admin">
            <Button
              variant="outline"
              className="border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              Panel de Administración
            </Button>
          </Link>
        </div>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Reservaciones Activas
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  {userStats.activeReservations}
                </h3>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Car className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Reservaciones Completadas
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  {userStats.completedReservations}
                </h3>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Plan Activo</p>
                <h3 className="text-xl font-bold mt-1">
                  {userStats.activePlan}
                </h3>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Próximo Pago
                </p>
                <h3 className="text-xl font-bold mt-1">
                  {userStats.nextPayment}
                </h3>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reservaciones Activas y Acciones Rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reservaciones Activas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Reservaciones Activas</CardTitle>
            <CardDescription>
              Tus reservaciones de vehículos actuales
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeReservations.length > 0 ? (
              <div className="space-y-4">
                {activeReservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <img
                      src={reservation.imagen || "/placeholder.svg"}
                      alt={reservation.vehiculo}
                      className="w-20 h-16 object-cover rounded"
                    />
                    <div className="flex-grow">
                      <h4 className="font-semibold">
                        {reservation.vehiculo}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {reservation.fechaInicio} - {reservation.fechaFin}
                      </p>
                    </div>
                    <Link href={`/reservations/${reservation.id}`}>
                      <Button variant="outline" size="sm">
                        Ver Detalles
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No tienes reservaciones activas
                </p>
                <Link href="/vehicles">
                  <Button className="mt-4 bg-blue-500 hover:bg-blue-600">
                    Explorar Vehículos
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Acciones Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Accede rápidamente a las funciones principales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/vehicles">
                <Button className="w-full justify-start bg-blue-500 hover:bg-blue-600 mb-2">
                  <Car className="h-4 w-4 mr-2" />
                  Rentar un Vehículo
                </Button>
              </Link>
              <Link href="/plans">
                <Button className="w-full justify-start bg-blue-500 hover:bg-blue-600 mb-2">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Ver Planes
                </Button>
              </Link>
              <Link href="/reservations">
                <Button className="w-full justify-start bg-blue-500 hover:bg-blue-600 mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  Mis Reservaciones
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
