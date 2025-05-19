//! преобразуем фио в строку
export const fioToString = (name, surname, patronymic) => {
  let fio = '';
  if (surname) fio += surname;
  if (name) fio += ' ' + name;
  if (patronymic) fio += ' ' + patronymic;
  return fio;
};

//! функция скопировать текст в буффер
export const funCopyText = async text => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error('Ошибка при копировании текста: ', err);
  }
};

//! Форматирование даты
export const formatDate = (date, language = 'ru') => {
  if (!date) date = new Date();
  const eventDate = new Date(date); // преобразование строки в объект Date
  const options = { day: 'numeric', month: 'long' };
  if (language === 'en') {
    return eventDate.toLocaleDateString('en-US', options);
  }
  return eventDate.toLocaleDateString('ru-RU', options);
};

//! Разбиение цены по частям

export const destructPrice = price => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export function convertDate(dateString) {
  if (!dateString) {
    return dateString;
  }
  const [year, month, day] = dateString.split('-'); // Убрали ?.
  return `${day}.${month}.${year}`;
}

export function convertDateTire(dateString) {
  if (!dateString) {
    return dateString;
  }
  const [day, month, year] = dateString.split('.'); // Убрали ?.
  return `${year}-${month}-${day}`;
}

//!Функция преобразования даты с и до
export function formatDateRange(dateStart, dateFinish) {
  const months = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ];

  const start = new Date(dateStart);
  const end = new Date(dateFinish);

  const startDay = start.getUTCDate();
  const endDay = end.getUTCDate();
  const startMonth = months[start.getUTCMonth()];
  const endMonth = months[end.getUTCMonth()];
  const year = start.getUTCFullYear();
  if (!dateFinish) {
    return `${startDay} ${startMonth} ${year}`;
  }
  if (start.getUTCMonth() === end.getUTCMonth()) {
    return `${startDay}-${endDay} ${startMonth} ${year}`;
  } else {
    return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`;
  }
}

//! функция преобразования ссылок

export const generateTitleFromLink = url => {
  try {
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname;

    switch (true) {
      case domain.includes('docs.google.com'):
        return 'Google ';
      case domain.includes('hh.ru'):
        return 'Резюме на hh.ru';
      case domain.includes('linkedin.com'):
        return 'Профиль LinkedIn';
      case domain.includes('superjob.ru'):
        return 'Резюме на SuperJob';
      case domain.includes('behance.net'):
        return `${parsedUrl.pathname.split('/').pop()} :: Behance`;
      case domain.includes('dribbble.com'):
        return `${parsedUrl.pathname.split('/').pop()} :: Dribbble`;
      case domain.includes('wix.com'):
        return 'Портфолио на Wix';
      case domain.includes('webflow.com'):
        return 'Портфолио на Webflow';
      case domain.includes('github.com'):
        return `${parsedUrl.pathname.split('/')[1]}/${parsedUrl.pathname.split('/')[2]} :: GitHub`;
      default:
        return domain;
    }
  } catch (error) {
    console.error('Ошибка обработки ссылки:', error);
    return url;
  }
};

//! форматирование даты
export const formatDateRangePrimereact = (startDate, endDate, lang = 'ru') => {
  const months = {
    ru: [
      'января',
      'февраля',
      'марта',
      'апреля',
      'мая',
      'июня',
      'июля',
      'августа',
      'сентября',
      'октября',
      'ноября',
      'декабря',
    ],
    en: [
      'january',
      'february',
      'march',
      'april',
      'may',
      'june',
      'july',
      'august',
      'september',
      'october',
      'november',
      'december',
    ],
  };

  if (!startDate || isNaN(new Date(startDate)?.getTime())) {
    return '';
  }

  const start = new Date(startDate);
  const startDay = start.getDate();
  const startMonth = months[lang][start.getMonth()];
  const startYear = start.getFullYear();

  if (!endDate || isNaN(new Date(endDate)?.getTime())) {
    return `${startDay} ${startMonth} ${startYear}`;
  }

  const end = new Date(endDate);
  const endDay = end.getDate();
  const endMonth = months[lang][end.getMonth()];
  const endYear = end.getFullYear();

  if (startYear === endYear) {
    if (start.getMonth() === end.getMonth()) {
      return `${startDay} - ${endDay} ${startMonth} ${startYear}`;
    } else {
      return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${startYear}`;
    }
  } else {
    return `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`;
  }
};

//! декодирование base64
export const decodeFileName = file => {
  if (!file) return 'Документ.pdf';
  const fileName = file?.name?.split('\\').pop();
  const decoder = new TextDecoder('utf-8'); // Если файл в CP1251
  const bytes = new Uint8Array(fileName?.split('').map(c => c.charCodeAt(0)));
  return decoder.decode(bytes);
};

export const decodeName = name => {
  //! проверка в какой кодировке текст
  const decoder = new TextDecoder('utf-8'); // Если файл в CP1251
  const bytes = new Uint8Array(name?.split('').map(c => c.charCodeAt(0)));
  return decoder.decode(bytes);
};

export const decodeText = text => {
  if (!text) return 'Файл';
  const decoder = new TextDecoder('utf-8'); // Если файл в CP1251
  const bytes = new Uint8Array(text?.split('').map(c => c.charCodeAt(0)));
  return decoder.decode(bytes);
};

// Функция для проверки дубликатов
export const hasDuplicates = (array, key) => {
  let names = [];
  if (key) {
    names = array.map(stage => stage?.[key]);
  } else {
    names = array.map(stage => stage);
  }
  return new Set(names).size !== names.length;
};
