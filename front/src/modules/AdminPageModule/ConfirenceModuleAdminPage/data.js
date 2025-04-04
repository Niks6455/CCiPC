//! один этап конференции
export const stagesObject = {
  date: '',
  name: '',
};

//! данные конференции
export const objectData = {
  stages: [],
  logoHeader: null,
  logoFooter: null,
  programConference: null,
  informationLetter: null,
  worksCollection: null,
  аrticleTemplate: null,
  aboutConference: '',
  directions: [],
  dateFirst: '',
  dateSecond: '',
  address: '',
  organizers: [],
  partners: [],
};

export const fileKeys = [
  {
    key: 'logoHeader',
    name: 'HEADER',
    fun: 'funApiEditFile',
    errorname: 'Фото хедера не загружено!',
  },
  {
    key: 'logoFooter',
    name: 'FOOTER',
    fun: 'funApiEditFile',
    errorname: 'Фото футера не загружено!',
  },
  {
    key: 'programConference',
    name: 'PROGRAM',
    fun: 'funApiEditFile',
    errorname: 'Файл "Программа конференции" не загружен!',
  },
  {
    key: 'informationLetter',
    name: 'LETTER',
    fun: 'funApiEditFile',
    errorname: 'Файл "Информационное письмо" не загружен!',
  },
  {
    key: 'worksCollection',
    name: 'COLLECTION',
    fun: 'funApiEditFile',
    errorname: 'Файл "Cборник научных трудов" не загружен!',
  },
  {
    key: 'аrticleTemplate',
    name: 'SAMPLE',
    fun: 'funApiEditFile',
    errorname: 'Файл "Шаблон статьи" не загружен!',
  },
  {
    key: 'cashlessIndividual',
    name: 'INDIVIDUAL',
    fun: 'funApiEditFile',
    errorname: 'Файл "Договор оплаты безналичным расчётом для физического лица" не загружен!',
  },
  {
    key: 'cashlessEntities',
    name: 'LEGAL',
    fun: 'funApiEditFile',
    errorname: 'Файл "Договор оплаты безналичным расчётом для юридического лица" не загружен!',
  },
  {
    key: 'organizers',
    name: 'ORGANIZATION',
    fun: 'funApiEditFileMulti',
    errorname: 'Файлы "Организаторы" не загружены!',
  },
  {
    key: 'partners',
    name: 'PARTNER',
    fun: 'funApiEditFileMulti',
    errorname: 'Файлы "Партнёры" не загружены!',
  },
  {
    key: 'main',
    name: 'main',
    fun: 'main',
    errorname: 'Данные не сохранены!',
  },
];

export const conferenceDataNull = {
  stages: [],
  logoHeader: null,
  logoFooter: null,
  programConference: null,
  informationLetter: null,
  worksCollection: null,
  аrticleTemplate: null,
  cashlessIndividual: null,
  cashlessEntities: null,
  aboutConference: '',
  directions: [],
  directionsIds: [],
  dateFirst: null,
  dateSecond: null,
  address: '',
  organizers: [],
  partners: [],
  deadlineUploadingReports: '',
};
