export type MessageType = 'recuerdo' | 'plan' | 'mensaje';

export interface DailyMessage {
    message: string;
    type: MessageType;
}

export const dailyMessages: { [key: number]: DailyMessage } = {
    13: {
        message: '13, Hoy es nuestro día especial, no lo olvide jijiji. Cada mes este número me recuerda lo afortunado que soy de tener una princesa Fiona. 💕',
        type: 'mensaje'
    },
    14: {
        message: 'Solo faltan unos días más para darte un abracito. Y adivina que, aun no tengo planes 😓',
        type: 'plan'
    },
    15: {
        message: 'Recuerdo cuando te veia por la ventana jijiji. Estaba echandote un ojito por si te caias yo te iba a levantar. 🍂',
        type: 'recuerdo'
    },
    16: {
        message: 'Ya tengo un plan, iremos al otro lugar que te mencionaba cuando era niño 🎯',
        type: 'plan'
    },
    17: {
        message: 'Ya faltan 8 dias para cojerte y darte un abrazo jijiji. 🫣😁 💫',
        type: 'mensaje'
    },
    18: {
        message: 'Hoy no hay mensaje, no hay sistema, intentelo mañana por favor. 😂',
        type: 'mensaje'
    },
    19: {
        message: 'Tengo una sorpresa preparada para cuando llegues. No puedo decirte qué es todavía.😏 🎁',
        type: 'plan'
    },
    20: {
        message: 'Princesa Fiona, recuerda que aunque no lo diga mucho sabes que te amo mucho. 💕',
        type: 'mensaje'
    },
    21: {
        message: 'Recuerdas cuando bailamos esa noche. Pues yo no jijij',
        type: 'recuerdo'
    },
    22: {
        message: 'Plan random, cocinar algo rico para ti 🍝',
        type: 'plan'
    },
    23: {
        message: 'Estoy contando las horas, los minutos, los segundos, pero se hace mas lento jum. 🫣',
        type: 'mensaje'
    },
    24: {
        message: '¡Hoy debias haber viajado! jumm. Enojado 😒',
        type: 'plan'
    },
    25: {
        message: '¡Ya casi! Solo falta una semana más. Aguanta un poquito más mi amor. 💕',
        type: 'mensaje'
    },
    26: {
        message: 'Una flor para la princesa Fiona 🌹',
        type: 'recuerdo'
    },
    27: {
        message: 'Tengo una lista de canciones para escuchar juntos. 🎵',
        type: 'plan'
    },
    28: {
        message: 'Cada vez que veo el reloj y son las 11:11, pido el mismo deseo: Tú, jijiji ✨',
        type: 'mensaje'
    },
    29: {
        message: '¡Hoy viajas en la noche! ¡Qué emoción! Espero que tengas todo listo. Te estaré esperando. Ño, mentiras, ño cuedo, tu debes venir a verme al trabajo😞',
        type: 'plan'
    },
    30: {
        message: '¡ES HOY, ES HOY! ¡Por fin! Si estas leyendo esto es porque Dios lo ha permitido. 💕✨',
        type: 'mensaje'
    }
};
