import {DataTypes, Model } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export default class Direction extends Model {
    static initialize(sequelize) {
        Direction.init(
            {
                id: { type: DataTypes.UUID, primaryKey: true },
                name: { type: DataTypes.STRING, allowNull: false, unique: 'name' },
            },
            {
                sequelize,
                schema: process.env.NODE_ENV,
                paranoid: false,
                modelName: 'Direction',
                tableName: 'directions',
                timestamps: true,
            },
        );

        Direction.beforeCreate(c => {
            c.id = uuidv4();
        });

        Direction.beforeBulkCreate(c=>{
            for (const participantInConference of c) {
                participantInConference.id=uuidv4()
            }
        })

    }
}