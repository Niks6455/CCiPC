import { models, sequelize } from "../models/index.js";
import setupAssociations from "../models/setup-associations.js";
import bcrypt from 'bcrypt';

export async function initializeDbModels() {
  for (const model of Object.values(models))
  if (typeof model.initialize === "function") model.initialize(sequelize);
  setupAssociations();
  for (const model of Object.values(models)) await model.sync({ alter: true });

  if (process.env.NODE_ENV !== "test") {
    console.log("models initialized");
  }
}

export async function createTestAdmin() {
  const user = await models.Participant.findOne({ where: { email: 'admin@sfedu.ru', role: 1 } });
  if (user) return;

  await models.Participant.create({ email: 'admin@sfedu.ru', password: bcrypt.hashSync('dfDk1oQQ6YGV@', 10), role: 1, activate: true,
    name: 'admin',
    surname: 'admin',
    academicTitle: 'Не выбрано',
    degree: 'Не выбрано',
    position: 'Не выбрано',
    organization: 'СКБ',
    phone: '+79185558467'
  });
  console.log('Test admin created');
}
