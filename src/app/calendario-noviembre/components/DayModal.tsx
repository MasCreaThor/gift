import { format } from 'date-fns';
import { dailyMessages } from '../data/messages';

interface DayModalProps {
    selectedDay: number | null;
    onClose: () => void;
}

export default function DayModal({ selectedDay, onClose }: DayModalProps) {
    if (selectedDay === null) return null;

    const selectedDate = new Date(selectedDay);
    const dayNumber = selectedDate.getDate();
    const messageData = dailyMessages[dayNumber] || {
        message: `Día ${dayNumber}: Cada día que pasa me acerca más a ti. 💕`,
        type: 'mensaje' as const
    };

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
                        {messageData.type === 'recuerdo' ? '💭' :
                            messageData.type === 'plan' ? '🎯' : '💕'}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        {format(selectedDate, "d 'de' MMMM")}
                    </h3>
                    <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700">
                        {messageData.type === 'recuerdo' ? 'Recuerdo Especial' :
                            messageData.type === 'plan' ? 'Plan para Ti' : 'Mensaje de Amor'}
                    </div>
                </div>
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
