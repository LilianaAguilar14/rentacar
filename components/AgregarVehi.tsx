"use client";

import React, { FormEvent, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AgregarVehiProps {
  open: boolean;
  onClose: () => void;
}

export default function AgregarVehi({ open, onClose }: AgregarVehiProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.currentTarget;

    // Extraemos los valores de los inputs mediante su atributo name.
    const marca = (form.elements.namedItem("marca") as HTMLInputElement).value;
    const modelo = (form.elements.namedItem("modelo") as HTMLInputElement).value;
    const anio = (form.elements.namedItem("anio") as HTMLInputElement).value;
    const placa = (form.elements.namedItem("placa") as HTMLInputElement).value;

    // Validación de campos vacíos.
    if (!marca.trim() || !modelo.trim() || !anio.trim() || !placa.trim()) {
      alert("Por favor, llena todos los campos correctamente.");
      setIsLoading(false);
      return;
    }

    // Validar que el año sea un número dentro del rango permitido.
    const numericYear = Number(anio);
    if (isNaN(numericYear) || numericYear < 1900 || numericYear > 2030) {
      alert("Intente de nuevo, campos inválidos: El año debe estar entre 1900 y 2030.");
      setIsLoading(false);
      return;
    }
    
    // Validar que la placa tenga al menos 6 dígitos.
    if (placa.trim().length < 6) {
      alert("La placa debe tener al menos 6 dígitos.");
      setIsLoading(false);
      return;
    }

    // Armamos el payload según lo que espera la API.
    const payload = {
      marca,
      modelo,
      anio,
      placa,
      id_estado: 1,
      id_categoria: 1,
    };

    try {
      const response = await fetch("http://localhost:8000/api/vehiculos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Intentamos parsear la respuesta para obtener un mensaje de error en caso de ocurrir.
      let data: any = null;
      try {
        data = await response.json();
      } catch (err) {
        console.error("No se pudo parsear la respuesta JSON:", err);
      }

      if (!response.ok) {
        const message =
          data?.message ||
          "Ocurrió un error al guardar el vehículo. Verifica los campos ingresados.";
        alert(message);
        setIsLoading(false);
        return;
      }

      console.log("Vehículo agregado con éxito:", data);
      onClose(); // Cierra el modal.
      window.location.reload(); // Recarga la página para actualizar la lista de vehículos.
    } catch (error) {
      console.error("Error al agregar el vehículo:", error);
      alert("No se pudo conectar al servidor. Verifica tu conexión o la información enviada.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Vehículo</DialogTitle>
          <DialogDescription>Ingresa los datos del vehículo</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label htmlFor="marca" className="block text-sm font-medium text-gray-700">
              Marca
            </label>
            <input
              type="text"
              id="marca"
              name="marca"
              placeholder="Toyota"
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
              required
            />
          </div>
          <div>
            <label htmlFor="modelo" className="block text-sm font-medium text-gray-700">
              Modelo
            </label>
            <input
              type="text"
              id="modelo"
              name="modelo"
              placeholder="Corolla"
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
              required
            />
          </div>
          <div>
            <label htmlFor="anio" className="block text-sm font-medium text-gray-700">
              Año
            </label>
            <input
              type="number"
              id="anio"
              name="anio"
              placeholder="2020"
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
              required
            />
          </div>
          <div>
            <label htmlFor="placa" className="block text-sm font-medium text-gray-700">
              Placa
            </label>
            <input
              type="text"
              id="placa"
              name="placa"
              placeholder="XYZ123"
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
              required
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
