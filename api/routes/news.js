

import { Router } from 'express';
import newsCtrl from '../controllers/news.js'
import { asyncRoute } from '../utils/errors.js';
import verify from '../middlewares/verify-token.js'
import roles from "../config/roles.js";
const router = Router();


/**
 * @swagger
 * /news/:
 *   post:
 *     summary: Создание новости
 *     security:
 *       - BearerAuth: [] # Требуется авторизация
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - title
 *               - description
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 news:
 *                   type: object
 *                   description: Информация о новости
 *   get:
 *     summary: Получение всех новостей
 *     parameters:
 *       - name: year
 *         in: query
 *         required: false
 *         description: год новости
 *         schema:
 *           type: string
 *       - name: limit
 *         in: query
 *         required: false
 *         description: limit
 *         schema:
 *           type: number
 *       - name: page
 *         in: query
 *         required: false
 *         description: page
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Успешный ответ
 *
 * /news/{id}/:
 *   get:
 *     summary: Получение новости по id
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID новости
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
 *                 news:
 *                   type: object
 *                   description: Информация о новости
 *                 currentPage:
 *                   type: number
 *                   description: Текущая страница
 *                 limit:
 *                   type: number
 *                   description: Лимит
 *   put:
 *     summary: Обновление новости
 *     security:
 *       - BearerAuth: [] # Требуется авторизация
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID новости
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               img:
 *                  type: Null
 *                  description: для удаления прислать null иначе ничего не будет
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
 *   delete:
 *     summary: Удаление новости
 *     security:
 *       - BearerAuth: [] # Требуется авторизация
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID новости
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
 *                   description: статус
 */


router.route('/')
    .post(asyncRoute(verify.admin([roles.ADMIN])), asyncRoute(newsCtrl.create))
    .get(asyncRoute(newsCtrl.find))

router.route('/:id')
    .put(asyncRoute(verify.admin([roles.ADMIN])), asyncRoute(newsCtrl.update))
    .delete(asyncRoute(verify.admin([roles.ADMIN])), asyncRoute(newsCtrl.delete))
    .get(asyncRoute(newsCtrl.findOne))


export default router;