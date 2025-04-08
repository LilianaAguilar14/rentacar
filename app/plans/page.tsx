"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Realiza el GET para obtener los planes desde la API
  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("http://localhost:8000/api/planes");
        if (!res.ok) {
          throw new Error("Error al obtener los planes");
        }
        const data = await res.json();
        setPlans(data);
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Nuestros Planes de Suscripción</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Elige el plan que mejor se adapte a tus necesidades.
        </p>
      </div>

      {isLoading ? (
        <p>Cargando planes...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card key={plan.id_plan} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl font-bold">{plan.nombre_plan}</CardTitle>
                <p className="text-gray-600">{plan.descripcion}</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-blue-500">${plan.precio_mensual}</span>
                  <span className="text-gray-500">/mes</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-500 mb-4">
                  Límite:{" "}
                  <span className="font-medium">
                    {plan.limite_km ? `${plan.limite_km} km` : "Ilimitado"}
                  </span>
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Categoría:{" "}
                  <span className="font-medium">
                    {plan.categoria.nombre_categoria}
                  </span>
                </p>
              </CardContent>
              <CardFooter>
                <Link href={`/plans/${plan.id_plan}/subscribe`} className="w-full">
                  <Button className="w-full bg-blue-500 hover:bg-blue-600">
                    Suscribirse
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
