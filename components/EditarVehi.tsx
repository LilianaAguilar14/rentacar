"use client";

import React, { FormEvent, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// INTERFAZ: se usan solo los campos que ya tenías, con id_vehiculo en lugar de id.
interface Vehicle {
  id_vehiculo: number;
  marca: string;
  modelo: string;
  anio: string;
  fecha_registro: string;
  placa: string;
  foto?: string;
  estado: {
    descripcion: string;
  };
  categoria: {
    nombre_categoria: string;
  };
}

interface EditarVehiProps {
  open: boolean;
  onClose: () => void;
  vehicle: Vehicle;
}

export default function EditarVehi({ open, onClose, vehicle }: EditarVehiProps) {
  // Estados para los campos, inicializados con los datos del vehículo.
  const [marca, setMarca] = useState(vehicle.marca);
  const [modelo, setModelo] = useState(vehicle.modelo);
  const [anio, setAnio] = useState(vehicle.anio);
  const [placa, setPlaca] = useState(vehicle.placa);
  // Estados para la imagen (solo vista previa en el frontend)
  const [imagen, setImagen] = useState<File | null>(null);
  const [imagenPreview, setImagenPreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Actualiza los valores cuando cambia el vehículo.
  useEffect(() => {
    setMarca(vehicle.marca);
    setModelo(vehicle.modelo);
    setAnio(vehicle.anio);
    setPlaca(vehicle.placa);
    setImagen(null);
    setImagenPreview("");
  }, [vehicle]);

  // Genera la URL para la vista previa de la imagen.
  useEffect(() => {
    if (imagen) {
      const objectUrl = URL.createObjectURL(imagen);
      setImagenPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setImagenPreview("");
    }
  }, [imagen]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Validaciones básicas
    if (!marca.trim() || !modelo.trim() || !anio.trim() || !placa.trim()) {
      alert("Por favor, llena todos los campos correctamente.");
      setIsLoading(false);
      return;
    }
    
    const numericYear = Number(anio);
    if (isNaN(numericYear) || numericYear < 1900 || numericYear > 2030) {
      alert("El año debe estar entre 1900 y 2030.");
      setIsLoading(false);
      return;
    }
    
    if (placa.trim().length < 6) {
      alert("La placa debe tener al menos 6 caracteres.");
      setIsLoading(false);
      return;
    }
    
    // Verifica que vehicle.id_vehiculo exista para evitar undefined.
    if (!vehicle.id_vehiculo) {
      console.error("El vehículo no tiene id_vehiculo definido.");
      alert("Error: no se encontró el identificador del vehículo.");
      setIsLoading(false);
      return;
    }

    // En este ejemplo se envían solo los datos en JSON (la imagen es solo vista previa).
    const dataToSend = {
      marca,
      modelo,
      anio,
      placa,
    };

    try {
      const response = await fetch(`http://localhost:8000/api/vehiculos/${vehicle.id_vehiculo}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const textResponse = await response.text();
      console.log("Respuesta cruda del servidor:", textResponse);

      let data: any;
      try {
        data = JSON.parse(textResponse);
      } catch (err) {
        console.error("No se pudo parsear la respuesta JSON:", err);
      }

      if (!response.ok) {
        const message = data?.message || "Error al actualizar el vehículo. Verifica los campos.";
        alert(message);
        setIsLoading(false);
        return;
      }

      console.log("Vehículo actualizado con éxito:", data);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error al actualizar el vehículo:", error);
      alert("No se pudo conectar al servidor. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Editar Vehículo</DialogTitle>
          <DialogDescription>Modifica los datos del vehículo</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Campo: Marca */}
          <div>
            <label htmlFor="marca" className="block text-sm font-medium text-gray-700">
              Marca
            </label>
            <input
              type="text"
              id="marca"
              name="marca"
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              placeholder="Toyota"
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
              required
            />
          </div>
          {/* Campo: Modelo */}
          <div>
            <label htmlFor="modelo" className="block text-sm font-medium text-gray-700">
              Modelo
            </label>
            <input
              type="text"
              id="modelo"
              name="modelo"
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              placeholder="Corolla"
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
              required
            />
          </div>
          {/* Campo: Año */}
          <div>
            <label htmlFor="anio" className="block text-sm font-medium text-gray-700">
              Año
            </label>
            <input
              type="number"
              id="anio"
              name="anio"
              value={anio}
              onChange={(e) => setAnio(e.target.value)}
              placeholder="2020"
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
              required
            />
          </div>
          {/* Campo: Placa */}
          <div>
            <label htmlFor="placa" className="block text-sm font-medium text-gray-700">
              Placa
            </label>
            <input
              type="text"
              id="placa"
              name="placa"
              value={placa}
              onChange={(e) => setPlaca(e.target.value)}
              placeholder="XYZ123"
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
              required
            />
          </div>
          {/* Campo: Imagen (solo vista previa en el frontend) */}
          <div>
            <label htmlFor="imagen" className="block text-sm font-medium text-gray-700">
              Imagen (solo vista previa)
            </label>
            <input
              type="file"
              id="imagen"
              name="imagen"
              accept="image/*"
              onChange={(e) => setImagen(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
              className="w-full mt-1"
            />
            {imagenPreview && (
              <div className="mt-2">
                <img src={imagenPreview} alt="Vista previa" className="h-40 object-cover rounded" />
              </div>
            )}
          </div>
          {/* Botones */}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
