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

// INTERFAZ para la Categoría
interface Category {
  id_categoria: number;
  nombre_categoria: string;
  descripcion: string;
}

interface EditarCategoProps {
  open: boolean;
  onClose: () => void;
  categoria: Category;
}

export default function EditarCatego({ open, onClose, categoria }: EditarCategoProps) {
  const [nombreCategoria, setNombreCategoria] = useState(categoria.nombre_categoria);
  const [descripcion, setDescripcion] = useState(categoria.descripcion);
  const [isLoading, setIsLoading] = useState(false);

  // Actualiza los valores cuando la categoría que se edita cambia.
  useEffect(() => {
    setNombreCategoria(categoria.nombre_categoria);
    setDescripcion(categoria.descripcion);
  }, [categoria]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Validaciones básicas
    if (!nombreCategoria.trim() || !descripcion.trim()) {
      alert("Por favor, completa todos los campos.");
      setIsLoading(false);
      return;
    }

    // Verifica que id_categoria esté definido
    if (!categoria.id_categoria) {
      console.error("La categoría no tiene id_categoria definido.");
      alert("Error: no se encontró el identificador de la categoría.");
      setIsLoading(false);
      return;
    }

    const dataToSend = {
      nombre_categoria: nombreCategoria,
      descripcion,
    };

    try {
      const response = await fetch(`http://localhost:8000/api/categorias/${categoria.id_categoria}`, {
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
        const message = data?.message || "Error al actualizar la categoría. Verifica los campos.";
        alert(message);
        setIsLoading(false);
        return;
      }

      console.log("Categoría actualizada con éxito:", data);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error al actualizar la categoría:", error);
      alert("No se pudo conectar al servidor. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Editar Categoría</DialogTitle>
          <DialogDescription>Modifica los datos de la categoría</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Campo: Nombre de la categoría */}
          <div>
            <label htmlFor="nombre_categoria" className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              id="id_categoria"
              name="nombre_categoria"
              value={nombreCategoria}
              onChange={(e) => setNombreCategoria(e.target.value)}
              placeholder="Nombre de la categoría"
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
              required
            />
          </div>
          {/* Campo: Descripción */}
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción de la categoría"
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
              rows={3}
              required
            ></textarea>
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
