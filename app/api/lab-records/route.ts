import { type NextRequest, NextResponse } from "next/server"

// Simulación de base de datos en memoria
let labRecords: any[] = []

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Agregar el registro a la "base de datos"
    labRecords.unshift(data)

    // Mantener solo los últimos 200 registros
    if (labRecords.length > 200) {
      labRecords = labRecords.slice(0, 200)
    }

    return NextResponse.json({ success: true, message: "Registro guardado correctamente" })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error al guardar registro" }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Calcular estadísticas
    const today = new Date().toDateString()
    const todayRecords = labRecords.filter((record) => new Date(record.timestamp).toDateString() === today)

    const accessRecords = todayRecords.filter((r) => r.tipo === "access-control")
    const inductionRecords = todayRecords.filter((r) => r.tipo === "induction-control")
    const loanRecords = todayRecords.filter((r) => r.tipo === "equipment-loan")

    const stats = {
      totalAccess: accessRecords.length,
      totalInductions: inductionRecords.length,
      totalLoans: loanRecords.length,
      currentlyInside: Math.floor(accessRecords.length * 0.7), // Simulación
    }

    return NextResponse.json({
      records: labRecords.slice(0, 50), // Últimos 50 registros
      stats,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error al obtener registros" }, { status: 500 })
  }
}
