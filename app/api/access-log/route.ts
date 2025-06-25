import { type NextRequest, NextResponse } from "next/server"

// Simulación de base de datos en memoria (en producción usarías una base de datos real)
let accessLogs: any[] = []

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Agregar el registro a la "base de datos"
    accessLogs.unshift(data) // Agregar al inicio para mostrar los más recientes primero

    // Mantener solo los últimos 100 registros
    if (accessLogs.length > 100) {
      accessLogs = accessLogs.slice(0, 100)
    }

    return NextResponse.json({ success: true, message: "Acceso registrado correctamente" })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error al registrar acceso" }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Calcular estadísticas
    const today = new Date().toDateString()
    const todayLogs = accessLogs.filter((log) => new Date(log.timestamp).toDateString() === today)

    const activityCount: { [key: string]: number } = {}
    todayLogs.forEach((log) => {
      activityCount[log.actividad] = (activityCount[log.actividad] || 0) + 1
    })

    const mostCommonActivity = Object.keys(activityCount).reduce(
      (a, b) => (activityCount[a] > activityCount[b] ? a : b),
      "",
    )

    const stats = {
      totalToday: todayLogs.length,
      currentlyInside: Math.floor(todayLogs.length * 0.7), // Simulación
      mostCommonActivity: mostCommonActivity || "N/A",
      averageTime: "2.5 horas", // Simulación
    }

    return NextResponse.json({
      logs: accessLogs.slice(0, 20), // Últimos 20 registros
      stats,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error al obtener registros" }, { status: 500 })
  }
}
