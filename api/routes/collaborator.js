import { asyncRoute } from '../utils/errors.js';
import verify from '../middlewares/verify-token.js';
import roles from '../config/roles.js';
import collaboratorCtrl from '../controllers/collaborator.js';
import { Router } from 'express';
const router = Router();


router.route('/')
  .post(asyncRoute(verify.admin([roles.ADMIN])), asyncRoute(collaboratorCtrl.create))
  .get(asyncRoute(verify.admin([roles.ADMIN])), asyncRoute(collaboratorCtrl.find))

router.route('/:id')
  .put(asyncRoute(verify.admin([roles.ADMIN])), asyncRoute(collaboratorCtrl.update))
  .delete(asyncRoute(verify.admin([roles.ADMIN])), asyncRoute(collaboratorCtrl.delete))
  .get(asyncRoute(verify.admin([roles.ADMIN])), asyncRoute(collaboratorCtrl.findOne))


export default router;