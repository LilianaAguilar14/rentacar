"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter} from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Car } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function LoginPageComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authToken, setAuthToken] = useState(""); // Estado para el token
  const router = useRouter();
  const { toast } = useToast();


  useEffect(() => {
    const token = sessionStorage.getItem("auth_token");
    if (token) {
      setAuthToken(token);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: "Error de inicio de sesión",
          description: errorData.error || "Credenciales inválidas",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      const token = data.token;

      // Guarda el token y los datos del usuario en sessionStorage
      sessionStorage.setItem("auth_token", token);
      sessionStorage.setItem("auth_user", JSON.stringify(data.user));
      sessionStorage.setItem("auth_user_id", data.user.id_usuario);
      sessionStorage.setItem("auth_user_role", data.user.id_rol);
      sessionStorage.setItem("auth_user_name", data.user.nombres);
      sessionStorage.setItem("auth_user_email", data.user.email);
      setAuthToken(token);

      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido al sistema de renta de carros",
        variant: "default",
      });

      if(Number(sessionStorage.getItem("auth_user_role")) === 1){
        router.replace("/admin");
      }
      else{
        router.replace("/dashboard");
      }
      
    } catch (error) {
      console.error("Error en la solicitud:", error);
      toast({
        title: "Error de inicio de sesión",
        description: "No se pudo conectar con el servidor",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[80vh] px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
            <Car className="h-6 w-6 text-blue-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Iniciar Sesión</CardTitle>
          <CardDescription className="text-center">
            Ingresa tus credenciales para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link href="/forgot-password" className="text-sm text-blue-500 hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600" disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{" "}
            <Link href="/register" className="text-blue-500 hover:underline">
              Regístrate
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
