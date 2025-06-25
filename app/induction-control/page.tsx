"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function InductionControl() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    nombresApellidos: "",
    laboratorio: "",
    programaAcademico: "",
    nombreEmpresa: "",
    tipoPublico: "",
    programaOtro: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const inductionData = {
      ...formData,
      timestamp: new Date().toISOString(),
      id: Date.now().toString(),
      tipo: "induction-control",
    }

    try {
      const response = await fetch("/api/lab-records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inductionData),
      })

      if (response.ok) {
        setIsSubmitted(true)
      }
    } catch (error) {
      console.error("Error al registrar inducción:", error)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-univalle-red-100 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-univalle-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Inducción Registrada!</h2>
            <p className="text-gray-600 mb-6">La asistencia a la inducción ha sido registrada exitosamente.</p>
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
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-univalle-red-600 hover:text-univalle-red-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Control de Asistencia a Inducción</CardTitle>
            <CardDescription>Registro de usuarios que asisten a la inducción del laboratorio</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nombresApellidos">Nombres y Apellidos *</Label>
                <Input
                  id="nombresApellidos"
                  value={formData.nombresApellidos}
                  onChange={(e) => setFormData({ ...formData, nombresApellidos: e.target.value })}
                  placeholder="Nombres y apellidos completos"
                  required
                />
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
                <Label htmlFor="tipoPublico">Tipo de Público *</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, tipoPublico: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el tipo de público" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="estudiante-pregrado">Estudiante de Pregrado</SelectItem>
                    <SelectItem value="estudiante-posgrado">Estudiante de Posgrado</SelectItem>
                    <SelectItem value="docente">Docente</SelectItem>
                    <SelectItem value="investigador">Investigador</SelectItem>
                    <SelectItem value="personal-administrativo">Personal Administrativo</SelectItem>
                    <SelectItem value="visitante-externo">Visitante Externo</SelectItem>
                    <SelectItem value="empresa-privada">Empresa Privada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="programaAcademico">Programa Académico</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, programaAcademico: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione su programa académico" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tecnologia-electronica-industrial">
                      Tecnología en Electrónica Industrial
                    </SelectItem>
                    <SelectItem value="tecnologia-mantenimiento-electromecanicos">
                      Tecnología en Mantenimiento de Sistemas Electromecánicos
                    </SelectItem>
                    <SelectItem value="ingenieria-industrial">Ingeniería Industrial</SelectItem>
                    <SelectItem value="tecnologia-desarrollo-software">Tecnología en Desarrollo de Software</SelectItem>
                    <SelectItem value="otro">Otro (especificar)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.programaAcademico === "otro" && (
                <div className="space-y-2">
                  <Label htmlFor="programaOtro">Especifique su Programa *</Label>
                  <Input
                    id="programaOtro"
                    value={formData.programaOtro || ""}
                    onChange={(e) => setFormData({ ...formData, programaOtro: e.target.value })}
                    placeholder="Escriba el nombre de su programa"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="nombreEmpresa">Nombre de la Empresa</Label>
                <Input
                  id="nombreEmpresa"
                  value={formData.nombreEmpresa}
                  onChange={(e) => setFormData({ ...formData, nombreEmpresa: e.target.value })}
                  placeholder="Nombre de la empresa (si aplica)"
                />
              </div>

              <Button type="submit" className="w-full bg-univalle-red-600 hover:bg-univalle-red-700" size="lg">
                Registrar Asistencia a Inducción
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
