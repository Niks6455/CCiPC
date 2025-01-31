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

const keysCoauthors = [
  "name",
  "surname",
  "patronymic",
  "organization",
  "email",
  "phone",
  "formParticipation",
];

//! функция расчета sliderState
const calculateSliderState = (state) => {
  let slider = 0;
  let length = keys.length;
  keys.map((key) => {
    if (key === "soauthors") {
      if (state.data.soauthors.length > 0) {
        length =
          keys.length - 1 + state.data.soauthors.length * keysCoauthors.length;
        state.data.soauthors.map((author) => {
          keysCoauthors.map((key) => {
            if (author[key] !== "" && author[key] !== null) {
              slider += 1;
            }
          });
        });
      } else {
        length = keys.length - 1;
      }
    } else {
      if (state.data[key] !== "" && state.data[key] !== null) {
        slider += 1;
      }
    }
  });
  return (100 / length) * slider;
};

const reportCreateSlice = createSlice({
  name: "reportCreate",
  initialState: {
    data: {
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
    },
    sliderState: 0,
    openPopUpName: "",
  },

  reducers: {
    setValue(state, action) {
      const { key, value } = action.payload;
      state.data[key] = value;
      //! считаем прогресс
      state.sliderState = calculateSliderState(state);
    },

    addSoauthors(state) {
      state.data.soauthors = [
        ...state.data.soauthors,
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
      //! считаем прогресс
      state.sliderState = calculateSliderState(state);
    },

    deleteCoauthor(state, action) {
      const { index } = action.payload;
      state.data.soauthors = state.data.soauthors.filter((_, i) => i !== index);
      state.sliderState = calculateSliderState(state);
    },

    setValueCoauthors(state, action) {
      const { index, key, value } = action.payload;
      if (value !== undefined) {
        state.data.soauthors[index][key] = value;
        //! считаем прогресс
        state.sliderState = calculateSliderState(state);
      }
    },

    funSaveDataState(state) {
      //! определяем есть ли соавторы с одинаковой почтой
      const emails = state.data.soauthors.map((soauthor) => soauthor.email);
      const uniqueEmails = new Set(emails);
      if (emails.length !== uniqueEmails.size) {
        state.openPopUpName = "SameEmail";
        return;
      }

      //! проверяем что есть соавторы но их поля заполненны не полностью
      if (state.data.soauthors.length > 0) {
        let modal = "";
        state.data.soauthors.map((soauthor) => {
          keysCoauthors.map((key) => {
            if (soauthor[key] === "" || soauthor[key] === null) {
              modal = "NotFullyFilledCoauthors";
              return;
            }
          });
        });
        if (modal === "NotFullyFilledCoauthors") {
          state.openPopUpName = modal;
          return;
        }
      }

      //! проверим что все поля заполненны корректно и полностью
      if (state.sliderState === 100) {
        state.openPopUpName = "SuccessModal";
        return;
      }

      //! поля заполненны но не полностью
      if (state.sliderState < 100) {
        state.openPopUpName = "NotFullyFilled";
        return;
      }
    },

    setOpenPopUpName(state, action) {
      const { name } = action.payload;
      state.openPopUpName = name;
    },
  },
});

export const {
  setValue,
  addSoauthors,
  deleteCoauthor,
  setValueCoauthors,
  setOpenPopUpName,
  funSaveDataState,
} = reportCreateSlice.actions;

export default reportCreateSlice.reducer;
