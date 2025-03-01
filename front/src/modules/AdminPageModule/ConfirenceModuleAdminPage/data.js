/* 
    stages - этап конференции
    deadlineUploadingReports - крайний срок загрузки докладов
    logoHeader - логотип хедера файл pdf
    logoFooter - логотип футера файл pdf
    programConference - программа конференции файл pdf
    informationLetter - информационное письмо файл pdf
    worksCollection - Cборник научных трудов файл pdf
    аrticleTemplate - шаблоны статьи файл doc
    cashlessIndividual- безналичная оплата Doc физ лица
    cashlessEntities- безналичная оплата Doc юр лица
    aboutConference - о конференции
    directions - Направления работы конференции
    dateFirst - дата начала проведения
    dateSecond - дата конца проведения
    address - место проведения
    organizers - организаторы массив файлов
    partners - партнеры массив файлов
    
 
*/

//! один этап конференции
export const stagesObject = {
  date: "",
  name: "",
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
  aboutConference: "",
  directions: [],
  dateFirst: "",
  dateSecond: "",
  address: "",
  organizers: [],
  partners: [],
};

//! тестовые данные
const about = `Архыз — живописный уголок Кавказа, который ежегодно привлекает тысячи туристов со всей страны.
В этом году здесь прошла конференция, посвящённая вопросам экологии и устойчивого развития горных регионов. Участники мероприятия обсудили актуальные проблемы сохранения биоразнообразия, рационального использования природных ресур  сов и внедрения «зелёных» технологий в жизнь местных сообществ.
Ведущие эксперты
         Конференция собрала ведущих экспертов, учёных и представителей общественных организаций. Обсуждались такие важные темы, как снижение воздействия туризма на экосистемы гор, развитие экотуризма и создание новых природоохранных зон. Особое внимание было уделено роли местного населения в сохранении природного наследия региона.
В рамках конференции также прошли мастер-классы и практические семинары, где участники могли обменяться опытом и узнать о последних достижениях в области экологического менеджмента.
Мероприятие завершилось подписанием резолюции, в которой были сформулированы рекомендации для государственных органов и бизнеса по улучшению экологической ситуации в горах.`;

export const testData = {
  stages: [
    {
      date: "01.09.2024",
      name: "Представление докладов и регистрационных форм",
    },
    {
      date: "08.09.2024",
      name: "Информирование авторов о результатах экспертизы докладов",
    },
    {
      date: "23.09.2024",
      name: "Начало работы конференции",
    },
    {
      date: "15.09.2024",
      name: "Оплата оргвзноса за опубликование принятых докладов",
    },
  ],
  deadlineUploadingReports: "15.09.2024",
  logoHeader: null,
  logoFooter: null,
  programConference: null,
  informationLetter: null,
  worksCollection: null,
  аrticleTemplate: null,
  cashlessIndividual: null,
  cashlessEntities: null,
  aboutConference: about,
  directions: [
    "Информационная безопасность",
    "Управление системами с распределёнными параметрами",
    "Беспилотные автоматизированные системы",
    "Интелектуальная обработка информации",
    "Современные образовательные технологии в области подготовк инженерных кадров",
    "Проблемы математического моделирования и управления в области медицины",
    "Математическое моделирование в астрономии, геофизике и инженерных науках",
    "Искусственный интеллект в управлении: теория и практика",
    "Проблемы самоорганизации и управления в сложных технических системах",
  ],
  dateFirst: "23.09.2024",
  dateSecond: "29.09.2024",
  address: "пос. Нижний Архыз",
  organizers: [],
  partners: [],
};
