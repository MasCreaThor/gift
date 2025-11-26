import { generateCalendarWeeks } from '../utils/dateUtils';
import { dailyMessages } from '../data/messages';

interface CalendarGridProps {
    startDate: Date;
    arrivalDate: Date;
    currentTime: Date | null;
    getCurrentColombiaTime: () => Date;
    onDayClick: (date: Date) => void;
}

export default function CalendarGrid({ startDate, arrivalDate, currentTime, getCurrentColombiaTime, onDayClick }: CalendarGridProps) {
    const calendarWeeks = generateCalendarWeeks(startDate, arrivalDate);
    const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    // Función para obtener información de un día
    const getDayInfo = (date: Date) => {
        const dayNumber = date.getDate();
        const isInRange = date >= startDate && date <= arrivalDate;

        // Usar la hora actual de Colombia para las comparaciones
        const now = currentTime || getCurrentColombiaTime();

        // Comparar solo las fechas (sin hora) para determinar si es pasado, hoy o futuro
        const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const isPastDay = dateOnly < nowOnly && isInRange;
        const isTodayDate = dateOnly.getTime() === nowOnly.getTime() && isInRange;
        const isFutureDay = dateOnly > nowOnly && !isTodayDate && isInRange;
        const isOutOfRange = date < startDate || date > arrivalDate;

        return {
            date,
            dayNumber,
            isPast: isPastDay,
            isToday: isTodayDate,
            isFuture: isFutureDay,
            isOutOfRange,
            canOpen: (isPastDay || isTodayDate) && isInRange,
            message: dailyMessages[dayNumber] || {
                message: `Día ${dayNumber}: Cada día que pasa me acerca más a ti. 💕`,
                type: 'mensaje' as const
            }
        };
    };

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-orange-200 max-w-6xl w-full mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Noviembre 2025
            </h3>

            {/* Encabezado de días de la semana */}
            <div className="grid grid-cols-7 gap-2 mb-2">
                {weekDays.map((day, index) => (
                    <div
                        key={index}
                        className="text-center font-bold text-gray-600 text-sm py-2"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Semanas del calendario */}
            <div className="space-y-2">
                {calendarWeeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="grid grid-cols-7 gap-2">
                        {week.map((date, dayIndex) => {
                            const dayInfo = getDayInfo(date);
                            const icon = dayInfo.dayNumber === 26
                                ? '🌹'
                                : dayInfo.message.type === 'recuerdo'
                                    ? '💭'
                                    : dayInfo.message.type === 'plan'
                                        ? '🎯'
                                        : '💕';
                            const uniqueKey = `${weekIndex}-${dayIndex}-${date.getTime()}`;

                            return (
                                <button
                                    key={uniqueKey}
                                    onClick={() => dayInfo.canOpen && onDayClick(date)}
                                    disabled={!dayInfo.canOpen}
                                    className={`
                    relative p-3 rounded-xl transition-all duration-300 transform min-h-[80px]
                    ${dayInfo.isToday
                                            ? 'bg-gradient-to-br from-orange-400 to-amber-500 text-white scale-105 shadow-xl ring-4 ring-orange-300'
                                            : dayInfo.isPast
                                                ? 'bg-gradient-to-br from-orange-200 to-amber-200 hover:scale-105 hover:shadow-lg cursor-pointer'
                                                : dayInfo.isFuture && !dayInfo.isOutOfRange
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                                                    : 'bg-gray-50 text-gray-300 cursor-default opacity-30'
                                        }
                  `}
                                >
                                    <div className="text-center">
                                        {dayInfo.canOpen && (
                                            <div className="text-xl mb-1">{icon}</div>
                                        )}
                                        <div className={`text-lg font-bold ${dayInfo.isToday ? 'text-white' : dayInfo.isOutOfRange ? 'text-gray-300' : 'text-gray-800'}`}>
                                            {dayInfo.dayNumber}
                                        </div>
                                        {dayInfo.isToday && (
                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-xs">✨</span>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}
