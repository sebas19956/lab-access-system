import { type NextRequest, NextResponse } from "next/server"

// Simulación de base de datos en memoria para reservas
const reservations: any[] = [
  // Datos de ejemplo
  {
    id: "1",
    nombreEstudiante: "Juan Pérez",
    codigoEstudiante: "2021001",
    email: "juan.perez@universidad.edu",
    programaAcademico: "Ingeniería Electrónica",
    fechaReserva: "2024-12-21",
    horaInicio: "10:00",
    duracionEstimada: "2 horas",
    equipos: {
      osciloscopio: 1,
      fuentePoder: 1,
      multimetro: 2,
      protoboard: 3,
      fuenteDual: 0,
      generadorFunciones: 0,
      plc: 0,
    },
    otrosEquipos: "Cables de conexión",
    estado: "pendiente",
    timestamp: "2024-12-20T08:30:00Z",
  },
  {
    id: "2",
    nombreEstudiante: "María González",
    codigoEstudiante: "2021002",
    email: "maria.gonzalez@universidad.edu",
    programaAcademico: "Ingeniería de Sistemas",
    fechaReserva: "2024-12-21",
    horaInicio: "14:00",
    duracionEstimada: "3 horas",
    equipos: {
      osciloscopio: 2,
      fuentePoder: 1,
      multimetro: 1,
      protoboard: 2,
      fuenteDual: 1,
      generadorFunciones: 1,
      plc: 0,
    },
    otrosEquipos: "",
    estado: "aprobada",
    timestamp: "2024-12-19T15:20:00Z",
  },
  {
    id: "3",
    nombreEstudiante: "Carlos Rodríguez",
    codigoEstudiante: "2020003",
    email: "carlos.rodriguez@universidad.edu",
    programaAcademico: "Ingeniería Industrial",
    fechaReserva: "2024-12-22",
    horaInicio: "09:00",
    duracionEstimada: "4 horas",
    equipos: {
      osciloscopio: 1,
      fuentePoder: 2,
      multimetro: 3,
      protoboard: 5,
      fuenteDual: 0,
      generadorFunciones: 1,
      plc: 1,
    },
    otrosEquipos: "Resistencias y capacitores",
    estado: "en-curso",
    timestamp: "2024-12-21T07:45:00Z",
  },
  {
    id: "4",
    nombreEstudiante: "Ana Martínez",
    codigoEstudiante: "2021004",
    email: "ana.martinez@universidad.edu",
    programaAcademico: "Ingeniería Electrónica",
    fechaReserva: "2024-12-23",
    horaInicio: "11:00",
    duracionEstimada: "2 horas",
    equipos: {
      osciloscopio: 1,
      fuentePoder: 0,
      multimetro: 1,
      protoboard: 2,
      fuenteDual: 1,
      generadorFunciones: 1,
      plc: 0,
    },
    otrosEquipos: "",
    estado: "completada",
    timestamp: "2024-12-18T12:00:00Z",
  },
  {
    id: "5",
    nombreEstudiante: "Luis Torres",
    codigoEstudiante: "2020005",
    email: "luis.torres@universidad.edu",
    programaAcademico: "Ingeniería Mecánica",
    fechaReserva: "2024-12-21",
    horaInicio: "10:30",
    duracionEstimada: "2 horas",
    equipos: {
      osciloscopio: 1,
      fuentePoder: 1,
      multimetro: 1,
      protoboard: 2,
      fuenteDual: 0,
      generadorFunciones: 0,
      plc: 0,
    },
    otrosEquipos: "",
    estado: "rechazada",
    timestamp: "2024-12-20T09:15:00Z",
    observacionesAdmin: "Conflicto de horarios con otra reserva",
  },
]

export async function GET() {
  try {
    // Obtener reservas de los registros de préstamos existentes
    const labRecordsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/lab-records`,
    )
    let existingLoans: any[] = []

    if (labRecordsResponse.ok) {
      const data = await labRecordsResponse.json()
      existingLoans = data.records?.filter((r: any) => r.tipo === "equipment-loan") || []
    }

    // Convertir préstamos existentes a formato de reservas
    const convertedReservations = existingLoans.map((loan: any) => ({
      id: loan.id,
      nombreEstudiante: loan.nombreEstudiante,
      codigoEstudiante: loan.codigoEstudiante,
      email: loan.email,
      programaAcademico: loan.programaAcademico,
      fechaReserva: loan.fechaReserva,
      horaInicio: loan.horaInicio,
      duracionEstimada: "2 horas",
      equipos: {
        osciloscopio: Number.parseInt(loan.osciloscopio || "0"),
        fuentePoder: Number.parseInt(loan.fuentePoder || "0"),
        fuenteDual: Number.parseInt(loan.fuenteDual || "0"),
        generadorFunciones: Number.parseInt(loan.generadorFunciones || "0"),
        multimetro: Number.parseInt(loan.multimetro || "0"),
        plc: Number.parseInt(loan.plc || "0"),
        protoboard: Number.parseInt(loan.protoboard || "0"),
      },
      otrosEquipos: loan.otrosEquipos || "",
      estado: "pendiente",
      timestamp: loan.timestamp,
    }))

    // Combinar reservas existentes con las convertidas
    const allReservations = [...reservations, ...convertedReservations]

    return NextResponse.json({
      reservations: allReservations,
      total: allReservations.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error al obtener reservas" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, estado, observacionesAdmin } = await request.json()

    // Actualizar reserva
    const reservationIndex = reservations.findIndex((r) => r.id === id)
    if (reservationIndex !== -1) {
      reservations[reservationIndex] = {
        ...reservations[reservationIndex],
        estado,
        observacionesAdmin: observacionesAdmin || reservations[reservationIndex].observacionesAdmin,
        updatedAt: new Date().toISOString(),
      }

      return NextResponse.json({
        success: true,
        message: "Reserva actualizada correctamente",
        reservation: reservations[reservationIndex],
      })
    } else {
      return NextResponse.json({ success: false, error: "Reserva no encontrada" }, { status: 404 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error al actualizar reserva" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const reservationData = await request.json()

    const newReservation = {
      ...reservationData,
      id: Date.now().toString(),
      estado: "pendiente",
      timestamp: new Date().toISOString(),
    }

    reservations.unshift(newReservation)

    return NextResponse.json({
      success: true,
      message: "Reserva creada correctamente",
      reservation: newReservation,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error al crear reserva" }, { status: 500 })
  }
}
