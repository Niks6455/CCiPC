import typesFiles from "../config/typesFiles.js";


const acceptedTypesFiles = /doc|dock|pdf/;
const acceptedTypesPhoto = /png|jpg|jpeg/;
import path from 'path';
import typesFile from '../config/typesFiles.js'
import typesPhoto from '../config/typesPhoto.js'
import multer from 'multer';
import {
    AppError,
    AppErrorForbiddenAction,
    AppErrorInvalid,
    AppErrorMissing,
    AppErrorNotExist,
    MultipleError,
} from '../utils/errors.js';
import errorCodes from '../config/error-codes.js';
import * as fs from "fs";
import Report from "../models/report.js";
import News from "../models/news.js";
import Conference from "../models/conference.js";
import Committee from "../models/committee.js";
const dir= './uploads'

// Проверка расширения файла
const fileFilter = ({body: {type}}, {originalname}, cb) => {

    const extension = path.extname(originalname).toLowerCase();
    if(Object.values(typesFile).includes(type) && acceptedTypesFiles.test(extension)) cb(null, true);
    if(Object.values(typesPhoto).includes(type)  && acceptedTypesPhoto.test(extension)) cb(null, true);
    else cb(new AppError(errorCodes.FileExtensionNotAllowed));
};


const storage = multer.diskStorage({
    destination: ({body: { type }}, { originalname }, { admin}, cb) => {
        if (type in typesFile || type in typesPhoto)
        {
            if(type === typesPhoto.NEWS || type === typesPhoto.COMMITTEE && !admin) cb(new AppErrorForbiddenAction('file'));
            if(fs.existsSync(path.join(dir, type.toLowerCase())))  fs.mkdirSync(path.join(dir, type.toLowerCase()), { recursive: true });
            cb(null, path.join(dir, type.toLowerCase()));
        }
    },
    filename: ({ originalname }, cb) => {
        cb(null, originalname);
    },
});

const uploader = multer({ storage, fileFilter, limits: { fileSize: 3145728 } }).single('file');

export default {
    uploader,

    async afterUpload({body : { type, reportId, newsId, committeeId }, file, participant, }, res) {

        if (!file) throw new AppErrorMissing('file');

        const extension = path.extname(file.originalname).toLowerCase();

        if(type === typesPhoto.AVATAR) await participant.update({avatar: path.join(dir, type.toLowerCase(), file.originalname) });

        if(type === typesPhoto.NEWS)  {
            if(!newsId) throw new AppErrorMissing('newsId');
            const news=await News.findByPk(newsId)
            if(!news) throw new AppErrorNotExist('news');
            await participant.update({img: path.join(dir, type.toLowerCase(), file.originalname) });
        }

        if(type === typesPhoto.COMMITTEE) {
            if(!committeeId) throw  new AppErrorMissing('committeeId')
            const committee =await Committee.findByPk(committeeId)
            if(!committee) throw new AppErrorNotExist('committee');
            await committee.update({img: path.join(dir, type.toLowerCase(), file.originalname) });
        }

        const report =await Report.findOne({
            id: reportId,
            participantId: participant.id
        })
        if(!report) throw new AppErrorInvalid('report');

        if(type === typesFiles.REPORT || type === typesFiles.CONCLUSION ) await report.update({
            ...(type === typesFiles.REPORT ? {reportFile: path.join(dir, type.toLowerCase(), file.originalname)} :
                {conclusionFile: path.join(dir, type.toLowerCase(), file.originalname)}),
        })
        res.json({status: 'OK'});
    },

    async delete({student}, res) {
        /*fs.unlink(`./uploads/summary/${student.id}.pdf`, () => {
        });

        await student.update({summary: false});
        res.json({status: 'OK'});*/
    },
}