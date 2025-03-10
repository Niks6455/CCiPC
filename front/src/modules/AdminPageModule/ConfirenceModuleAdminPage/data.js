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

export const testData = {
  stages: [
    {
      date: '01.09.2024',
      name: 'Представление докладов и регистрационных форм',
    },
    {
      date: '08.09.2024',
      name: 'Информирование авторов о результатах экспертизы докладов',
    },
    {
      date: '23.09.2024',
      name: 'Начало работы конференции',
    },
    {
      date: '15.09.2024',
      name: 'Оплата оргвзноса за опубликование принятых докладов',
    },
  ],
  deadlineUploadingReports: '15.09.2024',
  logoHeader: null,
  logoFooter: null,
  programConference: null,
  informationLetter: null,
  worksCollection: null,
  аrticleTemplate: null,
  cashlessIndividual: null,
  cashlessEntities: null,
  aboutConference:
    'Архыз — живописный уголок Кавказа, который ежегодно привлекает тысячи туристов со всей страны.',
  directions: [
    'Информационная безопасность',
    'Управление системами с распределёнными параметрами',
    'Беспилотные автоматизированные системы',
    'Интелектуальная обработка информации',
    'Современные образовательные технологии в области подготовк инженерных кадров',
    'Проблемы математического моделирования и управления в области медицины',
    'Математическое моделирование в астрономии, геофизике и инженерных науках',
    'Искусственный интеллект в управлении: теория и практика',
    'Проблемы самоорганизации и управления в сложных технических системах',
  ],
  dateFirst: '23.09.2024',
  dateSecond: '29.09.2024',
  address: 'пос. Нижний Архыз',
  organizers: [],
  partners: [],
};
