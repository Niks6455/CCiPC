import { Router } from 'express';
import archiveCtrl from '../controllers/archive.js';
import { asyncRoute } from '../utils/errors.js';
import verify from '../middlewares/verify-token.js'
import roles from "../config/roles.js";
const router = Router();

/**
 * @swagger
 * /archive/:
 *   post:
 *     summary: Создание архива
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
 *               type:
 *                 type: number
 *                 description: 0 - архив фото, 1 - архив докладов
 *               url:
 *                 type: string
 *             required:
 *               - name
 *               - type
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 archive:
 *                   type: object
 *                   description: Информация о архиве
 *
 * /archive/photo:
 *   get:
 *     summary: Получение всех архивов фото
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
 *                 archives:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Все архивы фоток
 *
 * /archive/report:
 *   get:
 *     summary: Получение всех сборников
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 archives:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Все сборники
 *
 * /archive/{id}/:
 *   put:
 *     summary: Обновление сборника или архива
 *     security:
 *       - BearerAuth: [] # Требуется авторизация
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID архива или сборника
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: number
 *               url:
 *                 type: string
 *               file:
 *                 type: null
 *                 description: для удаления файла
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Обновленный сборник или архив фото
 *
 *   delete:
 *     summary: Удаление сборника или архива фоток
 *     security:
 *       - BearerAuth: [] # Требуется авторизация
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID архива или сборника
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
 *                   description: Статус удаления
 */

router.route('/photo')
    .get(asyncRoute(verify.general), asyncRoute(archiveCtrl.findPhoto))

router.route('/report')
    .get(asyncRoute(archiveCtrl.findReport))

router.route('/').post(asyncRoute(verify.admin([roles.ADMIN])), asyncRoute(archiveCtrl.create))

router.route('/:id')
    .put(asyncRoute(verify.admin([roles.ADMIN])), asyncRoute(archiveCtrl.update))
    .delete(asyncRoute(verify.admin([roles.ADMIN])), asyncRoute(archiveCtrl.delete))

export default router;