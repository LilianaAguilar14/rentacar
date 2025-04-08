"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Settings,
  Car,
  ShoppingCart,
  CreditCard,
  Users,
} from "lucide-react";

// Importación de modales
import AgregarVehi from "@/components/AgregarVehi";       // Modal para agregar vehículo
import AgregarCatego from "@/components/AgregarCatego";     // Modal para agregar categoría
import AgregarPlan from "@/components/AgregarPlan";         // Modal para agregar plan
import EditarVehi from "@/components/EditarVehi";           // Modal para editar vehículo
import EditarCatego from "@/components/EditarCatego";         // Modal para editar categoría
import EditarPlan from "@/components/EditarPlan";           // Modal para editar plan

// INTERFAZ DE VEHÍCULO: se usan únicamente los campos originales, usando id_vehiculo como identificador.
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

// INTERFAZ DE CATEGORÍA: se usan únicamente los campos originales.
interface Category {
  id_categoria: number;
  nombre_categoria: string;
  descripcion: string;
}

// INTERFAZ DE PLAN: basada en el JSON obtenido.
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

// INTERFAZ DE USUARIO: según el ejemplo proporcionado.
interface User {
  id_usuario: number;
  nombres: string;
  email: string;
  telefono: string;
  dui: string;
  fecha_registro: string;
  id_rol: number;
  rol: {
    id_rol: number;
    nombre_rol: string;
  };
}

// INTERFAZ DE RESERVACIÓN: se extraen únicamente los campos solicitados.
// Se asume que la reservación trae también objetos anidados: "suscripcion" y "vehiculo"
interface Reservation {
  id_reservacion: number;
  fecha_desde: string;
  fecha_hasta: string;
  fecha_registro: string;
  id_suscripcion: number;
  // del objeto suscripcion:
  suscripcion: {
    fecha_inicio: string;
    fecha_fin: string;
    fecha_pago: string;
  };
  // del objeto vehiculo:
  vehiculo: {
    marca: string;
    modelo: string;
    anio: string;
    placa: string;
  };
}

export default function AdminDashboard() {
  // Estados para modales de vehículo
  const [modalOpen, setModalOpen] = useState(false);
  const [editarVehiOpen, setEditarVehiOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState<Vehicle | null>(null);

  // Estados para modales de categoría
  const [modalCategoOpen, setModalCategoOpen] = useState(false);
  const [editarCategoOpen, setEditarCategoOpen] = useState(false);
  const [categoriaToEdit, setCategoriaToEdit] = useState<Category | null>(null);

  // Estados para modales de plan
  const [modalPlanOpen, setModalPlanOpen] = useState(false);
  const [planToEdit, setPlanToEdit] = useState<Plan | null>(null);
  const [editarPlanOpen, setEditarPlanOpen] = useState(false);

  // Estados para almacenar datos
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [fetchVehiclesError, setFetchVehiclesError] = useState("");

  const [categorias, setCategorias] = useState<Category[]>([]);
  const [loadingCatego, setLoadingCatego] = useState(false);
  const [fetchCategoError, setFetchCategoError] = useState("");

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [fetchPlansError, setFetchPlansError] = useState("");

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loadingReservations, setLoadingReservations] = useState(false);
  const [fetchReservationsError, setFetchReservationsError] = useState("");

  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [fetchUsersError, setFetchUsersError] = useState("");

  // Obtención de vehículos
  useEffect(() => {
    const fetchVehicles = async () => {
      setLoadingVehicles(true);
      setFetchVehiclesError("");
      try {
        const res = await fetch("http://localhost:8000/api/vehiculos");
        if (!res.ok) throw new Error("Error al obtener vehículos");
        const data = await res.json();
        setVehicles(data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        setFetchVehiclesError("No se pudieron obtener los vehículos. Intenta de nuevo.");
      } finally {
        setLoadingVehicles(false);
      }
    };
    fetchVehicles();
  }, []);

  // Obtención de categorías
  useEffect(() => {
    const fetchCategorias = async () => {
      setLoadingCatego(true);
      setFetchCategoError("");
      try {
        const res = await fetch("http://localhost:8000/api/categorias");
        if (!res.ok) throw new Error("Error al obtener categorías");
        const data = await res.json();
        setCategorias(data);
      } catch (error) {
        console.error("Error fetching categorías:", error);
        setFetchCategoError("No se pudieron obtener las categorías. Intenta de nuevo.");
      } finally {
        setLoadingCatego(false);
      }
    };
    fetchCategorias();
  }, []);

  // Obtención de planes
  useEffect(() => {
    const fetchPlans = async () => {
      setLoadingPlans(true);
      setFetchPlansError("");
      try {
        const res = await fetch("http://localhost:8000/api/planes");
        if (!res.ok) throw new Error("Error al obtener planes");
        const data = await res.json();
        setPlans(data);
      } catch (error) {
        console.error("Error fetching plans:", error);
        setFetchPlansError("No se pudieron obtener los planes. Intenta de nuevo.");
      } finally {
        setLoadingPlans(false);
      }
    };
    fetchPlans();
  }, []);

  // Obtención de reservaciones (solo GET)
  useEffect(() => {
    const fetchReservations = async () => {
      setLoadingReservations(true);
      setFetchReservationsError("");
      try {
        const res = await fetch("http://localhost:8000/api/reservaciones");
        if (!res.ok) throw new Error("Error al obtener reservaciones");
        const data = await res.json();
        setReservations(data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        setFetchReservationsError("No se pudieron obtener las reservaciones. Intenta de nuevo.");
      } finally {
        setLoadingReservations(false);
      }
    };
    fetchReservations();
  }, []);

  // Obtención de usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      setFetchUsersError("");
      try {
        const res = await fetch("http://localhost:8000/api/usuarios");
        if (!res.ok) throw new Error("Error al obtener usuarios");
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setFetchUsersError("No se pudieron obtener los usuarios. Intenta de nuevo.");
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  // Función para abrir modal de edición de vehículo
  const handleEditVehicle = (idVehiculo: number) => {
    const veh = vehicles.find((v) => v.id_vehiculo === idVehiculo);
    if (veh) {
      console.log("Vehículo a editar:", veh);
      setVehicleToEdit(veh);
      setEditarVehiOpen(true);
    } else {
      console.error("No se encontró el vehículo con id_vehiculo:", idVehiculo);
    }
  };

  // Función para abrir modal de edición de categoría
  const handleEditCategory = (id: number) => {
    const cat = categorias.find((c) => c.id_categoria === id);
    if (cat) {
      console.log("Categoría a editar:", cat);
      setCategoriaToEdit(cat);
      setEditarCategoOpen(true);
    } else {
      console.error("No se encontró la categoría con id:", id);
    }
  };

  // Función para abrir modal de edición de plan
  const handleEditPlan = (idPlan: number) => {
    const planFound = plans.find((p) => p.id_plan === idPlan);
    if (planFound) {
      console.log("Plan a editar:", planFound);
      setPlanToEdit(planFound);
      setEditarPlanOpen(true);
    } else {
      console.error("No se encontró el plan con id:", idPlan);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <p className="text-gray-500">Gestiona todos los aspectos del sistema de renta de carros</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-blue-500 hover:bg-blue-600">
            <FileText className="h-4 w-4 mr-2" /> Generar Reporte
          </Button>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8">
        {/* Tarjeta de Vehículos Totales */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Vehículos Totales</p>
                <h3 className="text-2xl font-bold mt-1">{vehicles.length}</h3>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Car className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <div className="mt-4 text-sm text-green-500 flex items-center">
              <span>↑ 12% desde el mes pasado</span>
            </div>
          </CardContent>
        </Card>

        {/* Tarjeta de Planes Totales */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Planes Totales</p>
                <h3 className="text-2xl font-bold mt-1">{plans.length}</h3>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div className="mt-4 text-sm text-green-500 flex items-center">
              <span>Actualizado recientemente</span>
            </div>
          </CardContent>
        </Card>

        {/* Tarjeta de Reservaciones Totales */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Reservaciones Totales</p>
                <h3 className="text-2xl font-bold mt-1">{reservations.length}</h3>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-red-500" />
              </div>
            </div>
            <div className="mt-4 text-sm text-green-500 flex items-center">
              <span>Actualizado recientemente</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de administración */}
      <Tabs defaultValue="vehicles" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="vehicles">Vehículos</TabsTrigger>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="reservations">Reservaciones</TabsTrigger>
          <TabsTrigger value="plans">Planes</TabsTrigger>
          <TabsTrigger value="categorias">Categorías</TabsTrigger>
        </TabsList>

        {/* Pestaña Vehículos */}
        <TabsContent value="vehicles">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Gestión de Vehículos</CardTitle>
                  <CardDescription>Administra el inventario de vehículos disponibles</CardDescription>
                </div>
                <Button onClick={() => setModalOpen(true)} className="bg-blue-500 hover:bg-blue-600">
                  <Car className="h-4 w-4 mr-2" /> Agregar Vehículo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingVehicles ? (
                <div>Cargando vehículos...</div>
              ) : fetchVehiclesError ? (
                <div className="text-red-500">{fetchVehiclesError}</div>
              ) : vehicles.length === 0 ? (
                <div>No se encontraron vehículos.</div>
              ) : (
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Foto</th>
                      <th className="text-left py-2 px-4">Marca</th>
                      <th className="text-left py-2 px-4">Modelo</th>
                      <th className="text-left py-2 px-4">Año</th>
                      <th className="text-left py-2 px-4">Fecha Registro</th>
                      <th className="text-left py-2 px-4">Placa</th>
                      <th className="text-left py-2 px-4">Estado</th>
                      <th className="text-left py-2 px-4">Categoría</th>
                      <th className="text-left py-2 px-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map((vehicle) => (
                      <tr key={vehicle.id_vehiculo} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">
                          {vehicle.foto ? (
                            <img
                              src={vehicle.foto}
                              alt={`${vehicle.marca} ${vehicle.modelo}`}
                              className="h-12 w-auto rounded"
                            />
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="py-2 px-4">{vehicle.marca}</td>
                        <td className="py-2 px-4">{vehicle.modelo}</td>
                        <td className="py-2 px-4">{vehicle.anio}</td>
                        <td className="py-2 px-4">{new Date(vehicle.fecha_registro).toLocaleDateString()}</td>
                        <td className="py-2 px-4">{vehicle.placa}</td>
                        <td className="py-2 px-4">{vehicle.estado?.descripcion || "-"}</td>
                        <td className="py-2 px-4">{vehicle.categoria?.nombre_categoria || "-"}</td>
                        <td className="py-2 px-4">
                          <Button variant="outline" size="sm" onClick={() => handleEditVehicle(vehicle.id_vehiculo)}>
                            Editar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña Usuarios */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Gestión de Usuarios</CardTitle>
                  <CardDescription>Muestra nombre, email, teléfono, DUI, fecha de registro y rol</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loadingUsers ? (
                <div>Cargando usuarios...</div>
              ) : fetchUsersError ? (
                <div className="text-red-500">{fetchUsersError}</div>
              ) : users.length === 0 ? (
                <div>No se encontraron usuarios.</div>
              ) : (
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Nombre</th>
                      <th className="text-left py-2 px-4">Email</th>
                      <th className="text-left py-2 px-4">Teléfono</th>
                      <th className="text-left py-2 px-4">DUI</th>
                      <th className="text-left py-2 px-4">Fecha Registro</th>
                      <th className="text-left py-2 px-4">Rol</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id_usuario} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{user.nombres}</td>
                        <td className="py-2 px-4">{user.email}</td>
                        <td className="py-2 px-4">{user.telefono}</td>
                        <td className="py-2 px-4">{user.dui}</td>
                        <td className="py-2 px-4">{new Date(user.fecha_registro).toLocaleDateString()}</td>
                        <td className="py-2 px-4">{user.rol?.nombre_rol || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña Reservaciones */}
        <TabsContent value="reservations">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Gestión de Reservaciones</CardTitle>
                  <CardDescription>Muestra la información de las reservaciones</CardDescription>
                </div>
                {/* Sin botón de agregar reservaciones */}
              </div>
            </CardHeader>
            <CardContent>
              {loadingReservations ? (
                <div>Cargando reservaciones...</div>
              ) : fetchReservationsError ? (
                <div className="text-red-500">{fetchReservationsError}</div>
              ) : reservations.length === 0 ? (
                <div>No se encontraron reservaciones.</div>
              ) : (
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">ID Reservación</th>
                      <th className="text-left py-2 px-4">Fecha Desde</th>
                      <th className="text-left py-2 px-4">Fecha Hasta</th>
                      <th className="text-left py-2 px-4">Fecha Registro</th>
                      <th className="text-left py-2 px-4">ID Suscripción</th>
                      <th className="text-left py-2 px-4">Fecha Pago</th>
                      <th className="text-left py-2 px-4">Marca</th>
                      <th className="text-left py-2 px-4">Modelo</th>
                      <th className="text-left py-2 px-4">Año</th>
                      <th className="text-left py-2 px-4">Placa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((resv) => (
                      <tr key={resv.id_reservacion} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{resv.id_reservacion}</td>
                        <td className="py-2 px-4">{resv.fecha_desde}</td>
                        <td className="py-2 px-4">{resv.fecha_hasta}</td>
                        <td className="py-2 px-4">{new Date(resv.fecha_registro).toLocaleString()}</td>
                        <td className="py-2 px-4">{resv.id_suscripcion}</td>
                        <td className="py-2 px-4">{resv.suscripcion?.fecha_pago}</td>
                        <td className="py-2 px-4">{resv.vehiculo?.marca}</td>
                        <td className="py-2 px-4">{resv.vehiculo?.modelo}</td>
                        <td className="py-2 px-4">{resv.vehiculo?.anio}</td>
                        <td className="py-2 px-4">{resv.vehiculo?.placa}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña Planes */}
        <TabsContent value="plans">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Gestión de Planes</CardTitle>
                  <CardDescription>Administra los planes de suscripción disponibles</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setModalPlanOpen(true)} className="bg-blue-500 hover:bg-blue-600">
                    <CreditCard className="h-4 w-4 mr-2" /> Nuevo Plan
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loadingPlans ? (
                <div>Cargando planes...</div>
              ) : fetchPlansError ? (
                <div className="text-red-500">{fetchPlansError}</div>
              ) : plans.length === 0 ? (
                <div>No se encontraron planes.</div>
              ) : (
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Nombre del Plan</th>
                      <th className="text-left py-2 px-4">Descripción</th>
                      <th className="text-left py-2 px-4">Precio</th>
                      <th className="text-left py-2 px-4">Límite KM</th>
                      <th className="text-left py-2 px-4">Categoría</th>
                      <th className="text-left py-2 px-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map((plan) => (
                      <tr key={plan.id_plan} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{plan.nombre_plan}</td>
                        <td className="py-2 px-4">{plan.descripcion}</td>
                        <td className="py-2 px-4">${parseFloat(plan.precio_mensual).toFixed(2)}</td>
                        <td className="py-2 px-4">{plan.limite_km} km</td>
                        <td className="py-2 px-4">{plan.categoria?.nombre_categoria || "Sin categoría"}</td>
                        <td className="py-2 px-4">
                          <Button variant="outline" size="sm" onClick={() => handleEditPlan(plan.id_plan)}>
                            Editar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña Categorías */}
        <TabsContent value="categorias">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Gestión de Categorías</CardTitle>
                  <CardDescription>Administra las categorías disponibles</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setModalCategoOpen(true)} className="bg-blue-500 hover:bg-blue-600">
                    <CreditCard className="h-4 w-4 mr-2" /> Agregar Categoría
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loadingCatego ? (
                <div>Cargando categorías...</div>
              ) : fetchCategoError ? (
                <div className="text-red-500">{fetchCategoError}</div>
              ) : categorias.length === 0 ? (
                <div>No se encontraron categorías.</div>
              ) : (
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">ID</th>
                      <th className="text-left py-2 px-4">Nombre</th>
                      <th className="text-left py-2 px-4">Descripción</th>
                      <th className="text-left py-2 px-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categorias.map((cat) => (
                      <tr key={cat.id_categoria} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{cat.id_categoria}</td>
                        <td className="py-2 px-4">{cat.nombre_categoria}</td>
                        <td className="py-2 px-4">{cat.descripcion}</td>
                        <td className="py-2 px-4">
                          <Button variant="outline" size="sm" onClick={() => handleEditCategory(cat.id_categoria)}>
                            Editar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modales */}
      {/* Modal para Agregar Vehículo */}
      <AgregarVehi open={modalOpen} onClose={() => setModalOpen(false)} />
      {/* Modal para Agregar Categoría */}
      <AgregarCatego open={modalCategoOpen} onClose={() => setModalCategoOpen(false)} />
      {/* Modal para Agregar Plan */}
      <AgregarPlan open={modalPlanOpen} onClose={() => setModalPlanOpen(false)} categories={categorias} />
      {/* Modal para Editar Vehículo */}
      {vehicleToEdit && (
        <EditarVehi open={editarVehiOpen} onClose={() => setEditarVehiOpen(false)} vehicle={vehicleToEdit} />
      )}
      {/* Modal para Editar Categoría */}
      {categoriaToEdit && (
        <EditarCatego open={editarCategoOpen} onClose={() => setEditarCategoOpen(false)} categoria={categoriaToEdit} />
      )}
      {/* Modal para Editar Plan */}
      {planToEdit && (
        <EditarPlan
          open={editarPlanOpen}
          onClose={() => setEditarPlanOpen(false)}
          plan={planToEdit}
          categories={categorias}
        />
      )}
    </div>
  );
}
