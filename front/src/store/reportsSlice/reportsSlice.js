import { createSlice } from "@reduxjs/toolkit";
import { apiGetReports } from "../../apirequests/apirequests";

/*
    directionConference - Направление конференции
    formParticipation - Форма участия
    participationStatus - Статус участия
    fileArticle - путь к файлу со статьей
    fileExpertOpinion - файл с экспертным заключением
    comments - комментарии
    soauthors - сооавторы
*/

// const testData = [
//   {
//     id: "id1",
//     status: "save",
//     number: 1,
//     name: "Сравнительный анализ характеристик мониторинга технологического процесса с использованием линейного и нелинейного метода главных компонент",
//     directionConference: "Информационная безопасность",
//     formParticipation: "Очно",
//     participationStatus: "Студент",
//     fileArticle: "",
//     fileExpertOpinion: "",
//     comments: "Комментарий к докладу",
//     soauthors: [
//       {
//         name: "Артур",
//         surname: "Тоноян",
//         patronymic: "Арменович",
//         organization: "ЮФУ",
//         email: "atonoian@sfedu.ru",
//         phone: "79034005695",
//       },
//       {
//         name: "Никита",
//         surname: "Капылов",
//         patronymic: "Максимович",
//         organization: "ЮФУ",
//         email: "niks@sfedu.ru",
//         phone: "79007777777",
//       },
//     ],
//   },
//   {
//     id: "id2",
//     status: "save",
//     number: 2,
//     name: "Исследование управления процессами биологической очистки на предприятии «ИДАВАНГ Агро»",
//     directionConference: "Информационная безопасность",
//     formParticipation: "Очно",
//     participationStatus: "Студент",
//     fileArticle: "",
//     fileExpertOpinion: "",
//     comments: "Комментарий к докладу",
//     soauthors: [
//       {
//         name: "Никита",
//         surname: "Капылов",
//         patronymic: "Максимович",
//         organization: "ЮФУ",
//         email: "niks@sfedu.ru",
//         phone: "79007777777",
//       },
//     ],
//   },
// ],

const reportsSlice = createSlice({
  name: "reports",
  initialState: {
    data: [],
  },

  reducers: {
    disGetReports(state, actions) {
      const { data } = actions.payload;
      state.data = data || [];
    },
  },
});

export const { disGetReports } = reportsSlice.actions;

export default reportsSlice.reducer;
