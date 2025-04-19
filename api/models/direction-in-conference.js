import { DataTypes, Model } from 'sequelize';

export default class DirectionInConference extends Model {
    static initialize(sequelize) {
        DirectionInConference.init(
            {
                id: { type: DataTypes.UUID, primaryKey: true, unique: true },
            },
            {
                sequelize,
                schema: process.env.NODE_ENV,
                modelName: 'DirectionInConference',
                tableName: 'directions-In-conference',
                timestamps: false,
            }
        )
    }
}