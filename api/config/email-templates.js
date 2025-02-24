export default {
    registration: {
        subject: 'Confirmation email',
        template: (code) =>
            `<h1>Здраствуйте! Код для подтвержения почты на платформе CCPC.</h1>
<p><strong>${code}</strong></p>`,
    },
    reset: {
        subject: 'Reset password',
        template: (code) =>
            `<h1>Здраствуйте! Код для восстановления пароля на платформе CCPC.</h1>
<p><strong>${code}</strong></p>`,
    }
}