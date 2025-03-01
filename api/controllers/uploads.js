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
import Participant from "../models/participant.js";
import Committee from "../models/committee.js";
import Archive from "../models/archive.js";
const dir= './uploads'

// Проверка расширения файла
const fileFilter = (req, file, cb) => {
    const { type } = req.query; // Получаем тип из тела запроса
        const extension = path.extname(file.originalname).toLowerCase();

    if (!type) {
        return cb(new AppError(errorCodes.Missing)); // Если type отсутствует
    }

    if ( type in typesFile && acceptedTypesFiles.test(extension)) {
        return cb(null, true);
    }

    if ( type in typesPhoto && acceptedTypesPhoto.test(extension)) {
        return cb(null, true);
    }

    return cb(new AppError(errorCodes.FileExtensionNotAllowed)); // Если тип файла не разрешен
};


const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        const { type } = req.query
        if (!type || !(type in typesFile || type in typesPhoto)) {
            return cb(new AppError(errorCodes.Invalid));
        }


        if ((typesPhoto[type] === 4
            || typesPhoto[type] === 5
            || typesPhoto[type] === 1
            || typesPhoto[type] === 2
            || typesPhoto[type] === 7
            || typesPhoto[type] === 8
            || typesFile[type] === 0
            || typesFile[type] === 1
            || typesFile[type] === 2
            || typesFile[type] === 3
            || typesFile[type] === 6
            )
            && !req.admin

            ||
            ((typesPhoto[type] === 0
            || typesFile[type] === 4
            || typesFile[type] === 5)
                && !req.user)
        ) {
            return cb(new AppErrorForbiddenAction('file'));
        }

        console.log(0)

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
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

const uploader = multer({ storage, fileFilter, limits: { fileSize: 3145728 } }).single('file');
const multiUploader = multer({ storage, fileFilter, limits: { fileSize: 31457280 } }).array('files', 10);

export default {
    uploader,
    multiUploader,
    async afterUpload({body : { reportId, newsId, committeeId, conferenceId, archiveId }, query: { type }, file, user, admin }, res) {

        if (!file) throw new AppErrorMissing('files');
        if(typesPhoto[type]=== 1 && !newsId) throw new AppErrorMissing('newsId')

        if(newsId)
        {
            const news =await News.findByPk(newsId)
            if(!news) throw new AppErrorNotExist('news')
            await news.update({ img: file.path })
            return res.json({status: 'OK'});

        }

        if(!committeeId && typesPhoto[type]===2) throw new AppErrorMissing('committeeId');

        if(committeeId)
        {
            const committee=await Committee.findByPk(committeeId)
            if(!committee) throw new AppErrorNotExist('committeeId');
            await committee.update({ img: file.path })
            return res.json({status: 'OK'});

        }

        if((typesFile[type] === 4 || typesFile[type] === 5) && !reportId) throw new AppErrorMissing('reportId');

        if(reportId)
        {
            const report =await Report.findByPk(reportId, {
                include: {
                    model : Participant,
                    as: 'participants',
                    required: true,
                    where: {
                        id: user.id
                    }
                }
            });

            if(!report) throw new AppErrorNotExist('report')
            typesFile[type]===4 ? await report.update({ reportFile: file.path }) : await report.update({ conclusion : file.path })
            return res.json({status: 'OK'});
        }


        if(typesPhoto[type]=== 8 || typesFile[type] === 6 && !archiveId) throw new AppErrorMissing('archiveId');
        if(archiveId) {
            const archive =await Archive.findByPk(archiveId);
            if(!archive) throw new AppErrorNotExist('archiveId')
            await archive.update({ file: file.path })
            return res.json({url: file.path});

        }


        if(!conferenceId) throw new AppErrorMissing('conferenceId');

        const conference = await Conference.findByPk(conferenceId);

        if(!conference) throw new AppErrorNotExist('conference');

        if(typesFile[type] === 0) await conference.update({ documents: { 'PROGRAM' : file.path } })
        if(typesFile[type] === 1) await conference.update({ documents: { 'LETTER' : file.path } })
        if(typesFile[type] === 2) await conference.update({ documents: { 'COLLECTION' : file.path } })
        if(typesFile[type] === 3) await conference.update({ documents: { 'SAMPLE' : file.path } })




        /*сonst extension = path.extname(file.originalname).toLowerCase();

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
        })*/
        res.json({url: file.path});
    },

    async delete({student}, res) {
        /*fs.unlink(`./uploads/summary/${student.id}.pdf`, () => {
        });

        await student.update({summary: false});
        res.json({status: 'OK'});*/
    },
}