'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Hook personalizado para evitar problemas de hidratación
function useClientOnly() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return isClient;
}

export default function FloresAmarillas() {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [erupciones, setErupciones] = useState<Array<{
    id: number;
    palabra: string;
    x: number;
    y: number;
    timestamp: number;
  }>>([]);
  const [isClient, setIsClient] = useState(false);

  // Efecto de fade-in de la página
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Hook para evitar problemas de hidratación
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Array de palabras aleatorias
  const palabrasAleatorias = [
    "Te amo", "Besitos", "Feliz Día", "Mi amor", "Mi princesa",
    "Princesa Fiona", "Mi corazón"
  ];

  // Función para manejar clic en emoji
  const handleEmojiClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    // Seleccionar una palabra aleatoria
    const palabraAleatoria = palabrasAleatorias[Math.floor(Math.random() * palabrasAleatorias.length)];
    
    // Crear 50 palabras que salen una por una desde el origen
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const idUnico = Date.now() + i + Math.random() * 1000; // ID único con decimales
        const nuevasErupciones: Array<{
          id: number;
          palabra: string;
          x: number;
          y: number;
          timestamp: number;
        }> = [{
          id: idUnico,
          palabra: palabraAleatoria,
          x: x + (Math.random() - 0.5) * 200, // Dispersión desde el origen
          y: y + (Math.random() - 0.5) * 200, // Dispersión desde el origen
          timestamp: Date.now()
        }];
        
        setErupciones(prev => [...prev, ...nuevasErupciones]);
        
        // Limpiar esta palabra específica después de 4 segundos
        setTimeout(() => {
          setErupciones(prev => prev.filter(erupcion => erupcion.id !== idUnico));
        }, 4000);
      }, i * 50); // 50ms de delay entre cada palabra
    }
  };

  // Generar posiciones aleatorias para los emojis
  const generarPosiciones = () => {
    const posiciones = [];
    for (let i = 0; i < 20; i++) {
      posiciones.push({
        left: Math.random() * 80 + 10, // Entre 10% y 90%
        top: Math.random() * 80 + 10,  // Entre 10% y 90%
        delay: Math.random() * 3,      // Delay entre 0 y 3 segundos
        duration: 3 + Math.random() * 4 // Duración entre 3 y 7 segundos
      });
    }
    return posiciones;
  };

  const [posicionesEmojis] = useState(generarPosiciones());

  // Emojis disponibles
  const emojis = ['🌻', '🌼', '🌹', '❤️', '💕', '💖', '💗', '💘', '💝', '😘', '🥰', '😍'];

  return (
    <>
      {/* Elemento de audio */}
      <audio 
        id="rosas-audio"
        preload="auto"
        className="hidden"
        loop
      >
        <source src="/Rosas_cancion.mp3" type="audio/mpeg" />
        Tu navegador no soporta el elemento de audio.
      </audio>

      {/* Overlay de fade-in */}
      <div 
        className={`fixed inset-0 bg-black z-50 transition-opacity duration-1000 ease-in-out ${
          pageLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      />

      <div 
        className={`min-h-screen relative transition-opacity duration-1000 ease-in-out ${
          pageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Fondo con imagen de flores y difuminado oscuro */}
        <div className="absolute inset-0">
          <Image
            src="/flores.jpg"
            alt="Flores de fondo"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Efecto de partículas flotantes */}
        {isClient && (
          <div className="absolute inset-0 overflow-hidden">
            {posicionesEmojis.map((pos, i) => (
              <div
                key={i}
                className="absolute text-4xl animate-float cursor-pointer hover:scale-125 transition-transform duration-200 z-20"
                style={{
                  left: `${pos.left}%`,
                  top: `${pos.top}%`,
                  animationDelay: `${pos.delay}s`,
                  animationDuration: `${pos.duration}s`
                }}
                onClick={(e) => handleEmojiClick(e)}
              >
                {emojis[i % emojis.length]}
              </div>
            ))}
          </div>
        )}

        {/* Erupciones de palabras con animación de explosión */}
        {erupciones.map((erupcion) => (
          <div
            key={erupcion.id}
            className="absolute text-white font-bold text-lg pointer-events-none z-30 animate-explosion"
            style={{
              left: erupcion.x,
              top: erupcion.y,
              transform: 'translate(-50%, -50%)',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
            }}
          >
            {erupcion.palabra}
          </div>
        ))}

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
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
          {/* Reproductor de música */}
          <div className="mb-8 flex justify-center">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/20 max-w-md w-full">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">
                  🎵 Rosas 🎵
                </h3>
                <p className="text-white/80 text-sm">
                  Por eso esperaba con la carita embarrada jijij
                </p>
              </div>
              
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => {
                    const audio = document.getElementById('rosas-audio') as HTMLAudioElement;
                    if (audio) {
                      audio.pause();
                      audio.currentTime = 0;
                    }
                  }}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 transform hover:scale-110 shadow-lg"
                  title="Reiniciar"
                >
                  <span className="text-white text-xl">⏮️</span>
                </button>
                
                <button
                  onClick={() => {
                    const audio = document.getElementById('rosas-audio') as HTMLAudioElement;
                    if (audio) {
                      if (audio.paused) {
                        audio.play();
                      } else {
                        audio.pause();
                      }
                    }
                  }}
                  className="bg-white/30 hover:bg-white/40 backdrop-blur-sm rounded-full p-4 transition-all duration-300 transform hover:scale-110 shadow-xl"
                  title="Reproducir/Pausar"
                >
                  <span className="text-white text-2xl">▶️</span>
                </button>
                
                <button
                  onClick={() => {
                    const audio = document.getElementById('rosas-audio') as HTMLAudioElement;
                    if (audio) {
                      audio.muted = !audio.muted;
                    }
                  }}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 transform hover:scale-110 shadow-lg"
                  title="Silenciar/Activar sonido"
                >
                  <span className="text-white text-xl">🔊</span>
                </button>
              </div>
              
              <div className="mt-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="30"
                  onChange={(e) => {
                    const audio = document.getElementById('rosas-audio') as HTMLAudioElement;
                    if (audio) {
                      audio.volume = parseInt(e.target.value) / 100;
                    }
                  }}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  title="Volumen"
                />
                <div className="flex justify-between text-xs text-white/60 mt-1">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
