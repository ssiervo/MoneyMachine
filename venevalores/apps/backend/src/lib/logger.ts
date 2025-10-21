import winston from 'winston';

const { combine, timestamp, printf, colorize } = winston.format;

const format = combine(
  colorize(),
  timestamp(),
  printf(({ level, message, timestamp: ts }) => `${ts} [${level}] ${message}`),
);

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  transports: [new winston.transports.Console()],
  format,
});

export default logger;
