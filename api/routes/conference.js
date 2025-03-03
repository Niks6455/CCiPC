

import { Router } from 'express';
import conferenceCtrl from '../controllers/conference.js';
import { asyncRoute } from '../utils/errors.js';
import verify from '../middlewares/verify-token.js'
import roles from "../config/roles.js";
const router = Router();

/**
 * @swagger
 * /conferences/:
 *   post:
 *     summary: Создание конференции
 *     security:
 *       - BearerAuth: [] # Требуется авторизация
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               number:
 *                 type: number
 *               date:
 *                 type: string
 *               address:
 *                 type: string
 *               stages:
 *                 type: array
 *                 items:
 *                   type: object
 *               directions:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - date
 *               - number
 *               - address
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 conference:
 *                   type: object
 *                   description: Информация о конференции
 *   get:
 *     summary: Получение всех конференций
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 conferences:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Информация о конференциях
 *
 * /conferences/{id}/participants:
 *   get:
 *     summary: Получение всех участников конференции
 *     security:
 *       - BearerAuth: [] # Требуется авторизация
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID конференции
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
 *                 participants:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Информация о участниках конференции
 * /conferences/{id}/:
 *   get:
 *     summary: Получение конференции по id
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID конференции
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
 *                 conference:
 *                   type: object
 *                   description: Информация о конференции
 *   put:
 *     summary: Обновление админом конференции по id
 *     security:
 *       - BearerAuth: [] # Требуется авторизация
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               number:
 *                 type: number
 *               date:
 *                 type: string
 *               address:
 *                 type: string
 *               stages:
 *                 type: array
 *                 items:
 *                   type: object
 *               directions:
 *                 type: array
 *                 items:
 *                   type: string
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID конференции
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
 *                 conference:
 *                   type: object
 *                   description: Информация о конференции
 */

router.route('/')
    .get(asyncRoute(conferenceCtrl.find))
    .post(asyncRoute(verify.admin([roles.ADMIN])),asyncRoute(conferenceCtrl.create))



router.route('/:id/participants').get(verify.combine(asyncRoute(verify.admin([roles.ADMIN]), verify.admin([roles.PUBLIC]))), asyncRoute(conferenceCtrl.findParticipants))

router.route('/:id/fee')
    .get(asyncRoute(verify.admin([roles.ADMIN])), asyncRoute(conferenceCtrl.findFee))
    .put(asyncRoute(verify.admin([roles.ADMIN])), asyncRoute(conferenceCtrl.assignFee))

router.route('/:id/saveArchive').get(asyncRoute(verify.admin([roles.ADMIN])), asyncRoute(conferenceCtrl.saveArchive))

router.route('/:id')
    .get(asyncRoute(conferenceCtrl.findOne))
    .put(asyncRoute(verify.admin([roles.ADMIN])), asyncRoute(conferenceCtrl.update))




export default router;