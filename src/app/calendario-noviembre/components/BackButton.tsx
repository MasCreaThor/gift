import Link from 'next/link';

export default function BackButton() {
    return (
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
    );
}
