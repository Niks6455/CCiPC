export const tableHeader = [
  {
    name: '№',
    key: 'number',
  },
  {
    name: 'ФИО',
    key: 'fio',
  },
  {
    name: 'Доклад',
    key: 'report',
  },
  {
    name: 'Организация',
    key: 'organization',
  },
  {
    name: 'Форма участия',
    key: 'participationForm',
  },
  {
    name: 'Статус участия',
    key: 'participationStatus',
  },
  {
    name: 'Форма оплаты',
    key: 'paymentForm',
  },
  {
    name: 'Сумма оргвзноса',
    key: 'sumOrgWznos',
  },
  {
    name: 'Подтверждение',
    key: 'confirmation',
  },
];

export const testData = Array(10)
  .fill(0)
  .map((_, i) => ({
    fio: `Иванов Иван Иванович ${i}`,
    report:
      'Проект по созданию распределенной сети полигонов для отработки сценариев применения гетерогенных групп транспортных средств с электрическим приводом в сложных климатических и ландшафтных условиях, проблемы и перспективы реализации на примере САО РАН',
    organization: 'Санкт-Петербургский государственный электротехнический университет «ЛЭТИ»',
    participationForm: 'Очно',
    participationStatus: 'Аспирант',
    paymentForm: 'Безналичный расчёт',
    sumOrgWznos: 2201,
    confirmation: false,
    author: false,
    contract: null,
    receipt: null,
  }));
