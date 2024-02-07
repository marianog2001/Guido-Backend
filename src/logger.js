import winston from 'winston'
import { isInProduction } from './environment.js'

const customLevels = {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
}

const devTransport = [
    new winston.transports.Console({
        level: 'debug'
    })
]

const prodTransport = [
    new winston.transports.Console({
        level: 'debug'
    }),
    new winston.transports.File({
        filename: './errors.log', level: 'warning'
    })
]

const transports = isInProduction ? prodTransport : devTransport

export const logger = winston.createLogger({
    transports: transports,
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    ),
    levels: customLevels,

})

/* const prodLogger = winston.createLogger({
    transports: [
        new winston.transports.File({
            filename:'./errors.log', level: 'warn'})
    ]
})
 */

export const addLogger = (req, res, next) => {
    req.logger = logger
    req.logger.http(`[${req.method}] ${req.url} - ${new Date().toLocaleTimeString()}`)
    next()
}
