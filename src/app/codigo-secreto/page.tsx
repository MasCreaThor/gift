'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Hook personalizado para evitar problemas de hidratación
function useClientOnly() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return isClient;
}

export default function CodigoSecreto() {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [currentPista, setCurrentPista] = useState(0);
  const [pistasResueltas, setPistasResueltas] = useState(0);
  const [mensajeFinal, setMensajeFinal] = useState(false);
  const [intentos, setIntentos] = useState(0);
  const [mostrarAyuda, setMostrarAyuda] = useState(false);
  const [mostrarMensajeExito, setMostrarMensajeExito] = useState(false);
  const [mensajeExitoActual, setMensajeExitoActual] = useState('');
  const isClient = useClientOnly();

  // Efecto de fade-in de la página
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Datos de las pistas
  const pistas = [
    {
      id: 1,
      pregunta: "¿En qué mes nos conocimos?",
      opciones: ["Enero", "Octubre", "Noviembre", "Diciembre", "Mayo", "Febrero"],
      respuestaCorrecta: "Noviembre",
      pistaAyuda: "Una canción de Reik tiene ese mes como título",
      mensajeCorrecto: "¡Correcto! Ese fuel el mes en que conoci a mi princesa fiona ❤️"
    },
    {
      id: 2,
      pregunta: "¿Cuál es mi color favorito?",
      opciones: ["Rosa", "Azul", "Verde", "Púrpura", "Rojo", "Amarillo"],
      respuestaCorrecta: "Verde",
      pistaAyuda: "Es el color de lo natural, y representa la paciencia",
      mensajeCorrecto: "¡Exacto! Ese color te debe recordar toda la paciencia que te tengo jijiji 💕"
    },
    {
      id: 3,
      pregunta: "¿Cuál es nuestra canción especial?",
      opciones: ["Lo Que Siento", "Perfect", "All of Me", "Disfruto", "A Thousand Years", "Rosas"],
      respuestaCorrecta: "Disfruto",
      pistaAyuda: "Es la canción que siempre escuchamos juntos...",
      mensajeCorrecto: "¡Perfecto! Esa canción nos encanta 🎵"
    },
    {
      id: 4,
      pregunta: "¿Qué es lo que más temo perder?",
      opciones: ["Mi trabajo", "Mi familia", "A ti", "Mi salud", "Mis amigos", "Mi libertad"],
      respuestaCorrecta: "A ti",
      pistaAyuda: "Es la persona más importante en mi vida...",
      mensajeCorrecto: "¡Correcto! Te has convertido en alguien muy importante para mi, al igual que mi familia 💖"
    }
  ];

  // Generar posiciones fijas para las partículas
  const particulas = [
    { left: '10%', top: '20%', delay: '0s', duration: '4s' },
    { left: '20%', top: '40%', delay: '1s', duration: '5s' },
    { left: '30%', top: '60%', delay: '2s', duration: '4.5s' },
    { left: '40%', top: '80%', delay: '0.5s', duration: '5.5s' },
    { left: '50%', top: '10%', delay: '1.5s', duration: '4s' },
    { left: '60%', top: '30%', delay: '2.5s', duration: '5s' },
    { left: '70%', top: '50%', delay: '0.8s', duration: '4.5s' },
    { left: '80%', top: '70%', delay: '1.8s', duration: '5.5s' },
    { left: '90%', top: '90%', delay: '0.3s', duration: '4s' },
    { left: '15%', top: '70%', delay: '2.2s', duration: '5s' },
    { left: '25%', top: '90%', delay: '0.7s', duration: '4.5s' },
    { left: '35%', top: '10%', delay: '1.3s', duration: '5.5s' },
    { left: '45%', top: '30%', delay: '2.7s', duration: '4s' },
    { left: '55%', top: '50%', delay: '0.9s', duration: '5s' },
    { left: '65%', top: '70%', delay: '1.7s', duration: '4.5s' },
    { left: '75%', top: '90%', delay: '0.4s', duration: '5.5s' },
    { left: '85%', top: '10%', delay: '2.1s', duration: '4s' },
    { left: '95%', top: '30%', delay: '0.6s', duration: '5s' },
    { left: '5%', top: '50%', delay: '1.9s', duration: '4.5s' },
    { left: '12%', top: '80%', delay: '0.2s', duration: '5.5s' }
  ];

  // Función para verificar respuesta
  const verificarRespuesta = (respuesta: string) => {
    const pistaActual = pistas[currentPista];
    
    if (respuesta === pistaActual.respuestaCorrecta) {
      setPistasResueltas(prev => prev + 1);
      setIntentos(0);
      setMostrarAyuda(false);
      
      // Mostrar mensaje de éxito temporalmente
      setMensajeExitoActual(pistaActual.mensajeCorrecto);
      setMostrarMensajeExito(true);
      
      // Ocultar mensaje después de 3 segundos
      setTimeout(() => {
        setMostrarMensajeExito(false);
      }, 6000);
      
      // Si es la última pista, mostrar mensaje final
      if (currentPista === pistas.length - 1) {
        setTimeout(() => {
          setMensajeFinal(true);
        }, 6000); // Aumentar tiempo para que se vea el mensaje de éxito
      } else {
        // Avanzar a la siguiente pista
        setTimeout(() => {
          setCurrentPista(prev => prev + 1);
        }, 6000); // Aumentar tiempo para que se vea el mensaje de éxito
      }
    } else {
      setIntentos(prev => prev + 1);
      if (intentos >= 2) {
        setMostrarAyuda(true);
      }
    }
  };

  // Función para reiniciar
  const reiniciar = () => {
    setCurrentPista(0);
    setPistasResueltas(0);
    setMensajeFinal(false);
    setIntentos(0);
    setMostrarAyuda(false);
    setMostrarMensajeExito(false);
    setMensajeExitoActual('');
  };

  return (
    <>
      {/* Overlay de fade-in */}
      <div 
        className={`fixed inset-0 bg-black z-50 transition-opacity duration-1000 ease-in-out ${
          pageLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      />

      <div 
        className={`min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 transition-opacity duration-1000 ease-in-out ${
          pageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Efecto de partículas de fondo */}
        {isClient && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particulas.map((particula, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-purple-300 rounded-full animate-float opacity-60"
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

        {/* Botón de regreso */}
        <div className="fixed top-4 left-4 z-40">
          <Link
            href="/"
            className="bg-white/20 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white/30 transition-all duration-300 transform hover:scale-110 flex items-center gap-2"
            title="Volver al inicio"
          >
            <span className="text-xl">🏠</span>
            <span className="text-sm font-medium text-white">Inicio</span>
          </Link>
        </div>

        {/* Contenido principal */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
          {!mensajeFinal ? (
            <>
              {/* Encabezado */}
              <div className="text-center mb-8 animate-fadeIn">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <span className="text-white text-3xl">🔐</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">
                  Mensaje Secreto
                </h1>
                <p className="text-xl text-purple-200 max-w-2xl mx-auto leading-relaxed">
                  Para llegar a mi corazón, primero debes resolver estos misterios...
                </p>
              </div>

              {/* Barra de progreso */}
              <div className="w-full max-w-md mb-8">
                <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full transition-all duration-1000 ease-out"
                    style={{ width: `${(pistasResueltas / pistas.length) * 100}%` }}
                  />
                </div>
                <p className="text-center text-purple-200 mt-2">
                  Pistas resueltas: {pistasResueltas}/{pistas.length}
                </p>
              </div>

              {/* Contenedor de pista */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-purple-300/30 max-w-2xl w-full">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl">🔍</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Pista {currentPista + 1}
                  </h2>
                  <p className="text-lg text-purple-200">
                    {pistas[currentPista].pregunta}
                  </p>
                </div>

                {/* Opciones de respuesta */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {pistas[currentPista].opciones.map((opcion, index) => (
                    <button
                      key={index}
                      onClick={() => verificarRespuesta(opcion)}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 text-white font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-purple-300/30"
                    >
                      {opcion}
                    </button>
                  ))}
                </div>

                {/* Ayuda */}
                {mostrarAyuda && (
                  <div className="bg-yellow-400/20 border border-yellow-400/50 rounded-xl p-4 mb-4">
                    <p className="text-yellow-200 text-center">
                      💡 Pista: {pistas[currentPista].pistaAyuda}
                    </p>
                  </div>
                )}

                {/* Intentos */}
                <div className="text-center text-purple-200">
                  Intentos: {intentos}/3
                </div>
              </div>

               {/* Mensaje de éxito temporal */}
               {mostrarMensajeExito && (
                 <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500/90 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-green-400/50 z-50 animate-fadeIn">
                   <p className="text-white text-lg font-medium text-center">
                     {mensajeExitoActual}
                   </p>
                 </div>
               )}
            </>
          ) : (
            /* Mensaje final desbloqueado */
            <div className="text-center max-w-4xl mx-auto animate-fadeIn">
              {/* Cofre que se abre */}
              <div className="mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl transform animate-bounceIn">
                  <span className="text-white text-6xl">🎁</span>
                </div>
                <h2 className="text-4xl font-bold text-white mb-4">
                  ¡Mensaje Desbloqueado!
                </h2>
              </div>

              {/* Mensaje de amor */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-purple-300/30 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-red-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">💌</span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-6">
                  Para Mi Amorcito Bello
                </h3>
                <div className="text-lg text-purple-100 leading-relaxed space-y-4">
                  <p>
                    Woo!, Lograste pasar la pruena de amor, ahora si te dire que soy Billonario,
                     ahora es el momento de la verdad, jijiji ya no sufriras mas.😁
                  </p>
                  <p>
                    En este mes del amor y la amistad, quiero recordarte que eres
                    mi mejor amiga, mi confidente y el amorcito de mi vida.😏
                  </p>
                  <p>
                    No me voy a quejar, pensaba quejarme hoy pero no voy a hacerlo,
                    sera mas luego. 😅
                  </p>
                  <p>
                    Resulta que solo te traigo malas noticias, pero no te preocupes,
                    ya que para ti seran malas, pero para mi seran buenas.😏
                    Resulta y acontece que estoy embarazado, y no se si sera un niño o una niña, o lombrices.
                    Pero vamos al grano, no podre ir a la boda, ya que hoy confirmo el profesor que el parcial
                    empieza el 22 de septiembre y el examen con este profesor sera en dos sepciones,
                    la primera sera el jueves 25 de septiembre y la segunda sera el sabado 27 de septiembre.
                    La buena noticia es que te prometo que estare el dia de tu boda.🫣
                  </p>
                  <p>
                    Se que deseas que este contigo ese dia, pero no sera posible 😔
                    lo siento mucho, espero que me entiendas princesa fiona.
                  </p>
                  <p className="text-2xl font-bold text-yellow-300">
                    ¡Feliz mes del amor y la amistad y feliz 4 años y 9 meses! ❤️
                  </p>
                  <p>
                    DE: Tu principe Achul🫡 <br />
                    PARA: Princesa Fiona👑
                  </p>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={reiniciar}
                  className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  🔄 Jugar de Nuevo
                </button>
                <Link
                  href="/"
                  className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-center"
                >
                  🏠 Volver al Inicio
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
