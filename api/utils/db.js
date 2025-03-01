import { models, sequelize } from '../models/index.js';
import setupAssociations from '../models/setup-associations.js';

// Инициализация моделей в БД, установка связей. При успешном выполнении - сообщение в консоль
export async function initializeDbModels() {
    for (const model of Object.values(models)) if (typeof model.initialize === 'function') model.initialize(sequelize);
    setupAssociations();
    for (const model of Object.values(models)) await model.sync({ alter: true });
    if (process.env.NODE_ENV !== 'test') console.log('models initialized');

}