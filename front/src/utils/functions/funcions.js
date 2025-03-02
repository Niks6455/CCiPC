//! преобразуем фио в строку
export const fioToString = (name, surname, patronymic) => {
  let fio = "";
  if (surname) fio += surname;
  if (name) fio += " " + name;
  if (patronymic) fio += " " + patronymic;
  return fio;
};

//! функция скопировать текст в буффер
export const funCopyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Ошибка при копировании текста: ", err);
  }
};

//! Форматирование даты
export const formatDate = (date) => {
  if (!date) date = new Date();
  const eventDate = new Date(date); // преобразование строки в объект Date
  const options = { day: "numeric", month: "long" };
  return eventDate.toLocaleDateString("ru-RU", options);
};

//! Разбиение цены по частям

export const destructPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export function convertDate(dateString) {
  const [year, month, day] = dateString?.split("-");
  return `${day}.${month}.${year}`;
}
export function convertDateTire(dateString) {
  const [day, month, year] = dateString?.split(".");
  return `${year}-${month}-${day}`;
}

//!Функция преобразования даты с и до
export function formatDateRange(dateStart, dateFinish) {
  const months = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];

  const start = new Date(dateStart);
  const end = new Date(dateFinish);

  const startDay = start.getUTCDate();
  const endDay = end.getUTCDate();
  const startMonth = months[start.getUTCMonth()];
  const endMonth = months[end.getUTCMonth()];
  const year = start.getUTCFullYear();

  if (start.getUTCMonth() === end.getUTCMonth()) {
    return `${startDay}-${endDay} ${startMonth} ${year}`;
  } else {
    return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`;
  }
}

//! функция преобразования ссылок

export const generateTitleFromLink = (url) => {
  try {
    const parsedUrl = new URL(url); // Парсим ссылку
    const domain = parsedUrl.hostname; // Извлекаем доменное имя
    const pathParts = parsedUrl.pathname.split("/").filter(Boolean); // Разделяем путь на части

    // Генерация названия на основе домена и пути
    if (domain.includes("docs.google.com")) {
      if (pathParts.includes("spreadsheets")) {
        return "Google Таблица";
      } else if (pathParts.includes("document")) {
        return "Документ Google";
      } else if (pathParts.includes("presentation")) {
        return "Презентация Google";
      } else {
        return "Google Документ";
      }
    } else if (domain.includes("hh.ru")) {
      return "Резюме на hh.ru";
    } else if (domain.includes("linkedin.com")) {
      return "Профиль LinkedIn";
    } else if (domain.includes("superjob.ru")) {
      return "Резюме на SuperJob";
    } else if (domain.includes("behance.net")) {
      const username = pathParts.pop(); // Последняя часть пути — имя пользователя
      return `${username} :: Behance`;
    } else if (domain.includes("dribbble.com")) {
      const username = pathParts.pop(); // Последняя часть пути — имя пользователя
      return `${username} :: Dribbble`;
    } else if (domain.includes("wix.com")) {
      return "Портфолио на Wix";
    } else if (domain.includes("webflow.com")) {
      return "Портфолио на Webflow";
    } else if (domain.includes("github.com")) {
      const username = pathParts[0]; // Первая часть пути — имя пользователя
      const repo = pathParts[1]; // Вторая часть пути — репозиторий
      return repo ? `${username}/${repo} :: GitHub` : `${username} :: GitHub`;
    } else {
      // Если шаблон не найден, возвращаем домен
      return domain;
    }
  } catch (error) {
    console.error("Ошибка обработки ссылки:", error);
    return url; // Если ссылка некорректна, возвращаем её как есть
  }
};

//! форматирование даты
export const formatDateRangePrimereact = (startDate, endDate) => {
  const months = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];

  // Check if startDate and endDate are valid
  if (!startDate || isNaN(new Date(startDate).getTime())) {
    return ""; // Return an empty string if startDate is invalid
  }

  const start = new Date(startDate);
  const startDay = start.getDate();
  const startMonth = months[start.getMonth()];
  const startYear = start.getFullYear();

  if (!endDate || isNaN(new Date(endDate).getTime())) {
    // If endDate is invalid, return only the start date
    return `${startDay} ${startMonth} ${startYear}`;
  }

  const end = new Date(endDate);
  const endDay = end.getDate();
  const endMonth = months[end.getMonth()];
  const endYear = end.getFullYear();

  if (startYear === endYear) {
    if (start.getMonth() === end.getMonth()) {
      // Same month and year
      return `${startDay}-${endDay} ${startMonth} ${startYear}`;
    } else {
      // Different months, same year
      return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${startYear}`;
    }
  } else {
    // Different years
    return `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`;
  }
};

//! декодирование base64
export const decodeFileName = (fileName) => {
  try {
    const bytes = new Uint8Array([...fileName].map((c) => c.charCodeAt(0)));
    return new TextDecoder("windows-1251").decode(bytes);
  } catch (error) {
    console.error("Ошибка декодирования:", error);
    return fileName;
  }
};
