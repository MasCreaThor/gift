'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// Hook personalizado para evitar problemas de hidratación
function useClientOnly() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return isClient;
}

export default function HomePage() {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const isClient = useClientOnly();
  const audioRef = useRef<HTMLAudioElement>(null);

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
      audioRef.current.volume = 0.2; // Volumen al 20% para música de fondo
      audioRef.current.loop = true; // Reproducción en bucle
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

  // Reproducir música automáticamente cuando la página esté lista
  useEffect(() => {
    if (pageLoaded && isClient) {
      const musicTimer = setTimeout(() => {
        playMusic();
      }, 1000); // Reproducir después de 1 segundo de que la página esté lista

      return () => clearTimeout(musicTimer);
    }
  }, [pageLoaded, isClient]);

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
        <source src="/Someone_You_Loved.mp3" type="audio/mpeg" />
        Tu navegador no soporta el elemento de audio.
      </audio>

      {/* Overlay de fade-in */}
      <div 
        className={`fixed inset-0 bg-black z-50 transition-opacity duration-1000 ease-in-out ${
          pageLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      />

      <div 
        className={`min-h-screen bg-gradient-to-br from-pink-100 via-red-100 to-purple-100 transition-opacity duration-1000 ease-in-out ${
          pageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Efecto de partículas de fondo */}
        {isClient && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particulas.map((particula, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-pink-300 rounded-full animate-float"
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

        {/* Botón para reproducir música si no está sonando */}
        {!isMusicPlaying && pageLoaded && (
          <div className="fixed top-4 right-4 z-40">
            <button
              onClick={playMusic}
              className="bg-white/60 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white/80 transition-all duration-300 transform hover:scale-110"
              title="Reproducir música"
            >
              <span className="text-2xl">🔇</span>
            </button>
          </div>
        )}

        {/* Contenido principal */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
          {/* Encabezado principal */}
          <div className="text-center mb-12 animate-fadeIn">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-red-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
              <span className="text-white text-4xl">💕</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Mi Amor
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Aquí encontrarás todos los detalles especiales que te preparo cada mes. 
              Cada uno está hecho con mucho amor para ti.
            </p>
          </div>

          {/* Tarjetas de detalles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
            {/* Carta de Amor - Agosto 2025 */}
            <Link 
              href="/carta"
              className="group transform hover:scale-105 transition-all duration-300"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-pink-200 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                {/* Decoración de fondo */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-200 to-red-200 rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full translate-y-8 -translate-x-8 opacity-50"></div>
                
                {/* Icono principal */}
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-red-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-2xl">💌</span>
                  </div>
                  
                {/* Contenido de la tarjeta */}
                <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">
                  Carta de Amor
                </h3>
                <p className="text-gray-600 text-center mb-4">
                  Agosto 2025
                </p>
                <p className="text-sm text-gray-500 text-center leading-relaxed">
                  Una carta especial escrita con todo mi amor para celebrar nuestros 4 años y 8 meses juntos.
                </p>
                
                {/* Indicador de hover */}
                <div className="absolute bottom-4 right-4 text-pink-400 group-hover:translate-x-1 transition-transform duration-300">
                  <span className="text-lg">→</span>
                </div>
              </div>
            </Link>

            {/* Código Secreto - Septiembre 2025 */}
            <Link 
              href="/codigo-secreto"
              className="group transform hover:scale-105 transition-all duration-300"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-purple-200 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                {/* Decoración de fondo */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full translate-y-8 -translate-x-8 opacity-50"></div>
                
                {/* Icono principal */}
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl">🔐</span>
                </div>
                
                {/* Contenido de la tarjeta */}
                <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">
                  Código Secreto
                </h3>
                <p className="text-gray-600 text-center mb-4">
                  Septiembre 2025
                </p>
                <p className="text-sm text-gray-500 text-center leading-relaxed">
                  Un mensaje misterioso que solo podrás desbloquear resolviendo pistas sobre nuestro amor.
                </p>
                
                {/* Indicador de hover */}
                <div className="absolute bottom-4 right-4 text-purple-400 group-hover:translate-x-1 transition-transform duration-300">
                  <span className="text-lg">→</span>
                </div>
              </div>
            </Link>

            {/* Flores Amarillas - Septiembre 2025 */}
            <Link 
              href="/rosas"
              className="group transform hover:scale-105 transition-all duration-300"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-yellow-200 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                {/* Decoración de fondo */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-red-200 to-pink-200 rounded-full translate-y-8 -translate-x-8 opacity-50"></div>
                
                {/* Icono principal */}
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl">🌻</span>
                </div>
                
                {/* Contenido de la tarjeta */}
                <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">
                  Rosas
                </h3>
                <p className="text-gray-600 text-center mb-4">
                  Septiembre 2025
                </p>
                <p className="text-sm text-gray-500 text-center leading-relaxed">
                  Un jardín virtual lleno de florcitas, corazoncitos y palabritas unicas de mi para ti.
                    Feliz dia del amor y la amistad.
                </p>
                
                {/* Indicador de hover */}
                <div className="absolute bottom-4 right-4 text-yellow-400 group-hover:translate-x-1 transition-transform duration-300">
                  <span className="text-lg">→</span>
                </div>
              </div>
            </Link>

            {/* Carta de Octubre - Octubre 2025 */}
            <Link 
              href="/carta-octubre"
              className="group transform hover:scale-105 transition-all duration-300"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-pink-200 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                {/* Decoración de fondo */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-200 to-red-200 rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full translate-y-8 -translate-x-8 opacity-50"></div>
                
                {/* Icono principal */}
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-red-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl">💌</span>
                </div>
                
                {/* Contenido de la tarjeta */}
                <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">
                  Carta de Octubre
                </h3>
                <p className="text-gray-600 text-center mb-4">
                  Octubre 2025
                </p>
                <p className="text-sm text-gray-500 text-center leading-relaxed">
                  Una carta especial escrita con todo mi amor para celebrar nuestro aniversario mensual.
                </p>
                
                {/* Indicador de hover */}
                <div className="absolute bottom-4 right-4 text-pink-400 group-hover:translate-x-1 transition-transform duration-300">
                  <span className="text-lg">→</span>
                </div>
              </div>
            </Link>

            {/* Tarjeta placeholder para más detalles */}
            <div className="group transform hover:scale-105 transition-all duration-300 opacity-60">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200 relative overflow-hidden">
                {/* Decoración de fondo */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full translate-y-8 -translate-x-8 opacity-50"></div>
                
                {/* Icono principal */}
                <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">💝</span>
                </div>
                
                {/* Contenido de la tarjeta */}
                <h3 className="text-2xl font-bold text-gray-600 mb-3 text-center">
                  Más Detalles
                </h3>
                <p className="text-gray-500 text-center mb-4">
                  Próximamente
                </p>
                <p className="text-sm text-gray-400 text-center leading-relaxed">
                  Cada mes tendrás un detalle especial aquí...
                </p>
                
                {/* Indicador */}
                <div className="absolute bottom-4 right-4 text-gray-400">
                  <span className="text-lg">⏳</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mensaje de amor */}
          <div className="mt-16 text-center max-w-4xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-pink-200">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Te amo mucho ❤️
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Espero que hallas disfrutado cada detallito. <br />
                Besitos 💋
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
