"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

/* Componente Modal simple */
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <>
      {/* Fondo semi-transparente */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      ></div>
      {/* Contenido del Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
          {children}
        </div>
      </div>
    </>
  );
}

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Estado para manejar la visualización del modal y el plan seleccionado
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Fetch de planes desde la API
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

  // Función que se ejecuta al hacer clic en "Suscribirse"
  const handleSubscribeClick = (plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPlan(null);
  };

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
                <CardTitle className="text-xl font-bold">
                  {plan.nombre_plan}
                </CardTitle>
                <p className="text-gray-600">{plan.descripcion}</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-blue-500">
                    ${plan.precio_mensual}
                  </span>
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
                <Button
                  onClick={() => handleSubscribeClick(plan)}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  Suscribirse
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Suscripción */}
      <Modal isOpen={showModal} onClose={handleCloseModal}>
        {selectedPlan && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Suscribirse</h2>
            <p className="mb-2">
              <span className="font-medium">Plan:</span>{" "}
              {selectedPlan.nombre_plan}
            </p>
            <p className="mb-2">
              <span className="font-medium">Monto a pagar:</span> $
              {selectedPlan.precio_mensual}/mes
            </p>
            {/* Aquí podrías agregar más detalles o inputs si lo requieres */}
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={handleCloseModal} variant="outline">
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  // Aquí puedes agregar la lógica para confirmar la suscripción y enviar datos al backend
                  console.log("Suscripción confirmada para el plan:", selectedPlan);
                  handleCloseModal();
                }}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Confirmar Suscripción
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
