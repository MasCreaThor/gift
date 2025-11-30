import { format } from 'date-fns';
import { useRef, useEffect } from 'react';
import { dailyMessages } from '../data/messages';

interface DayModalProps {
    selectedDay: number | null;
    onClose: () => void;
}

export default function DayModal({ selectedDay, onClose }: DayModalProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    // Calcular dayNumber antes de cualquier return condicional
    const selectedDate = selectedDay !== null ? new Date(selectedDay) : null;
    const dayNumber = selectedDate ? selectedDate.getDate() : null;

    // Reproducir video con audio cuando se abre el modal del día 30
    useEffect(() => {
        if (dayNumber === 30 && videoRef.current) {
            const video = videoRef.current;
            const playPromise = video.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        // Si la reproducción es exitosa, activar el audio
                        video.muted = false;
                    })
                    .catch((error) => {
                        // Si falla el autoplay, intentar reproducir sin muted
                        console.log('Autoplay con audio bloqueado, intentando reproducir...');
                        video.muted = false;
                        video.play().catch(() => {
                            console.log('El navegador requiere interacción del usuario para reproducir audio');
                        });
                    });
            }
        }
    }, [dayNumber]);

    if (selectedDay === null || selectedDate === null || dayNumber === null) return null;

    const messageData = dailyMessages[dayNumber] || {
        message: `Día ${dayNumber}: Cada día que pasa me acerca más a ti. 💕`,
        type: 'mensaje' as const
    };

    const icon = dayNumber === 26
        ? '🌹'
        : messageData.type === 'recuerdo'
            ? '💭'
            : messageData.type === 'plan'
                ? '🎯'
                : '💕';

    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full transform transition-all duration-300 animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-center mb-6">
                    <div className="text-5xl mb-4">
                        {icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        {format(selectedDate, "d 'de' MMMM")}
                    </h3>
                    <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700">
                        {messageData.type === 'recuerdo' ? 'Recuerdo Especial' :
                            messageData.type === 'plan' ? 'Plan para Ti' : 'Mensaje de Amor'}
                    </div>
                </div>

                {dayNumber === 26 && (
                    <div className="mb-6 flex justify-center">
                        <video
                            src="/rosa.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="rounded-2xl max-h-80 w-full object-cover"
                        />
                    </div>
                )}

                {dayNumber === 30 && (
                    <div className="mb-6 flex justify-center">
                        <video
                            ref={videoRef}
                            src="/EsHoy.mp4"
                            autoPlay
                            loop
                            playsInline
                            className="rounded-2xl max-h-80 w-full object-cover"
                        />
                    </div>
                )}

                <p className="text-gray-700 text-lg leading-relaxed mb-6 text-center">
                    {messageData.message}
                </p>
                <button
                    onClick={onClose}
                    className="w-full bg-gradient-to-r from-orange-400 to-amber-500 text-white font-bold py-3 px-6 rounded-xl hover:from-orange-500 hover:to-amber-600 transition-all duration-300 transform hover:scale-105"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
}
