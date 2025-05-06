//! функция делает первую букву текста заглавной
export const capitalizeFirstLetter = value => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

//! функция преобразования номера в вид +7 (XXX) XXX-XX-XX
export const formatPhoneNumber = value => {
  if (!value) {
    return '';
  }
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length <= 1) {
    if (cleaned.length === 0) return '';
    else {
      return `+${7}`;
    }
  } else if (cleaned.length <= 4) {
    return `+${cleaned.slice(0, 1)} (${cleaned.slice(1)}`;
  } else if (cleaned.length <= 7) {
    return `+${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(4)}`;
  } else if (cleaned.length <= 9) {
    return `+${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(
      4,
      7,
    )}-${cleaned.slice(7)}`;
  } else {
    return `+${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(
      4,
      7,
    )}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
  }
};

//! валидациия ФИО (разрешены английские и русские буквы а также тире и пробелы)
export const validateFIO = value => {
  if (value === '') {
    return true;
  }
  const regex = /^[A-Za-zА-ЯЁа-яё\-\s]+$/;
  return regex.test(value);
};

//! валидациия почты
export const validateEmail = value => {
  // Проверяем, что поле не пустое
  if (value.trim() === '') {
    return false; // Возвращаем false, если поле пустое
  }
  // Регулярное выражение для проверки формата email
  const regex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  return regex.test(value); // Проверяем соответствие формату
};

//! валидация на колличество символов кроме пробелов
export const validateLength = (value, count, max) => {
  if (!value) {
    return true;
  }
  if (value.trim().length < count) {
    return false;
  }
  if (max && value.trim().length > max) {
    return false;
  }
  return true;
};
