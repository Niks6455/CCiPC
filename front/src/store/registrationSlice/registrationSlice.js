import { createSlice } from '@reduxjs/toolkit';

export const dataobject = {
  name: '',
  surname: '',
  patronymic: '',
  academicTitle: '',
  degree: '',
  position: '',
  organization: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  napravlenieKonferencii: '',
};

const ParticipantsSlice = createSlice({
  name: 'registration',
  initialState: {
    data: dataobject,
    timer: 60,
  },

  reducers: {
    setDataKey(state, action) {
      const { key, value } = action.payload;
      state.data[key] = value;
    },

    setTimer(state, action) {
      state.timer = action.payload;
    },

    resetData(state) {
      state.data = dataobject;
      state.timer = 60;
    },
  },
});

export const { setDataKey, setTimer, resetData } = ParticipantsSlice.actions;

export default ParticipantsSlice.reducer;
