'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, format, isPast, isToday, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, getDay, eachDayOfInterval } from 'date-fns';

// Hook personalizado para evitar problemas de hidratación
function useClientOnly() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return isClient;
}

// Componente para mostrar números con efecto de flip
function FlipNumber({ value, className }: { value: string; className?: string }) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);
  const [prevValue, setPrevValue] = useState(value);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (value !== prevValue) {
      setIsFlipping(true);
      setKey(prev => prev + 1);
      
      // Después de la mitad de la animación, cambiar el valor
      const timer = setTimeout(() => {
        setDisplayValue(value);
        setPrevValue(value);
      }, 300); // La mitad de la animación de 0.6s
      
      // Resetear el estado de flip después de la animación
      const resetTimer = setTimeout(() => {
        setIsFlipping(false);
      }, 600);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(resetTimer);
      };
    }
  }, [value, prevValue]);

  return (
    <div className={`relative inline-block w-full ${className || ''}`}>
      <div className={`flip-number-container relative ${isFlipping ? 'flipping' : ''}`} key={key}>
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Valor anterior (sale) */}
          {isFlipping && (
            <div className="flip-number-old">
              <span className="text-3xl md:text-4xl font-bold text-orange-500 drop-shadow-sm">
                {prevValue}
              </span>
            </div>
          )}
          {/* Valor nuevo (entra) */}
          <div className={`${isFlipping ? 'flip-number-new' : ''}`}>
            <span className="text-3xl md:text-4xl font-bold text-orange-500 drop-shadow-sm">
              {displayValue}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Función para convertir una fecha UTC a la zona horaria de Colombia (UTC-5)
function utcToColombiaTime(utcDate: Date): Date {
  // Colombia está en UTC-5 (sin horario de verano)
  // Restar 5 horas del timestamp UTC
  const colombiaOffsetMs = -5 * 60 * 60 * 1000; // -5 horas en milisegundos
  return new Date(utcDate.getTime() + colombiaOffsetMs);
}

// Función para convertir una fecha local a la zona horaria de Colombia (UTC-5)
function toColombiaTime(date: Date): Date {
  // Convertir fecha local a UTC, luego a Colombia
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  const colombiaOffsetMs = -5 * 60 * 60 * 1000; // -5 horas en milisegundos
  return new Date(utc + colombiaOffsetMs);
}

// Función para crear una fecha en la zona horaria de Colombia
// Para los cálculos de tiempo, necesitamos la hora exacta en Colombia
function createColombiaDate(year: number, month: number, day: number, hour: number = 0, minute: number = 0, second: number = 0): Date {
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

export default function CalendarioNoviembre() {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [serverTimeOffset, setServerTimeOffset] = useState<number | null>(null);
  const [clientStartTime, setClientStartTime] = useState<number | null>(null);
  const isClient = useClientOnly();
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fechas en zona horaria de Colombia
  // 25 de noviembre de 2025 a las 00:00:00 hora de Colombia
  const arrivalDate = useMemo(() => {
    const date = createColombiaDate(2025, 10, 25, 0, 0, 0);
    if (isNaN(date.getTime())) {
      console.error('Error creando arrivalDate, usando fecha local');
      return new Date(2025, 10, 25, 0, 0, 0);
    }
    return date;
  }, []);
  
  // 13 de noviembre de 2025 a las 00:00:00 hora de Colombia
  const startDate = useMemo(() => {
    const date = createColombiaDate(2025, 10, 13, 0, 0, 0);
    if (isNaN(date.getTime())) {
      console.error('Error creando startDate, usando fecha local');
      return new Date(2025, 10, 13, 0, 0, 0);
    }
    return date;
  }, []);

  // Calcular tiempo restante
  const calculateTimeRemaining = (now: Date) => {
    // Asegurarse de que ambas fechas estén en la misma zona horaria para el cálculo
    const diff = arrivalDate.getTime() - now.getTime();
    
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds };
  };

  // Obtener la hora actual considerando la hora del servidor
  const getCurrentColombiaTime = (): Date => {
    if (serverTimeOffset === null || clientStartTime === null) {
      // Si aún no tenemos la hora del servidor, usar la hora local como fallback
      return toColombiaTime(new Date());
    }
    
    // Calcular el tiempo transcurrido desde que obtuvimos la hora del servidor
    const elapsed = Date.now() - clientStartTime;
    // La hora actual en Colombia = hora del servidor + tiempo transcurrido
    return new Date(serverTimeOffset + elapsed);
  };

  const [timeRemaining, setTimeRemaining] = useState(() => ({ days: 0, hours: 0, minutes: 0, seconds: 0 }));
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  // Obtener la hora del servidor al cargar
  useEffect(() => {
    const fetchServerTime = async () => {
      try {
        const response = await fetch('/api/current-time', { cache: 'no-store' });
        const data = await response.json();
        // El servidor devuelve la hora UTC
        const utcTime = new Date(data.timestamp);
        // Convertir a hora de Colombia (UTC-5)
        const colombiaTime = utcToColombiaTime(utcTime);
        setServerTimeOffset(colombiaTime.getTime());
        setClientStartTime(Date.now());
        setCurrentTime(colombiaTime);
        setTimeRemaining(calculateTimeRemaining(colombiaTime));
      } catch (error) {
        console.error('Error obteniendo hora del servidor:', error);
        // Fallback a hora local convertida a Colombia si falla la API
        const localTime = toColombiaTime(new Date());
        setServerTimeOffset(localTime.getTime());
        setClientStartTime(Date.now());
        setCurrentTime(localTime);
        setTimeRemaining(calculateTimeRemaining(localTime));
      }
    };

    fetchServerTime();
  }, []);

  // Actualizar tiempo cada segundo
  useEffect(() => {
    if (serverTimeOffset === null || clientStartTime === null) {
      return;
    }

    const timer = setInterval(() => {
      const now = getCurrentColombiaTime();
      setCurrentTime(now);
      setTimeRemaining(calculateTimeRemaining(now));
    }, 1000);

    return () => clearInterval(timer);
  }, [serverTimeOffset, clientStartTime, arrivalDate]);

  // Efecto de fade-in de la página
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Función para reproducir música
  const playMusic = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.loop = true;
      audioRef.current.play().then(() => {
        setIsMusicPlaying(true);
      }).catch((error) => {
        console.log('Error reproduciendo música:', error);
      });
    }
  };

  // Función para pausar música
  const pauseMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    }
  };

  // Mensajes para cada día (desde el 13 de noviembre hasta el 1 de diciembre)
  const dailyMessages: { [key: number]: { message: string; type: 'recuerdo' | 'plan' | 'mensaje' } } = {
    13: { 
      message: '13, Hoy es nuestro día especial, no lo olvide jijiji. Cada mes este número me recuerda lo afortunado que soy de tener una princesa Fiona. 💕', 
      type: 'mensaje' 
    },
    14: { 
      message: 'Solo faltan unos días más para darte un abracito. Y adivina que, aun no tengo planes 😓', 
      type: 'plan' 
    },
    15: { 
      message: 'Recuerdo cuando te veia por la ventana jijiji. Estaba echandote un ojito por si te caias yo te iba a levantar. 🍂', 
      type: 'recuerdo' 
    },
    16: { 
      message: 'Ya tengo un plan, iremos al otro lugar que te mencionaba cuando era niño 🎯', 
      type: 'plan' 
    },
    17: { 
      message: 'Ya faltan 8 dias para cojerte y darte un abrazo jijiji. 🫣😁 💫', 
      type: 'mensaje' 
    },
    18: { 
      message: 'Hoy no hay mensaje, no hay sistema, intentelo mañana por favor. 😂', 
      type: 'mensaje' 
    },
    19: { 
      message: 'Tengo una sorpresa preparada para cuando llegues. No puedo decirte qué es todavía.😏 🎁', 
      type: 'plan' 
    },
    20: { 
      message: 'Princesa Fiona, recuerda que aunque no lo diga mucho sabes que te amo mucho. 💕', 
      type: 'mensaje' 
    },
    21: { 
      message: 'Recuerdas cuando bailamos esa noche. Pues yo no jijij', 
      type: 'recuerdo' 
    },
    22: { 
      message: 'Plan random, cocinar algo rico para ti 🍝', 
      type: 'plan' 
    },
    23: { 
      message: 'Estoy contando las horas, los minutos, los segundos, pero se hace mas lento jum. 🫣', 
      type: 'mensaje' 
    },
    24: { 
      message: '¡Mañana llegas! No puedo creerlo. Estoy nervioso y feliz al mismo tiempo. 🎉', 
      type: 'plan' 
    },
    25: { 
      message: '¡ES HOY, ES HOY! ¡Por fin! Si estas leyendo esto es porque Dios lo ha permitido. 💕✨', 
      type: 'mensaje' 
    },
  };

  // Generar calendario con formato semanal (7 días por semana)
  const generateCalendarWeeks = () => {
    const monthStart = startOfMonth(startDate);
    const monthEnd = endOfMonth(arrivalDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Domingo
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    
    const allDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    const weeks: Date[][] = [];
    
    // Dividir en semanas de 7 días
    for (let i = 0; i < allDays.length; i += 7) {
      weeks.push(allDays.slice(i, i + 7));
    }
    
    return weeks;
  };

  const calendarWeeks = generateCalendarWeeks();
  
  // Función para obtener información de un día
  const getDayInfo = (date: Date) => {
    const dayNumber = date.getDate();
    const month = date.getMonth();
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
      month,
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
  
  // Días de la semana
  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Generar posiciones fijas para las partículas
  const particulas = [
    { left: '10%', top: '20%', delay: '0s', duration: '3s' },
    { left: '20%', top: '40%', delay: '0.5s', duration: '4s' },
    { left: '30%', top: '60%', delay: '1s', duration: '3.5s' },
    { left: '40%', top: '80%', delay: '1.5s', duration: '4.5s' },
    { left: '50%', top: '10%', delay: '2s', duration: '3s' },
    { left: '60%', top: '30%', delay: '2.5s', duration: '4s' },
    { left: '70%', top: '50%', delay: '3s', duration: '3.5s' },
    { left: '80%', top: '70%', delay: '0.2s', duration: '4.5s' },
    { left: '90%', top: '90%', delay: '0.7s', duration: '3s' },
    { left: '15%', top: '70%', delay: '1.2s', duration: '4s' },
    { left: '25%', top: '90%', delay: '1.7s', duration: '3.5s' },
    { left: '35%', top: '10%', delay: '2.2s', duration: '4.5s' },
    { left: '45%', top: '30%', delay: '2.7s', duration: '3s' },
    { left: '55%', top: '50%', delay: '0.3s', duration: '4s' },
    { left: '65%', top: '70%', delay: '0.8s', duration: '3.5s' },
    { left: '75%', top: '90%', delay: '1.3s', duration: '4.5s' },
    { left: '85%', top: '10%', delay: '1.8s', duration: '3s' },
    { left: '95%', top: '30%', delay: '2.3s', duration: '4s' },
    { left: '5%', top: '50%', delay: '2.8s', duration: '3.5s' },
    { left: '12%', top: '80%', delay: '0.1s', duration: '4.5s' }
  ];

  return (
    <>
      {/* Elemento de audio */}
      <audio 
        ref={audioRef}
        preload="auto"
        className="hidden"
      >
        <source src="/Sebastián-Yatra-Reik-Un Año.mp3" type="audio/mpeg" />
        Tu navegador no soporta el elemento de audio.
      </audio>

      {/* Overlay de fade-in */}
      <div 
        className={`fixed inset-0 bg-black z-50 transition-opacity duration-1000 ease-in-out ${
          pageLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      />

      <div 
        className={`min-h-screen bg-gradient-to-br from-orange-100 via-amber-100 to-yellow-100 transition-opacity duration-1000 ease-in-out ${
          pageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Efecto de partículas de fondo */}
        {isClient && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particulas.map((particula, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-orange-300 rounded-full animate-float"
                style={{
                  left: particula.left,
                  top: particula.top,
                  animationDelay: particula.delay,
                  animationDuration: particula.duration
                }}
              />
            ))}
          </div>
        )}

        {/* Controles de música */}
        {isMusicPlaying && (
          <div className="fixed top-4 right-4 z-40">
            <button
              onClick={pauseMusic}
              className="bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all duration-300 transform hover:scale-110"
              title="Pausar música"
            >
              <span className="text-2xl">🎵</span>
            </button>
          </div>
        )}

        {/* Botón de regreso */}
        <div className="fixed top-4 left-4 z-40">
          <Link
            href="/"
            className="bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all duration-300 transform hover:scale-110 flex items-center gap-2"
            title="Volver al inicio"
          >
            <span className="text-xl">🏠</span>
            <span className="text-sm font-medium">Inicio</span>
          </Link>
        </div>

        {/* Contenido principal */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 py-20">
          {/* Encabezado y Contador unificado */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-10 shadow-2xl border-2 border-orange-200 mb-8 max-w-5xl w-full animate-fadeIn">
            <div className="text-center">
              {/* Icono */}
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                <span className="text-white text-4xl">📅</span>
              </div>
              
              {/* Título */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
                Calendario de Cuenta Regresiva
              </h1>
              
              {/* Descripción */}
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                Hice un contador para que veas que tan cerca estas de un besito del Principe Achul.
              </p>

              {/* Contador elegante */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 border border-orange-200 mb-6">
                {timeRemaining.days > 0 ? (
                  <>
                    <div className="mb-6">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-700 mb-2">
                        Faltan
                      </h2>
                      <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent mb-4">
                        {timeRemaining.days} {timeRemaining.days === 1 ? 'día' : 'días'}
                      </div>
                    </div>
                    
                    {/* Contador de tiempo detallado */}
                    <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                      <div className="bg-white/80 rounded-xl p-4 shadow-lg border border-orange-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="mb-1 min-h-[3.5rem] flex items-center justify-center overflow-hidden">
                          <FlipNumber value={String(timeRemaining.hours).padStart(2, '0')} />
                        </div>
                        <div className="text-xs md:text-sm text-gray-600 font-medium text-center">
                          Horas
                        </div>
                      </div>
                      <div className="bg-white/80 rounded-xl p-4 shadow-lg border border-orange-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="mb-1 min-h-[3.5rem] flex items-center justify-center overflow-hidden">
                          <FlipNumber value={String(timeRemaining.minutes).padStart(2, '0')} />
                        </div>
                        <div className="text-xs md:text-sm text-gray-600 font-medium text-center">
                          Minutos
                        </div>
                      </div>
                      <div className="bg-white/80 rounded-xl p-4 shadow-lg border border-orange-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="mb-1 min-h-[3.5rem] flex items-center justify-center overflow-hidden">
                          <FlipNumber value={String(timeRemaining.seconds).padStart(2, '0')} />
                        </div>
                        <div className="text-xs md:text-sm text-gray-600 font-medium text-center">
                          Segundos
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="py-8">
                    <div className="text-4xl md:text-5xl font-bold text-green-500 mb-4">
                      ¡HOY ES EL DÍA! 🎉
                    </div>
                    <p className="text-xl text-gray-600">
                      ¡Finalmente llegaste! Te amo más de lo que las palabras pueden expresar. 💕✨
                    </p>
                  </div>
                )}
              </div>

              {/* Fecha de llegada */}
              <div className="pt-4 border-t border-orange-200">
                <p className="text-gray-600 text-sm md:text-base">
                  Fecha de llegada: <span className="font-semibold text-orange-600">
                    {arrivalDate && !isNaN(arrivalDate.getTime()) 
                      ? format(arrivalDate, "d 'de' MMMM, yyyy")
                      : '25 de noviembre, 2025'
                    }
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Calendario */}
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
                    const icon = dayInfo.message.type === 'recuerdo' ? '💭' : 
                                dayInfo.message.type === 'plan' ? '🎯' : '💕';
                    const uniqueKey = `${weekIndex}-${dayIndex}-${date.getTime()}`;
                    
                    return (
                      <button
                        key={uniqueKey}
                        onClick={() => dayInfo.canOpen && setSelectedDay(date.getTime())}
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

          {/* Modal de mensaje */}
          {selectedDay !== null && (() => {
            const selectedDate = new Date(selectedDay);
            const dayInfo = getDayInfo(selectedDate);
            
            return (
              <div 
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={() => setSelectedDay(null)}
              >
                <div 
                  className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full transform transition-all duration-300 animate-fadeIn"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-center mb-6">
                    <div className="text-5xl mb-4">
                      {dayInfo.message.type === 'recuerdo' ? '💭' : 
                       dayInfo.message.type === 'plan' ? '🎯' : '💕'}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {format(selectedDate, "d 'de' MMMM")}
                    </h3>
                    <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700">
                      {dayInfo.message.type === 'recuerdo' ? 'Recuerdo Especial' : 
                       dayInfo.message.type === 'plan' ? 'Plan para Ti' : 'Mensaje de Amor'}
                    </div>
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6 text-center">
                    {dayInfo.message.message}
                  </p>
                  <button
                    onClick={() => setSelectedDay(null)}
                    className="w-full bg-gradient-to-r from-orange-400 to-amber-500 text-white font-bold py-3 px-6 rounded-xl hover:from-orange-500 hover:to-amber-600 transition-all duration-300 transform hover:scale-105"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Instrucciones */}
          <div className="text-center text-gray-600 max-w-2xl">
            <p className="text-lg">
              Haz clic en los días que ya pasaron para ver un mensajito especial 💌
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

