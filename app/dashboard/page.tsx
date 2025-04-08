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

/**
 * Función auxiliar para calcular el próximo pago en un plan mensual.
 * Suma un mes a la fecha actual y devuelve la fecha formateada en DD/MM/YYYY.
 */
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

  // Lista completa de reservaciones que nos devuelva el endpoint
  const [allReservations, setAllReservations] = useState([]);
  // Lista completa de planes (array) que nos devuelva el endpoint
  const [allPlans, setAllPlans] = useState([]);

  // De la lista de planes, aquí guardaremos el plan "activo" que desees mostrar
  const [userPlan, setUserPlan] = useState(null);

  // Filtramos las reservaciones en "activas/pendientes" y "completadas"
  const [activeReservations, setActiveReservations] = useState([]);
  const [completedReservations, setCompletedReservations] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem("auth_token");
    if (!token) return;

    async function fetchData() {
      try {
        // 1. Obtener información del usuario
        const userResponse = await fetch("http://localhost:8000/api/usuarios", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (userResponse.ok) {
          // Dado que tu captura muestra un array, asumimos que /usuarios podría devolver más de un usuario
          // Ejemplo: [{ id_usuario: 1, nombres: "Carlos López", ... }, { ... }]
          // Si deseas solo el usuario logueado, normalmente tu backend debería filtrar por token.
          // Para fines ilustrativos, solo tomamos el primer elemento.
          const users = await userResponse.json();
          // Suponiendo que el backend retorna un array, y tu usuario logueado es [0]
          if (Array.isArray(users) && users.length > 0) {
            setUserName(users[0].nombres);
          }
        } else {
          console.error("Error al obtener el usuario:", userResponse.status);
        }

        // 2. Obtener todas las reservaciones
        const reservationsResponse = await fetch(
          "http://localhost:8000/api/reservaciones",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (reservationsResponse.ok) {
          const reservationsData = await reservationsResponse.json();
          setAllReservations(reservationsData);

          // Filtramos de una vez las activas/pendientes y las completadas
          const active = reservationsData.filter(
            (res) => res.status === "active" || res.status === "pending"
          );
          const completed = reservationsData.filter(
            (res) => res.status === "completed"
          );
          setActiveReservations(active);
          setCompletedReservations(completed);
        } else {
          console.error(
            "Error al obtener reservaciones:",
            reservationsResponse.status
          );
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

          // Suponiendo que tu usuario tiene un plan activo con "id_plan" = 1 (por ejemplo),
          // o que deseas simplemente mostrar el primer plan. Ajusta la lógica según tu app.
          // Por ejemplo, si tu "reservaciones" o "suscripción" indica "id_plan: 2",
          // podrías buscar ese plan en 'plansData'.
          //
          // Ejemplo: encontrar plan con "id_plan" = 1
          // const userHasPlanId = 1;
          // const foundPlan = plansData.find((p) => p.id_plan === userHasPlanId);

          // Para un ejemplo simple, tomaremos el primer plan (si existe):
          if (Array.isArray(plansData) && plansData.length > 0) {
            // Ajusta la lógica para obtener el plan correcto
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
            <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-50">
              Panel de Administración
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
                  <h3 className="text-2xl font-bold mt-1">
                    {activeReservations.length}
                  </h3>
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
                  <h3 className="text-2xl font-bold mt-1">
                    {completedReservations.length}
                  </h3>
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
                    <h3 className="text-xl font-bold mt-1">
                      {userPlan.nombre_plan}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                      {/* Si tu JSON de planes no trae la fecha de pago,
                          usamos computeNextPayment(). Ajusta según tu lógica. */}
                      Próximo Pago: {computeNextPayment()}
                    </p>
                  </>
                ) : (
                  <h3 className="text-xl font-bold mt-1">
                    No tienes un plan activo
                  </h3>
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
            <CardDescription>
              Reservaciones de vehículos actuales
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeReservations.length > 0 ? (
              <div className="space-y-4">
                {activeReservations.map((reservation) => (
                  <div
                    key={reservation.id_reservacion}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    {/* Ajusta las propiedades según tu JSON.
                        Supongamos que el vehiculo se anida en "reservation.vehiculo"
                        con "nombre_vehiculo", etc. */}
                    <img
                      src={
                        reservation.vehiculo?.imagen ||
                        "/placeholder.svg"
                      }
                      alt={
                        reservation.vehiculo?.nombre_vehiculo || "Vehículo"
                      }
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
