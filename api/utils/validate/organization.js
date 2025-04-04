export default (organization) => {
    const trimmedName = organization.trim();

    // Проверяем, соответствует ли название требованиям
    const nameRegex = /^[a-zA-Zа-яА-ЯёЁ0-9.,'"() -]{3,200}$/;

    return trimmedName.length > 0 && nameRegex.test(trimmedName);
}