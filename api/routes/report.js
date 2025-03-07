

import { Router } from 'express';
import reportCtrl from '../controllers/report.js';
import { asyncRoute } from '../utils/errors.js';
import verify from '../middlewares/verify-token.js'
import roles from "../config/roles.js";
const router = Router();

/**
 * @swagger
 * /reports/:
 *   get:
 *     summary: Получение своих докладов
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
 *                 reports:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Информация о докладах
 *   post:
 *     summary: Создание доклада
 *     security:
 *       - BearerAuth: [] # Требуется авторизация
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               form:
 *                 type: string
 *               direction:
 *                 type: string
 *               comment:
 *                 type: string
 *               coAuthors:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - name
 *               - form
 *               - direction
 *               - comment
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
 * /reports/directions:
 *   put:
 *     summary: Обновление направлений у докладов админом
 *     security:
 *       - BearerAuth: [] # Требуется авторизация
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reportsInfo:
 *                 type: array
 *                 items:
 *                   type: object
 *             required:
 *               - reportsInfo
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reports:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Информация о докладах
 * /reports/{id}/:
 *   get:
 *     summary: Получение данных о докладе
 *     security:
 *       - BearerAuth: [] # Требуется авторизация
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID доклада
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 report:
 *                   type: object
 *                   description: Информация о докладе
 *   put:
 *     summary: Обновление данных о докладе
 *     security:
 *       - BearerAuth: [] # Требуется авторизация
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID доклада
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               form:
 *                 type: string
 *               direction:
 *                 type: string
 *               status:
 *                  type: string
 *               comment:
 *                 type: string
 *               coAuthors:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 report:
 *                   type: object
 *                   description: Информация о докладе
 *   delete:
 *     summary: Удаление доклада
 *     security:
 *       - BearerAuth: [] # Требуется авторизация
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID доклада
 *         schema:
 *           type: string
 *           format: uuid
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
 */

router.route('/')
    .post(asyncRoute(verify.general), asyncRoute(reportCtrl.create))
    .get(asyncRoute(verify.general), asyncRoute(reportCtrl.find))

router.route('/directions')
    .put(asyncRoute(verify.admin([roles.ADMIN])), asyncRoute(reportCtrl.updateDirections))


router.route('/:id')
    .put(verify.combine(asyncRoute(verify.general), asyncRoute(verify.admin([roles.ADMIN]))), asyncRoute(reportCtrl.update))
    .delete(asyncRoute(verify.general), asyncRoute(reportCtrl.delete))
    .get(asyncRoute(verify.general), asyncRoute(reportCtrl.findOne));


export default router;