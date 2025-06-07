import jwt from '../utils/jwt.js';
import {AppErrorForbiddenAction, AppErrorInvalid, asyncRoute, SystemError} from '../utils/errors.js';
import Participant from "../models/participant.js";
import rolesCheck from "../config/roles.js";

function admin(roles) {
    if (!roles) throw new SystemError();
    return async (req, res, next) => {

        if(roles === rolesCheck.PUBLIC ) next ()
        const token = req.cookies.jwt;
        if (!token) return next(new AppErrorInvalid('token', 401));

        try {
            const userId = jwt.verify(token).id;

            const admin=await Participant.findByPk(userId)

            if(!admin) return next(new AppErrorInvalid('not activate', 401));

            if (!roles.includes(admin.role))  return next(new AppErrorForbiddenAction());

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

    const token = req.cookies.jwt;
    if (!token) throw new AppErrorInvalid('token', 401);

    try {
        const userId = jwt.verify(token).id

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
    combine,

};