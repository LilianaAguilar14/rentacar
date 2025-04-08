"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Realiza el fetch de la lista de vehículos
  useEffect(() => {
    const fetchVehicles = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("http://localhost:8000/api/vehiculos");
        if (!res.ok) {
          throw new Error("Error al obtener los vehículos");
        }
        const data = await res.json();
        // Se asume que "data" es un array con los vehículos
        setVehicles(data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, []);

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
                  {/* Muestra un Badge según el estado */}
                  <Badge className={vehicle.estado.descripcion === "Activo" ? "bg-green-500" : "bg-yellow-500"}>
                    {vehicle.estado.descripcion}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Año: {vehicle.anio}</p>
                  <p className="text-sm text-gray-500">Categoría: {vehicle.categoria.nombre_categoria}</p>
                </div>
              </CardContent>
              <CardFooter>
                {/* Si el vehículo está Activo, redirige a la página de Planes para contratar un plan;
                    de lo contrario, lleva a la página de detalles del vehículo */}
                <Link
                  href={vehicle.estado.descripcion === "Activo" ? "/plans" : `/vehicles/${vehicle.id_vehiculo}`}
                  className="w-full"
                >
                  <Button className="w-full bg-blue-500 hover:bg-blue-600">
                    {vehicle.estado.descripcion === "Activo" ? "Reservar Ahora" : "Ver Detalles"}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
