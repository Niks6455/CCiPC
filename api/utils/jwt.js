import jwt from 'jsonwebtoken';

const issuer = 'CCPC';
const audience = process.env.WEB_URL;

export default {
    generate(payload = {}, options = {}) {
        if (!payload.iat) payload.iat = Math.round(+new Date() / 1000);

        return {
            // Создание токена
            jwt: jwt.sign(payload, process.env.JWT_SECRET, { issuer, audience, ...options }),
            iat: payload.iat,
        };
    },
    // Проверка ключа и возвращение декодированного payload
    verify(key) {
        return jwt.verify(key, process.env.JWT_SECRET, { issuer, audience });
    },

    // декодирование токена
    decode(token) {
        return jwt.decode(token);
    },
};