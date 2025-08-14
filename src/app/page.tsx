'use client';

import { useState, useEffect, useRef } from 'react';

// Hook personalizado para evitar problemas de hidratación
function useClientOnly() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return isClient;
}

export default function CartaDigital() {
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isUnfolding, setIsUnfolding] = useState(false);
  const [unfoldProgress, setUnfoldProgress] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 });
  const [pageLoaded, setPageLoaded] = useState(false);
  const [sealOpened, setSealOpened] = useState(false);
  const [envelopeVisible, setEnvelopeVisible] = useState(true);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const isClient = useClientOnly();
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const writingAreaRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const mensajeCompleto = `Hola mi amor,

Hoy 13 de agosto de 2025, celebramos juntos 4 años y 8 meses de nuestra hermosa relación. 

Cada momento que hemos pasado juntos ha sido un aprendizaje que ha hecho más fuerte nuestra relación.
Me he dado cuenta que en los días más grises tú tienes una fuerza increíble dentro de ti, que buscas la manera
de solucionar los problemas y puedes ver soluciones que no alcanzo a visualizar, y eso me ha hecho sentir seguro y me genera confianza, entre otras sensaciones.

Gracias por ser mi compañera, mi amiga, mi confidente, mi novia y el amorcito de mi vida. También gracias por tu paciencia, por tu amor incondicional,
por cada sonrisa y carcajadas que sacas de mí, y por cada abrazo, por cada beso que me hace sentir muy enamorado y que todo está bien.

Te amo mucho, aunque no lo diga todo el tiempo, pero siempre quiero que no te pase nada, que tengas lo necesario, y a veces pongo una mirada triste sin que lo notes
cuando no puedo ayudarte. Todos los días le pido a Dios que te cuide. Para finalizar, te quiero decir que eres la mejor novia que he tenido.

Con todo mi amor,
Tu amorcito ❤️`;

  // Efecto de fade-in de la página (4 segundos)
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Función para reproducir música
  const playMusic = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // Volumen al 30%
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

  // Función para calcular la posición del cursor
  const updateCursorPosition = () => {
    if (textRef.current) {
      const textElement = textRef.current;
      const textContent = textElement.textContent || '';
      const lastCharIndex = textContent.length - 1;
      
      if (lastCharIndex >= 0) {
        // Crear un rango temporal para medir la posición
        const range = document.createRange();
        const textNode = textElement.firstChild;
        
        if (textNode) {
          range.setStart(textNode, lastCharIndex);
          range.setEnd(textNode, lastCharIndex);
          
          const rect = range.getBoundingClientRect();
          const textRect = textElement.getBoundingClientRect();
          
          setCursorPosition({
            top: rect.top - textRect.top,
            left: rect.right - textRect.left
          });
        }
      }
    }
  };

  // Función para centrar la cámara en el área de escritura
  const centerCameraOnWriting = () => {
    if (writingAreaRef.current && isTyping) {
      const writingArea = writingAreaRef.current;
      const viewportHeight = window.innerHeight;
      
      // Obtener la posición del área de escritura
      const writingRect = writingArea.getBoundingClientRect();
      const writingCenter = writingRect.top + writingRect.height / 2;
      const viewportCenter = viewportHeight / 2;
      
      // Calcular cuánto scroll necesitamos para centrar
      const scrollNeeded = writingCenter - viewportCenter;
      
      // Solo hacer scroll si es necesario y significativo
      if (Math.abs(scrollNeeded) > 50) {
        window.scrollBy({
          top: scrollNeeded,
          behavior: 'smooth'
        });
      }
    }
  };

  // Función para hacer scroll automático hacia el cursor
  const scrollToCursor = () => {
    if (textRef.current && isTyping) {
      const textElement = textRef.current;
      const viewportHeight = window.innerHeight;
      
      // Obtener la posición del cursor en relación al viewport
      const textRect = textElement.getBoundingClientRect();
      const cursorTop = textRect.top + cursorPosition.top;
      
      // Calcular la posición ideal del cursor (centro del viewport)
      const idealCursorPosition = viewportHeight * 0.4; // 40% desde arriba
      const currentCursorPosition = cursorTop;
      
      // Calcular cuánto scroll necesitamos
      const scrollAmount = currentCursorPosition - idealCursorPosition;
      
      // Solo hacer scroll si es necesario
      if (Math.abs(scrollAmount) > 30) {
        window.scrollBy({
          top: scrollAmount,
          behavior: 'smooth'
        });
      }
    }
  };

  // Función para abrir el sello
  const openSeal = () => {
    setSealOpened(true);
    
    // Reproducir música al abrir el sello
    playMusic();
    
    // Desaparecer el sobre lentamente
    setEnvelopeVisible(false);
    
    // Después de que desaparezca el sobre, mostrar la carta
    setTimeout(() => {
      setIsUnfolding(true);
    }, 1000);
  };

  // Efecto de desdoble de la carta
  useEffect(() => {
    if (isUnfolding) {
      const unfoldTimer = setInterval(() => {
        setUnfoldProgress(prev => {
          if (prev >= 100) {
            setIsUnfolding(false);
            setIsTyping(true);
            clearInterval(unfoldTimer);
            return 100;
          }
          return prev + 2;
        });
      }, 50);

      return () => clearInterval(unfoldTimer);
    }
  }, [isUnfolding]);

  // Efecto de escritura de la carta
  useEffect(() => {
    if (isTyping) {
      let index = 0;
      const timer = setInterval(() => {
        if (index < mensajeCompleto.length) {
          setCurrentText(mensajeCompleto.slice(0, index + 1));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(timer);
        }
      }, 50);

      return () => clearInterval(timer);
    }
  }, [isTyping]);

  // Actualizar posición del cursor cuando cambie el texto
  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(updateCursorPosition, 10);
      return () => clearTimeout(timer);
    }
  }, [currentText, isTyping]);

  // Sistema de cámara que sigue la escritura
  useEffect(() => {
    if (isTyping && cursorPosition.top > 0) {
      // Primero centrar la cámara en el área de escritura
      const centerTimer = setTimeout(centerCameraOnWriting, 100);
      
      // Luego ajustar la posición del cursor
      const cursorTimer = setTimeout(scrollToCursor, 200);
      
      return () => {
        clearTimeout(centerTimer);
        clearTimeout(cursorTimer);
      };
    }
  }, [cursorPosition, isTyping]);

  // Generar posiciones fijas para las partículas para evitar problemas de hidratación
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
        <source src="/Lo Que Siento.mp3" type="audio/mpeg" />
        Tu navegador no soporta el elemento de audio.
      </audio>

      {/* Overlay de fade-in desde negro (4 segundos) */}
      <div 
        className={`fixed inset-0 bg-black z-50 transition-opacity duration-[4000ms] ease-in-out ${
          pageLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      />

      <div 
        ref={containerRef}
        className={`min-h-screen bg-gradient-to-br from-pink-100 via-red-100 to-purple-100 flex items-center justify-center p-4 transition-opacity duration-[4000ms] ease-in-out ${
          pageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Efecto de partículas de fondo - solo mostrar en el cliente */}
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

        {/* Sobre de carta */}
        <div className="relative max-w-2xl w-full my-8">
          {/* Sobre cerrado */}
          {envelopeVisible && (
            <div className="relative">
              {/* Sobre principal */}
              <div 
                className="relative w-96 h-64 mx-auto cursor-pointer transform hover:scale-105 transition-all duration-1000"
                onClick={openSeal}
                style={{
                  opacity: envelopeVisible ? 1 : 0,
                  transform: envelopeVisible ? 'scale(1)' : 'scale(0.8)',
                  transition: 'opacity 1s ease-out, transform 1s ease-out'
                }}
              >
                {/* Frente del sobre */}
                <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-100 rounded-lg shadow-2xl border-2 border-gray-300">
                  {/* Líneas del sobre */}
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-400"></div>
                  <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-400"></div>
                  
                  {/* Esquina doblada */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 transform rotate-45 origin-top-left rounded-tr-lg"></div>
                  
                  {/* Sello en el centro */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer z-10">
                    <span className="text-white text-2xl">💌</span>
                  </div>
                  
                  {/* Texto indicativo */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-600 font-medium">
                    Haz clic en el sello para abrir
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Carta */}
          {sealOpened && !envelopeVisible && (
            <div 
              className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-2xl p-8 border border-gray-200 transform hover:scale-105 transition-transform duration-300 relative overflow-hidden"
              style={{
                opacity: sealOpened ? 1 : 0,
                transform: sealOpened 
                  ? (isUnfolding 
                    ? `perspective(1000px) rotateX(${(100 - unfoldProgress) * 0.9}deg) scaleY(${0.1 + (unfoldProgress / 100) * 0.9})` 
                    : 'perspective(1000px) rotateX(0deg) scaleY(1)')
                  : 'scale(0.8)',
                transition: sealOpened 
                  ? (isUnfolding ? 'none' : 'transform 0.5s ease-out')
                  : 'opacity 0.5s ease-out, transform 0.5s ease-out'
              }}
            >
              {/* Línea de doblez que desaparece gradualmente */}
              {isUnfolding && (
                <div 
                  className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-br from-transparent via-gray-300 to-transparent transform origin-top"
                  style={{
                    transform: `scaleY(${Math.max(0, 1 - unfoldProgress / 50)})`,
                    opacity: Math.max(0, 1 - unfoldProgress / 30)
                  }}
                />
              )}
              
              {/* Encabezado de la carta */}
              <div className="text-center mb-8 animate-fadeIn">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl">💌</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Carta de Amor
                </h1>
                <p className="text-gray-600 text-lg">
                  13 de Agosto, 2025
                </p>
              </div>

              {/* Línea decorativa */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent mb-8 animate-slideIn" />

              {/* Contenido de la carta */}
              <div className="relative">
                {/* Texto de la carta */}
                <div 
                  ref={textRef}
                  className="text-gray-700 text-lg leading-relaxed font-serif whitespace-pre-line animate-fadeIn relative"
                  style={{
                    opacity: isUnfolding ? 0 : 1,
                    transform: isUnfolding ? 'translateY(20px)' : 'translateY(0)',
                    transition: 'opacity 0.5s ease-out, transform 0.5s ease-out'
                  }}
                >
                  {currentText}
                  
                  {/* Cursor parpadeante que se mueve con el texto */}
                  {isTyping && (
                    <span 
                      className="absolute w-0.5 h-6 bg-pink-500 animate-pulse"
                      style={{
                        top: cursorPosition.top,
                        left: cursorPosition.left,
                        transform: 'translateY(-2px)'
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Sello de cera después de abrir */}
          {sealOpened && !envelopeVisible && (
            <div 
              className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg animate-stamp"
              style={{
                opacity: isUnfolding ? 0 : 1,
                transform: isUnfolding ? 'scale(0) rotate(0deg)' : 'scale(1) rotate(360deg)',
                transition: 'opacity 0.5s ease-out, transform 0.5s ease-out'
              }}
            >
              <span className="text-white text-2xl">❤️</span>
            </div>
          )}
        </div>

        {/* Área de escritura invisible para el sistema de cámara */}
        <div 
          ref={writingAreaRef}
          className="absolute pointer-events-none"
          style={{
            top: isTyping ? cursorPosition.top + 100 : 0,
            left: 0,
            width: '100%',
            height: '200px',
            opacity: 0
          }}
        />
      </div>
    </>
  );
}
