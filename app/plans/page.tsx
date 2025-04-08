"use client"; // En Next.js 13+ (App Router)

import React, { useState, useEffect } from "react";
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

// ======================================
// Tipos / Interfaces
// ======================================
interface IPlan {
  id_plan: number;
  nombre_plan: string;
  descripcion: string;
  precio_mensual: number;
  limite_km: number | null;
  categoria?: {
    nombre_categoria: string;
  };
}

interface ISubscription {
  id_suscripcion: number;
  fecha_inicio: string;
  fecha_fin: string;
  fecha_pago: string;
  id_usuario: number;
  id_plan: number;
  id_estado: number;
  plan?: {
    nombre_plan: string;
  };
}

// Asumimos que la creación de suscripción sí usa "success" y "data"
interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface IPayment {
  id_pago: number;
  id_suscripcion: number;
  fecha_registro: string;
  monto: number;
}

// Interfaz para los datos del formulario de tarjeta
interface ICardData {
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCVV: string;
}

// ======================================
// 1. Helpers para manejo de Fechas
// ======================================
function getCurrentDateTimeFormatted(): string {
  const now = new Date();
  const pad = (num: number) => String(num).padStart(2, "0");
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function getNextMonthDateTimeFormatted(): string {
  const now = new Date();
  now.setMonth(now.getMonth() + 1);
  const pad = (num: number) => String(num).padStart(2, "0");
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// ======================================
// 2. Funciones para llamadas a la API
// ======================================
const BASE_URL = "http://localhost:8000/api";

/** Obtiene la lista de planes disponibles. */
async function fetchPlanes(): Promise<IPlan[]> {
  const res = await fetch(`${BASE_URL}/planes`);
  if (!res.ok) {
    throw new Error("Error al obtener los planes");
  }
  return await res.json();
}

/** 
 * Obtiene la suscripción activa del usuario (si existe).
 * Si tu backend retorna { success: boolean, data: {...} },
 * adáptalo aquí según la estructura. O si retorna algo plano,
 * ajusta la lógica.
 */
async function fetchSuscripcionActual(): Promise<ISubscription | null> {
  const res = await fetch(`${BASE_URL}/suscripciones`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    console.error("Error al obtener la suscripción:", res.status);
    return null;
  }

  // Por ejemplo, si la API de suscripciones sí usa { success, data }
  const responseJson: ApiResponse<ISubscription> = await res.json();
  if (!responseJson.success) {
    return null;
  }

  const subscription = responseJson.data;
  return subscription && subscription.id_estado === 1 ? subscription : null;
}

/**
 * Crea una nueva suscripción para el usuario.
 * Aquí asumimos que tu backend retorna { success: boolean, data: ISubscription }.
 */
async function createSuscripcion(
  subscriptionData: Partial<ISubscription>
): Promise<ISubscription> {
  console.log("=== CREANDO SUSCRIPCIÓN. DATA ENVIADA:", subscriptionData);

  const res = await fetch(`${BASE_URL}/suscripciones`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(subscriptionData),
  });

  if (!res.ok) {
    const responseText = await res.text();
    console.error("Error al crear suscripción:", res.status, responseText);
    throw new Error("Error al crear la suscripción");
  }

  // Tu API devuelvería { success, data: { ... } }
  const jsonResponse: ApiResponse<ISubscription> = await res.json();

  if (!jsonResponse.success) {
    throw new Error("La API devolvió success=false al crear la suscripción");
  }

  // Retornamos la suscripción real
  return jsonResponse.data;
}

/**
 * Crea un pago asociado a la suscripción.
 * Aquí NO usamos success ni data, sino la lógica simple:
 * - Si (res.ok) => parseamos y devolvemos
 * - Si no => error
 */
async function createPago(
  paymentData: { id_suscripcion: number; fecha_registro: string; monto: number }
): Promise<IPayment> {
  console.log("=== REGISTRANDO PAGO. DATA ENVIADA:", paymentData);

  const res = await fetch(`${BASE_URL}/pagos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(paymentData),
  });

  // Validamos sólo que sea 2xx
  if (!res.ok) {
    const responseText = await res.text();
    console.error("Error en el POST de pago:", res.status, responseText);
    throw new Error("Error al registrar el pago");
  }

  // Éxito => parseamos sin buscar "success" o "status"
  const createdPayment: IPayment = await res.json();
  console.log("Pago creado (response):", createdPayment);

  return createdPayment;
}

/** Inactiva la suscripción actual (estado = 2). */
async function inactivateSuscripcion(suscripcionId: number): Promise<ISubscription> {
  const patchBody = { id_estado: 2 };

  const res = await fetch(`${BASE_URL}/suscripciones/${suscripcionId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(patchBody),
  });

  if (!res.ok) {
    const responseText = await res.text();
    console.error("Error al inactivar la suscripción:", res.status, responseText);
    throw new Error("Error al inactivar la suscripción");
  }

  // Asumiendo que tu backend todavía retorna { success, data } en esta parte:
  const jsonResponse: ApiResponse<ISubscription> = await res.json();
  if (!jsonResponse.success) {
    throw new Error("La API devolvió success=false al inactivar la suscripción");
  }

  return jsonResponse.data;
}

// ======================================
// 3. Componente principal PlansPage
// ======================================
export default function PlansPage() {
  const [plans, setPlans] = useState<IPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [currentSubscription, setCurrentSubscription] = useState<ISubscription | null>(null);

  // Estados para el modal de suscripción y pago
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<IPlan | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ======================================
  // useEffect para cargar planes
  // ======================================
  useEffect(() => {
    const loadPlans = async () => {
      setIsLoading(true);
      try {
        const data = await fetchPlanes();
        setPlans(data);
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPlans();
  }, []);

  // ======================================
  // useEffect para cargar suscripción activa
  // ======================================
  useEffect(() => {
    const loadCurrentSubscription = async () => {
      try {
        const sub = await fetchSuscripcionActual();
        setCurrentSubscription(sub);
      } catch (error) {
        console.error("Error fetching current subscription:", error);
      }
    };
    loadCurrentSubscription();
  }, []);

  // --------------------------------------
  // Manejo de click en "Suscribirse"
  // --------------------------------------
  const handleSubscribeClick = (plan: IPlan) => {
    setErrorMessage("");
    setIsPaying(false);
    setPaymentSuccess(false);
    setSelectedPlan(plan);
    setShowModal(true);
  };

  // --------------------------------------
  // Cerrar el modal
  // --------------------------------------
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPlan(null);
  };

  // --------------------------------------
  // Confirmar suscripción y pago
  // --------------------------------------
  const handleConfirmSubscription = async (cardData: ICardData) => {
    // Validación básica de campos
    if (!cardData.cardName || !cardData.cardNumber || !cardData.cardExpiry || !cardData.cardCVV) {
      setErrorMessage("Por favor, completa todos los datos de la tarjeta.");
      return;
    }

    setIsPaying(true);
    setErrorMessage("");

    try {
      const token = sessionStorage.getItem("auth_token");
      if (!token) {
        throw new Error("No autenticado (falta token en sessionStorage)");
      }

      if (!selectedPlan) {
        throw new Error("No se seleccionó un plan antes de suscribirse");
      }

      // 1. Crear la suscripción (usa success/data)
      const subscriptionData: Partial<ISubscription> = {
        fecha_inicio: getCurrentDateTimeFormatted(),
        fecha_fin: getNextMonthDateTimeFormatted(),
        fecha_pago: getCurrentDateTimeFormatted(),
        id_usuario: Number(sessionStorage.getItem("auth_user_id")),
        id_plan: selectedPlan.id_plan,
        id_estado: 1, // Activo
      };

      const subscriptionCreated = await createSuscripcion(subscriptionData);
      console.log("Suscripción creada:", subscriptionCreated);

      // 2. Registrar el pago (usa lógica simple, sin success)
      const paymentData = {
        id_suscripcion: subscriptionCreated.id_suscripcion,
        fecha_registro: getCurrentDateTimeFormatted(),
        monto: selectedPlan.precio_mensual,
      };

      console.log("Datos del pago que se envían:", paymentData);

      const paymentCreated = await createPago(paymentData);
      console.log("Pago registrado:", paymentCreated);

      // Actualizar la suscripción activa local
      setCurrentSubscription(subscriptionCreated);
      setPaymentSuccess(true);
    } catch (error) {
      console.error("Error en suscripción/pago:", error);
      setErrorMessage("Ocurrió un error al procesar el pago.");
    } finally {
      setIsPaying(false);
    }
  };

  // --------------------------------------
  // Inactivar Suscripción
  // --------------------------------------
  const handleInactivateSubscription = async () => {
    try {
      const token = sessionStorage.getItem("auth_token");
      if (!token) throw new Error("No autenticado");

      if (!currentSubscription) {
        throw new Error("No hay suscripción activa para inactivar.");
      }

      const updatedSub = await inactivateSuscripcion(currentSubscription.id_suscripcion);
      console.log("Suscripción inactivada:", updatedSub);

      if (updatedSub.id_estado === 2) {
        setCurrentSubscription(null);
      }
    } catch (error) {
      console.error("Error al inactivar suscripción:", error);
    }
  };

  // ======================================
  // Render
  // ======================================
  return (
    <div className="container mx-auto px-4 py-8">
      {/* ===========================
          Suscripción Activa
      ============================ */}
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

      {/* ===========================
          Lista de Planes (si NO hay suscripción activa)
      ============================ */}
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
        </>
      )}

      {/* ===========================
          Modal para Suscribirse
      ============================ */}
      {showModal && selectedPlan && (
        <Suscribirse
          isOpen={showModal}
          onClose={handleCloseModal}
          plan={selectedPlan}
          onConfirm={handleConfirmSubscription}
          isPaying={isPaying}
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
}
