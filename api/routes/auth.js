

import { Router } from 'express';
import authCtrl from '../controllers/auth.js';
import { asyncRoute } from '../utils/errors.js';
import verify from "../middlewares/verify-token.js";
const router = Router();


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Авторизация пользователя
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
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: yourpassword
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: your_jwt_token
 *                 participant:
 *                   type: object
 *                   description: Информация о пользователе
 *
 * /auth/register:
 *   post:
 *     summary: Регистрация пользователя
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
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: yourpassword
 *               name:
 *                 type: string
 *                 example: Иван
 *               surname:
 *                 type: string
 *                 example: Иванов
 *               patronymic:
 *                 type: string
 *                 example: Иванович
 *               academicTitle:
 *                 type: string
 *                 example: Доктор наук
 *               degree:
 *                 type: string
 *                 example: Кандидат наук
 *               position:
 *                 type: string
 *                 example: Профессор
 *               organization:
 *                 type: string
 *                 example: МГУ
 *               phone:
 *                 type: string
 *                 format: phone
 *                 example: +7-999-123-45-67
 *             required:
 *               - email
 *               - password
 *               - name
 *               - surname
 *               - academicTitle
 *               - degree
 *               - position
 *               - organization
 *               - phone
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
 *                   description: Информация о пользователе
 *
 * /auth/checkEmail:
 *   post:
 *     summary: отправка кода для подтверждения почты или для восстановления пароля
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
 *                 example: user@example.com
 *               code:
 *                 type: string
 *                 example: 123456
 *               type:
 *                  type: string
 *             required:
 *               - email
 *               - code
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
 *                   description: статус
 * /auth/changePassword:
 *   post:
 *     summary: для смены пароля
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               repeatPassword:
 *                  type: string
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - repeatPassword
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
 *                   description: статус
 * /auth/recovery:
 *   post:
 *     summary: восстановление пароля
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               email:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               repeatPassword:
 *                  type: string
 *             required:
 *               - code
 *               - email
 *               - newPassword
 *               - repeatPassword
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
 *                   description: статус
 */

router.route('/login').post(asyncRoute(authCtrl.login));

router.route('/register').post(asyncRoute(authCtrl.register))

router.route('/checkEmail').post(asyncRoute(authCtrl.checkEmail))

router.route('/changePassword').post(asyncRoute(verify.general), asyncRoute(authCtrl.reset));

router.route('/recovery').post(asyncRoute(authCtrl.reset))

router.route('/sandReset').post(asyncRoute(authCtrl.sandCodeChangePassword));

export default router;