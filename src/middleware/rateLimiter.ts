import rateLimit from "express-rate-limit";

export const askLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: { error: "Foram feitos demasiados pedidos num curto espaço temporal. Por favor tenta novamente mais tarde." },
});