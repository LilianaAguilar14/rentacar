"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Hacemos el GET a la API para obtener las categorías
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("http://localhost:8000/api/categorias");
        if (!res.ok) {
          throw new Error("Error al obtener las categorías");
        }
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Categorías de Vehículos</h1>
      {isLoading ? (
        <p>Cargando categorías...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id_categoria} className="overflow-hidden">
              <img
                src={category.imagen || "/placeholder.svg"}
                alt={category.nombre_categoria}
                className="w-full h-48 object-cover"
              />
              <CardHeader>
                <CardTitle>{category.nombre_categoria}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{category.descripcion}</p>
                <p className="text-sm text-gray-500">
                  Vehículos disponibles:{" "}
                  <span className="font-medium">{category.vehiculos_disponibles}</span>
                </p>
              </CardContent>
              <CardFooter>
                <Link href={`/vehicles?category=${category.id_categoria}`} className="w-full">
                  <Button className="w-full bg-blue-500 hover:bg-blue-600">
                    Ver Vehículos
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
