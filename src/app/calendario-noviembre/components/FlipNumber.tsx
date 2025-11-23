import { useState, useEffect } from 'react';

// Componente para mostrar números con efecto de flip
export default function FlipNumber({ value, className }: { value: string; className?: string }) {
    const [displayValue, setDisplayValue] = useState(value);
    const [isFlipping, setIsFlipping] = useState(false);
    const [prevValue, setPrevValue] = useState(value);
    const [key, setKey] = useState(0);

    useEffect(() => {
        if (value !== prevValue) {
            setIsFlipping(true);
            setKey(prev => prev + 1);

            // Después de la mitad de la animación, cambiar el valor
            const timer = setTimeout(() => {
                setDisplayValue(value);
                setPrevValue(value);
            }, 300); // La mitad de la animación de 0.6s

            // Resetear el estado de flip después de la animación
            const resetTimer = setTimeout(() => {
                setIsFlipping(false);
            }, 600);

            return () => {
                clearTimeout(timer);
                clearTimeout(resetTimer);
            };
        }
    }, [value, prevValue]);

    return (
        <div className={`relative inline-block w-full ${className || ''}`}>
            <div className={`flip-number-container relative ${isFlipping ? 'flipping' : ''}`} key={key}>
                <div className="relative w-full h-full flex items-center justify-center">
                    {/* Valor anterior (sale) */}
                    {isFlipping && (
                        <div className="flip-number-old">
                            <span className="text-3xl md:text-4xl font-bold text-orange-500 drop-shadow-sm">
                                {prevValue}
                            </span>
                        </div>
                    )}
                    {/* Valor nuevo (entra) */}
                    <div className={`${isFlipping ? 'flip-number-new' : ''}`}>
                        <span className="text-3xl md:text-4xl font-bold text-orange-500 drop-shadow-sm">
                            {displayValue}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
