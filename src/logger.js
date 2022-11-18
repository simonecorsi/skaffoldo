import pino from 'pino';
import pretty from 'pino-pretty';

export default pino(
    {
        level: 'debug',
    },
    pretty({
        sync: true,
        ignore: 'time,pid,hostname',
        colorize: true,
    })
);
