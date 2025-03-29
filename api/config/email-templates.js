export default {
    registration: {
        subject: 'Confirmation email',
        template: (code) =>
            `<h1>Здраствуйте! Код для подтвержения почты на платформе ССиПС.</h1>
<p><strong>${code}</strong></p>`,
    },
    reset: {
        subject: 'Reset password',
        template: (code) =>
            `<h1>Здраствуйте! Код для восстановления пароля на платформе ССиПС.</h1>
<p><strong>${code}</strong></p>`,
    },
    report: {
        subject: 'Report on conference',
        template: (fio) => `<h1>Здраствуйте! ${fio} вас добавили соавтором в доклад на конфиренцию, пройдите регистрацию на платформе ССиПС и заполните необходимую информацию в личном кабинете.</h1>
<p><strong>${process.env.WEB_URL}</strong></p>`,
    }
}