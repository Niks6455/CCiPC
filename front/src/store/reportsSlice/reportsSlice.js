import { createSlice } from "@reduxjs/toolkit";

/*
    directionConference - Направление конференции
    formParticipation - Форма участия
    participationStatus - Статус участия
    fileArticle - путь к файлу со статьей
    fileExpertOpinion - файл с экспертным заключением
    comments - комментарии
    soauthors - сооавторы
*/

const reportsSlice = createSlice({
  name: "reports",
  initialState: {
    data: [
      {
        id: "id1",
        status: "save",
        number: 1,
        name: "Сравнительный анализ характеристик мониторинга технологического процесса с использованием линейного и нелинейного метода главных компонент",
        directionConference: "Информационная безопасность",
        formParticipation: "Очно",
        participationStatus: "Студент",
        fileArticle: "",
        fileExpertOpinion: "",
        comments: "Комментарий к докладу",
        soauthors: [
          {
            name: "Артур",
            surname: "Тоноян",
            patronymic: "Арменович",
            organization: "ЮФУ",
            email: "atonoian@sfedu.ru",
            phone: "79034005695",
          },
        ],
      },
      {
        id: "id2",
        status: "save",
        number: 2,
        name: "Исследование управления процессами биологической очистки на предприятии «ИДАВАНГ Агро»",
        directionConference: "Информационная безопасность",
        formParticipation: "Очно",
        participationStatus: "Студент",
        fileArticle: "",
        fileExpertOpinion: "",
        comments: "Комментарий к докладу",
        soauthors: [
          {
            name: "Никита",
            surname: "Капылов",
            patronymic: "Максимович",
            organization: "ЮФУ",
            email: "niks@sfedu.ru",
            phone: "79007777777",
          },
        ],
      },
    ],
  },

  reducers: {
    setNumber(state, action) {
      const { number } = action.payload;
      state.data = number;
    },
  },
});

export const { setNumber } = reportsSlice.actions;

export default reportsSlice.reducer;
