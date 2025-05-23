

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
router.route('/delete').post(verify.combine(asyncRoute(verify.general), asyncRoute(verify.admin([roles.ADMIN]))), asyncRoute(uploadCtrl.delete));
router.route('/multi').post(asyncRoute(verify.admin([roles.ADMIN])), asyncRoute(uploadCtrl.multiUploader.fields([
        { name: 'PROGRAM', maxCount: 1 },
        { name: 'LETTER', maxCount: 1 },
        { name: 'COLLECTION', maxCount: 1 },
        { name: 'SAMPLE', maxCount: 1 },
        { name: 'INDIVIDUAL', maxCount: 1 },
        { name: 'LEGAL', maxCount: 1 },
        { name: 'HEADER', maxCount: 1 },
        { name: 'FOOTER', maxCount: 1 },
    ])
), asyncRoute(uploadCtrl.afterMultipleUpload));


export default router;