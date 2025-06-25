"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from 'lucide-react'
import Link from "next/link"

export default function InductionControl() {
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
            <CardTitle>Control de Asistencia a Inducción</CardTitle>
            <CardDescription>Registro de usuarios que asisten a la inducción del laboratorio</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">Página en construcción...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}