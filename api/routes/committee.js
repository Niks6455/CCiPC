
import { Router } from 'express';
import committeeCtrl from '../controllers/committee.js';
import { asyncRoute } from '../utils/errors.js';
import verify from '../middlewares/verify-token.js'
import roles from "../config/roles.js";
const router = Router();

/**
 * @swagger
 * /committees/:
 *   post:
 *     summary: Создание сотрудника
 *     security:
 *       - BearerAuth: [] # Требуется авторизация
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               conferenceId:
 *                 type: string
 *                 format: uuid
 *               fio:
 *                 type: string
 *               organization:
 *                 type: string
 *               type:
 *                 type: number
 *             required:
 *               - organization
 *               - fio
 *               - type
 *               - conferenceId
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
 *                   properties:
 *                      status:
 *                          type: string
 *                          description: Статус
 *   get:
 *     summary: Получение всех сотрудников конфиренции
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
 *                     description: Информация о сотрудниках
 *
 * /committees/{id}/:
 *   put:
 *     summary: Обновление сотрудника конференции
 *     security:
 *       - BearerAuth: [] # Требуется авторизация
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID сотрудника
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
 *               fio:
 *                 type: string
 *               organization:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  committee:
 *                   type: object
 *                   description: Информация о сотруднике
 *   delete:
 *     summary: удаление сотрудника по id из какого-то коммитета
 *     security:
 *       - BearerAuth: [] # Требуется авторизация
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID сотрудника по определенному типу комитета
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
    .get(asyncRoute(committeeCtrl.find))
    .post(asyncRoute(verify.admin([roles.ADMIN])), asyncRoute(committeeCtrl.create))

router.route('/:id')
    .put(asyncRoute(verify.admin([roles.ADMIN])), asyncRoute(committeeCtrl.update))
    .delete(asyncRoute(verify.admin([roles.ADMIN])), asyncRoute(committeeCtrl.delete))

export default router;