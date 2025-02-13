import { createTransport } from 'nodemailer';
import templates from '../config/email-templates.js';
import { SystemError } from '../utils/errors.js';

const address = process.env.MAIL_USER;

// объект для отправления писем на outlook
const smtp = createTransport({
    host: 'outlook.office365.com',
    port: 587,
    secure: false,
    auth: { user: address, pass: process.env.MAIL_PASS },
});

export default function (to, type, ...arg) {
    if (!to) return;
    if (!type) throw new SystemError(500, 'type not specified');

    // из templates по type полает replacement.subject и replacement.template для mail
    const replacement = templates[type];
    if (!replacement) throw new SystemError(500, 'not exist');

    // объект сообщения
    const mail = {
        from: { name: 'CCPC', address },
        to,
        subject: replacement.subject,
        generateTextFromHTML: true,
        html: `${replacement.template(
            ...arg
        )}<br><p>Это автоматически сгенерированное сообщение. Не отвечайте на него.</p>`,
    };

    // отправка сообщений на production
    if (process.env.NODE_ENV === 'production') {
        smtp.sendMail(mail);
    } else {
        console.log(mail);
    }
}