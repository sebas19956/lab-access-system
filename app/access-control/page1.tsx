"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle } from 'lucide-react'
import Link from "next/link"

export default function AccessControl() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-red-100 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Acceso Registrado!</h2>
            <p className="text-gray-600 mb-6">El control de acceso ha sido registrado exitosamente.</p>
            <Link href="/">
              <Button className="w-full">Volver al Inicio</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-red-600 hover:text-red-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Control de Acceso al Laboratorio</CardTitle>
            <CardDescription>Registro de entrada y salida del personal</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre Completo *</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Tu nombre completo"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Código/ID *</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Código estudiantil o ID"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Motivo de la Visita *</label>
                <select className="w-full p-2 border border-gray-300 rounded-md" required>
                  <option value="">Seleccione el motivo</option>
                  <option value="practica">Práctica de Laboratorio</option>
                  <option value="investigacion">Investigación</option>
                  <option value="clase">Clase/Cátedra</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                Registrar Acceso
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}