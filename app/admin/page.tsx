import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Car, CreditCard, DollarSign, FileText, Settings, ShoppingCart, Users } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <p className="text-gray-500">Gestiona todos los aspectos del sistema de renta de carros</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-blue-500 hover:bg-blue-600">
            <FileText className="h-4 w-4 mr-2" />
            Generar Reporte
          </Button>
          <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-50">
            <Settings className="h-4 w-4 mr-2" />
            Configuración
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Vehículos Totales</p>
                <h3 className="text-2xl font-bold mt-1">48</h3>
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

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Usuarios Activos</p>
                <h3 className="text-2xl font-bold mt-1">156</h3>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div className="mt-4 text-sm text-green-500 flex items-center">
              <span>↑ 8% desde el mes pasado</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Reservaciones</p>
                <h3 className="text-2xl font-bold mt-1">32</h3>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-purple-500" />
              </div>
            </div>
            <div className="mt-4 text-sm text-green-500 flex items-center">
              <span>↑ 24% desde el mes pasado</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Ingresos</p>
                <h3 className="text-2xl font-bold mt-1">$12,450</h3>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
            <div className="mt-4 text-sm text-green-500 flex items-center">
              <span>↑ 16% desde el mes pasado</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="vehicles" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="vehicles">Vehículos</TabsTrigger>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="reservations">Reservaciones</TabsTrigger>
          <TabsTrigger value="plans">Planes</TabsTrigger>
        </TabsList>

        <TabsContent value="vehicles">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Gestión de Vehículos</CardTitle>
                  <CardDescription>Administra el inventario de vehículos disponibles</CardDescription>
                </div>
                <Button className="bg-blue-500 hover:bg-blue-600">
                  <Car className="h-4 w-4 mr-2" />
                  Agregar Vehículo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">ID</th>
                      <th className="text-left py-3 px-4">Marca</th>
                      <th className="text-left py-3 px-4">Modelo</th>
                      <th className="text-left py-3 px-4">Año</th>
                      <th className="text-left py-3 px-4">Placa</th>
                      <th className="text-left py-3 px-4">Categoría</th>
                      <th className="text-left py-3 px-4">Estado</th>
                      <th className="text-left py-3 px-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">1</td>
                      <td className="py-3 px-4">Toyota</td>
                      <td className="py-3 px-4">Corolla</td>
                      <td className="py-3 px-4">2020</td>
                      <td className="py-3 px-4">XYZ123</td>
                      <td className="py-3 px-4">Sedan</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Disponible</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                          <Button variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-50">
                            Eliminar
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">2</td>
                      <td className="py-3 px-4">Honda</td>
                      <td className="py-3 px-4">CR-V</td>
                      <td className="py-3 px-4">2021</td>
                      <td className="py-3 px-4">ABC456</td>
                      <td className="py-3 px-4">SUV</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Disponible</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                          <Button variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-50">
                            Eliminar
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">3</td>
                      <td className="py-3 px-4">Ford</td>
                      <td className="py-3 px-4">Mustang</td>
                      <td className="py-3 px-4">2022</td>
                      <td className="py-3 px-4">DEF789</td>
                      <td className="py-3 px-4">Luxury</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Reservado</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                          <Button variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-50">
                            Eliminar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Gestión de Usuarios</CardTitle>
                  <CardDescription>Administra los usuarios registrados en el sistema</CardDescription>
                </div>
                <Button className="bg-blue-500 hover:bg-blue-600">
                  <Users className="h-4 w-4 mr-2" />
                  Agregar Usuario
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">ID</th>
                      <th className="text-left py-3 px-4">Nombre</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Teléfono</th>
                      <th className="text-left py-3 px-4">Rol</th>
                      <th className="text-left py-3 px-4">Estado</th>
                      <th className="text-left py-3 px-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">1</td>
                      <td className="py-3 px-4">Juan Pérez</td>
                      <td className="py-3 px-4">juan.perez@example.com</td>
                      <td className="py-3 px-4">5551234567</td>
                      <td className="py-3 px-4">Cliente</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Activo</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                          <Button variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-50">
                            Eliminar
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">2</td>
                      <td className="py-3 px-4">María López</td>
                      <td className="py-3 px-4">maria.lopez@example.com</td>
                      <td className="py-3 px-4">5559876543</td>
                      <td className="py-3 px-4">Administrador</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Activo</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                          <Button variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-50">
                            Eliminar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reservations">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Gestión de Reservaciones</CardTitle>
                  <CardDescription>Administra las reservaciones de vehículos</CardDescription>
                </div>
                <Button className="bg-blue-500 hover:bg-blue-600">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Nueva Reservación
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">ID</th>
                      <th className="text-left py-3 px-4">Cliente</th>
                      <th className="text-left py-3 px-4">Vehículo</th>
                      <th className="text-left py-3 px-4">Fecha Inicio</th>
                      <th className="text-left py-3 px-4">Fecha Fin</th>
                      <th className="text-left py-3 px-4">Plan</th>
                      <th className="text-left py-3 px-4">Estado</th>
                      <th className="text-left py-3 px-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">1</td>
                      <td className="py-3 px-4">Juan Pérez</td>
                      <td className="py-3 px-4">Toyota Corolla</td>
                      <td className="py-3 px-4">10/04/2025</td>
                      <td className="py-3 px-4">20/04/2025</td>
                      <td className="py-3 px-4">Plan Básico</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Activa</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Ver
                          </Button>
                          <Button variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-50">
                            Cancelar
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">2</td>
                      <td className="py-3 px-4">María López</td>
                      <td className="py-3 px-4">Ford Mustang</td>
                      <td className="py-3 px-4">15/05/2025</td>
                      <td className="py-3 px-4">25/05/2025</td>
                      <td className="py-3 px-4">Plan Premium</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pendiente</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Ver
                          </Button>
                          <Button variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-50">
                            Cancelar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Gestión de Planes</CardTitle>
                  <CardDescription>Administra los planes de suscripción disponibles</CardDescription>
                </div>
                <Button className="bg-blue-500 hover:bg-blue-600">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Nuevo Plan
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">ID</th>
                      <th className="text-left py-3 px-4">Nombre</th>
                      <th className="text-left py-3 px-4">Descripción</th>
                      <th className="text-left py-3 px-4">Precio Mensual</th>
                      <th className="text-left py-3 px-4">Límite KM</th>
                      <th className="text-left py-3 px-4">Categoría</th>
                      <th className="text-left py-3 px-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">1</td>
                      <td className="py-3 px-4">Plan Básico</td>
                      <td className="py-3 px-4">Plan con kilometraje limitado</td>
                      <td className="py-3 px-4">$29.99</td>
                      <td className="py-3 px-4">1000</td>
                      <td className="py-3 px-4">Sedan</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                          <Button variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-50">
                            Eliminar
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">2</td>
                      <td className="py-3 px-4">Plan Estándar</td>
                      <td className="py-3 px-4">Plan con kilometraje extendido</td>
                      <td className="py-3 px-4">$49.99</td>
                      <td className="py-3 px-4">2000</td>
                      <td className="py-3 px-4">Sedan, SUV</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                          <Button variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-50">
                            Eliminar
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">3</td>
                      <td className="py-3 px-4">Plan Premium</td>
                      <td className="py-3 px-4">Plan sin límite de kilometraje</td>
                      <td className="py-3 px-4">$79.99</td>
                      <td className="py-3 px-4">Ilimitado</td>
                      <td className="py-3 px-4">Todas las categorías</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                          <Button variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-50">
                            Eliminar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

