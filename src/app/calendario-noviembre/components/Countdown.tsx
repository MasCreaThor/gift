import { format } from 'date-fns';
import FlipNumber from './FlipNumber';
import { Calendar, Clock, Heart, Plane, Sparkles, Loader2 } from 'lucide-react';

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
        <div className="relative group w-full max-w-4xl mx-auto">
            {/* Efecto de resplandor trasero */}
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-amber-600 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>

            <div className="relative bg-white/90 backdrop-blur-xl rounded-[1.5rem] p-6 md:p-8 shadow-2xl border border-white/50 mb-6 w-full animate-fadeIn ring-1 ring-orange-100">
                <div className="text-center">
                    {/* Icono Principal */}
                    <div className="relative inline-block mb-4">
                        <div className="absolute inset-0 bg-orange-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
                        <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 duration-300">
                            <Calendar className="w-8 h-8 md:w-10 md:h-10 text-white" />
                            <div className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-md">
                                <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-bounce" />
                            </div>
                        </div>
                    </div>

                    {/* Título */}
                    <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600 mb-2 tracking-tight">
                        Cuenta Regresiva
                    </h1>

                    {/* Descripción */}
                    <p className="text-base md:text-lg text-gray-600 mb-6 leading-relaxed font-light max-w-xl mx-auto">
                        Cada segundo que pasa es un segundo menos para tenerte entre mis brazos.
                        <span className="block mt-1 text-orange-500 font-medium flex items-center justify-center gap-2 text-sm md:text-base">
                            <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                            Esperando al amor de mi vida
                            <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                        </span>
                    </p>

                    {/* Contador elegante */}
                    <div className="bg-gradient-to-br from-orange-50/50 to-amber-50/50 rounded-2xl p-6 border border-orange-100/50 shadow-inner mb-6">
                        {isLoading ? (
                            <div className="py-10 flex flex-col items-center justify-center space-y-3">
                                <Loader2 className="w-8 h-8 md:w-10 md:h-10 text-orange-500 animate-spin" />
                                <p className="text-orange-600/70 font-medium tracking-wide animate-pulse text-sm">Sincronizando tiempo...</p>
                            </div>
                        ) : !isFinished ? (
                            <>
                                <div className="mb-6">
                                    <div className="inline-flex items-center justify-center gap-2 bg-white/80 px-4 py-1.5 rounded-full shadow-sm border border-orange-100 mb-4">
                                        <Clock className="w-4 h-4 text-orange-500" />
                                        <span className="text-orange-800 font-medium text-sm">Tiempo Restante</span>
                                    </div>

                                    <div className="flex flex-col items-center justify-center">
                                        <div className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-500 to-amber-600 leading-none mb-1 drop-shadow-sm">
                                            {timeRemaining.days}
                                        </div>
                                        <div className="text-lg md:text-xl font-medium text-orange-400 uppercase tracking-widest">
                                            {timeRemaining.days === 1 ? 'Día' : 'Días'}
                                        </div>
                                    </div>
                                </div>

                                {/* Contador de tiempo detallado */}
                                <div className="grid grid-cols-3 gap-3 md:gap-6 max-w-lg mx-auto">
                                    {[
                                        { label: 'Horas', value: timeRemaining.hours },
                                        { label: 'Minutos', value: timeRemaining.minutes },
                                        { label: 'Segundos', value: timeRemaining.seconds }
                                    ].map((item, index) => (
                                        <div key={item.label} className="group relative">
                                            <div className="absolute inset-0 bg-orange-200 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                                            <div className="relative bg-white rounded-xl p-3 md:p-4 shadow-lg border border-orange-50 transform transition duration-300 group-hover:-translate-y-1">
                                                <div className="mb-2 min-h-[2.5rem] md:min-h-[3.5rem] flex items-center justify-center overflow-hidden">
                                                    <FlipNumber value={String(item.value).padStart(2, '0')} />
                                                </div>
                                                <div className="text-[10px] md:text-xs text-gray-400 font-semibold uppercase tracking-wider text-center">
                                                    {item.label}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="py-8 animate-bounce-slow">
                                <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
                                    <Plane className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
                                </div>
                                <div className="text-3xl md:text-5xl font-black text-green-500 mb-2 tracking-tight">
                                    ¡BIENVENIDA! 🎉
                                </div>
                                <p className="text-lg md:text-xl text-gray-600 font-light">
                                    Mi mundo está completo otra vez.
                                    <span className="block mt-1 font-medium text-green-600">Te amo infinitamente 💕</span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Fecha de llegada */}
                    <div className="pt-4 border-t border-orange-100 flex items-center justify-center gap-2 text-gray-500">
                        <Plane className="w-4 h-4 text-orange-400" />
                        <span className="text-xs md:text-sm font-light">
                            Llegada estimada: <span className="font-semibold text-orange-600">
                                {arrivalDate && !isNaN(arrivalDate.getTime())
                                    ? format(arrivalDate, "d 'de' MMMM, yyyy")
                                    : '1 de diciembre, 2025'
                                }
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
