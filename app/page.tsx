import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Hero Section con dos columnas */}
      <section className="container mx-auto grid md:grid-cols-2 gap-8 py-16 px-4 md:px-6">
        {/* Columna Izquierda - Caja Azul */}
        <div className="bg-blue-500 rounded-2xl p-8 md:p-10 text-white flex flex-col justify-between shadow-lg">
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">La Mejor Plataforma Para Rentar Carros</h1>
           
          </div>
          <div className="mt-8">
            <Link href="/login">
              <Button className="bg-white text-blue-500 hover:bg-blue-50 w-fit font-medium px-6 py-2 rounded-lg shadow-md transition-all duration-200">
                Rentar Carros
              </Button>
            </Link>
          </div>
        </div>

    
        <div className="flex items-center justify-center">
          <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden rounded-2xl shadow-xl">
            <Image
              src="carro.jpg"
              alt="Car Rental Service"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </section>
    </main>
  )
}
