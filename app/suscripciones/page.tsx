"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ===========================
// 1. Interfaz de Suscripción
// ===========================
interface ISubscription {
  id_suscripcion: number;
  fecha_inicio: string;
  fecha_fin: string;
  plan: {
    id: number;
    nombre: string;
    categoria: {
      id: number;
      nombre: string;
    };
  };
  estado: {
    id: number;
    nombre: string;
  };
}

// =============================
// 2. Componente principal
// =============================
export default function SuscripcionesDelCliente() {
  const [subscriptions, setSubscriptions] = useState<ISubscription[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // useEffect para cargar suscripciones de un cliente
  useEffect(() => {
    const fetchSubscriptions = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        // 1) Leemos el userId desde sessionStorage
        const userId = sessionStorage.getItem("auth_user_id");
        if (!userId) {
          throw new Error("No se encontró 'auth_user_id' en sessionStorage.");
        }

        // 2) Llamamos al endpoint /suscripciones/cliente/{userId}
        const res = await fetch(`http://localhost:8000/api/suscripciones/cliente/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Error al obtener las suscripciones: ${res.status} => ${text}`);
        }

        // 3) Parseamos el JSON como array de ISubscription
        const data: ISubscription[] = await res.json();
        setSubscriptions(data);
      } catch (error: any) {
        console.error("Error cargando suscripciones:", error);
        setErrorMessage(error.message || "Error al cargar suscripciones.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  // Render
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Suscripciones del Cliente</h1>

      {errorMessage && (
        <div className="text-red-600 font-medium mb-4">
          {errorMessage}
        </div>
      )}

      {isLoading ? (
        <p className="text-center">Cargando suscripciones...</p>
      ) : subscriptions.length === 0 ? (
        <p className="text-center">No se encontraron suscripciones.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {subscriptions.map((sub) => (
            <Card key={sub.id_suscripcion} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  {sub.plan.nombre}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-grow">
                <p className="text-sm mb-2">
                  <strong>ID Suscripción:</strong> {sub.id_suscripcion}
                </p>
                <p className="text-sm mb-2">
                  <strong>Categoría:</strong> {sub.plan.categoria.nombre}
                </p>
                <p className="text-sm mb-2">
                  <strong>Fecha de Inicio:</strong> {sub.fecha_inicio}
                </p>
                <p className="text-sm mb-2">
                  <strong>Fecha de Fin:</strong> {sub.fecha_fin}
                </p>
                <p className="text-sm mb-2">
                  <strong>Estado:</strong> {sub.estado.nombre}
                </p>
              </CardContent>

              <CardFooter>
                {/* Un botón opcional si quisieras hacer algo con esta suscripción */}
                <Button className="w-full bg-blue-500 hover:bg-blue-600">
                  Ver Detalle
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
