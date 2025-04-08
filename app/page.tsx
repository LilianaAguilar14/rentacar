import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="grid md:grid-cols-2 gap-6 py-10 px-4 md:px-6">
        {/* Left Hero */}
        <div className="bg-blue-500 rounded-lg p-8 text-white flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">The Best Platform for Car Rental</h1>
            <p className="mb-8">Ease of doing a car rental safely and reliably. Of course at a low price.</p>
          </div>
          <Link href="/login">
            <Button className="bg-white text-blue-500 hover:bg-blue-50 w-fit">Rental Car</Button>
          </Link>
        </div>

        {/* Right Hero */}
        <div className="bg-blue-500 rounded-lg p-8 text-white flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Easy way to rent a car at a low price</h1>
            <p className="mb-8">Providing cheap car rental services and safe and comfortable facilities.</p>
          </div>
          <Link href="/login">
            <Button className="bg-white text-blue-500 hover:bg-blue-50 w-fit">Rental Car</Button>
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="py-10 px-4 md:px-6 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">¿Por qué elegirnos?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
              <h3 className="text-xl font-semibold mb-2">Variedad de Vehículos</h3>
              <p className="text-gray-600">
                Ofrecemos una amplia gama de vehículos para satisfacer todas tus necesidades.
              </p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
              <h3 className="text-xl font-semibold mb-2">Precios Competitivos</h3>
              <p className="text-gray-600">Nuestros planes de suscripción se adaptan a tu presupuesto.</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
              <h3 className="text-xl font-semibold mb-2">Servicio 24/7</h3>
              <p className="text-gray-600">Asistencia en carretera y soporte al cliente disponible todo el día.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-6 bg-blue-500 text-white text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-4">¿Listo para comenzar?</h2>
          <p className="mb-8 max-w-2xl mx-auto">
            Regístrate ahora y disfruta de todos los beneficios de nuestro sistema de renta de carros.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button className="bg-white text-blue-500 hover:bg-blue-50">Registrarse</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="border-white text-white hover:bg-blue-600">
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

