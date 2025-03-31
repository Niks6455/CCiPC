import {DataTypes, Model } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import roles from "../config/roles.js";
import bcrypt from "bcrypt";

export default class Participant extends Model {
    static initialize(sequelize) {
        Participant.init(
            {
                id: { type: DataTypes.UUID, primaryKey: true },
                email: { type: DataTypes.STRING, unique: 'email', allowNull: 'false' },
                role: {
                    type: DataTypes.SMALLINT,
                    allowNull: false,
                    defaultValue: 0,
                    validate: { isIn: [Object.values(roles)] },
                },
                activate: {type: DataTypes.BOOLEAN, defaultValue: false },
                name: { type: DataTypes.STRING, allowNull: false },
                surname: { type: DataTypes.STRING, allowNull: false },
                patronymic: { type: DataTypes.STRING, allowNull: true },
                academicTitle: { type: DataTypes.STRING, allowNull: false },
                degree: { type: DataTypes.STRING, allowNull: false },
                position: { type: DataTypes.STRING, allowNull: false },
                organization: { type: DataTypes.STRING, allowNull: false },
                phone: { type: DataTypes.STRING, allowNull: false },
                password: { type: DataTypes.STRING, allowNull: false },
                isMicrosoft: {type: DataTypes.BOOLEAN, defaultValue: false },
            },
            {
                sequelize,
                schema: process.env.NODE_ENV,
                paranoid: false,
                modelName: 'Participant',
                tableName: 'participants',
                timestamps: true,
            }
        );

        Participant.beforeCreate(c => {
            c.id = uuidv4();
        });
    }

    validatePassword(password) {
        return bcrypt.compareSync(password, this.password);
    }
}