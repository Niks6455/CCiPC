import { Sequelize } from 'sequelize';

import Participant from "./participant.js";
import Conference from "./conference.js"
import Report from "./report.js";
import ParticipantInConference from "./participant-in-conference.js";
import News from "./news.js";
import Committee from "./committee.js";
import CommitteeInConference from "./committee-in-conference.js";
import Archive from "./archive.js";
import ParticipantOfReport from "./participant-of-report.js";
import 'dotenv/config'


const { DB_NAME,DB_USER, DB_PWD, DB_HOST, DB_PORT } = process.env;

export const models = {
   Participant,
   Report,
   Conference,
   ParticipantInConference,
   News,
   Committee,
   CommitteeInConference,
   Archive,
   ParticipantOfReport
};

// Подключение к БД с парамтрами из .env
export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PWD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    dialectOptions: { multipleStatements: true },
    define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
        timestamps: true,
        underscored: true,
    },
    logging: false,
});