import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiGetConferences } from "../../apirequests/apirequests";

export const fetchConferences = createAsyncThunk(
  "user/fetchConferences",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiGetConferences();
      if (response.status === 200) {
        return response.data;
      } else {
        return rejectWithValue("Ошибка получения данных");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const conferencesSlice = createSlice({
  name: "conferences",
  initialState: {
    data: {},
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },

  reducer: {
    setData(state) {
      state.data = {};
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchConferences.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchConferences.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload; // Обновляем данные
      })
      .addCase(fetchConferences.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Неизвестная ошибка";
      });
  },
});

export const { setData } = conferencesSlice.actions;
export default conferencesSlice.reducer;
