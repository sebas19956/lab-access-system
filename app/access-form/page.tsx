"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function AccessForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    codigo: "",
    tipoUsuario: "",
    programa: "",
    actividad: "",
    tiempoEstimado: "",
    descripcion: "",
    equipos: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Simular envío del formulario
    const accessData = {
      ...formData,
      timestamp: new Date().toISOString(),
      id: Date.now().toString(),
    }

    try {
      const response = await fetch("/api/access-log", {
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Acceso Registrado!</h2>
            <p className="text-gray-600 mb-6">Tu entrada al laboratorio ha sido registrada exitosamente.</p>
            <Link href="/">
              <Button className="w-full">Volver al Inicio</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registro de Acceso al Laboratorio</CardTitle>
            <CardDescription>Por favor completa la siguiente información para registrar tu acceso</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre Completo *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código/ID *</Label>
                  <Input
                    id="codigo"
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                    placeholder="Código estudiantil o ID"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Tipo de Usuario *</Label>
                <RadioGroup
                  value={formData.tipoUsuario}
                  onValueChange={(value) => setFormData({ ...formData, tipoUsuario: value })}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="estudiante" id="estudiante" />
                    <Label htmlFor="estudiante">Estudiante</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="profesor" id="profesor" />
                    <Label htmlFor="profesor">Profesor</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="investigador" id="investigador" />
                    <Label htmlFor="investigador">Investigador</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="visitante" id="visitante" />
                    <Label htmlFor="visitante">Visitante</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="programa">Programa/Departamento</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, programa: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu programa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ingenieria-sistemas">Ingeniería de Sistemas</SelectItem>
                    <SelectItem value="ingenieria-electronica">Ingeniería Electrónica</SelectItem>
                    <SelectItem value="ingenieria-industrial">Ingeniería Industrial</SelectItem>
                    <SelectItem value="ciencias-computacion">Ciencias de la Computación</SelectItem>
                    <SelectItem value="matematicas">Matemáticas</SelectItem>
                    <SelectItem value="fisica">Física</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="actividad">Tipo de Actividad *</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, actividad: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="¿Qué vas a hacer?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="practica-laboratorio">Práctica de Laboratorio</SelectItem>
                    <SelectItem value="proyecto-investigacion">Proyecto de Investigación</SelectItem>
                    <SelectItem value="tesis">Trabajo de Tesis</SelectItem>
                    <SelectItem value="clase">Clase/Cátedra</SelectItem>
                    <SelectItem value="estudio-personal">Estudio Personal</SelectItem>
                    <SelectItem value="mantenimiento">Mantenimiento de Equipos</SelectItem>
                    <SelectItem value="reunion">Reunión</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tiempoEstimado">Tiempo Estimado de Permanencia *</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, tiempoEstimado: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="¿Cuánto tiempo estarás?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30min">30 minutos</SelectItem>
                    <SelectItem value="1hora">1 hora</SelectItem>
                    <SelectItem value="2horas">2 horas</SelectItem>
                    <SelectItem value="3horas">3 horas</SelectItem>
                    <SelectItem value="4horas">4 horas</SelectItem>
                    <SelectItem value="medio-dia">Medio día</SelectItem>
                    <SelectItem value="dia-completo">Día completo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="equipos">Equipos a Utilizar</Label>
                <Input
                  id="equipos"
                  value={formData.equipos}
                  onChange={(e) => setFormData({ ...formData, equipos: e.target.value })}
                  placeholder="Ej: Computadoras, microscopios, impresora 3D..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción de la Actividad</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Describe brevemente lo que vas a realizar..."
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                Registrar Acceso
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
