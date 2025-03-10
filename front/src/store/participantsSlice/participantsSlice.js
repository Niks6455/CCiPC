import { createSlice } from '@reduxjs/toolkit';

const ParticipantsSlice = createSlice({
  name: 'participantsSlice',
  initialState: {
    selectParticipantsData:null
  },

  reducers: {
    //! добавить в массив фильтрацию по заголовку
    setSelectDataParticipants(state, action) {
      const { data } = action.payload;
      state.selectParticipantsData = data;
    },

    clearDataParticipants(state) {
      state.selectParticipantsData = null;
    },
  },
});

export const { setSelectDataParticipants, clearDataParticipants } = ParticipantsSlice.actions;

export default ParticipantsSlice.reducer;
