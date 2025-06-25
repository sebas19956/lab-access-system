"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function AccessControl() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split("T")[0],
    usuario: "",
    cargo: "",
    dependencia: "",
    empresa: "",
    codigo: "",
    motivo: "",
    horaIngreso: "",
    horaSalida: "",
    observaciones: "",
    laboratorio: "",
    email: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const accessData = {
      ...formData,
      timestamp: new Date().toISOString(),
      id: Date.now().toString(),
      tipo: "access-control",
    }

    try {
      const response = await fetch("/api/lab-records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(accessData),
      })

      if (response.ok) {
        setIsSubmitted(true)
      }
    } catch (error) {
      console.error("Error al registrar acceso:", error)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-univalle-red-100 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-univalle-red-600 mx-auto mb-4" />
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
    <div className="min-h-screen bg-gradient-to-br from-univalle-red-50 to-red-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-univalle-red-600 hover:text-univalle-red-800">
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
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fecha">Fecha *</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usuario">Usuario *</Label>
                  <Input
                    id="usuario"
                    value={formData.usuario}
                    onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
                    placeholder="Nombre completo del usuario"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input
                    id="cargo"
                    value={formData.cargo}
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                    placeholder="Cargo del usuario"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dependencia">Dependencia</Label>
                  <Input
                    id="dependencia"
                    value={formData.dependencia}
                    onChange={(e) => setFormData({ ...formData, dependencia: e.target.value })}
                    placeholder="Dependencia académica"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="empresa">Empresa</Label>
                  <Input
                    id="empresa"
                    value={formData.empresa}
                    onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                    placeholder="Empresa (si aplica)"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código</Label>
                  <Input
                    id="codigo"
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                    placeholder="Código estudiantil o de empleado"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="laboratorio">Laboratorio *</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, laboratorio: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el laboratorio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="laboratorio-fisica">Laboratorio de Física</SelectItem>
                    <SelectItem value="laboratorio-electronica-redes">Laboratorio de Electrónica y Redes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="motivo">Motivo de la Visita *</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, motivo: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el motivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="practica-laboratorio">Práctica de Laboratorio</SelectItem>
                    <SelectItem value="investigacion">Investigación</SelectItem>
                    <SelectItem value="tesis">Trabajo de Tesis</SelectItem>
                    <SelectItem value="clase">Clase/Cátedra</SelectItem>
                    <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                    <SelectItem value="reunion">Reunión</SelectItem>
                    <SelectItem value="capacitacion">Capacitación</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="horaIngreso">Hora de Ingreso *</Label>
                  <Input
                    id="horaIngreso"
                    type="time"
                    value={formData.horaIngreso}
                    onChange={(e) => setFormData({ ...formData, horaIngreso: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horaSalida">Hora de Salida</Label>
                  <Input
                    id="horaSalida"
                    type="time"
                    value={formData.horaSalida}
                    onChange={(e) => setFormData({ ...formData, horaSalida: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  value={formData.observaciones}
                  onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                  placeholder="Observaciones adicionales..."
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full bg-univalle-red-600 hover:bg-univalle-red-700" size="lg">
                Registrar Acceso
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
