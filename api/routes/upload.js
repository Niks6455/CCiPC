

import { Router } from 'express';
import uploadCtrl from '../controllers/uploads.js';
import { asyncRoute } from '../utils/errors.js';
import verify from '../middlewares/verify-token.js'
import roles from "../config/roles.js";

const router = Router();


/**
 * @swagger
 * /uploads/:
 *   post:
 *     summary: для загрузки файлов
 *     security:
 *       - BearerAuth: [] # Требуется авторизация
 *     consumes:
 *      - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *             required:
 *               - type
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Статус
 *
 */

router.route('/').post(verify.combine(asyncRoute(verify.general), asyncRoute(verify.admin([roles.ADMIN]))), asyncRoute(uploadCtrl.uploader), asyncRoute(uploadCtrl.afterUpload));
router.route('/multi').post(asyncRoute(verify.admin([roles.ADMIN])), asyncRoute(uploadCtrl.multiUploader), asyncRoute(uploadCtrl.afterUpload));


export default router;