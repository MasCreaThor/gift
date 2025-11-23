import { useState, useEffect, useMemo, useCallback } from 'react';
import { utcToColombiaTime, toColombiaTime, calculateTimeRemaining, createColombiaDate } from '../utils/dateUtils';

export function useServerTime() {
    const [serverTimeOffset, setServerTimeOffset] = useState<number | null>(null);
    const [clientStartTime, setClientStartTime] = useState<number | null>(null);
    const [currentTime, setCurrentTime] = useState<Date | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [timeRemaining, setTimeRemaining] = useState(() => ({ days: 0, hours: 0, minutes: 0, seconds: 0 }));

    // Fechas en zona horaria de Colombia
    // 1 de diciembre de 2025 a las 00:00:00 hora de Colombia
    const arrivalDate = useMemo(() => {
        const date = createColombiaDate(2025, 11, 1, 0, 0, 0);
        if (isNaN(date.getTime())) {
            console.error('Error creando arrivalDate, usando fecha local');
            return new Date(2025, 11, 1, 0, 0, 0);
        }
        return date;
    }, []);

    // 13 de noviembre de 2025 a las 00:00:00 hora de Colombia
    const startDate = useMemo(() => {
        const date = createColombiaDate(2025, 10, 13, 0, 0, 0);
        if (isNaN(date.getTime())) {
            console.error('Error creando startDate, usando fecha local');
            return new Date(2025, 10, 13, 0, 0, 0);
        }
        return date;
    }, []);

    // Obtener la hora actual considerando la hora del servidor
    const getCurrentColombiaTime = useCallback((): Date => {
        if (serverTimeOffset === null || clientStartTime === null) {
            // Si aún no tenemos la hora del servidor, usar la hora local como fallback
            return toColombiaTime(new Date());
        }

        // Calcular el tiempo transcurrido desde que obtuvimos la hora del servidor
        const elapsed = Date.now() - clientStartTime;
        // La hora actual en Colombia = hora del servidor + tiempo transcurrido
        return new Date(serverTimeOffset + elapsed);
    }, [serverTimeOffset, clientStartTime]);

    // Obtener la hora del servidor al cargar
    useEffect(() => {
        const fetchServerTime = async () => {
            try {
                const response = await fetch('/api/current-time', { cache: 'no-store' });
                const data = await response.json();
                // El servidor devuelve la hora UTC
                const utcTime = new Date(data.timestamp);
                // Convertir a hora de Colombia (UTC-5)
                const colombiaTime = utcToColombiaTime(utcTime);
                setServerTimeOffset(colombiaTime.getTime());
                setClientStartTime(Date.now());
                setCurrentTime(colombiaTime);
                setTimeRemaining(calculateTimeRemaining(colombiaTime, arrivalDate));
            } catch (error) {
                console.error('Error obteniendo hora del servidor:', error);
                // Fallback a hora local convertida a Colombia si falla la API
                const localTime = toColombiaTime(new Date());
                setServerTimeOffset(localTime.getTime());
                setClientStartTime(Date.now());
                setCurrentTime(localTime);
                setTimeRemaining(calculateTimeRemaining(localTime, arrivalDate));
            } finally {
                setIsLoading(false);
            }
        };

        fetchServerTime();
    }, [arrivalDate]);

    // Actualizar tiempo cada segundo
    useEffect(() => {
        if (serverTimeOffset === null || clientStartTime === null) {
            return;
        }

        const timer = setInterval(() => {
            const now = getCurrentColombiaTime();
            setCurrentTime(now);
            setTimeRemaining(calculateTimeRemaining(now, arrivalDate));
        }, 1000);

        return () => clearInterval(timer);
    }, [serverTimeOffset, clientStartTime, arrivalDate, getCurrentColombiaTime]);

    return {
        currentTime,
        timeRemaining,
        arrivalDate,
        startDate,
        getCurrentColombiaTime,
        isLoading
    };
}
