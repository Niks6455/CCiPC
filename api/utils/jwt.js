import jwt from 'jsonwebtoken';
import { AppErrorInvalid } from './errors.js';

const issuer = 'CCPC';
const audience = process.env.WEB_URL;

export default {
    generate(payload = {}) {
        if (!payload.iat) payload.iat = Math.round(+new Date() / 1000);
        const access_token = jwt.sign(payload, process.env.JWT_SECRET, { issuer, audience, expiresIn: '15m' } )
        const refresh_token = jwt.sign(payload, process.env.JWT_SECRET, { issuer, audience, expiresIn: '30d' })

        return {
            access_token,
            refresh_token,
            iat: payload.iat,
        };
    },

    verify(res, access_token, refresh_token) {
        try {
            return jwt.verify(access_token, process.env.JWT_SECRET, { issuer, audience });
        } catch (e) {
                const  { access_token: accessToken, refresh_token: refreshToken }  = this.refresh(access_token, refresh_token)
                this.setCookie(res, accessToken, refreshToken);
                return jwt.verify(accessToken, process.env.JWT_SECRET, { issuer, audience });
        }
    },

    refresh(accessToken, refreshToken) {
        try {
            jwt.verify(refreshToken, process.env.JWT_SECRET, { issuer, audience });
            const { id }  = this.decode(refreshToken)
            const { access_token, refresh_token } = this.generate({ id })
            return { access_token, refresh_token }
        } catch (e){
          throw new AppErrorInvalid('refresh_token');
        }
    },


    decode(token) {
        return jwt.decode(token);
    },

    setCookie(res, access_token, refresh_token) {
        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 900000
        });

        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 2592000000
        });
    }
};