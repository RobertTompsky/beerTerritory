import winston from "winston";

export const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(log => {
                    return `${log.timestamp} - ${log.message}`;
                })
            )
        }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});