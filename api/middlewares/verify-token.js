import jwt from '../utils/jwt.js';
import {AppErrorForbiddenAction, AppErrorInvalid, asyncRoute, SystemError} from '../utils/errors.js';
import Participant from "../models/participant.js";
import rolesCheck from "../config/roles.js";
function admin(roles) {
    if (!roles) throw new SystemError();
    return async (req, res, next) => {

        if(roles === rolesCheck.PUBLIC ) next ()
        const authorization = req.headers.authorization;
        if (authorization?.split(' ')[0] !== 'Bearer') {
            return next(new AppErrorInvalid('token', 401));
        }

        try {
            // Верифицируем токен и сохраняем результат в локальной переменной
            const userId = jwt.verify(authorization.split(' ')[1]).id;

            const admin=await Participant.findByPk(userId)


            if(!admin) return next(new AppErrorInvalid('not activate', 401));

            if (!roles.includes(admin.role))  return next(new AppErrorForbiddenAction());

            // Передаем пользователя через объект `req` в `next()`, не мутируя `req` напрямую
            req.admin=admin
        } catch (e) {
            console.error(e);
            return next(new AppErrorInvalid('token', 401));
        }
        next()
    };
}

function combine(...verifications) {
    return asyncRoute(async (req, res, next) => {

        const results = await Promise.all(
            verifications.map(v =>
                v(req, res, () => {}).then(
                    () => 1,
                    () => undefined
                )
            )
        );

        if (results.filter(Boolean).length) next();
        else throw new AppErrorForbiddenAction();
    });
}


async function general(req, res, next) {
    const authorization = req.headers.authorization;
    console.log(authorization)
    if (authorization?.split(' ')[0] !== 'Bearer') throw new AppErrorInvalid('token', 401);

    try {
        const userId = jwt.verify(authorization.split(' ')[1]).id;

        const user=await Participant.findByPk(userId)

        if(!user || !user.activate) return next(new AppErrorInvalid('not activate', 401));

        req.user = user;
        next()

    } catch (e) {
        console.log(e);
        throw new AppErrorInvalid('token', 401);
    }
}

export default {
    general,
    admin,
    combine
};