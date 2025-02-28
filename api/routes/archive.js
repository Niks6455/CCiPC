import { Router } from 'express';
import archiveCtrl from '../controllers/archive.js';
import { asyncRoute } from '../utils/errors.js';
import verify from '../middlewares/verify-token.js'
import roles from "../config/roles.js";
const router = Router();



router.route('/photo')
    .get(asyncRoute(verify.general), asyncRoute(archiveCtrl.findPhoto))
    //.post(asyncRoute(verify.admin([roles.ADMIN])), asyncRoute(committeeCtrl.create))

router.route('/report')
    .get(asyncRoute(archiveCtrl.findReport))

router.route('/').post(asyncRoute(verify.admin([roles.ADMIN])), asyncRoute(archiveCtrl.create))

router.route('/:id')
    .put(asyncRoute(verify.admin(roles.ADMIN)), asyncRoute(archiveCtrl.update))
    .delete(asyncRoute(verify.admin(roles.ADMIN)), asyncRoute(archiveCtrl.delete))

export default router;