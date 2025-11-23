import { startOfWeek, endOfWeek, startOfMonth, eachDayOfInterval } from 'date-fns';

// Función para convertir una fecha UTC a la zona horaria de Colombia (UTC-5)
export function utcToColombiaTime(utcDate: Date): Date {
    // Colombia está en UTC-5 (sin horario de verano)
    // Restar 5 horas del timestamp UTC
    const colombiaOffsetMs = -5 * 60 * 60 * 1000; // -5 horas en milisegundos
    return new Date(utcDate.getTime() + colombiaOffsetMs);
}

// Función para convertir una fecha local a la zona horaria de Colombia (UTC-5)
export function toColombiaTime(date: Date): Date {
    // Convertir fecha local a UTC, luego a Colombia
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const colombiaOffsetMs = -5 * 60 * 60 * 1000; // -5 horas en milisegundos
    return new Date(utc + colombiaOffsetMs);
}

// Función para crear una fecha en la zona horaria de Colombia
// Para los cálculos de tiempo, necesitamos la hora exacta en Colombia
export function createColombiaDate(year: number, month: number, day: number, hour: number = 0, minute: number = 0, second: number = 0): Date {
    // Colombia está en UTC-5
    // Para crear una fecha que represente una hora específica en Colombia,
    // creamos la fecha en UTC con 5 horas más
    // Ejemplo: 00:00 en Colombia = 05:00 UTC del mismo día

    // Crear fecha en UTC
    const utcDate = new Date(Date.UTC(year, month, day, hour + 5, minute, second));

    // Verificar que la fecha sea válida
    if (isNaN(utcDate.getTime())) {
        // Fallback: crear fecha local simple
        console.warn(`Fecha UTC inválida, usando fecha local: ${year}-${month + 1}-${day}`);
        return new Date(year, month, day, hour, minute, second);
    }

    return utcDate;
}

export const calculateTimeRemaining = (now: Date, targetDate: Date) => {
    // Asegurarse de que ambas fechas estén en la misma zona horaria para el cálculo
    const diff = targetDate.getTime() - now.getTime();

    if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
};

// Generar calendario con formato semanal (7 días por semana)
export const generateCalendarWeeks = (startDate: Date, arrivalDate: Date) => {
    const monthStart = startOfMonth(startDate);
    // Usamos la fecha de llegada como límite final visual, pero extendemos al final de la semana
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Domingo
    const calendarEnd = endOfWeek(arrivalDate, { weekStartsOn: 0 });

    const allDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    const weeks: Date[][] = [];

    // Dividir en semanas de 7 días
    for (let i = 0; i < allDays.length; i += 7) {
        weeks.push(allDays.slice(i, i + 7));
    }

    return weeks;
};
