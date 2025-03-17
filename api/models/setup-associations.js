import { models } from './index.js';
const { Participant, Report, Conference, ParticipantInConference, Direction, DirectionInConference, Committee, CommitteeInConference, ParticipantOfReport } = models;

export default function () {


    Direction.belongsToMany(Conference, {
        through: DirectionInConference,
        foreignKey: {name: 'directionId', allowNull: false},
        as: 'conferences'
    })

    Conference.belongsToMany(Direction, {
        through: DirectionInConference,
        foreignKey: {name: 'conferenceId', allowNull: false},
        as: 'directions'
    })


    Direction.hasMany(DirectionInConference, {
        as: 'directionInConference',
        foreignKey: { name: 'directionId', allowNull: false},
    })

    Conference.hasMany(DirectionInConference, {
        as: 'directionInConference',
        foreignKey: { name: 'conferenceId', allowNull: false }
    });


    DirectionInConference.belongsTo(Conference, {
        as: 'conference',
        foreignKey: { name: 'conferenceId', allowNull: false }
    });


    DirectionInConference.belongsTo(Direction, {
        as: 'direction',
        foreignKey: { name: 'directionId', allowNull: false }
    });


    Participant.belongsToMany(Report, {
        through: ParticipantOfReport,
        foreignKey: { name: 'participantId', allowNull: false},
        as: 'reports',
    })

    Report.belongsToMany(Participant, {
        through: ParticipantOfReport,
        foreignKey: { name: 'reportId', allowNull: false},
        as: 'participants',
    })

    Participant.hasMany(ParticipantOfReport, {
        as: 'participantOfReport',
        foreignKey: { name: 'participantId', allowNull: false},
    })

    Report.hasMany(ParticipantOfReport, {
        as: 'participantOfReport',
        foreignKey: { name: 'reportId', allowNull: false }
    });


    ParticipantOfReport.belongsTo(Participant, {
        as: 'participant',
        foreignKey: { name: 'participantId', allowNull: false }
    });


    ParticipantOfReport.belongsTo(Report, {
        as: 'report',
        foreignKey: { name: 'reportId', allowNull: false }
    });

    Conference.belongsToMany(Participant, {
        through: ParticipantInConference,
        foreignKey: { name: 'conferenceId', allowNull: false},
        as: 'participants',

    });
    Participant.belongsToMany(Conference, {
        through: ParticipantInConference,
        foreignKey: { name: 'participantId', allowNull: false},
        as: 'conferences',
    });


    Participant.hasMany(ParticipantInConference, {
        as: 'participantInConference',
        foreignKey: { name: 'participantId', allowNull: false }
    });


    Conference.hasMany(ParticipantInConference, {
        as: 'participantInConference',
        foreignKey: { name: 'conferenceId', allowNull: false }
    });


    ParticipantInConference.belongsTo(Participant, {
        as: 'participant',
        foreignKey: { name: 'participantId', allowNull: false }
    });


    ParticipantInConference.belongsTo(Conference, {
        as: 'conference',
        foreignKey: { name: 'conferenceId', allowNull: false }
    });


    Conference.belongsToMany(Committee, {
        through: {
            model: CommitteeInConference,
            unique: false, // Убираем уникальность
        },
        foreignKey: { name: 'conferenceId', allowNull: false},
        as: 'committees',

    });
    Committee.belongsToMany(Conference, {
        through: {
            model: CommitteeInConference,
            unique: false, // Убираем уникальность
        },
        foreignKey: { name: 'committeeId', allowNull: false},
        as: 'conferences',
    });


    CommitteeInConference.belongsTo(Committee, {
        as: 'committee',
        foreignKey: { name: 'committeeId', allowNull: false },
    });


    CommitteeInConference.belongsTo(Conference, {
        as: 'conference',
        foreignKey: { name: 'conferenceId', allowNull: false  },
    });


    Committee.hasMany(CommitteeInConference, {
        as: 'committeeInConference', // Название ассоциации
        foreignKey: 'committeeId', // Внешний ключ в таблице CommitteeInConference
    });


    Conference.hasMany(CommitteeInConference, {
        as: 'committeeInConference', // Название ассоциации
        foreignKey: 'conferenceId', // Внешний ключ в таблице CommitteeInConference
    });


    /*Participant.hasMany(Report, { foreignKey: { name: 'participantId', allowNull: true }, as: 'reports' });
    Report.belongsTo(Participant, { foreignKey: { name: 'participantId', allowNull: true }, as: 'participant' });*/

    Direction.hasMany(Report, {foreignKey: {name: 'directionId', allowNull: false}, as: 'reports' })
    Report.belongsTo(Direction, { foreignKey: { name: 'directionId', allowNull: false }, as: 'direction' });

    Conference.hasMany(Report, { foreignKey: { name: 'conferenceId', allowNull: true }, as: 'reports' });
    Report.belongsTo(Conference, { foreignKey: { name: 'conferenceId', allowNull: true }, as: 'conference' });

}