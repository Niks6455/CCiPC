

import { Router } from 'express';
import participantCtrl from '../controllers/participant.js';
import { asyncRoute } from '../utils/errors.js';
import verify from '../middlewares/verify-token.js'
const router = Router();

/**
 * @swagger
 * /participants/self/:
 *   get:
 *     summary: Личный профиль
 *     security:
 *       - BearerAuth: [] # Требуется авторизация
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 participant:
 *                   type: object
 *                   description: Информация о участнике
 *
 * /participants/:
 *   put:
 *     summary: Обновление личного профиля
 *     security:
 *       - BearerAuth: [] # Требуется авторизация
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 participants:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Информация о участниках конференции
 *
 * /participants/checkEmail:
 *   get:
 *     summary: Получение данных по почте
 *     security:
 *       - BearerAuth: [] # Требуется авторизация
 *     parameters:
 *       - name: email
 *         in: query
 *         required: true
 *         description: Email пользователя
 *         schema:
 *           type: string
 *           format: email
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 participant:
 *                   type: object
 *                   description: Информация о участнике
 */

router.route('/')
    .put(asyncRoute(verify.general), asyncRoute(participantCtrl.update))

router.route('/self')
    .get(asyncRoute(verify.general), asyncRoute(participantCtrl.self));


router.route('/checkEmail')
    .get(asyncRoute(verify.general), asyncRoute(participantCtrl.findByEmail))


export default router;