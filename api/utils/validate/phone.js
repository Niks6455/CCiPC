export default (phone) => {
    const cleanedPhone = phone.replace(/[\s-]+/g, '');

    // Проверяем, соответствует ли номер формату +7 и 10 цифрам
    const phoneRegex = /^\+7\d{10}$/;

    return phoneRegex.test(cleanedPhone);
}