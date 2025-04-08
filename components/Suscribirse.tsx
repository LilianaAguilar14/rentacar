"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Modal (implementación simple)
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose}></div>
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

  // Para el modal de suscripción
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Fechas para la suscripción (en formato YYYY-MM-DD)
  const getCurrentDateFormatted = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getNextMonthDateFormatted = () => {
    const today = new Date();
    today.setMonth(today.getMonth() + 1);
    return today.toISOString().split("T")[0];
  };

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

  // Maneja el clic en "Suscribirse": guarda el plan y abre el modal
  const handleSubscribeClick = (plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  // Función para confirmar la suscripción (posteriormente enviar al backend)
  const handleConfirmSubscription = () => {
    // Aquí preparas el objeto de suscripción
    const subscriptionData = {
      fecha_inicio: getCurrentDateFormatted(),
      fecha_fin: getNextMonthDateFormatted(),
      fecha_pago: getCurrentDateFormatted(),
      id_cliente: 1, // Puedes obtener el id_cliente de tu sesión/auth
      id_plan: selectedPlan.id_plan,
      id_estado: 1, // Por ejemplo, 1 = activo
    };

    console.log("Suscripción confirmada:", subscriptionData);
    // Enviar subscriptionData al backend vía POST (ejemplo)
    // await fetch("http://localhost:8000/api/subscriptions", { method: "POST", body: JSON.stringify(subscriptionData), ... })

    // Cierra el modal
    setShowModal(false);
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
                <Button onClick={() => handleSubscribeClick(plan)} className="w-full bg-blue-500 hover:bg-blue-600">
                  Suscribirse
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Suscripción */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2 className="text-2xl font-bold mb-4">Suscribirse</h2>
        {selectedPlan && (
          <div>
            <p className="mb-2">
              <span className="font-medium">Plan:</span> {selectedPlan.nombre_plan}
            </p>
            <p className="mb-2">
              <span className="font-medium">Monto a pagar:</span> ${selectedPlan.precio_mensual}
            </p>
            <p className="mb-2">
              <span className="font-medium">Fecha de Inicio:</span> {getCurrentDateFormatted()}
            </p>
            <p className="mb-2">
              <span className="font-medium">Fecha de Pago:</span> {getCurrentDateFormatted()}
            </p>
            <p className="mb-4">
              <span className="font-medium">Fecha Fin:</span> {getNextMonthDateFormatted()}
            </p>
            {/* Puedes agregar aquí inputs ocultos o visibles si deseas modificar algo */}
            <div className="flex justify-end gap-2">
              <Button onClick={() => setShowModal(false)} variant="outline">
                Cancelar
              </Button>
              <Button onClick={handleConfirmSubscription} className="bg-blue-500 hover:bg-blue-600">
                Confirmar Suscripción
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
