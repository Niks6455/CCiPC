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

const keys = [
  "name",
  "directionConference",
  "formParticipation",
  "participationStatus",
  "fileArticle",
  "fileExpertOpinion",
  "comments",
  "soauthors",
];

const reportCreateSlice = createSlice({
  name: "reportCreate",
  initialState: {
    id: "id1",
    status: "save",
    number: 1,
    name: "",
    directionConference: "",
    formParticipation: "",
    participationStatus: "",
    fileArticle: null,
    fileExpertOpinion: null,
    comments: "",
    soauthors: [],
    sliderState: 0,
  },

  reducers: {
    setValue(state, action) {
      const { key, value } = action.payload;
      console.log("key, value", key, value);
      state[key] = value;
      //! считаем прогресс
      let slider = 0;
      keys.map((key) => {
        if (key === "soauthors") {
          if (state.soauthors.length > 0) {
            slider += 1;
          }
        } else {
          if (state[key] !== "" && state[key] !== null) {
            slider += 1;
          }
        }
      });
      state.sliderState = (100 / keys.length) * slider;
    },

    addSoauthors(state) {
      state.soauthors = [
        ...state.soauthors,
        {
          name: "",
          surname: "",
          patronymic: "",
          organization: "",
          email: "",
          phone: "",
          formParticipation: "",
        },
      ];
    },

    deleteCoauthor(state, action) {
      const { index } = action.payload;
      console.log("index", index);
      state.soauthors = state.soauthors.filter((_, i) => i !== index);
      console.log("state.soauthors", state.soauthors);
    },

    setValueCoauthors(state, action) {
      const { index, key, value } = action.payload;
      state.soauthors[index][key] = value;
    },
  },
});

export const { setValue, addSoauthors, deleteCoauthor, setValueCoauthors } =
  reportCreateSlice.actions;

export default reportCreateSlice.reducer;
