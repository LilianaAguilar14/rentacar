"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Car, CheckCircle } from "lucide-react";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Realizamos la petición GET hacia la API
  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://127.0.0.1:8000/api/reservaciones");
        if (!response.ok) {
          throw new Error("Error al obtener las reservaciones");
        }
        const data = await response.json();
        setReservations(data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, []);

  // Filtramos las reservaciones según el estado
  const activeReservations = reservations.filter(
    (res) =>
      res?.estado?.descripcion === "Activo" || 
      res?.estado?.descripcion === "Pendiente"
  );

  const historyReservations = reservations.filter(
    (res) => res?.estado?.descripcion === "Completada" 
             // Puedes añadir más estados que consideres "historial"
  );

  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mis Reservaciones</h1>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="active">Activas</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>

        {/* TAB: RESERVACIONES ACTIVAS */}
        <TabsContent value="active" className="space-y-4">
          {isLoading ? (
            <p>Cargando reservaciones...</p>
          ) : activeReservations.length > 0 ? (
            activeReservations.map((reservation) => (
              <Card key={reservation.id_reservacion} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Imagen del vehículo (si existe) */}
                    <img
                      src={
                        reservation.vehiculo?.imagen
                          ? reservation.vehiculo.imagen
                          : "/placeholder.svg"
                      }
                      alt={
                        reservation.vehiculo
                          ? `${reservation.vehiculo.marca} ${reservation.vehiculo.modelo}`
                          : "Vehículo"
                      }
                      className="w-full md:w-40 h-auto object-cover rounded-md"
                    />

                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold">
                          {/* Ejemplo: "Toyota Corolla (2020)" */}
                          {reservation.vehiculo?.marca} {reservation.vehiculo?.modelo} (
                          {reservation.vehiculo?.anio})
                        </h3>
                        {/* Badge para el estado */}
                        <Badge
                          className={
                            reservation?.estado?.descripcion === "Activo"
                              ? "bg-green-500"
                              : reservation?.estado?.descripcion === "Pendiente"
                              ? "bg-yellow-500"
                              : "bg-gray-500"
                          }
                        >
                          {reservation?.estado?.descripcion || "Desconocido"}
                        </Badge>
                      </div>

                      {/* Datos adicionales */}
                      <p className="text-sm text-gray-500 mt-1">
                        Placa: {reservation.vehiculo?.placa}
                      </p>
                      <p className="text-sm text-gray-500">
                        Plan: {reservation.plan?.descripcion || "N/A"}
                      </p>
                      {/* Fechas */}
                      <div className="mt-2 flex items-center text-sm">
                        <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
                        <span>
                          {formatDate(reservation.fecha_desde)} -{" "}
                          {formatDate(reservation.fecha_hasta)}
                        </span>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-col gap-2 md:justify-center">
                      <Button
                        variant="outline"
                        className="border-blue-500 text-blue-500 hover:bg-blue-50"
                      >
                        Ver Detalles
                      </Button>
                      {reservation?.estado?.descripcion === "Activo" && (
                        <Button
                          variant="outline"
                          className="border-red-500 text-red-500 hover:bg-red-50"
                        >
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            // Mensaje si no hay reservaciones activas
            <div className="text-center py-12">
              <Car className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">
                No tienes reservaciones activas
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Explora nuestros vehículos y realiza tu primera reservación.
              </p>
              <Button className="mt-4 bg-blue-500 hover:bg-blue-600">
                Explorar Vehículos
              </Button>
            </div>
          )}
        </TabsContent>

        {/* TAB: HISTORIAL DE RESERVACIONES */}
        <TabsContent value="history" className="space-y-4">
          {isLoading ? (
            <p>Cargando historial...</p>
          ) : historyReservations.length > 0 ? (
            historyReservations.map((reservation) => (
              <Card key={reservation.id_reservacion} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Imagen del vehículo (si existe) */}
                    <img
                      src={
                        reservation.vehiculo?.imagen
                          ? reservation.vehiculo.imagen
                          : "/placeholder.svg"
                      }
                      alt={
                        reservation.vehiculo
                          ? `${reservation.vehiculo.marca} ${reservation.vehiculo.modelo}`
                          : "Vehículo"
                      }
                      className="w-full md:w-40 h-auto object-cover rounded-md"
                    />

                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold">
                          {reservation.vehiculo?.marca} {reservation.vehiculo?.modelo} (
                          {reservation.vehiculo?.anio})
                        </h3>
                        <Badge className="bg-gray-500">
                          {reservation?.estado?.descripcion || "Desconocido"}
                        </Badge>
                      </div>

                      {/* Datos adicionales */}
                      <p className="text-sm text-gray-500 mt-1">
                        Placa: {reservation.vehiculo?.placa}
                      </p>
                      <p className="text-sm text-gray-500">
                        Plan: {reservation.plan?.descripcion || "N/A"}
                      </p>
                      {/* Fechas */}
                      <div className="mt-2 flex items-center text-sm">
                        <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
                        <span>
                          {formatDate(reservation.fecha_desde)} -{" "}
                          {formatDate(reservation.fecha_hasta)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 md:justify-center">
                      <Button
                        variant="outline"
                        className="border-blue-500 text-blue-500 hover:bg-blue-50"
                      >
                        Ver Detalles
                      </Button>
                      <Button className="bg-blue-500 hover:bg-blue-600">
                        Reservar Nuevamente
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            // Mensaje si no hay historial
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">
                No tienes reservaciones anteriores
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Tu historial de reservaciones aparecerá aquí.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
