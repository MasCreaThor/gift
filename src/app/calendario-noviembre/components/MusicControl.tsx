import { useState, useRef } from 'react';

export default function MusicControl() {
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

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

            {/* Botón para iniciar música si no está sonando (opcional, o se maneja externamente) */}
            {!isMusicPlaying && (
                <div className="fixed top-4 right-4 z-40">
                    <button
                        onClick={playMusic}
                        className="bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all duration-300 transform hover:scale-110"
                        title="Reproducir música"
                    >
                        <span className="text-2xl">🔇</span>
                    </button>
                </div>
            )}
        </>
    );
}
