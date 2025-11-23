import { useState, useEffect } from 'react';

// Hook personalizado para evitar problemas de hidratación
export function useClientOnly() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return isClient;
}
