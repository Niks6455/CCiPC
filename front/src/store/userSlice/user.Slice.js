import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiGetUserData } from '../../apirequests/apirequests';

// Асинхронный thunk для получения данных пользователя
export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async (_, { rejectWithValue }) => {
    try {
      console.log('accessToken', localStorage.getItem('accessToken'));
      const response = await apiGetUserData();
      if (response.status === 200) {
        return response.data; // Возвращаем данные пользователя
      } else {
        window.location.href = '/authorization';
        return rejectWithValue('Ошибка получения данных');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const UserSlice = createSlice({
  name: 'user',
  initialState: {
    user: {
      data: {},
    },
    editUser: {
      data: {},
    },
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
  },

  reducers: {
    setUserData(state, action) {
      const { data } = action.payload;
      state.user.data = data;
    },

    disEditUser(state) {
      state.editUser.data = state.user.data;
    },

    setEditUser(state, action) {
      const { key, value } = action.payload;
      state.editUser.data[key] = value;
    },

    disResetUser(state) {
      state.editUser.data = {};
      state.user.data = {};
      state.status = 'idle';
      state.error = null;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(fetchUserData.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user.data = action.payload.participant; // Обновляем данные
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Неизвестная ошибка';
      });
  },
});

export const { disResetUser, setUserData, disEditUser, setEditUser } = UserSlice.actions;

export default UserSlice.reducer;
