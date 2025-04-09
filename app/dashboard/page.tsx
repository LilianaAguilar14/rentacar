"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Car, CreditCard, Calendar, Clock } from "lucide-react";

const computeNextPayment = () => {
  const now = new Date();
  now.setMonth(now.getMonth() + 1);
  return now.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function DashboardPage() {
  const [userName, setUserName] = useState("Usuario");

  // Estados para datos obtenidos desde la API:
  const [allReservations, setAllReservations] = useState([]);
  const [allPlans, setAllPlans] = useState([]);
  const [userPlan, setUserPlan] = useState(null);

  // Filtrado de reservaciones:
  const [activeReservations, setActiveReservations] = useState([]);
  const [completedReservations, setCompletedReservations] = useState([]);

  // Estado para el token
  const [token, setToken] = useState(null);

  // Al montar, obtenemos el token del sessionStorage
  useEffect(() => {
    const storedToken = sessionStorage.getItem("auth_token");
    const usuario = sessionStorage.getItem("auth_user_name");
    setToken(storedToken);
    setUserName(usuario);
  }, []);

  // Cada vez que cambie el token se obtienen los datos del usuario, reservas y planes
  useEffect(() => {
    if (!token) return;

    async function fetchData() {
      try {
        // 1. Obtener información del usuario
        const userResponse = await fetch(`http://localhost:8000/api/usuarios`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (userResponse.ok) {
          const users = await userResponse.json();
        } else {
          console.error("Error al obtener el usuario:", userResponse.status);
        }

        // 2. Obtener todas las reservaciones
        const reservationsResponse = await fetch("http://localhost:8000/api/reservaciones", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (reservationsResponse.ok) {
          const reservationsData = await reservationsResponse.json();
          setAllReservations(reservationsData);

          const active = reservationsData.filter(
            (res) => res.status === "active" || res.status === "pending"
          );
          const completed = reservationsData.filter(
            (res) => res.status === "completed"
          );
          setActiveReservations(active);
          setCompletedReservations(completed);
        } else {
          console.error("Error al obtener reservaciones:", reservationsResponse.status);
        }

        // 3. Obtener todos los planes
        const plansResponse = await fetch("http://localhost:8000/api/planes", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (plansResponse.ok) {
          const plansData = await plansResponse.json();
          setAllPlans(plansData);

          // Ajusta la lógica para obtener el plan activo del usuario
          if (Array.isArray(plansData) && plansData.length > 0) {
            setUserPlan(plansData[0]);
          }
        } else {
          console.error("Error al obtener planes:", plansResponse.status);
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    }

    fetchData();
  }, [token]);

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
        </div>
      </div>

      {/* Tarjetas de Estadísticas Simplificadas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card: Reservaciones Activas y Pendientes */}
        <Link href="/reservations?status=active" className="cursor-pointer">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Reservaciones Activas y Pendientes
                  </p>
                  <h3 className="text-2xl font-bold mt-1">{activeReservations.length}</h3>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Car className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Card: Reservaciones Completadas */}
        <Link href="/reservations?status=completed" className="cursor-pointer">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Reservaciones Completadas
                  </p>
                  <h3 className="text-2xl font-bold mt-1">{completedReservations.length}</h3>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Card: Plan Activo y Próximo Pago */}
        <Link href="/plans" className="cursor-pointer">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Plan Activo</p>
                {userPlan ? (
                  <>
                    <h3 className="text-xl font-bold mt-1">{userPlan.nombre_plan}</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      Próximo Pago: {computeNextPayment()}
                    </p>
                  </>
                ) : (
                  <h3 className="text-xl font-bold mt-1">No tienes un plan activo</h3>
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <CreditCard className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Sección de Reservaciones Detalladas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Listado de Reservaciones Activas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Reservaciones Activas</CardTitle>
            <CardDescription>Reservaciones de vehículos actuales</CardDescription>
          </CardHeader>
          <CardContent>
            {activeReservations.length > 0 ? (
              <div className="space-y-4">
                {activeReservations.map((reservation) => (
                  <div
                    key={reservation.id_reservacion}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <img
                      src={reservation.vehiculo?.imagen || "/placeholder.svg"}
                      alt={reservation.vehiculo?.nombre_vehiculo || "Vehículo"}
                      className="w-20 h-16 object-cover rounded"
                    />
                    <div className="flex-grow">
                      <h4 className="font-semibold">
                        {reservation.vehiculo?.nombre_vehiculo || "Sin nombre"}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {reservation.fecha_desde} - {reservation.fecha_hasta}
                      </p>
                    </div>
                    <Link href={`/reservations/${reservation.id_reservacion}`}>
                      <Button variant="outline" size="sm">
                        Ver Detalles
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No tienes reservaciones activas</p>
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
            <CardDescription>Accede rápidamente a las funciones principales</CardDescription>
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
