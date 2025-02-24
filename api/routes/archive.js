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

export default router;