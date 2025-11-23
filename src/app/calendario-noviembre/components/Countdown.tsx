import { format } from 'date-fns';
import FlipNumber from './FlipNumber';

interface CountdownProps {
    timeRemaining: {
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    };
    arrivalDate: Date;
    isLoading: boolean;
}

export default function Countdown({ timeRemaining, arrivalDate, isLoading }: CountdownProps) {
    const isFinished = !isLoading &&
        timeRemaining.days <= 0 &&
        timeRemaining.hours <= 0 &&
        timeRemaining.minutes <= 0 &&
        timeRemaining.seconds <= 0;

    return (
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
                    {isLoading ? (
                        <div className="py-12 flex flex-col items-center justify-center">
                            <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-500 font-medium">Sincronizando tiempo...</p>
                        </div>
                    ) : !isFinished ? (
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
                                : '1 de diciembre, 2025'
                            }
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
