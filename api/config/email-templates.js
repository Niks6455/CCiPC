export default {
    registration: {
        subject: 'Confirmation email',
        template: (code) =>
            `<h1>Здравствуйте! Код для подтверждения почты на платформе ССиПС.</h1>
<p><strong>${code}</strong></p>`,
    },
    reset: {
        subject: 'Reset password',
        template: (code) =>
            `<h1>Здравствуйте! Код для восстановления пароля на платформе ССиПС.</h1>
<p><strong>${code}</strong></p>`,
    },
    report: {
        subject: 'Report on conference',
        template: (fio) => `<h1>Здравствуйте, ${fio}! Вас добавили соавтором в доклад на конфиренцию, пройдите регистрацию на платформе ССиПС и заполните необходимую информацию в личном кабинете.</h1>
<p><strong>${process.env.WEB_URL}</strong></p>`,
    },
    assignFee: {
        subject: 'Assignee fee',
        template: (fio, fee) =>  `<h1>Здравствуйте, ${fio}! Ваш доклад на конфиренция "Системный синтез и прикладная синергетика" принят. Сообщаем, что оплата оргвзноса в размере ${fee} рублей можно оплатить либо наличными либо безналичным расчетом.</h1>
</h1>Подробная информация находится в вашем личном кабинете на сайте конференции.</h1>
<p><strong>${process.env.WEB_URL}</strong></p>`,
    }
}