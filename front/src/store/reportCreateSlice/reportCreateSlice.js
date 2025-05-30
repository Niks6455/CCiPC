import { createSlice } from '@reduxjs/toolkit';

/*
    directionConference - Направление конференции
    formParticipation - Форма участия
    participationStatus - Статус участия
    fileArticle - путь к файлу со статьей
    fileExpertOpinion - файл с экспертным заключением
    comments - комментарии
    soauthors - сооавторы
    organization.prisma - Организация

*/

const keys = [
  'name',
  'directionConference',
  'formParticipation',
  'participationStatus',
  'fileArticle',
  'fileExpertOpinion',
  'comments',
  'soauthors',
  'organization',
];

const keysCoauthors = [
  'name',
  'surname',
  'patronymic',
  // "organization.prisma",
  'email',
  // "phone",
  // "formParticipation",
];

//! функция расчета sliderState
const calculateSliderState = state => {
  let slider = 0;
  let length = keys.length;
  keys.map(key => {
    if (key === 'soauthors') {
      if (state.data?.soauthors?.length > 0) {
        length = keys.length - 1 + state.data.soauthors.length * keysCoauthors.length;
        state.data.soauthors.map(author => {
          keysCoauthors.map(key => {
            if (author.data[key] !== '' && author.data[key] !== null) {
              slider += 1;
            }
          });
        });
      } else {
        length = keys.length - 1;
      }
    } else {
      if (state.data[key] !== '' && state.data[key] !== null) {
        slider += 1;
      }
    }
  });
  return (100 / length) * slider;
};

const reportCreateSlice = createSlice({
  name: 'reportCreate',
  initialState: {
    data: {
      id: 'id1',
      status: 'save',
      number: 1,
      name: '',
      directionConference: '',
      formParticipation: '',
      participationStatus: '',
      fileArticle: null,
      fileExpertOpinion: null,
      comments: '',
      soauthors: [],
      coAuthorsIds: [],
      organization: '',
    },
    editData: {},
    prevData: {},
    sliderState: 0,
    openPopUpName: '',
  },

  reducers: {
    setValue(state, action) {
      const { key, value } = action.payload;
      state.data[key] = value;
      //! считаем прогресс
      state.sliderState = calculateSliderState(state);
    },

    disSetResetReport(state, action) {
      state.data = {
        id: 'id1',
        status: 'save',
        number: action.payload,
        name: '',
        directionConference: '',
        formParticipation: '',
        participationStatus: '',
        fileArticle: null,
        fileExpertOpinion: null,
        comments: '',
        soauthors: [],
        coAuthorsIds: [],
        organization: '',
      };
      state.sliderState = 0;
      state.openPopUpName = '';
      state.popUpText = '';
    },

    addSoauthors(state) {
      state.data.soauthors = [
        ...state.data.soauthors,
        {
          data: {
            name: '',
            surname: '',
            patronymic: '',
            organization: '',
            email: '',
            phone: '',
            formParticipation: '',
          },
          autocompletion: '',
        },
      ];
      //! считаем прогресс
      state.sliderState = calculateSliderState(state);
    },

    deleteCoauthor(state, action) {
      const { index, id } = action.payload;
      if (id) {
        state.data.coAuthorsIds = [...state.data.coAuthorsIds, id];
      }
      state.data.soauthors = state.data.soauthors.filter((_, i) => i !== index);
      state.sliderState = calculateSliderState(state);
    },

    setValueCoauthors(state, action) {
      const { index, key, value } = action.payload;
      if (value !== undefined) {
        state.data.soauthors[index].data[key] = value;
        //! считаем прогресс
        state.sliderState = calculateSliderState(state);
      }
    },

    funSaveDataState(state) {
      const emails = state.data.soauthors.map(soauthor => soauthor.data.email);
      if (new Set(emails).size !== emails.length) {
        state.openPopUpName = 'SameEmail';
        return;
      }
      const hasEmptyCoauthor = state.data.soauthors.some(coauthor =>
        keysCoauthors.some(
          key => (key !== 'patronymic' && coauthor.data[key] === '') || coauthor.data[key] === null,
        ),
      );
      if (hasEmptyCoauthor) {
        state.openPopUpName = 'NotFullyFilledCoauthors';
        return;
      }
      if (state.sliderState < 100) {
        state.openPopUpName = 'NotFullyFilled';
        return;
      }
      state.openPopUpName = 'SuccessModal';
    },

    setOpenPopUpName(state, action) {
      const { name, text } = action.payload;
      state.openPopUpName = name;
      if (text) {
        state.popUpText = text;
      }
    },

    setCoauthorAutocompletion(state, action) {
      const { index, autocompletion } = action.payload;
      state.data.soauthors[index].autocompletion = autocompletion;
    },
    setCoauthorDataApi(state, action) {
      const { index, data } = action.payload;
      if (data) {
        state.data.soauthors[index].data = { ...state.data.soauthors[index].data, ...data };
      } else {
        state.data.soauthors[index].data = {
          ...state.data.soauthors[index].data,
          name: '',
          surname: '',
          patronymic: '',
        };
      }
    },

    //! редактирование
    disEditReport(state, action) {
      const { data } = action.payload;
      state.data = data;
      state.prevData = data;
      state.editData = {};
      state.sliderState = 0;
      state.openPopUpName = '';
    },

    disSeteEditData(state, action) {
      const { key, value } = action.payload;
      if (state.prevData[key] !== value) {
        state.editData[key] = value;
      } else {
        delete state.editData[key];
      }
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
  setCoauthorDataApi,
  setCoauthorAutocompletion,
  disEditReport,
  disSeteEditData,
  disSetResetReport,
} = reportCreateSlice.actions;

export default reportCreateSlice.reducer;
