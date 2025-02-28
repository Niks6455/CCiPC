import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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

// Асинхронный thunk для получения данных пользователя
export const fetchReports = createAsyncThunk(
  "user/fetchReports",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiGetReports();
      if (response?.status === 200) {
        return response.data; // Возвращаем данные пользователя
      } else {
        return rejectWithValue("Ошибка получения данных");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const reportsSlice = createSlice({
  name: "reports",
  initialState: {
    data: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },

  reducers: {
    disGetReports(state, actions) {
      const { data } = actions.payload;
      state.data = data || [];
    },

    disDeleteReport(state, actions) {
      const { id } = actions.payload;
      state.data = state.data.filter((report) => report.id !== id);
    },
    disResetReports(state) {
      state.data = [];
      state.status = "idle";
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.reports; // Обновляем данные
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Неизвестная ошибка";
      });
  },
});

export const { disResetReports, disGetReports, disDeleteReport } =
  reportsSlice.actions;

export default reportsSlice.reducer;
