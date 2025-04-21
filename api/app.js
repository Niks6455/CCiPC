import express from 'express';
import logger from 'morgan';
import { MulterError } from 'multer';
import { createTestAdmin, initializeDbModels } from './utils/db.js';
import { AppError, MultipleError, SystemError } from './utils/errors.js';
import uploadsRoute from './routes/upload.js';
import authRoute from './routes/auth.js';
import reportRoute from './routes/report.js';
import conferenceRoute from './routes/conference.js'
import participantRoute from './routes/participant.js'
import newsRoute from './routes/news.js';
import committeeRoute from './routes/committee.js'
import archiveRoute from './routes/archive.js'
import directionRoute from './routes/direction.js'
import swaggerUi from 'swagger-ui-express'
import swaggerJsDoc from 'swagger-jsdoc'

import corsMiddleware from './middlewares/cors.js';
import errorCodes from './config/error-codes.js';
import 'dotenv/config'


import cookieParser from 'cookie-parser';

const app = express();

logger.token('body', req => {
    try {
        if (req.method === 'POST' || req.method === 'PUT') {
            return JSON.stringify(req.body);
        } else {
            return null;
        }
    } catch (e) {
        return `Body parse error ${e?.message ?? e}`;
    }
});

if (app.get('env') === 'production') {
    app.use(
        logger('[:date[clf]] :method :url :status :response-time ms', {
            skip: req => ['/system', '/uploads'].includes(req.baseUrl),
        })
    );
} else {
    app.use(
        logger('[:date[clf]] :method :url :status :body :response-time ms', {
            skip: req => ['/system', '/uploads'].includes(req.baseUrl),
        })
    );
}


const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0', // Версия OpenAPI
        info: {
            title: 'API Documentation', // Заголовок документации
            version: '1.0.0', // Версия API
            description: 'API для примера использования Swagger', // Описание
        },
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'Bearer',
                    bearerFormat: 'JWT', // Формат токена
                },
            },
        },
        servers: [
            {
                url: 'http://localhost:3000', // URL вашего сервера
            },
        ],
    },
    apis: ['./routes/*.js'], // Путь к файлам с аннотациями
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ==== on server start functions
(async function initDb() {
    try {

        await initializeDbModels();

        await createTestAdmin();

    } catch (e) {
        if (app.get('env') !== 'test') {
            console.log(e);
            console.log('COULD NOT CONNECT TO THE DB, retrying in 5 seconds');
        }
        setTimeout(initDb, 5000);
    }
})();
// ====

// CronJob section //
if (app.get('env') === 'production') {

}
if (app.get('env') === 'development' || app.get('env') === 'staging') {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}
// ============== //

app.use(corsMiddleware);

//app.use('/system', systemRoute);
app.use('/auth', authRoute);
app.use("/uploads", express.static("./uploads"), uploadsRoute);
app.use('/reports', reportRoute)
app.use('/conferences', conferenceRoute);
app.use('/participants', participantRoute);
app.use('/news', newsRoute)
app.use('/committees', committeeRoute)
app.use('/archive', archiveRoute)
app.use('/directions', directionRoute)

// Handle 404 AND 500
app
    .use((req, res) => res.status(404).json({ type: 'NOT FOUND', code: 404 }))
    // eslint-disable-next-line no-unused-vars
    .use((error, req, res, next) => {
        if (error instanceof AppError || error instanceof SystemError || error instanceof MultipleError) {
            console.log("err", error)
            res.status(error.status).json(error.toJSON());
        } else if (error instanceof MulterError && error.code === 'LIMIT_FILE_SIZE') {
            const error = new AppError(errorCodes.FileTooLarge);
            res.status(error.status).json(error.toJSON());
        } else if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else if (error) {
            res.status(500).json(error);
        } else {
            res.status(500).json({ message: 'INTERNAL SERVER ERROR' });
        }
    });

app.listen(process.env.PORT || 3000, () => console.log(`Listen on :${process.env.PORT || 3000}`));