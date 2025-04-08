"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Interfaz para Categoría (se usa la misma estructura que en el Dashboard)
interface Category {
  id_categoria: number;
  nombre_categoria: string;
  descripcion: string;
}

// Interfaz para Plan
interface Plan {
  id_plan: number;
  nombre_plan: string;
  descripcion: string;
  precio_mensual: string; // se recibe como string
  limite_km: number;
  id_categoria: number;
  categoria?: {
    id_categoria: number;
    nombre_categoria: string;
    descripcion: string;
  };
}

interface EditarPlanProps {
  open: boolean;
  onClose: () => void;
  plan: Plan;
  categories: Category[];
}

export default function EditarPlan({ open, onClose, plan, categories }: EditarPlanProps) {
  const [nombrePlan, setNombrePlan] = useState(plan.nombre_plan);
  const [descripcion, setDescripcion] = useState(plan.descripcion);
  const [precioMensual, setPrecioMensual] = useState(plan.precio_mensual);
  const [limiteKm, setLimiteKm] = useState(plan.limite_km.toString());
  const [idCategoria, setIdCategoria] = useState(plan.id_categoria.toString());
  const [isLoading, setIsLoading] = useState(false);

  // Actualiza los estados cuando se modifica el plan pasado en props.
  useEffect(() => {
    setNombrePlan(plan.nombre_plan);
    setDescripcion(plan.descripcion);
    setPrecioMensual(plan.precio_mensual);
    setLimiteKm(plan.limite_km.toString());
    setIdCategoria(plan.id_categoria.toString());
  }, [plan]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Validación básica
    if (
      !nombrePlan.trim() ||
      !descripcion.trim() ||
      !precioMensual.trim() ||
      !limiteKm.trim() ||
      !idCategoria.trim()
    ) {
      alert("Por favor, completa todos los campos.");
      setIsLoading(false);
      return;
    }

    const dataToSend = {
      nombre_plan: nombrePlan,
      descripcion,
      precio_mensual: parseFloat(precioMensual),
      limite_km: parseInt(limiteKm, 10),
      id_categoria: parseInt(idCategoria, 10),
    };

    try {
      const response = await fetch(`http://localhost:8000/api/planes/${plan.id_plan}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const data = await response.json();
        const message = data?.message || "Error al actualizar el plan. Verifica los campos.";
        alert(message);
        setIsLoading(false);
        return;
      }

      alert("¡Plan actualizado con éxito!");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error al actualizar el plan:", error);
      alert("No se pudo conectar al servidor. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Editar Plan</DialogTitle>
          <DialogDescription>Modifica los datos del plan</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Campo: Nombre del Plan */}
          <div>
            <label htmlFor="nombre_plan" className="block text-sm font-medium text-gray-700">
              Nombre del Plan
            </label>
            <input
              type="text"
              id="nombre_plan"
              name="nombre_plan"
              value={nombrePlan}
              onChange={(e) => setNombrePlan(e.target.value)}
              placeholder="Plan Básico"
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
              placeholder="Plan con kilometraje limitado"
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
              rows={3}
              required
            ></textarea>
          </div>
          {/* Campo: Precio Mensual */}
          <div>
            <label htmlFor="precio_mensual" className="block text-sm font-medium text-gray-700">
              Precio Mensual
            </label>
            <input
              type="number"
              step="0.01"
              id="precio_mensual"
              name="precio_mensual"
              value={precioMensual}
              onChange={(e) => setPrecioMensual(e.target.value)}
              placeholder="29.99"
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
              required
            />
          </div>
          {/* Campo: Límite de Kilómetros */}
          <div>
            <label htmlFor="limite_km" className="block text-sm font-medium text-gray-700">
              Límite de Kilómetros
            </label>
            <input
              type="number"
              id="limite_km"
              name="limite_km"
              value={limiteKm}
              onChange={(e) => setLimiteKm(e.target.value)}
              placeholder="1000"
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
              required
            />
          </div>
          {/* Campo: Categoría (Select) */}
          <div>
            <label htmlFor="id_categoria" className="block text-sm font-medium text-gray-700">
              Categoría
            </label>
            <select
              id="id_categoria"
              name="id_categoria"
              value={idCategoria}
              onChange={(e) => setIdCategoria(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
              required
            >
              <option value="">Seleccione una categoría</option>
              {categories.map((cat) => (
                <option key={cat.id_categoria} value={cat.id_categoria}>
                  {cat.id_categoria} - {cat.nombre_categoria}
                </option>
              ))}
            </select>
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
