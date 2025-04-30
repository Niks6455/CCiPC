import typesFiles from "../config/typesFiles.js";
const acceptedTypesFiles = /doc|docx|pdf/;
const acceptedTypesPhoto = /png|jpg|jpeg/;
import path from "path";
import typesFile from "../config/typesFiles.js";
import typesPhoto from "../config/typesPhoto.js";
import multer from "multer";
import {
  AppError,
  AppErrorForbiddenAction,
  AppErrorInvalid,
  AppErrorMissing,
  AppErrorNotExist,
} from "../utils/errors.js";
import errorCodes from "../config/error-codes.js";
import * as fs from "fs";
import Report from "../models/report.js";
import News from "../models/news.js";
import Conference from "../models/conference.js";
import Participant from "../models/participant.js";
import Committee from "../models/committee.js";
import Archive from "../models/archive.js";
import { v4 as uuidv4 } from "uuid";
import ParticipantInConference from "../models/participant-in-conference.js";
import { Op } from "sequelize";
import FileLink from "../models/file-link.js";
import File from "../models/file.js";
const dir = "./uploads";
const photo = ["HEADER", "FOOTER", "ORGANIZATION", "PARTNER"];
const document = [
  "PROGRAM",
  "LETTER",
  "COLLECTION",
  "SAMPLE",
  "INDIVIDUAL",
  "LEGAL",
];

const updateUrl = async (infoFiles, file) => {
  for (const infoFile of infoFiles) {
    fs.unlink(file.url, (err) => {
      if (err) console.log(err);
    });
    await file.update({ url: infoFile.path, name: Buffer.from(infoFile.originalname, 'latin1').toString('utf8') });
  }
};

const fileFilter = (req, file, cb) => {
  const { type } = req.query;

  const extension = path.extname(file.originalname).toLowerCase();
  if (!type) {
    return cb(new AppError(errorCodes.Missing));
  }

  if (type in typesFile && acceptedTypesFiles.test(extension)) {
    return cb(null, true);
  }

  if (type in typesPhoto && acceptedTypesPhoto.test(extension)) {
    return cb(null, true);
  }

  return cb(new AppError(errorCodes.FileExtensionNotAllowed));
};

const multiFileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();
  if (photo.includes(file.fieldname) && acceptedTypesPhoto.test(extension))
    return cb(null, true);
  if (document.includes(file.fieldname) && acceptedTypesFiles.test(extension))
    return cb(null, true);
  return cb(new AppError(errorCodes.FileExtensionNotAllowed));
};

const multiStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(dir, file.fieldname.toLowerCase());
    try {
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    } catch (err) {
      cb(new AppError(errorCodes.NotExist));
    }
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname).toLowerCase());
  },
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { type } = req.query;
    if (!type || !(type in typesFile || type in typesPhoto)) {
      return cb(new AppError(errorCodes.Invalid));
    }

    if (
      ((typesPhoto[type] === 4 ||
        typesPhoto[type] === 5 ||
        typesPhoto[type] === 1 ||
        typesPhoto[type] === 2 ||
        typesPhoto[type] === 7 ||
        typesPhoto[type] === 8 ||
        typesFile[type] === 0 ||
        typesFile[type] === 1 ||
        typesFile[type] === 2 ||
        typesFile[type] === 3 ||
        typesFile[type] === 6 ||
        typesFile[type] === 7 ||
        typesFile[type] === 8) &&
        !req.admin) ||
      ((typesPhoto[type] === 0 ||
        typesFile[type] === 4 ||
        typesFile[type] === 5 ||
        typesFile[type] === 9 ||
        typesFile[type] === 10) &&
        !req.user)
    ) {
      return cb(new AppErrorForbiddenAction("file"));
    }

    const uploadPath = path.join(dir, type.toLowerCase());

    try {
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    } catch (err) {
      cb(new AppError(errorCodes.NotExist));
    }
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname).toLowerCase());
  },
});

const uploader = multer({
  storage,
  fileFilter,
  limits: { fileSize: 262144000 },
}).single("file");
const multiUploader = multer({
  storage: multiStorage,
  fileFilter: multiFileFilter,
  limits: { fileSize: 262144000 },
});

export default {
  uploader,
  multiUploader,
  async afterMultipleUpload(
    { body: { conferenceId }, query: { type }, files },
    res
  ) {
    if (files?.length < 1) throw new AppErrorMissing("files");
    if (!conferenceId || conferenceId === "null") throw new AppErrorMissing("conferenceId");
    const conference = await Conference.findByPk(conferenceId);
    if (!conference) throw new AppErrorNotExist("conference");

    const program = files["PROGRAM"] || [];
    const letter = files["LETTER"] || [];
    const collection = files["COLLECTION"] || [];
    const individual = files["INDIVIDUAL"] || [];
    const legal = files["LEGAL"] || [];
    const sample = files["SAMPLE"] || [];
    const header = files["HEADER"] || [];
    const footer = files["FOOTER"] || [];
    const organization = files["ORGANIZATION"] || [];
    const partner = files["PARTNER"] || [];

    const infoFiles = {
      PROGRAM: program,
      LETTER: letter,
      COLLECTION: collection,
      INDIVIDUAL: individual,
      LEGAL: legal,
      SAMPLE: sample,
      HEADER: header,
      FOOTER: footer,
      ORGANIZATION: organization,
      PARTNER: partner,
    };

    const helpTypes = {
      0: "PROGRAM",
      1: "LETTER",
      2: "COLLECTION",
      3: "SAMPLE",
      14: "HEADER",
      15: "FOOTER",
      16: "ORGANIZATION",
      17: "PARTNER",
      7: "INDIVIDUAL",
      8: "LEGAL",
    };
    const fileTypes = [];

    if (program.length > 0) fileTypes.push(0);
    if (letter.length > 0) fileTypes.push(1);
    if (collection.length > 0) fileTypes.push(2);
    if (individual.length > 0) fileTypes.push(7);
    if (legal.length > 0) fileTypes.push(8);
    if (sample.length > 0) fileTypes.push(3);
    if (header.length > 0) fileTypes.push(14);
    if (footer.length > 0) fileTypes.push(15);
    if (organization.length > 0) fileTypes.push(16);
    if (partner.length > 0) fileTypes.push(17);

    const filesLink = await File.findAll({
      include: {
        model: FileLink,
        as: "fileLinks",
        required: true,
        where: {
          conferenceId: conferenceId,
          type: { [Op.in]: fileTypes }, // Используем массив fileTypes
        },
      },
    });

    if (filesLink.length > 0) {
      for (const fileLink of filesLink) {
        if (
          fileLink.fileLinks[0].type !== 16 &&
          fileLink.fileLinks[0].type !== 17
        ) {
          if (
            infoFiles[helpTypes[fileLink.fileLinks[0].type]][0].path !==
            fileLink.url
          )
            await updateUrl(
              infoFiles[helpTypes[fileLink.fileLinks[0].type]],
              fileLink
            );
          delete infoFiles[helpTypes[fileLink.fileLinks[0].type]];
        }
      }
    }

    try {
      const fileIds = [];

      for (const [key, files] of Object.entries(infoFiles)) {
        for (const file of files) {
          const fileRecord = {
            name:  Buffer.from(file.originalname, 'latin1').toString('utf8'),
            url: file.path,
            type: typesFiles[key],
            conferenceId: conferenceId,
          };

          const createdFile = await File.create(fileRecord);
          fileIds.push({ fileId: createdFile.id, type: fileRecord.type })
        }
      }

      const linkPromises = fileIds.map((fileId) => {
        return FileLink.create({
          fileId: fileId.fileId,
          conferenceId: conferenceId,
          type: fileId.type,
        });
      });

      await Promise.all(linkPromises);
    } catch (error) {
      console.error("Error saving files and links to the database:", error);
    }

    res.json({ status: "Ok" });
  },
  async afterUpload(
    {
      body: { reportId, newsId, committeeId, conferenceId, archiveId },
      query: { type },
      file,
      user,
      admin,
    },
    res
  ) {
    if (!file) throw new AppErrorMissing("file");
    if (typesPhoto[type] === 0) {
      const participant = await Participant.findByPk(user.id);
      if (!participant) throw new AppErrorNotExist("participant");

      const avatar = await File.findOne({
        include: {
          model: FileLink,
          as: "fileLinks",
          required: true,
          where: {
            type: typesPhoto[type],
            participantId: participant.id,
          },

        },
      });

      if (avatar) {
        await avatar.update({ url: file.path, name: Buffer.from(file.originalname, 'latin1').toString('utf8') });
        return res.json({ file: avatar });
      }

      const fileParticipant = await File.create({
        name:  Buffer.from(file.originalname, 'latin1').toString('utf8'),
        url: file.path,
      });

      await FileLink.create({
        fileId: fileParticipant.id, // ID файла
        participantId: participant.id,
        type: typesPhoto[type],
      });

      return res.json({ file: fileParticipant });
    }

    if (typesPhoto[type] === 1 && !newsId) throw new AppErrorMissing("newsId");

    if (newsId) {
      const news = await News.findByPk(newsId);
      if (!news) throw new AppErrorNotExist("news");

      const newsFile = await File.findOne({
        include: {
          model: FileLink,
          as: "fileLinks",
          required: true,
          where: {
            type: typesPhoto[type],
            newsId: news.id,
          },
        },
      });

      if (newsFile) {
        await newsFile.update({ url: file.path, name: Buffer.from(file.originalname, 'latin1').toString('utf8') });
        return res.json({ file: newsFile });
      }

      const fileNews = await File.create({
        name:  Buffer.from(file.originalname, 'latin1').toString('utf8'),
        url: file.path,
      });

      await FileLink.create({
        fileId: fileNews.id, // ID файла
        newsId: news.id,
        type: typesPhoto[type],
      });

      return res.json({ file: fileNews });
    }

    if (!committeeId && typesPhoto[type] === 2)
      throw new AppErrorMissing("committeeId");

    if (committeeId) {
      const committee = await Committee.findByPk(committeeId);
      if (!committee) throw new AppErrorNotExist("committeeId");

      const committeeFile = await File.findOne({
        include: {
          model: FileLink,
          as: "fileLinks",
          required: true,
          where: {
            type: typesPhoto[type],
            committeeId: committee.id,
          },
        },
      });

      if (committeeFile) {
        await committeeFile.update({ url: file.path, name: Buffer.from(file.originalname, 'latin1').toString('utf8') });
        return res.json({ file: committeeFile });
      }

      const fileCommittee = await File.create({
        name:  Buffer.from(file.originalname, 'latin1').toString('utf8'),
        url: file.path,
      });

      await FileLink.create({
        fileId: fileCommittee.id,
        committeeId: committee.id,
        type: typesPhoto[type],
      });

      return res.json({ file: fileCommittee });
    }

    if ((typesFile[type] === 4 || typesFile[type] === 5) && !reportId)
      throw new AppErrorMissing("reportId");

    if (reportId) {
      const report = await Report.findByPk(reportId, {
        include: {
          model: Participant,
          as: "participants",
          required: true,
          where: {
            id: user.id,
          },
        },
      });

      if (!report) throw new AppErrorNotExist("report");

      const reportFile = await File.findOne({
        include: {
          model: FileLink,
          as: "fileLinks",
          required: true,
          where: {
            type: typesFile[type],
            reportId: report.id,
          },
        },
      });

      if (reportFile) {
        await reportFile.update({ url: file.path, name: Buffer.from(file.originalname, 'latin1').toString('utf8') });
        return res.json({ file: reportFile });
      }

      const fileReport = await File.create({
        name:  Buffer.from(file.originalname, 'latin1').toString('utf8'),
        url: file.path,
      });

      await FileLink.create({
        fileId: fileReport.id,
        reportId: report.id,
        type: typesFile[type],
      });
      return res.json({ file: fileReport });
    }

    if ((typesPhoto[type] === 8 || typesFile[type] === 6) && !archiveId)
      throw new AppErrorMissing("archiveId");
    if (archiveId) {
      const archive = await Archive.findByPk(archiveId);
      if (!archive) throw new AppErrorNotExist("archiveId");

      const archiveFile = await File.findOne({
        include: {
          model: FileLink,
          as: "fileLinks",
          required: true,
          where: {
            ...(typesFile[type] === 6 && { type: typesFile[type] }),
            ...(typesPhoto[type] === 8 && { type: typesPhoto[type] }),
            archiveId: archive.id,
          },
        },
      });

      if (archiveFile) {
        await archiveFile.update({ url: file.path, name: Buffer.from(file.originalname, 'latin1').toString('utf8') });
        return res.json({ file: archiveFile });
      }

      const fileArchive = await File.create({
        name:  Buffer.from(file.originalname, 'latin1').toString('utf8'),
        url: file.path,
      });

      await FileLink.create({
        fileId: fileArchive.id, // ID файла
        archiveId: archive.id,
        type: typesFiles[type] === 6 ? typesFiles[type] : typesPhoto[type],
      });

      return res.json({ file: fileArchive });
    }

    if (!conferenceId) throw new AppErrorMissing("conferenceId");

    const conference = await Conference.findByPk(conferenceId);

    if (!conference) throw new AppErrorNotExist("conference");

    if (typesFile[type] === 9 || typesFile[type] === 10) {
      const participantInConference = await ParticipantInConference.findOne({
        where: {
          participantId: user.id,
          conferenceId: conference.id,
        },
        include: {
          model: Conference,
          as: "conference",
          required: true,
        },
      });

      if (!participantInConference)
        throw new AppErrorNotExist("participantInConference");

      if (conference?.deadline && conference?.deadline < new Date())
        throw new AppErrorInvalid("deadline");

      const participantInConferenceFile = await File.findOne({
        include: {
          model: FileLink,
          as: "fileLinks",
          required: true,
          where: {
            ...(typesFile[type] === 9 && { type: typesFile[type] }),
            ...(typesFile[type] === 10 && { type: typesFile[type] }),
            participantId: user.id,
          },
        },
      });

      if (participantInConferenceFile) {
        await participantInConferenceFile.update({
          url: file.path,
          name: Buffer.from(file.originalname, 'latin1').toString('utf8'),
        });
        return res.json({ file: participantInConferenceFile });
      }

      const fileParticipantInConference = await File.create({
        name:  Buffer.from(file.originalname, 'latin1').toString('utf8'),
        url: file.path,
      });

      await FileLink.create({
        fileId: fileParticipantInConference.id,
        participantId: user.id,
        conferenceId: conference.id,
        type: typesFiles[type],
      });

      res.json({ file: fileParticipantInConference });
    }
  },

  async delete({ body: { ids } }, res) {
    if (ids.length < 1) throw new AppErrorMissing("id");

    const files = await File.findAll({
      where: {
        id: ids,
      },
    });

    if (files.length < 1) throw new AppErrorNotExist("file");

    for (const file of files) {
      try {
        await fs.promises.unlink(file.url);
      } catch (err) {
      }

      await file.destroy();
    }

    res.json({ status: "Ok" });
  },
};
