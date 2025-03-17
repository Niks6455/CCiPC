
import { Router } from 'express';
import directionCtrl from '../controllers/direction.js';
import { asyncRoute } from '../utils/errors.js';
import verify from '../middlewares/verify-token.js'
import roles from "../config/roles.js";
const router = Router();

router.route('/')
    .post(asyncRoute(verify.admin([roles.ADMIN])), asyncRoute(directionCtrl.create))
    .get(asyncRoute(directionCtrl.find))

router.route('/:id')
    .put(asyncRoute(verify.admin([roles.ADMIN])), asyncRoute(directionCtrl.update))
    .get(asyncRoute(directionCtrl.findOne))
    .delete(asyncRoute(verify.admin([roles.ADMIN])), asyncRoute(directionCtrl.delete))

export default router