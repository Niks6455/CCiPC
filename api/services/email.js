import { createTransport } from 'nodemailer';
import templates from '../config/email-templates.js';
import { SystemError } from '../utils/errors.js';

const address = process.env.MAIL_HOST;

const smtp = createTransport({
    host: address,
    port: 465,
    secure: true,
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
});

export default function (to, type, ...arg) {
    if (!to) return;
    if (!type) throw new SystemError(500, 'type not specified');

    const replacement = templates[type];
    if (!replacement) throw new SystemError(500, 'not exist');

    const mail = {
        from: { name: 'ССиПС', address: process.env.MAIL_USER },
        to,
        subject: replacement.subject,
        generateTextFromHTML: true,
        html: `${replacement.template(
            ...arg
        )}<br><p>Это автоматически сгенерированное сообщение. Не отвечайте на него.</p>`,
    };

    if (process.env.NODE_ENV === 'production') {
        smtp.sendMail(mail);
    } else {
        console.log(mail);
    }
}