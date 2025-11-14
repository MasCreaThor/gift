import { NextResponse } from 'next/server';

export async function GET() {
  // Obtener la hora actual del servidor (UTC)
  // Esta es la hora real del servidor, no puede ser manipulada por el cliente
  const now = new Date();
  const utcTime = now.getTime();
  
  return NextResponse.json({
    timestamp: utcTime, // Timestamp UTC del servidor
    iso: now.toISOString(),
    timezone: 'UTC' // El servidor devuelve UTC, el cliente lo convierte a Colombia
  });
}

