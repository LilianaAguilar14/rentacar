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
  Car,
  ShoppingCart,
  CreditCard,
  Users,
} from "lucide-react";

// Importación de modales
import AgregarVehi from "@/components/AgregarVehi";
import AgregarCatego from "@/components/AgregarCatego";
import AgregarPlan from "@/components/AgregarPlan";
import EditarVehi from "@/components/EditarVehi";
import EditarCatego from "@/components/EditarCatego";
import EditarPlan from "@/components/EditarPlan";

// IMPORTACIÓN DEL CHART
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// *** IMPORTANTE ***
// 1. Asegúrate de instalar: npm install jspdf jspdf-autotable
// 2. Usa la importación recomendada:
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Registro de componentes en ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// INTERFACES
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

interface Category {
  id_categoria: number;
  nombre_categoria: string;
  descripcion: string;
}

interface Plan {
  id_plan: number;
  nombre_plan: string;
  descripcion: string;
  precio_mensual: string;
  limite_km: number;
  id_categoria: number;
  categoria?: {
    id_categoria: number;
    nombre_categoria: string;
    descripcion: string;
  };
}

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

interface Reservation {
  id_reservacion: number;
  fecha_desde: string;
  fecha_hasta: string;
  fecha_registro: string;
  id_suscripcion: number;
  suscripcion: {
    id_suscripcion: number;
    fecha_inicio: string;
    fecha_fin: string;
    fecha_pago: string;
    id_usuario: number;
    id_plan: number;
    id_estado: number;
    created_at: string | null;
    updated_at: string | null;
  };
  vehiculo: {
    id_vehiculo: number;
    marca: string;
    modelo: string;
    anio: string;
    fecha_registro: string;
    placa: string;
  };
}

// Interfaz para Suscripción
interface Suscripcion {
  id_suscripcion: number;
  fecha_inicio: string;
  fecha_fin: string;
  fecha_pago: string;
  id_usuario: number;
  id_plan: number;
  id_estado: number;
  created_at: string | null;
  updated_at: string | null;
}

// === Funciones de ayuda para gráficos y cálculos ===

function getDailyCounts(
  data: any[],
  dateField: string,
  days: number = 7
): { labels: string[]; counts: number[] } {
  const labels: string[] = [];
  const counts: { [key: string]: number } = {};
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    labels.push(label);
    counts[label] = 0;
  }

  data.forEach((item) => {
    const d = new Date(item[dateField]);
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (label in counts) {
      counts[label]++;
    }
  });

  return { labels, counts: labels.map((lab) => counts[lab]) };
}

function getPlansDailyCounts(
  plans: Plan[],
  days: number = 7
): { labels: string[]; counts: number[] } {
  const labels: string[] = [];
  const counts: number[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    labels.push(label);
    counts.push(i === 0 ? plans.length : 0);
  }
  return { labels, counts };
}

/**
 * Suma diaria de ganancias a partir de la fecha_pago de la suscripción
 */
function getDailyRevenue(
  subs: Suscripcion[],
  dateField: string,
  plans: Plan[],
  days: number = 7
): { labels: string[]; revenue: number[] } {
  const labels: string[] = [];
  const revenueMap: { [key: string]: number } = {};
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    labels.push(label);
    revenueMap[label] = 0;
  }

  subs.forEach((sub) => {
    const d = new Date(sub[dateField]);
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const plan = plans.find((p) => p.id_plan === sub.id_plan);
    const amount = plan ? parseFloat(plan.precio_mensual) : 0;
    if (label in revenueMap) {
      revenueMap[label] += amount;
    }
  });

  return { labels, revenue: labels.map((lab) => revenueMap[lab]) };
}

export default function AdminDashboard() {
  // === Estados de modales ===
  const [modalOpen, setModalOpen] = useState(false);
  const [editarVehiOpen, setEditarVehiOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState<Vehicle | null>(null);

  const [modalCategoOpen, setModalCategoOpen] = useState(false);
  const [editarCategoOpen, setEditarCategoOpen] = useState(false);
  const [categoriaToEdit, setCategoriaToEdit] = useState<Category | null>(null);

  const [modalPlanOpen, setModalPlanOpen] = useState(false);
  const [planToEdit, setPlanToEdit] = useState<Plan | null>(null);
  const [editarPlanOpen, setEditarPlanOpen] = useState(false);

  // === Estados para datos ===
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

  const [suscripciones, setSuscripciones] = useState<Suscripcion[]>([]);
  const [loadingSuscripciones, setLoadingSuscripciones] = useState(false);
  const [fetchSuscripcionesError, setFetchSuscripcionesError] = useState("");

  // === Efectos para cargar datos al montar el componente ===
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
        setFetchVehiclesError("No se pudieron obtener los vehículos. Intenta de nuevo.");
      } finally {
        setLoadingVehicles(false);
      }
    };
    fetchVehicles();
  }, []);

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
        setFetchCategoError("No se pudieron obtener las categorías. Intenta de nuevo.");
      } finally {
        setLoadingCatego(false);
      }
    };
    fetchCategorias();
  }, []);

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
        setFetchPlansError("No se pudieron obtener los planes. Intenta de nuevo.");
      } finally {
        setLoadingPlans(false);
      }
    };
    fetchPlans();
  }, []);

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
        setFetchReservationsError("No se pudieron obtener las reservaciones. Intenta de nuevo.");
      } finally {
        setLoadingReservations(false);
      }
    };
    fetchReservations();
  }, []);

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
        setFetchUsersError("No se pudieron obtener los usuarios. Intenta de nuevo.");
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchSuscripciones = async () => {
      setLoadingSuscripciones(true);
      setFetchSuscripcionesError("");
      try {
        const res = await fetch("http://127.0.0.1:8000/api/suscripciones");
        if (!res.ok) throw new Error("Error al obtener suscripciones");
        const data = await res.json();
        setSuscripciones(data);
      } catch (error) {
        setFetchSuscripcionesError("No se pudieron obtener las suscripciones. Intenta de nuevo.");
      } finally {
        setLoadingSuscripciones(false);
      }
    };
    fetchSuscripciones();
  }, []);

  // === Funciones para abrir modales ===
  const handleEditVehicle = (idVehiculo: number) => {
    const veh = vehicles.find((v) => v.id_vehiculo === idVehiculo);
    if (veh) {
      setVehicleToEdit(veh);
      setEditarVehiOpen(true);
    }
  };

  const handleEditCategory = (id: number) => {
    const cat = categorias.find((c) => c.id_categoria === id);
    if (cat) {
      setCategoriaToEdit(cat);
      setEditarCategoOpen(true);
    }
  };

  const handleEditPlan = (idPlan: number) => {
    const planFound = plans.find((p) => p.id_plan === idPlan);
    if (planFound) {
      setPlanToEdit(planFound);
      setEditarPlanOpen(true);
    }
  };

  // === Aceptar Reservación (estado pendiente -> activo) ===
  const acceptReservation = async (reservationId: number) => {
    try {
      const payload = { id_estado: 1 };
      const res = await fetch(`http://127.0.0.1:8000/api/reservaciones/${reservationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error("Error al actualizar la reservación");
      }
      setReservations((prev) =>
        prev.map((r) =>
          r.id_reservacion === reservationId
            ? { ...r, suscripcion: { ...r.suscripcion, id_estado: 1 } }
            : r
        )
      );
    } catch (error) {
      console.error("Error en acceptReservation:", error);
    }
  };

  // === Cálculos de ganancias ===
  const totalRevenue = suscripciones.reduce((sum, sub) => {
    const plan = plans.find((p) => p.id_plan === sub.id_plan);
    const amount = plan ? parseFloat(plan.precio_mensual) : 0;
    return sum + amount;
  }, 0);

  const revenueDaily = getDailyRevenue(suscripciones, "fecha_pago", plans, 7);

  // === Datos de otros gráficos ===
  const vehiclesDaily = getDailyCounts(vehicles, "fecha_registro", 7);
  const reservationsDaily = getDailyCounts(reservations, "fecha_registro", 7);
  const plansDaily = getPlansDailyCounts(plans, 7);

  const vehiclesChartData = {
    labels: vehiclesDaily.labels,
    datasets: [
      {
        label: "Vehículos",
        data: vehiclesDaily.counts,
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
      },
    ],
  };

  const reservationsChartData = {
    labels: reservationsDaily.labels,
    datasets: [
      {
        label: "Reservaciones",
        data: reservationsDaily.counts,
        borderColor: "rgba(239, 68, 68, 1)",
        backgroundColor: "rgba(239, 68, 68, 0.2)",
      },
    ],
  };

  const plansChartData = {
    labels: plansDaily.labels,
    datasets: [
      {
        label: "Planes",
        data: plansDaily.counts,
        borderColor: "rgba(16, 185, 129, 1)",
        backgroundColor: "rgba(16, 185, 129, 0.2)",
      },
    ],
  };

  // === Gráfico de Ganancias Diarias ===
  const revenueChartData = {
    labels: revenueDaily.labels,
    datasets: [
      {
        label: "Ganancias diarias ($)",
        data: revenueDaily.revenue,
        borderColor: "rgba(107, 114, 128, 1)",
        backgroundColor: "rgba(107, 114, 128, 0.2)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { display: false }, beginAtZero: true },
    },
  };

  /**
   * GENERAR REPORTE PDF (jspdf + jspdf-autotable)
   */
  const generatePDFReport = () => {
    const doc = new jsPDF();

    // Título principal
    doc.setFontSize(18);
    doc.text("Reporte de Ganancias", 14, 20);

    // Subtítulo o resumen
    doc.setFontSize(12);
    doc.text(`Ganancias Totales: $${totalRevenue.toFixed(2)}`, 14, 30);

    // Preparamos la data para la tabla
    const tableColumn = [
      "ID",
      "Fecha Inicio",
      "Fecha Fin",
      "Fecha Pago",
      "Usuario",
      "Estado",
      "Plan",
      "Monto",
    ];
    const tableRows: string[][] = [];

    suscripciones.forEach((sub) => {
      const userInfo = users.find((u) => u.id_usuario === sub.id_usuario);
      const planInfo = plans.find((p) => p.id_plan === sub.id_plan);
      tableRows.push([
        sub.id_suscripcion.toString(),
        sub.fecha_inicio,
        sub.fecha_fin,
        sub.fecha_pago,
        userInfo ? userInfo.nombres : "—",
        sub.id_estado.toString(),
        planInfo ? planInfo.nombre_plan : "—",
        planInfo ? `$${parseFloat(planInfo.precio_mensual).toFixed(2)}` : "—",
      ]);
    });

    // Usamos autoTable y le pasamos la instancia de doc
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: "grid",
      headStyles: { fillColor: [59, 130, 246] },
    });

    // Guardamos el PDF
    doc.save("Reporte_de_Ganancias.pdf");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <p className="text-gray-500">
            Gestiona todos los aspectos del sistema de renta de carros
          </p>
        </div>
        <div className="flex gap-2">
          {/* Botón para generar reporte PDF */}
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={generatePDFReport}>
            <FileText className="h-4 w-4 mr-2" /> Generar Reporte
          </Button>
        </div>
      </div>

      {/* Tarjetas de estadísticas con gráficos diarios */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6 mb-8">
        {/* Vehículos Totales */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Vehículos Totales
                </p>
                <h3 className="text-2xl font-bold mt-1">{vehicles.length}</h3>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Car className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <div className="mt-4" style={{ height: "150px" }}>
              <Line data={vehiclesChartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Planes Totales */}
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
            <div className="mt-4" style={{ height: "150px" }}>
              <Line data={plansChartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Reservaciones Totales */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Reservaciones Totales
                </p>
                <h3 className="text-2xl font-bold mt-1">{reservations.length}</h3>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-red-500" />
              </div>
            </div>
            <div className="mt-4" style={{ height: "150px" }}>
              <Line data={reservationsChartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Ganancias Totales */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Ganancias Totales</p>
                <h3 className="text-2xl font-bold mt-1">${totalRevenue.toFixed(2)}</h3>
              </div>
              <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-gray-500" />
              </div>
            </div>
            <div className="mt-4" style={{ height: "150px" }}>
              <Line data={revenueChartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de administración */}
      <Tabs defaultValue="vehicles" className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-8">
          <TabsTrigger value="vehicles">Vehículos</TabsTrigger>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="reservations">Reservaciones</TabsTrigger>
          <TabsTrigger value="plans">Planes</TabsTrigger>
          <TabsTrigger value="categorias">Categorías</TabsTrigger>
          <TabsTrigger value="suscripciones">Suscripciones</TabsTrigger>
        </TabsList>

        {/* Pestaña Vehículos */}
        <TabsContent value="vehicles">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Gestión de Vehículos</CardTitle>
                  <CardDescription>
                    Administra el inventario de vehículos disponibles
                  </CardDescription>
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
                        <td className="py-2 px-4">
                          {new Date(vehicle.fecha_registro).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-4">{vehicle.placa}</td>
                        <td className="py-2 px-4">{vehicle.estado?.descripcion || "-"}</td>
                        <td className="py-2 px-4">
                          {vehicle.categoria?.nombre_categoria || "-"}
                        </td>
                        <td className="py-2 px-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditVehicle(vehicle.id_vehiculo)}
                          >
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
                  <CardDescription>
                    Muestra nombre, email, teléfono, DUI, fecha de registro y rol
                  </CardDescription>
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
                        <td className="py-2 px-4">
                          {new Date(user.fecha_registro).toLocaleDateString()}
                        </td>
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
                      <th className="text-left py-2 px-4">Cliente</th>
                      <th className="text-left py-2 px-4">Fecha Pago</th>
                      <th className="text-left py-2 px-4">Marca</th>
                      <th className="text-left py-2 px-4">Modelo</th>
                      <th className="text-left py-2 px-4">Año</th>
                      <th className="text-left py-2 px-4">Placa</th>
                      <th className="text-left py-2 px-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((resv) => {
                      const userId = resv.suscripcion?.id_usuario;
                      const userInfo = users.find((u) => u.id_usuario === userId);
                      return (
                        <tr key={resv.id_reservacion} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-4">{resv.id_reservacion}</td>
                          <td className="py-2 px-4">{resv.fecha_desde}</td>
                          <td className="py-2 px-4">{resv.fecha_hasta}</td>
                          <td className="py-2 px-4">
                            {new Date(resv.fecha_registro).toLocaleString()}
                          </td>
                          <td className="py-2 px-4">
                            {userInfo ? userInfo.nombres : ""}
                          </td>
                          <td className="py-2 px-4">{resv.suscripcion?.fecha_pago}</td>
                          <td className="py-2 px-4">{resv.vehiculo?.marca}</td>
                          <td className="py-2 px-4">{resv.vehiculo?.modelo}</td>
                          <td className="py-2 px-4">{resv.vehiculo?.anio}</td>
                          <td className="py-2 px-4">{resv.vehiculo?.placa}</td>
                          <td className="py-2 px-4">
                            {resv.suscripcion?.id_estado === 2 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => acceptReservation(resv.id_reservacion)}
                              >
                                Aceptar
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
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
                  <CardDescription>
                    Administra los planes de suscripción disponibles
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setModalPlanOpen(true)}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
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
                        <td className="py-2 px-4">
                          {plan.categoria?.nombre_categoria || "Sin categoría"}
                        </td>
                        <td className="py-2 px-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditPlan(plan.id_plan)}
                          >
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
                  <Button
                    onClick={() => setModalCategoOpen(true)}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCategory(cat.id_categoria)}
                          >
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

        {/* Pestaña Suscripciones */}
        <TabsContent value="suscripciones">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Gestión de Suscripciones</CardTitle>
                <CardDescription>
                  Muestra la información de las suscripciones
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {loadingSuscripciones ? (
                <div>Cargando suscripciones...</div>
              ) : fetchSuscripcionesError ? (
                <div className="text-red-500">{fetchSuscripcionesError}</div>
              ) : suscripciones.length === 0 ? (
                <div>No se encontraron suscripciones.</div>
              ) : (
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">ID</th>
                      <th className="text-left py-2 px-4">Fecha Inicio</th>
                      <th className="text-left py-2 px-4">Fecha Fin</th>
                      <th className="text-left py-2 px-4">Fecha Pago</th>
                      <th className="text-left py-2 px-4">Usuario</th>
                      <th className="text-left py-2 px-4">Estado</th>
                      <th className="text-left py-2 px-4">Plan</th>
                      <th className="text-left py-2 px-4">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suscripciones.map((sub) => {
                      const userInfo = users.find((u) => u.id_usuario === sub.id_usuario);
                      const planInfo = plans.find((p) => p.id_plan === sub.id_plan);
                      return (
                        <tr key={sub.id_suscripcion} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-4">{sub.id_suscripcion}</td>
                          <td className="py-2 px-4">{sub.fecha_inicio}</td>
                          <td className="py-2 px-4">{sub.fecha_fin}</td>
                          <td className="py-2 px-4">{sub.fecha_pago}</td>
                          <td className="py-2 px-4">{userInfo ? userInfo.nombres : "—"}</td>
                          <td className="py-2 px-4">{sub.id_estado}</td>
                          <td className="py-2 px-4">{planInfo ? planInfo.nombre_plan : "—"}</td>
                          <td className="py-2 px-4">
                            {planInfo
                              ? `$${parseFloat(planInfo.precio_mensual).toFixed(2)}`
                              : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modales */}
      <AgregarVehi open={modalOpen} onClose={() => setModalOpen(false)} />
      <AgregarCatego open={modalCategoOpen} onClose={() => setModalCategoOpen(false)} />
      <AgregarPlan open={modalPlanOpen} onClose={() => setModalPlanOpen(false)} categories={categorias} />
      {vehicleToEdit && (
        <EditarVehi
          open={editarVehiOpen}
          onClose={() => setEditarVehiOpen(false)}
          vehicle={vehicleToEdit}
        />
      )}
      {categoriaToEdit && (
        <EditarCatego
          open={editarCategoOpen}
          onClose={() => setEditarCategoOpen(false)}
          categoria={categoriaToEdit}
        />
      )}
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
