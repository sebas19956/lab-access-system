"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Shield, Mail } from "lucide-react"
import Link from "next/link"

declare global {
  interface Window {
    google: any
    gapi: any
  }
}

// Lista de administradores autorizados
const AUTHORIZED_ADMINS = [
  "laboartorio.electronica.palmira@correounivalle.edu.co",
  "laboartorio.fisica.palmira@correounivalle.edu.co",
  "henry.sebastian.rodriguez@correounivalle.edu.co",
  "sr833831@gmail.com",
]

export default function AdminLogin() {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false)
  const [gapiLoadError, setGapiLoadError] = useState(false)
  const [googleInitDone, setGoogleInitDone] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

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

      script.onerror = () => {
        console.error("❌  No se pudo cargar Google API")
        setGapiLoadError(true)
      }

      script.onload = () => {
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
              scope: "email profile",
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
      setError("Google API aún no está lista. Inténtalo de nuevo en unos segundos.")
      return
    }

    setIsLoading(true)
    setError("")

    const authInstance = window.gapi.auth2.getAuthInstance()
    if (!authInstance) {
      setError("No se pudo inicializar la autenticación de Google.")
      setIsLoading(false)
      return
    }

    authInstance
      .signIn()
      .then(handleAuthSuccess)
      .catch((err) => {
        console.error("Error en autenticación:", err)
        setError("Error al autenticar con Google")
        setIsLoading(false)
      })
  }

  const handleAuthSuccess = (user: any) => {
    const profile = user.getBasicProfile()
    const email = profile.getEmail()

    // Verificar que el email esté en la lista de administradores autorizados
    if (!AUTHORIZED_ADMINS.includes(email)) {
      setError("No tiene permisos de administrador. Contacte al administrador del sistema.")
      setIsLoading(false)

      // Cerrar sesión automáticamente si no está autorizado
      const authInstance = window.gapi.auth2.getAuthInstance()
      authInstance.signOut()
      return
    }

    // Crear token de administrador
    const adminData = {
      email: email,
      name: profile.getName(),
      picture: profile.getImageUrl(),
      loginTime: new Date().toISOString(),
      role: "admin",
    }

    // Guardar información del administrador
    localStorage.setItem("adminToken", JSON.stringify(adminData))
    localStorage.setItem("adminEmail", email)

    setIsLoading(false)
    router.push("/admin-dashboard")
  }

  if (gapiLoadError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center space-y-4">
            <Shield className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Error de Conexión</h2>
            <p className="text-gray-600">No se pudo cargar el sistema de autenticación de Google.</p>
            <Button onClick={() => location.reload()}>Reintentar</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-univalle-red-50 to-red-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-univalle-red-600 hover:text-univalle-red-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Inicio
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-univalle-red-600" />
            </div>
            <CardTitle>Acceso Administrativo</CardTitle>
            <CardDescription>Autenticación con Google para administradores autorizados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Información de administradores autorizados */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Administradores Autorizados:</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Laboratorio Electrónica Palmira</li>
                  <li>• Laboratorio Física Palmira</li>
                  <li>• Henry Sebastián Rodríguez</li>
                  <li>• Administrador del Sistema</li>
                </ul>
              </div>

              {/* Botón de autenticación */}
              <div className="text-center">
                {isGoogleLoaded ? (
                  <Button
                    onClick={handleGoogleSignIn}
                    className="w-full flex items-center gap-2 bg-univalle-red-600 hover:bg-univalle-red-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Verificando...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4" />
                        Iniciar Sesión con Google
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-univalle-red-600"></div>
                    <span className="ml-2">Cargando autenticación...</span>
                  </div>
                )}
              </div>

              {/* Mensaje de error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Información de seguridad */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-2">Seguridad:</h4>
                <ul className="text-xs text-yellow-700 space-y-1">
                  <li>• Solo cuentas autorizadas pueden acceder</li>
                  <li>• Autenticación segura con Google OAuth</li>
                  <li>• Sesiones con tiempo de expiración</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
