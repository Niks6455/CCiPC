import { models } from './index.js';
const { Archive, Participant, Report, Conference, ParticipantInConference, Direction, DirectionInConference, News, Committee, CommitteeInConference, ParticipantOfReport, FileLink, File } = models;

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
            unique: false,
        },
        foreignKey: { name: 'conferenceId', allowNull: false},
        as: 'committees',

    });
    Committee.belongsToMany(Conference, {
        through: {
            model: CommitteeInConference,
            unique: false,
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
        as: 'committeeInConference',
        foreignKey: 'committeeId',
    });


    Conference.hasMany(CommitteeInConference, {
        as: 'committeeInConference',
        foreignKey: 'conferenceId',
    });


    File.hasMany(FileLink, {
        foreignKey: { name: 'fileId', allowNull: false },
        as: 'fileLinks'
    });
    FileLink.belongsTo(File, {
        foreignKey: { name: 'fileId', allowNull: false },
        as: 'file'
    });

    Conference.hasMany(FileLink, {
        foreignKey: { name: 'conferenceId', allowNull: true },
        as: 'filesInConference'
    });
    FileLink.belongsTo(Conference, {
        foreignKey: { name: 'conferenceId', allowNull: true },
        as: 'conference'
    });

    Report.hasMany(FileLink, {
        foreignKey: { name: 'reportId', allowNull: true },
        as: 'reportFileLink'
    });
    FileLink.belongsTo(Report, {
        foreignKey: { name: 'reportId', allowNull: true },
        as: 'report'
    });

    Participant.hasMany(FileLink, {
        foreignKey: { name: 'participantId', allowNull: true },
        as: 'participantFile'
    });
    FileLink.belongsTo(Participant, {
        foreignKey: { name: 'participantId', allowNull: true },
        as: 'participant'
    });

    Committee.hasOne(FileLink, {
        foreignKey: { name: 'committeeId', allowNull: true },
        as: 'committeeFile'
    });
    FileLink.belongsTo(Committee, {
        foreignKey: { name: 'committeeId', allowNull: true },
        as: 'committee'
    });

    News.hasOne(FileLink, {
        foreignKey: { name: 'newsId', allowNull: true },
        as: 'newsFile'
    });
    FileLink.belongsTo(News, {
        foreignKey: { name: 'newsId', allowNull: true },
        as: 'news'
    });

    Archive.hasOne(FileLink, {
        foreignKey: { name: 'archiveId', allowNull: true },
        as: 'archiveFile'
    });
    FileLink.belongsTo(Archive, {
        foreignKey: { name: 'archiveId', allowNull: true },
        as: 'archive'
    });


    Direction.hasMany(Report, {foreignKey: {name: 'directionId', allowNull: false}, as: 'reports' })
    Report.belongsTo(Direction, { foreignKey: { name: 'directionId', allowNull: false }, as: 'direction' });

    Conference.hasMany(Report, { foreignKey: { name: 'conferenceId', allowNull: true }, as: 'reports' });
    Report.belongsTo(Conference, { foreignKey: { name: 'conferenceId', allowNull: true }, as: 'conference' });

}