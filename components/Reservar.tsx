import React, { useState } from "react";

interface ReservarProps {
  open: boolean;
  onClose: () => void;
  vehicle: { id_vehiculo: number; marca: string; modelo: string }; // Ajusta el tipo según tu estructura
  id_suscripcion: number; // Cambiado para usar id_suscripcion directamente
}

const Reservar: React.FC<ReservarProps> = ({ open, onClose, vehicle, id_suscripcion }) => {
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      fecha_desde: fechaDesde,
      fecha_hasta: fechaHasta,
      id_suscripcion, // Cambiado para usar directamente id_suscripcion
      id_vehiculo: vehicle.id_vehiculo,
    };

    console.log("Payload enviado:", payload);

    try {
      console.log("Iniciando solicitud a la API...");
      const response = await fetch("http://127.0.0.1:8000/api/reservaciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        mode: "no-cors", // Configura el modo no-cors
      });

      // Log para verificar si la solicitud fue enviada
      console.log("Solicitud enviada. Respuesta del servidor:", response);

      // Verificar si la respuesta tiene un estado no exitoso
      if (!response.ok) {
        console.error("Error en la respuesta del servidor. Código de estado:", response.status);
        throw new Error("Error al realizar la reserva.");
      }

      console.log("Reserva realizada con éxito.");
      alert("Reserva realizada con éxito.");
      onClose(); // Cierra el modal
    } catch (error) {
      console.error("Error al realizar la reserva:", error);
      alert(error.message || "Hubo un problema al realizar la reserva.");
    } finally {
      console.log("Finalizando solicitud.");
      setIsLoading(false);
    }
  };

  return (
    <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="modal-content bg-white p-6 rounded-md shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">
          Reservar {vehicle.marca} {vehicle.modelo}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fechaDesde" className="block text-sm font-medium text-gray-700">
              Fecha Desde
            </label>
            <input
              type="date"
              id="fechaDesde"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
              required
            />
          </div>
          <div>
            <label htmlFor="fechaHasta" className="block text-sm font-medium text-gray-700">
              Fecha Hasta
            </label>
            <input
              type="date"
              id="fechaHasta"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
              disabled={isLoading}
            >
              {isLoading ? "Reservando..." : "Reservar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Reservar;