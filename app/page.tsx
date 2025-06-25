import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, Monitor, Users, Clock, BookOpen, Wrench } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header con logo institucional */}
        <div className="text-center mb-8 bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="h-16 w-16 bg-red-600 rounded-full flex items-center justify-center mr-4">
              <span className="text-white font-bold text-xl">UV</span>
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold text-red-600 mb-1">Universidad del Valle</h1>
              <p className="text-lg text-gray-600">Sede Palmira</p>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Sistema Integral de Laboratorios</h2>
          <p className="text-lg text-gray-600">Control de acceso, inducción y préstamo de equipos</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-6 w-6 text-red-600" />
                Control de Acceso
              </CardTitle>
              <CardDescription>Registro de entrada y salida del laboratorio</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/access-control">
                <Button className="w-full bg-red-600 hover:bg-red-700" size="lg">
                  Registrar Acceso
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-red-600" />
                Inducción de Usuarios
              </CardTitle>
              <CardDescription>Control de asistencia a inducciones</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/induction-control">
                <Button className="w-full bg-red-600 hover:bg-red-700" size="lg">
                  Registrar Inducción
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-6 w-6 text-red-600" />
                Préstamo de Equipos
              </CardTitle>
              <CardDescription>Reserva de instalaciones y equipos</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/equipment-loan">
                <Button className="w-full bg-red-600 hover:bg-red-700" size="lg">
                  Solicitar Préstamo
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card className="hover:shadow-lg transition-shadow mb-8 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-6 w-6 text-red-600" />
              Dashboard Administrativo
            </CardTitle>
            <CardDescription>Monitoreo en tiempo real de todos los sistemas</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin-login">
              <Button variant="outline" className="w-full border-red-600 text-red-600 hover:bg-red-50" size="lg">
                Acceso Administrativo
              </Button>
            </Link>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-red-200">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">Control de Acceso</h3>
              <p className="text-sm text-gray-600">Registro completo de entradas y salidas</p>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardContent className="p-6 text-center">
              <BookOpen className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">Inducciones</h3>
              <p className="text-sm text-gray-600">Control de capacitaciones</p>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardContent className="p-6 text-center">
              <Wrench className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">Equipos</h3>
              <p className="text-sm text-gray-600">Gestión de préstamos</p>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">Tiempo Real</h3>
              <p className="text-sm text-gray-600">Monitoreo instantáneo</p>
            </CardContent>
          </Card>
        </div>

        {/* Footer institucional */}
        <footer className="mt-12 bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="h-8 w-8 bg-red-600 rounded-full flex items-center justify-center mr-2">
              <span className="text-white font-bold text-sm">UV</span>
            </div>
            <span className="text-gray-700 font-medium">Universidad del Valle - Sede Palmira</span>
          </div>
          <p className="text-sm text-gray-600">
            Sistema desarrollado para optimizar la gestión de laboratorios académicos
          </p>
          <p className="text-xs text-gray-500 mt-2">© 2024 Universidad del Valle. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  )
}
