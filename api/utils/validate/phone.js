export default (phone) => {
    const cleanedPhone = phone.replace(/[\s-]+/g, '');
    const phoneRegex = /^\+7\d{10}$/;
    return phoneRegex.test(cleanedPhone);
}