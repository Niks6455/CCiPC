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

const reportCreateSlice = createSlice({
  name: "reportCreate",
  initialState: {
    id: "id1",
    status: "save",
    number: 1,
    name: "Сравнительный анализ характеристик мониторинга технологического процесса с использованием линейного и нелинейного метода главных компонент",
    directionConference: "Информационная безопасность",
    formParticipation: "Очно",
    participationStatus: "Студент",
    fileArticle: null,
    fileExpertOpinion: null,
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

  reducers: {
    setValue(state, action) {
      const { key, value } = action.payload;
      console.log("key, value", key, value);
      if (state[key]) {
        state[key] = value;
      }
    },
  },
});

export const { setValue } = reportCreateSlice.actions;

export default reportCreateSlice.reducer;
