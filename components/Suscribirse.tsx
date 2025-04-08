"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

/* Componente Modal de Suscripción */
export default function SuscribirseModal({
  isOpen,
  onClose,
  plan,
  onConfirm,
  isPaying,
  errorMessage,
}) {
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");

  // Funciones para obtener fechas en formato YYYY-MM-DD
  const getCurrentDateFormatted = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getNextMonthDateFormatted = () => {
    const today = new Date();
    today.setMonth(today.getMonth() + 1);
    return today.toISOString().split("T")[0];
  };

  if (!isOpen) return null;

  // Evita que al hacer clic en el contenido se cierre el modal
  const handleContentClick = (e) => e.stopPropagation();

  return (
    <>
      {/* Fondo semi-transparente */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose}></div>
      {/* Contenedor del Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="bg-white rounded-lg shadow-lg max-w-md w-full p-6"
          onClick={handleContentClick}
        >
          <h2 className="text-2xl font-bold mb-4">Suscribirse</h2>
          <p className="mb-2">
            <span className="font-medium">Plan:</span> {plan.nombre_plan}
          </p>
          <p className="mb-2">
            <span className="font-medium">Monto a pagar:</span> $
            {plan.precio_mensual}/mes
          </p>
          <p className="mb-2">
            <span className="font-medium">Fecha de Inicio:</span>{" "}
            {getCurrentDateFormatted()}
          </p>
          <p className="mb-4">
            <span className="font-medium">Fecha de Fin:</span>{" "}
            {getNextMonthDateFormatted()}
          </p>

          {/* Formulario de Datos de Tarjeta */}
          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Nombre en la Tarjeta:
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded focus:outline-none"
                placeholder="Ej: Juan Pérez"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Número de Tarjeta:
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded focus:outline-none"
                placeholder="4242 4242 4242 4242"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm text-gray-700 mb-1">
                  Fecha de Vencimiento:
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded focus:outline-none"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-700 mb-1">
                  CVV:
                </label>
                <input
                  type="password"
                  className="w-full p-2 border rounded focus:outline-none"
                  placeholder="123"
                  value={cardCVV}
                  onChange={(e) => setCardCVV(e.target.value)}
                />
              </div>
            </div>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
          )}

          <div className="flex justify-end gap-2">
            <Button onClick={onClose} variant="outline" disabled={isPaying}>
              Cancelar
            </Button>
            <Button
              onClick={() =>
                onConfirm({
                  cardName,
                  cardNumber,
                  cardExpiry,
                  cardCVV,
                })
              }
              className="bg-blue-500 hover:bg-blue-600"
              disabled={isPaying}
            >
              {isPaying ? "Procesando..." : "Pagar"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
