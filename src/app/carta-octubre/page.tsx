'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function CartaOctubre() {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
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

  // Efecto para manejar la interacción del sobre
  useEffect(() => {
    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const envelope = document.querySelector('.envelope-wrapper');
      const letter = document.querySelector('.letter');

      if (
        target.matches(".envelope") || 
        target.matches(".tap-right") || 
        target.matches(".tap-left") || 
        target.matches(".heart")
      ) {
        envelope?.classList.toggle('flap');
        
        if (!letter?.classList.contains('opened')) {
          // Reproducir música al abrir
          playMusic();
          
          setTimeout(() => {
            letter?.classList.add('letter-opening');

            setTimeout(() => {
              letter?.classList.remove('letter-opening');
              letter?.classList.add('opened');
            }, 500);
          }, 1000);
        }
      } else if (target.matches(".envelope *")) {
        envelope?.classList.remove('flap');
        if (letter?.classList.contains("opened")) {
          letter.classList.add("closing-letter");
          setTimeout(() => {
            letter.classList.remove("closing-letter");
            letter.classList.remove("opened");
          }, 500);
        }
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

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
        className={`min-h-screen bg-gradient-to-br from-pink-100 via-red-100 to-purple-100 transition-opacity duration-1000 ease-in-out ${
          pageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
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

        {/* Contenido principal - Usando el HTML original */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
          <h1 style={{ 
            fontFamily: 'Marck Script, cursive',
            textAlign: 'center',
            fontSize: '60px',
            marginBottom: '50px',
            color: '#444'
          }}>
            💌 Carta para mi princesa Tatiana ❤️
          </h1>
          
          <div className="container" style={{ width: '400px' }}>
            <div className="envelope-wrapper" style={{
              position: 'relative',
              backgroundColor: '#ffe3ed',
              boxShadow: '0 0 40px rgba(0, 0, 0, 0.2)',
              borderRadius: '15px'
            }}>
              <div className="envelope" style={{
                position: 'relative',
                width: '400px',
                height: '300px'
              }}>
                <div className="letter" style={{
                  position: 'absolute',
                  bottom: 0,
                  width: '100%',
                  height: '100%',
                  background: '#fff',
                  textAlign: 'center',
                  boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
                  padding: '20px',
                  borderRadius: '10px',
                  transition: 'transform .5s ease-in-out'
                }}>
                  <div className="text" style={{
                    fontFamily: 'Dancing Script, cursive',
                    color: '#003049',
                    textAlign: 'left',
                    fontSize: '14px',
                    border: '3px dotted #003049',
                    padding: '10px',
                    height: '100%',
                    lineHeight: '20px',
                    cursor: 'pointer',
                    overflow: 'scroll',
                    fontWeight: '500'
                  }}>
                    <strong>Hola, mi querida Tatiana,</strong>
                    <p>
                      Hoy el calendario vuelve a señalar el <strong>13</strong>, ese número que dejó de ser solo una cifra para convertirse en un destino.  
                      Cada trece me recuerda el instante en que el universo, caprichoso y sabio, decidió cruzar nuestros caminos.  
                      Desde entonces, cada mes no es solo tiempo que pasa: es una constelación más que encendemos juntos en el cielo.
                    </p>
                    <p>
                      He aprendido que <strong>amarte es una decisión diaria</strong>, un acto silencioso pero poderoso.  
                      Es elegirte incluso en tus silencios, en tus risas que me devuelven la calma, en tus defectos que se han vuelto mi refugio.  
                      Es querer cada una de tus formas, desde la ternura de tu voz hasta la tempestad de tu mirada.
                    </p>
                    <p>
                      Por ti, he descubierto un nuevo ritual: <strong>escribirte cada 13</strong>, como quien guarda una promesa en un papel.  
                      Es mi manera de agradecer los treinta días que el mundo me concede para seguir aprendiendo de ti,  
                      de tu manera de amar, de existir, de incendiar mis pensamientos con solo pronunciar tu nombre.  
                      Cada carta será una pequeña ofrenda a lo que somos: dos almas que se buscan incluso cuando el reloj calla.
                    </p>
                    <p>
                      Y aunque ahora me despida, <strong>no es un adiós, amor precioso</strong>.  
                      Porque los que se aman de verdad no se despiden: se quedan en el aire, en el eco, en la tinta.  
                      Me despido solo para volver a ti, para que me extrañes lo justo y me recuerdes eterno.  
                      Porque donde termina la palabra, <em>empieza el amor</em>.
                    </p>
                    <p style={{ 
                      textAlign: 'right', 
                      fontFamily: 'Great Vibes, cursive',
                      fontSize: '18px',
                      marginTop: '20px',
                      color: '#8B0000'
                    }}>
                      Con todo lo que soy, <br />
                      <strong>Tu principe Achul</strong>
                    </p>
                  </div>
                </div>
              </div>
              <div className="heart" style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '30px',
                height: '30px',
                background: '#ff477e',
                transform: 'translate(-50%, 0%) rotate(45deg)',
                transition: 'transform 0.5s ease-in-out 1s',
                boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)',
                cursor: 'pointer',
                zIndex: 999
              }}></div>
              <div className="tap-right" style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100%',
                height: '100%',
                clipPath: 'polygon(100% 0, 0 100%, 100% 100%)',
                transform: 'rotate(-90deg,90deg)',
                borderBottomRightRadius: '10px',
                borderTopRightRadius: '10px',
                borderBottomLeftRadius: '10px',
                backgroundColor: '#ffc1d1'
              }}></div>
              <div className="tap-left" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                clipPath: 'polygon(0 0, 0% 100%, 100% 100%)',
                backgroundColor: '#ffc1d1',
                transform: 'rotate(90deg, -90deg)',
                borderTopLeftRadius: '10px',
                borderBottomLeftRadius: '10px',
                borderBottomRightRadius: '10px'
              }}></div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Marck+Script&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --primary: #fff;
          --bg-color: #ffebf2;
          --bg-envelope-color: #ffe3ed;
          --envelope-tab: #ffccd5;
          --envelope-cover: #ffc1d1;
          --shadow-color: rgba(0, 0, 0, 0.2);
          --txt-color: #003049;
          --heart-color: #ff477e;
        }

        .envelope-wrapper > .envelope::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 4;
          border-top: 180px solid var(--envelope-tab);
          border-right: 200px solid transparent;
          border-left: 200px solid transparent;
          transform-origin: top;
          transition: all 0.5s ease-in-out 0.7s;
          border-radius: 10px;
        }

        .envelope-wrapper.disable-envelope .envelope::before {
          pointer-events: none;
        }

        .heart:before,
        .heart:after {
          content: "";
          position: absolute;
          width: 30px;
          height: 30px;
          background-color: var(--heart-color);
          border-radius: 80%;
        }

        .heart:before {
          top: -15px;
        }
        
        .heart:after {
          right: 15px;
        }

        .flap > .envelope:before {
          transform: rotateX(180deg);
          z-index: 0;
        }

        .flap > .heart {
          transform: rotate(90deg);
          transition-delay: 0.4s;
        }

        .letter.letter-opening {
          transform: translateY(-290px);
          animation-delay: 0.5s;
          transition: transform .5s ease-in-out;
        }

        .letter.closing-letter {
          transform: translateY(-290px);
          transition: transform .5s ease-in-out;
          z-index: 10000;
        }

        .letter.opened{
          z-index: 10000;
        }

        ::-webkit-scrollbar {
          width: 8px; 
        }

        ::-webkit-scrollbar-track {
          background: transparent; 
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: var(--envelope-cover); 
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: var(--heart-color); 
        }

        @media screen and (max-width: 400px){
          .container {
            width: 300px;
          }

          .envelope-wrapper > .envelope {
            position: relative;
            width: 300px;
            height: 250px;
          }

          .tap-left,
          .tap-right{
            width: 100%;
          }

          .envelope-wrapper > .envelope::before {
            border-top: 150px solid var(--envelope-tab);
            border-right: 150px solid transparent;
            border-left: 150px solid transparent;
          }
        }
      `}</style>
    </>
  );
}
