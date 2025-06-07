

import { Router } from 'express';
import participantCtrl from '../controllers/participant.js';
import { asyncRoute } from '../utils/errors.js';
import verify from '../middlewares/verify-token.js'
import passport from 'passport';
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
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Уникальный идентификатор участника
 *                     name:
 *                       type: string
 *                       description: Имя участника
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: Электронная почта участника
 *
 * /participants/:
 *   put:
 *     summary: Обновление личного профиля
 *     security:
 *       - BearerAuth: [] # Требуется авторизация
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "example@example.com"
 *               name:
 *                 type: string
 *                 example: "Иван"
 *               patronymic:
 *                 type: string
 *                 example: "Иванович"
 *               academicTitle:
 *                 type: string
 *                 example: "Доктор наук"
 *               degree:
 *                 type: string
 *                 example: "Кандидат наук"
 *               position:
 *                 type: string
 *                 example: "Преподаватель"
 *               organization.prisma:
 *                 type: string
 *                 example: "Университет"
 *               phone:
 *                 type: string
 *                 example: "+7 (999) 123-45-67"
 *               avatar:
 *                 type: string
 *                 description: null для удаления фотки
 *               accord:
 *                 type: string
 *                 description: null для удаления соглашения
 *               receipt:
 *                 type:  string
 *                 description: null для удаления квитанции
 *               formPay:
 *                 type: string
 *                 description: Наличный или Безналичный
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