import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiGetConferences } from '../../apirequests/apirequests';
import { convertDate } from '../../utils/functions/funcions';

export const fetchConferences = createAsyncThunk(
  'user/fetchConferences',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiGetConferences();
      if (response.status === 200) {
        return response.data.conference;
      } else {
        return rejectWithValue('Ошибка получения данных');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const conferencesSlice = createSlice({
  name: 'conferences',
  initialState: {
    data: {},
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
  },

  reducers: {
    setData(state) {
      state.data = {};
    },
    disResetConferences(state) {
      state.data = {};
      state.status = 'idle';
      state.error = null;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(fetchConferences.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchConferences.fulfilled, (state, action) => {
        state.status = 'succeeded';
        let mass = [];
        if (action.payload.length > 0) {
          action.payload.length > 0 &&
            action.payload.map(item => {
              const originalDate = new Date(item?.date?.[0]?.value);
              const oneWeekAgo = new Date(originalDate);
              oneWeekAgo.setDate(originalDate.getDate() - 7);
              const resultDate = oneWeekAgo?.toISOString()?.split('T')?.[0];
              mass.push({
                ...item,
                dedlineReport1: convertDate(resultDate),
                dedlineReport2: convertDate(item?.deadline),
              });
            });
        }
        state.data = mass; // Обновляем данные
      })
      .addCase(fetchConferences.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Неизвестная ошибка';
      });
  },
});

export const { disResetConferences, setData } = conferencesSlice.actions;
export default conferencesSlice.reducer;
