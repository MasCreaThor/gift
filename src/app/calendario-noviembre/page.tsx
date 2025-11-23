'use client';

import { useState, useEffect } from 'react';
import { useClientOnly } from './hooks/useClientOnly';
import { useServerTime } from './hooks/useServerTime';
import BackgroundParticles from './components/BackgroundParticles';
import MusicControl from './components/MusicControl';
import BackButton from './components/BackButton';
import Countdown from './components/Countdown';
import CalendarGrid from './components/CalendarGrid';
import DayModal from './components/DayModal';

export default function CalendarioNoviembre() {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const isClient = useClientOnly();

  const {
    timeRemaining,
    arrivalDate,
    startDate,
    currentTime,
    getCurrentColombiaTime,
    isLoading
  } = useServerTime();

  // Efecto de fade-in de la página
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <MusicControl />

      {/* Overlay de fade-in */}
      <div
        className={`fixed inset-0 bg-black z-50 transition-opacity duration-1000 ease-in-out ${pageLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
      />

      <div
        className={`min-h-screen bg-gradient-to-br from-orange-100 via-amber-100 to-yellow-100 transition-opacity duration-1000 ease-in-out ${pageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
      >
        {/* Efecto de partículas de fondo */}
        {isClient && <BackgroundParticles />}

        <BackButton />

        {/* Contenido principal */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 py-4 md:py-8">

          <Countdown
            timeRemaining={timeRemaining}
            arrivalDate={arrivalDate}
            isLoading={isLoading}
          />

          <CalendarGrid
            startDate={startDate}
            arrivalDate={arrivalDate}
            currentTime={currentTime}
            getCurrentColombiaTime={getCurrentColombiaTime}
            onDayClick={(date) => setSelectedDay(date.getTime())}
          />

          <DayModal
            selectedDay={selectedDay}
            onClose={() => setSelectedDay(null)}
          />

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
