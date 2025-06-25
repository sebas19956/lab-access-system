"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, CheckCircle, User, Mail } from "lucide-react"
import Link from "next/link"

declare global {
  interface Window {
    google: any
    gapi: any
  }
}

export default function EquipmentLoan() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [gapiLoadError, setGapiLoadError] = useState(false)
  const [googleInitDone, setGoogleInitDone] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    nombreEstudiante: "",
    codigoEstudiante: "",
    programaAcademico: "",
    programaOtro: "",
    fechaReserva: "",
    horaInicio: "",
    osciloscopio: "0",
    fuentePoder: "0",
    fuenteDual: "0",
    generadorFunciones: "0",
    multimetro: "0",
    plc: "0",
    protoboard: "0",
    otrosEquipos: "",
  })

  useEffect(() => {
    loadGoogleAPI()
  }, [])

  const loadGoogleAPI = () => {
    // Do not append the script twice
    if (document.querySelector("#gapi-script")) return

    try {
      const script = document.createElement("script")
      script.id = "gapi-script"
      script.src = "https://apis.google.com/js/api.js"
      script.async = true
      script.defer = true

      // If the script fails we record the error so the UI can warn the user
      script.onerror = () => {
        console.error("❌  No se pudo cargar Google API")
        setGapiLoadError(true)
      }

      script.onload = () => {
        // When gapi is ready initialise auth2
        window.gapi.load("client:auth2", async () => {
          try {
            const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""
            if (!CLIENT_ID) {
              console.warn("No se definió NEXT_PUBLIC_GOOGLE_CLIENT_ID")
              setGapiLoadError(true)
              return
            }

            await window.gapi.client.init({
              apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY ?? "",
              clientId: CLIENT_ID,
              discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
              scope: "email profile https://www.googleapis.com/auth/calendar",
            })

            setIsGoogleLoaded(true)
            setGoogleInitDone(true)

            const authInstance = window.gapi.auth2.getAuthInstance()
            if (authInstance?.isSignedIn.get()) {
              handleAuthSuccess(authInstance.currentUser.get())
            }
          } catch (err) {
            console.error("❌ Fallo la inicialización de gapi:", err)
            setGapiLoadError(true)
          }
        })
      }

      document.head.appendChild(script)
    } catch (err) {
      console.error(err)
      setGapiLoadError(true)
    }
  }

  const handleGoogleSignIn = () => {
    if (!googleInitDone) {
      alert("Google API aún no está lista. Inténtalo de nuevo en unos segundos.")
      return
    }
    const authInstance = window.gapi.auth2.getAuthInstance()
    if (!authInstance) {
      alert("No se pudo inicializar la autenticación de Google.")
      return
    }
    authInstance.signIn().then(handleAuthSuccess).catch(console.error)
  }

  const handleAuthSuccess = (user: any) => {
    const profile = user.getBasicProfile()
    const email = profile.getEmail()

    // Verificar que sea correo de la universidad
    if (!email.endsWith("@correounivalle.edu.co")) {
      alert("Debe usar su correo institucional @correounivalle.edu.co")
      handleSignOut()
      return
    }

    setIsAuthenticated(true)
    setUserInfo({
      email: email,
      name: profile.getName(),
      picture: profile.getImageUrl(),
    })

    setFormData((prev) => ({
      ...prev,
      email: email,
      nombreEstudiante: profile.getName(),
    }))
  }

  const handleSignOut = () => {
    if (window.gapi?.auth2) {
      const authInstance = window.gapi.auth2.getAuthInstance()
      authInstance.signOut().then(() => {
        setIsAuthenticated(false)
        setUserInfo(null)
        setFormData((prev) => ({
          ...prev,
          email: "",
          nombreEstudiante: "",
        }))
      })
    }
  }

  const createCalendarEvent = async (reservationData: any) => {
    try {
      await window.gapi.load("client", async () => {
        await window.gapi.client.init({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
          clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
          scope: "https://www.googleapis.com/auth/calendar",
        })

        const startDateTime = new Date(`${reservationData.fechaReserva}T${reservationData.horaInicio}:00`)
        const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000) // 2 horas después

        const equiposList = Object.entries(reservationData)
          .filter(
            ([key, value]) =>
              [
                "osciloscopio",
                "fuentePoder",
                "fuenteDual",
                "generadorFunciones",
                "multimetro",
                "plc",
                "protoboard",
              ].includes(key) && Number(value) > 0,
          )
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ")

        const event = {
          summary: `Préstamo de Equipos - Lab. Electrónica`,
          description: `
Estudiante: ${reservationData.nombreEstudiante}
Código: ${reservationData.codigoEstudiante}
Programa: ${reservationData.programaAcademico}
Equipos solicitados: ${equiposList}
${reservationData.otrosEquipos ? `Otros equipos: ${reservationData.otrosEquipos}` : ""}

Estado: Pendiente de aprobación
Sistema de Laboratorios - Universidad del Valle
          `.trim(),
          start: {
            dateTime: startDateTime.toISOString(),
            timeZone: "America/Bogota",
          },
          end: {
            dateTime: endDateTime.toISOString(),
            timeZone: "America/Bogota",
          },
          attendees: [
            { email: reservationData.email },
            { email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@correounivalle.edu.co" },
          ],
          reminders: {
            useDefault: false,
            overrides: [
              { method: "email", minutes: 24 * 60 }, // 1 día antes
              { method: "popup", minutes: 30 }, // 30 minutos antes
            ],
          },
          location: "Laboratorio de Electrónica - Universidad del Valle",
        }

        const response = await window.gapi.client.calendar.events.insert({
          calendarId: "primary",
          resource: event,
        })

        return response.result
      })
    } catch (error) {
      console.error("Error creando evento en calendario:", error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      alert("Debe autenticarse con Google primero")
      return
    }

    const loanData = {
      ...formData,
      programaAcademico: formData.programaAcademico === "otro" ? formData.programaOtro : formData.programaAcademico,
      timestamp: new Date().toISOString(),
      id: Date.now().toString(),
      tipo: "equipment-loan",
      googleUserId: userInfo?.email,
    }

    try {
      // Crear evento en Google Calendar
      const calendarEvent = await createCalendarEvent(loanData)

      // Guardar en el sistema
      const response = await fetch("/api/lab-records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...loanData,
          calendarEventId: calendarEvent?.id,
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
      }
    } catch (error) {
      console.error("Error al registrar préstamo:", error)
      // Guardar sin calendario si falla
      const response = await fetch("/api/lab-records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loanData),
      })

      if (response.ok) {
        setIsSubmitted(true)
      }
    }
  }

  if (gapiLoadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Error al cargar los servicios de Google</h2>
            <p className="text-gray-600">Por favor verifica tu conexión a internet o inténtalo de nuevo más tarde.</p>
            <Button onClick={() => location.reload()}>Reintentar</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-univalle-red-100 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-univalle-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Préstamo Registrado!</h2>
            <p className="text-gray-600 mb-4">
              La solicitud ha sido registrada exitosamente y se ha creado un evento en su calendario de Google.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-blue-700">
                <strong>Próximos pasos:</strong>
                <br />• Recibirá una notificación cuando sea aprobada
                <br />• El evento se actualizará en su calendario
                <br />• Presente su carnet el día de la reserva
              </p>
            </div>
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
            <CardTitle>Préstamo de Instalaciones y Equipos</CardTitle>
            <CardDescription>Lab. Electrónica Palmira - Prácticas Libres</CardDescription>
          </CardHeader>
          <CardContent>
            {!isAuthenticated ? (
              <div className="text-center py-8">
                <div className="mb-6">
                  <User className="h-16 w-16 text-univalle-red-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Autenticación Requerida</h3>
                  <p className="text-gray-600 mb-4">
                    Para solicitar préstamo de equipos debe autenticarse con su correo institucional
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-yellow-800">
                      <strong>Importante:</strong> Solo se permiten correos @correounivalle.edu.co
                    </p>
                  </div>
                </div>

                {isGoogleLoaded ? (
                  <Button onClick={handleGoogleSignIn} className="flex items-center gap-2 mx-auto">
                    <Mail className="h-4 w-4" />
                    Iniciar Sesión con Google
                  </Button>
                ) : (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    <span className="ml-2">Cargando autenticación...</span>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {/* Información del usuario autenticado */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {userInfo?.picture && (
                        <img
                          src={userInfo.picture || "/placeholder.svg"}
                          alt="Avatar"
                          className="w-10 h-10 rounded-full"
                        />
                      )}
                      <div>
                        <p className="font-medium text-green-900">{userInfo?.name}</p>
                        <p className="text-sm text-green-700">{userInfo?.email}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleSignOut}>
                      Cambiar Usuario
                    </Button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombreEstudiante">Nombre del Estudiante *</Label>
                      <Input
                        id="nombreEstudiante"
                        value={formData.nombreEstudiante}
                        onChange={(e) => setFormData({ ...formData, nombreEstudiante: e.target.value })}
                        placeholder="Nombre completo"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="codigoEstudiante">Código del Estudiante *</Label>
                      <Input
                        id="codigoEstudiante"
                        value={formData.codigoEstudiante}
                        onChange={(e) => setFormData({ ...formData, codigoEstudiante: e.target.value })}
                        placeholder="Código estudiantil"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="programaAcademico">Programa Académico *</Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, programaAcademico: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione su programa" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tecnologia-electronica-industrial">
                          Tecnología en Electrónica Industrial
                        </SelectItem>
                        <SelectItem value="tecnologia-mantenimiento-electromecanicos">
                          Tecnología en Mantenimiento de Sistemas Electromecánicos
                        </SelectItem>
                        <SelectItem value="ingenieria-industrial">Ingeniería Industrial</SelectItem>
                        <SelectItem value="tecnologia-desarrollo-software">
                          Tecnología en Desarrollo de Software
                        </SelectItem>
                        <SelectItem value="otro">Otro (especificar)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.programaAcademico === "otro" && (
                    <div className="space-y-2">
                      <Label htmlFor="programaOtro">Especifique su Programa *</Label>
                      <Input
                        id="programaOtro"
                        value={formData.programaOtro}
                        onChange={(e) => setFormData({ ...formData, programaOtro: e.target.value })}
                        placeholder="Escriba el nombre de su programa"
                        required
                      />
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fechaReserva">Fecha de la Reserva *</Label>
                      <Input
                        id="fechaReserva"
                        type="date"
                        value={formData.fechaReserva}
                        onChange={(e) => setFormData({ ...formData, fechaReserva: e.target.value })}
                        min={new Date().toISOString().split("T")[0]}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="horaInicio">Hora de Inicio de la Reserva *</Label>
                      <Select onValueChange={(value) => setFormData({ ...formData, horaInicio: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione la hora" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="07:00">07:00 AM</SelectItem>
                          <SelectItem value="08:00">08:00 AM</SelectItem>
                          <SelectItem value="09:00">09:00 AM</SelectItem>
                          <SelectItem value="10:00">10:00 AM</SelectItem>
                          <SelectItem value="11:00">11:00 AM</SelectItem>
                          <SelectItem value="12:00">12:00 PM</SelectItem>
                          <SelectItem value="13:00">01:00 PM</SelectItem>
                          <SelectItem value="14:00">02:00 PM</SelectItem>
                          <SelectItem value="15:00">03:00 PM</SelectItem>
                          <SelectItem value="16:00">04:00 PM</SelectItem>
                          <SelectItem value="17:00">05:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Equipos Requeridos</h3>
                    <p className="text-sm text-gray-600">Indique la cantidad de equipos que requiere:</p>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="osciloscopio">Osciloscopio</Label>
                        <Select onValueChange={(value) => setFormData({ ...formData, osciloscopio: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Cantidad" />
                          </SelectTrigger>
                          <SelectContent>
                            {[0, 1, 2, 3, 4, 5].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fuentePoder">Fuente de Poder</Label>
                        <Select onValueChange={(value) => setFormData({ ...formData, fuentePoder: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Cantidad" />
                          </SelectTrigger>
                          <SelectContent>
                            {[0, 1, 2, 3, 4, 5].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fuenteDual">Fuente Dual</Label>
                        <Select onValueChange={(value) => setFormData({ ...formData, fuenteDual: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Cantidad" />
                          </SelectTrigger>
                          <SelectContent>
                            {[0, 1, 2, 3, 4, 5].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="generadorFunciones">Generador de Funciones</Label>
                        <Select onValueChange={(value) => setFormData({ ...formData, generadorFunciones: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Cantidad" />
                          </SelectTrigger>
                          <SelectContent>
                            {[0, 1, 2, 3, 4, 5].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="multimetro">Multímetro</Label>
                        <Select onValueChange={(value) => setFormData({ ...formData, multimetro: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Cantidad" />
                          </SelectTrigger>
                          <SelectContent>
                            {[0, 1, 2, 3, 4, 5].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="plc">PLC</Label>
                        <Select onValueChange={(value) => setFormData({ ...formData, plc: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Cantidad" />
                          </SelectTrigger>
                          <SelectContent>
                            {[0, 1, 2, 3, 4, 5].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="protoboard">Protoboard</Label>
                        <Select onValueChange={(value) => setFormData({ ...formData, protoboard: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Cantidad" />
                          </SelectTrigger>
                          <SelectContent>
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="otrosEquipos">Otros Equipos o Elementos</Label>
                    <Textarea
                      id="otrosEquipos"
                      value={formData.otrosEquipos}
                      onChange={(e) => setFormData({ ...formData, otrosEquipos: e.target.value })}
                      placeholder="Indique si requiere otros equipos o elementos para su práctica..."
                      rows={3}
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Información Importante:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• La reserva será creada automáticamente en su calendario de Google</li>
                      <li>• Recibirá notificaciones de aprobación/rechazo por email</li>
                      <li>• Debe presentar su carnet estudiantil el día de la reserva</li>
                      <li>• Las reservas están sujetas a disponibilidad de equipos</li>
                    </ul>
                  </div>

                  <Button type="submit" className="w-full bg-univalle-red-600 hover:bg-univalle-red-700" size="lg">
                    Solicitar Préstamo de Equipos
                  </Button>
                </form>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
