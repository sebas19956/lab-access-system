import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Credenciales de demo (en producción usar hash y base de datos)
    const validCredentials = {
      username: "admin",
      password: "admin123",
    }

    if (username === validCredentials.username && password === validCredentials.password) {
      // Generar token simple (en producción usar JWT)
      const token = Buffer.from(`${username}:${Date.now()}`).toString("base64")

      return NextResponse.json({
        success: true,
        token,
        message: "Autenticación exitosa",
      })
    } else {
      return NextResponse.json({ success: false, error: "Credenciales incorrectas" }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error del servidor" }, { status: 500 })
  }
}
