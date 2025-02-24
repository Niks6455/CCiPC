

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
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               patronymic:
 *                 type: string
 *               academicTitle:
 *                 type: string
 *               degree:
 *                  type: string
 *               position:
 *                  type: string
 *               organization:
 *                  type: string
 *               phone:
 *                  type: string
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
 *                     description: Информация о участнике
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
    .get(asyncRoute(verify.general), asyncRoute(participantCtrl.self))
    .delete(asyncRoute(verify.general), asyncRoute(participantCtrl.delete));



router.route('/checkEmail')
    .get(asyncRoute(verify.general), asyncRoute(participantCtrl.findByEmail))


export default router;