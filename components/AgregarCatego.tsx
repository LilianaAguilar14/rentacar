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

interface AgregarCategoProps {
  open: boolean;
  onClose: () => void;
}

export default function AgregarCatego({ open, onClose }: AgregarCategoProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.currentTarget;

    // Extraemos los valores de los inputs mediante su atributo name.
    const nombre_categoria = (form.elements.namedItem("nombre_categoria") as HTMLInputElement).value;
    const descripcion = (form.elements.namedItem("descripcion") as HTMLInputElement).value;

    // Validación de campos vacíos.
    if (!nombre_categoria.trim() || !descripcion.trim()) {
      alert("Por favor, llena todos los campos correctamente.");
      setIsLoading(false);
      return;
    }

    // Armamos el payload según lo que espera la API.
    const payload = {
      nombre_categoria,
      descripcion,
    };

    try {
      const response = await fetch("http://localhost:8000/api/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data: any = null;
      try {
        data = await response.json();
      } catch (err) {
        console.error("No se pudo parsear la respuesta JSON:", err);
      }

      if (!response.ok) {
        const message =
          data?.message ||
          "Ocurrió un error al guardar la categoría. Verifica los campos ingresados.";
        alert(message);
        setIsLoading(false);
        return;
      }

      console.log("Categoría agregada con éxito:", data);
      onClose(); // Cierra el modal.
      window.location.reload(); // Recarga la página para actualizar la lista.
    } catch (error) {
      console.error("Error al agregar la categoría:", error);
      alert("No se pudo conectar al servidor. Verifica tu conexión o la información enviada.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Agregar Nueva Categoría</DialogTitle>
          <DialogDescription>Ingresa los datos de la categoría</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label htmlFor="nombre_categoria" className="block text-sm font-medium text-gray-700">
              Nombre de la Categoría
            </label>
            <input
              type="text"
              id="nombre_categoria"
              name="nombre_categoria"
              placeholder="SUV"
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
              required
            />
          </div>
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <input
              type="text"
              id="descripcion"
              name="descripcion"
              placeholder="Vehículos deportivos utilitarios"
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
