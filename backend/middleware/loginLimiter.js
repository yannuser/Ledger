import rateLimit from 'express-rate-limit'

const loginLimiter = rateLimit({
    windowMs: 60 * 1000, //1 minute
    max: 5, //Limits each IP to 5 login requests per 'window' per minute
    message: {
        message: 'Too many login attempts from this Ip, please try again after'
    },
    // The handler function to execute when max is exceeded
    handler: (req, res, next, options) => {
        console.warn(`Brute force protection triggered by IP: ${req.ip}`);
        res.status(options.statusCode).json(options.message);
    },
    standardHeaders: true,
    legacyHeaders: false
})

module.exports = loginLimiter