"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Reservar from "@/components/Reservar"; // Importa el modal Reservar

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null); // Estado para el vehículo seleccionado
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal

  useEffect(() => {
    const fetchVehicles = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("http://localhost:8000/api/vehiculos");
        if (!res.ok) {
          throw new Error("Error al obtener los vehículos");
        }
        const data = await res.json();
        setVehicles(data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSubscriptionStatus = async () => {
      try {
        const userId = 1; // Reemplaza con el ID del usuario autenticado dinámicamente
        const res = await fetch(`http://localhost:8000/api/suscripciones/activa/${userId}`);
        if (!res.ok) {
          throw new Error("Error al verificar la suscripción activa");
        }
        const data = await res.json();

        // Verifica si la suscripción está activa
        const isActive =
          data.estado?.descripcion === "Activo" &&
          new Date(data.fecha_inicio) <= new Date() &&
          new Date(data.fecha_fin) >= new Date();

        console.log("Estado de suscripción activa:", isActive); // Depuración
        setHasActiveSubscription(isActive);
      } catch (error) {
        console.error("Error fetching subscription status:", error);
        setHasActiveSubscription(false); // Asegúrate de manejar el estado en caso de error
      }
    };

    fetchVehicles();
    fetchSubscriptionStatus();
  }, []);

  const handleOpenModal = (vehicle) => {
    setSelectedVehicle(vehicle); // Guarda el vehículo seleccionado
    setIsModalOpen(true); // Abre el modal
  };

  const handleCloseModal = () => {
    setSelectedVehicle(null); // Limpia el vehículo seleccionado
    setIsModalOpen(false); // Cierra el modal
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Nuestros Vehículos</h1>

      {isLoading ? (
        <p>Cargando vehículos...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id_vehiculo} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>
                    {vehicle.marca} {vehicle.modelo}
                  </CardTitle>
                  <Badge className={vehicle.estado.descripcion === "Activo" ? "bg-green-500" : "bg-yellow-500"}>
                    {vehicle.estado.descripcion}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {/* Imagen del vehículo */}
                  <img
                    src={vehicle.url} 
                    alt={`${vehicle.marca} ${vehicle.modelo}`}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <p className="text-sm text-gray-500">Año: {vehicle.anio}</p>
                  <p className="text-sm text-gray-500">Categoría: {vehicle.categoria.nombre_categoria}</p>
                </div>
              </CardContent>
              <CardFooter>
                {hasActiveSubscription ? (
                  <Button
                    className="w-full bg-blue-500 hover:bg-blue-600"
                    onClick={() => handleOpenModal(vehicle)} // Abre el modal con el vehículo seleccionado
                  >
                    Reservar Ahora
                  </Button>
                ) : (
                  <Link href="/plans" className="w-full">
                    <Button className="w-full bg-blue-500 hover:bg-blue-600">Reservar Ahora</Button>
                  </Link>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Reservar */}
      {isModalOpen && selectedVehicle && (
        <Reservar
          open={isModalOpen}
          onClose={handleCloseModal}
          vehicle={selectedVehicle} // Pasa el vehículo seleccionado al modal
          id_suscripcion={1} // Cambiado para usar id_suscripcion directamente
        />
      )}
    </div>
  );
}
