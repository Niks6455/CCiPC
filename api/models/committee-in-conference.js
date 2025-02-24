import {DataTypes, Model} from 'sequelize';
import committee from "../config/committee.js";
import { v4 as uuidv4 } from 'uuid';

export default class CommitteeInConference extends Model {
    static initialize(sequelize) {
        CommitteeInConference.init(
            {
                id: { type: DataTypes.UUID, primaryKey: true },
                type: {
                    type: DataTypes.SMALLINT,
                    allowNull: false,
                    defaultValue: committee.coChairs,
                    validate: { isIn: [Object.values(committee)] },
                },
            },
            {
                sequelize,
                schema: process.env.NODE_ENV,
                modelName: 'CommitteeInConference',
                tableName: 'committee-In-conference',
                timestamps: false,
            }
        );

        CommitteeInConference.beforeCreate(c => {
            c.id = uuidv4();
        });
    }
}