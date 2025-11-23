import React from 'react';

export default function BackgroundParticles() {
    // Generar posiciones fijas para las partículas
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
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particulas.map((particula, i) => (
                <div
                    key={i}
                    className="absolute w-2 h-2 bg-orange-300 rounded-full animate-float"
                    style={{
                        left: particula.left,
                        top: particula.top,
                        animationDelay: particula.delay,
                        animationDuration: particula.duration
                    }}
                />
            ))}
        </div>
    );
}
