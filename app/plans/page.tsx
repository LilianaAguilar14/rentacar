"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Suscribirse from "@/components/Suscribirse"; // Componente modal "Suscribirse"

// Función para formatear la fecha actual en "YYYY-MM-DD HH:MM:SS"
const getCurrentDateTimeFormatted = () => {
  const now = new Date();
  const pad = (num) => String(num).padStart(2, "0");
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// Para calcular la fecha un mes después
const getNextMonthDateTimeFormatted = () => {
  const now = new Date();
  now.setMonth(now.getMonth() + 1);
  const pad = (num) => String(num).padStart(2, "0");
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Estado para la suscripción activa del usuario (si existe)
  const [currentSubscription, setCurrentSubscription] = useState(null);

  // Estados para el modal de suscripción y para el plan seleccionado
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // GET: Obtener planes disponibles
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

  // GET: Obtener suscripción activa del usuario
  useEffect(() => {
    const fetchCurrentSubscription = async () => {
      try {
        const token = sessionStorage.getItem("auth_token");
        if (!token) return;

        const res = await fetch("http://localhost:8000/api/suscripciones", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          // Asumimos que id_estado === 1 indica suscripción activa
          if (data.id_estado === 1) {
            setCurrentSubscription(data);
          } else {
            setCurrentSubscription(null);
          }
        } else {
          console.error("Error al obtener la suscripción:", res.status);
          setCurrentSubscription(null);
        }
      } catch (error) {
        console.error("Error fetching current subscription:", error);
      }
    };

    fetchCurrentSubscription();
  }, []);

  // Abrir modal con el plan seleccionado
  const handleSubscribeClick = (plan) => {
    setErrorMessage("");
    setIsPaying(false);
    setPaymentSuccess(false);
    setSelectedPlan(plan);
    setShowModal(true);
  };

  // Cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPlan(null);
  };

  // Confirmar suscripción y registrar el pago
  const handleConfirmSubscription = async (cardData) => {
    // Validación mínima de datos de tarjeta
    if (!cardData.cardName || !cardData.cardNumber || !cardData.cardExpiry || !cardData.cardCVV) {
      setErrorMessage("Por favor, completa todos los datos de la tarjeta.");
      return;
    }
    setIsPaying(true);
    setErrorMessage("");

    try {
      const token = sessionStorage.getItem("auth_token");
      if (!token) throw new Error("No autenticado");

      // 1. Crear la suscripción (POST)
      const subscriptionData = {
        fecha_inicio: getCurrentDateTimeFormatted(),
        fecha_fin: getNextMonthDateTimeFormatted(),
        fecha_pago: getCurrentDateTimeFormatted(),
        id_usuario: 1, // Ajusta según el usuario logueado
        id_plan: selectedPlan.id_plan,
        id_estado: 1, // Activo
      };

      const subRes = await fetch("http://localhost:8000/api/suscripciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(subscriptionData),
      });
      if (!subRes.ok) {
        throw new Error("Error al crear la suscripción");
      }
      const subscriptionCreated = await subRes.json();
      console.log("Suscripción creada:", subscriptionCreated);

      // 2. Registrar el pago (POST)
      // NOTA: Según tu API, el objeto a enviar debe tener: 
      // { "id_suscription": 1, "fecha_registro": "2025-04-06 14:30:00", "monto": 49.99 }
      // Asegúrate de utilizar "id_suscription" (con 't') si ese es el campo que espera el backend.
      const paymentData = {
        id_suscripcion: subscriptionCreated.id_suscripcion, // Usamos "id_suscription" en inglés
        fecha_registro: getCurrentDateTimeFormatted(),
        monto: selectedPlan.precio_mensual,
      };

      // Agrega un console.log para verificar la data que se envía
      console.log("Payment Data que se envía:", paymentData);

      const payRes = await fetch("http://localhost:8000/api/pagos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });
      if (!payRes.ok) {
        const responseText = await payRes.text();
        console.error("Error en el POST de pago:", payRes.status, responseText);
        throw new Error("Error al registrar el pago");
      }
      const paymentCreated = await payRes.json();
      console.log("Pago registrado:", paymentCreated);

      // Actualizar la suscripción activa
      setCurrentSubscription(subscriptionCreated);
      setPaymentSuccess(true);
    } catch (error) {
      console.error("Error en suscripción/pago:", error);
      setErrorMessage("Ocurrió un error al procesar el pago.");
    } finally {
      setIsPaying(false);
    }
  };

  // Inactivar la suscripción actual (cambiar id_estado a 2)
  const handleInactivateSubscription = async () => {
    try {
      const token = sessionStorage.getItem("auth_token");
      if (!token) throw new Error("No autenticado");

      const suscripcionId = currentSubscription.id_suscripcion;
      const patchBody = { id_estado: 2 }; // 2 = inactivo

      const res = await fetch(`http://localhost:8000/api/suscripciones/${suscripcionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(patchBody),
      });

      if (!res.ok) {
        throw new Error("Error al inactivar la suscripción");
      }
      const updatedSub = await res.json();
      console.log("Suscripción inactivada:", updatedSub);
      if (updatedSub.id_estado === 2) {
        setCurrentSubscription(null);
      }
    } catch (error) {
      console.error("Error al inactivar suscripción:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Apartado para Suscripción Activa */}
      {currentSubscription && currentSubscription.id_estado === 1 && (
        <div className="mb-8 p-4 border border-green-500 rounded bg-green-50">
          <h2 className="text-2xl font-bold mb-2">Tu Suscripción Activa</h2>
          <p>
            <span className="font-medium">Plan:</span>{" "}
            {currentSubscription.plan?.nombre_plan || "Sin nombre"}
          </p>
          <p>
            <span className="font-medium">Fecha de Inicio:</span>{" "}
            {currentSubscription.fecha_inicio}
          </p>
          <p>
            <span className="font-medium">Fecha de Fin:</span>{" "}
            {currentSubscription.fecha_fin}
          </p>
          <p>
            <span className="font-medium">Estado:</span> Activo
          </p>
          <div className="mt-4">
            <Button
              onClick={handleInactivateSubscription}
              className="bg-red-500 hover:bg-red-600"
            >
              Inactivar Suscripción
            </Button>
          </div>
        </div>
      )}

      {/* Si no hay suscripción activa, se muestra la lista de planes */}
      {(!currentSubscription || currentSubscription.id_estado !== 1) && (
        <>
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
                        {plan.categoria?.nombre_categoria || "Desconocida"}
                      </span>
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={() => {
                        setSelectedPlan(plan);
                        setShowModal(true);
                        setErrorMessage("");
                        setIsPaying(false);
                        setPaymentSuccess(false);
                      }}
                      className="w-full bg-blue-500 hover:bg-blue-600"
                    >
                      Suscribirse
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal de Suscribirse (componente independiente) */}
      {showModal && selectedPlan && (
        <Suscribirse
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedPlan(null);
          }}
          plan={selectedPlan}
          onConfirm={handleConfirmSubscription}
          isPaying={isPaying}
          errorMessage={errorMessage}
          paymentSuccess={paymentSuccess}
        />
      )}
    </div>
  );
}
