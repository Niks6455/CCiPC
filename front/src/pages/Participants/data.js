export const tableHead = [
  { key: 'number', value: '№', isActive: true },
  { key: 'fio', value: 'Ф.И.О', isActive: true },
  { key: 'organization', value: 'Организация', isActive: true },
  { key: 'participation', value: 'Участие', isActive: true },
  { key: 'direction', value: 'Направление', isActive: true },
  { key: 'report', value: 'Доклад', isActive: true },
];

export const tableData = Array(20)
  .fill(0)
  .map((_, i) => ({
    number: i + 1,
    fio: 'Ковалёв Дмитрий Александрович Русинов Леон Абрамович Куркина Виктория Вадимовна Вакуленко Дмитрий Юрьевич',
    organization: 'Санкт-Петербургский государственный электротехнический университет «ЛЭТИ»',
    participation: 'Аспирант',
    direction: '7. Проблемы математического моделирования и управления в области медицины',
    report:
      'Проект по созданию распределенной сети полигонов для отработки сценариев применения гетерогенных групп транспортных средств с электрическим приводом в сложных климатических и ландшафтных условиях, проблемы и перспективы реализации на примере САО РАН',
  }));
